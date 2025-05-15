import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import useCartStore from '../store/cartStore';

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true);
      
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = category === 'all'
    ? products
    : products.filter(product => product.category === category);

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Our Menu</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Categories</option>
          <option value="pizza">Pizza</option>
          <option value="burger">Burgers</option>
          <option value="chicken">Chicken</option>
          <option value="sides">Sides</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold">${product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;