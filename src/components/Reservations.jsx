import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';

function Reservations() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to make a reservation');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          ...formData,
          user_id: user.id
        });

      if (error) throw error;
      
      toast.success('Reservation submitted successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Make a Reservation</h2>
      
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            name="guests"
            min="1"
            max="10"
            value={formData.guests}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Special Requests
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Any special requests or dietary requirements?"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Make Reservation'}
        </button>
      </form>
    </div>
  );
}

export default Reservations;