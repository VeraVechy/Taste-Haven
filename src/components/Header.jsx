import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import logo from '../assets/TasteHaven_Cafe_logo.png';
import instagram from '../assets/instagram.png';
import facebook from '../assets/facebook.png';
import call from '../assets/call.png';
import search from '../assets/search.png';

function Header() {
  const { user } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <div className="container-fluid">
        <div className="headline-info row">
          <div className="col-4 adding-border pt-3">
            <p><span className='text-success'>100%</span> Secure delivery </p>
          </div>
          <div className="col-4 search adding-border1 pt-3">
            <input type="search" placeholder='Search'/>
            <img src={search} alt="search image" />
          </div>
          <div className="col-4 d-flex adding-border1 pt-3">
            <div className="headline-images">
              <div className="img-headline">
                <img src={call} alt="Call Number 08167000077" />
              </div>
              <p>08167000077</p>
            </div>
            <div className="headline-images">
              <div className="img-headlie">
                <img src={facebook} alt="Facebook" />
              </div>
              <p>Taste_heaven</p>
            </div>
            <div className="headline-images">
              <div className="img-headline">
                <img src={instagram} alt="Instagram" />
              </div>
              <p>Taste_heaven</p>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="Taste Heaven Logo" style={{width:'3rem'}}/>
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNavAltMarkup" 
              aria-controls="navbarNavAltMarkup" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav mx-auto">
                <Link className="nav-link active text-success" to="/">Home</Link>
                <Link className="nav-link" to="/menu">Menu</Link>
                <Link className="nav-link" to="/reservations">Reservations</Link>
                <Link className="nav-link position-relative" to="/cart">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
              {user ? (
                <div className="d-flex gap-2">
                  <Link to="/profile" className="btn border border-success bg-white text-success">Profile</Link>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/auth" className="btn border border-success bg-white text-success">Sign In</Link>
                  <Link to="/auth" className="btn bg-success text-white">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Header;