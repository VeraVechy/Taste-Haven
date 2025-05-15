import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';

function Profile() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [ordersResponse, reservationsResponse] = await Promise.all([
        supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products (
                name,
                price
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('reservations')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
      ]);

      if (ordersResponse.error) throw ordersResponse.error;
      if (reservationsResponse.error) throw reservationsResponse.error;

      setOrders(ordersResponse.data);
      setReservations(reservationsResponse.data);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">My Profile</h2>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">My Orders</h3>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.product.name}
                        </span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <span className="font-semibold">
                      Total: ${order.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">My Reservations</h3>
          {reservations.length === 0 ? (
            <p>No reservations yet</p>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      {new Date(reservation.date).toLocaleDateString()}
                    </span>
                    <span className="capitalize">{reservation.status}</span>
                  </div>
                  <div className="text-sm">
                    <p>Time: {reservation.time}</p>
                    <p>Guests: {reservation.guests}</p>
                    {reservation.notes && (
                      <p className="mt-2">Notes: {reservation.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;