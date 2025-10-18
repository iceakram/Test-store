import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addItem({ productId, quantity });
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, { quantity });
      await loadCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await loadCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [] });
    } catch (error) {
      throw error;
    }
  };

  const getCartTotal = () => {
    return cart.items?.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  const getCartItemsCount = () => {
    return cart.items?.reduce((count, item) => count + item.quantity, 0) || 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
