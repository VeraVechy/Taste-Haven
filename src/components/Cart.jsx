import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { supabase } from '../lib/supabase';

function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: getTotal(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <button
          onClick={() => navigate('/menu')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value))
                }
                className="w-16 px-2 py-1 border rounded"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="text-xl font-bold">
          Total: ${getTotal().toFixed(2)}
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}

export default Cart;