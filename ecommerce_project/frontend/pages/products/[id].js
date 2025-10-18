import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import useCartStore from '../../lib/cartStore';
import Image from 'next/image';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-300">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.category && (
              <p className="mt-2 text-sm text-gray-500">{product.category.name}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${parseFloat(product.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                className="input mt-1 w-24"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="w-full btn btn-primary"
            >
              {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="border-t pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">SKU:</span>
              <span className="text-gray-900">{product.sku}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Availability:</span>
              <span className={product.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
