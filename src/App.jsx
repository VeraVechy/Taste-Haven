import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import useAuthStore from './store/authStore';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Reservations from './components/Reservations';
import Auth from './components/Auth';
import Profile from './components/Profile';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;