import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity }] });
    }
    
    get().calculateTotal();
  },
  
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.id !== productId) });
    get().calculateTotal();
  },
  
  updateQuantity: (productId, quantity) => {
    set({
      items: get().items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
    get().calculateTotal();
  },
  
  clearCart: () => {
    set({ items: [], total: 0 });
  },
  
  calculateTotal: () => {
    const total = get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    set({ total });
  },
}));

export default useCartStore;
