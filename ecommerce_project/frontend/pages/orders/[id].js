import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '../../lib/authStore';
import api from '../../lib/api';

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (id) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Order not found</p>
          <Link href="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/orders" className="text-primary-600 hover:text-primary-700">
          ← Back to Orders
        </Link>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Order Timeline */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
              <span className="text-sm text-gray-700">Order Placed</span>
            </div>
            {order.status !== 'cancelled' && (
              <>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                  <span className="text-sm text-gray-700">Confirmed</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                  <span className="text-sm text-gray-700">Processing</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                  <span className="text-sm text-gray-700">Shipped</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                  <span className="text-sm text-gray-700">Delivered</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${parseFloat(item.total).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${parseFloat(item.price).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-gray-700">
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">${parseFloat(order.shipping).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-${parseFloat(order.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
