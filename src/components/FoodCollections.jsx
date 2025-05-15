import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { toast } from 'react-hot-toast';
import img1 from '../assets/images/pizza.png';
import img2 from '../assets/images/shawama.png';
import img3 from '../assets/images/fried-chicken.png';
import img4 from '../assets/images/fried-chips.png';
import img5 from '../assets/images/hamburger.png';
import img6 from '../assets/images/chicken-biryani.png';
import img7 from '../assets/images/pasta.png';
import img8 from '../assets/images/fried-chips.png';

import love from '../assets/images/loveIcon.png';
import fullStar from '../assets/images/Fullstar.png';
import star from '../assets/images/star.png';

function FoodCollections() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const foodCategories = [
    {
      id: 1,
      pic: img1,
      name: 'Pepperoni Pizza',
      price: 30.52,
      originalPrice: 38.52,
      category: 'pizza'
    },
    {
      id: 2,
      pic: img2,
      name: 'Beef Shawarma',
      price: 25.99,
      originalPrice: 32.99,
      category: 'shawarma'
    },
    {
      id: 3,
      pic: img3,
      name: 'Fried Chicken',
      price: 28.99,
      originalPrice: 35.99,
      category: 'chicken'
    },
    {
      id: 4,
      pic: img4,
      name: 'French Fries',
      price: 12.99,
      originalPrice: 15.99,
      category: 'sides'
    }
  ];

  const foodCategories2 = [
    {
      id: 5,
      pic: img5,
      name: 'Cheese Burger',
      price: 22.99,
      originalPrice: 27.99,
      category: 'burger'
    },
    {
      id: 6,
      pic: img6,
      name: 'Chicken Biryani',
      price: 32.99,
      originalPrice: 39.99,
      category: 'rice'
    },
    {
      id: 7,
      pic: img7,
      name: 'Pasta Alfredo',
      price: 24.99,
      originalPrice: 29.99,
      category: 'pasta'
    },
    {
      id: 8,
      pic: img8,
      name: 'Loaded Fries',
      price: 15.99,
      originalPrice: 18.99,
      category: 'sides'
    }
  ];

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.pic
    });
    toast.success(`${item.name} added to cart!`);
  };

  const rateFood = {
    heart: love,
    fullRate: fullStar,
    noRate: star
  };

  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <div className="text-center mb-4">
            <p className="text-success">CRISPY, EVERY BITE TASTE</p>
            <h4>POPULAR FOOD ITEMS</h4>
          </div>

          <div className="row">
            {foodCategories.map((foodCategory) => (
              <div className="food-items col-lg-3 col-md-6 col-sm-6" key={foodCategory.id}>
                <div className="Fastfood-btn">
                  <div className="fastFoods">
                    <div className="foods mx-auto">
                      <img src={foodCategory.pic} alt={foodCategory.name} className='img-fluid'/>
                    </div>
                    <div className="love">
                      <img src={rateFood.heart} alt="Love" className='img-fluid'/>
                    </div>
                  </div>
                  <button 
                    style={{width: '10rem'}} 
                    className='btn btn-secondary mx-auto display-btn'
                    onClick={() => handleAddToCart(foodCategory)}
                  >
                    Add To Cart
                  </button>
                </div>

                <div className="text pt-3">
                  <span>{foodCategory.name}</span>
                  <div className="img-rating">
                    <img src={rateFood.fullRate} alt="Ratings" className='img-fluid'/>
                    <img src={rateFood.fullRate} alt="Ratings" className='img-fluid'/>
                    <img src={rateFood.fullRate} alt="Ratings" className='img-fluid'/>
                    <img src={rateFood.fullRate} alt="Ratings" className='img-fluid'/>
                    <img src={rateFood.noRate} alt="Ratings" className='img-fluid'/>
                  </div>
                  <p>${foodCategory.price} <span style={{textDecoration: 'line-through', fontSize: '12px'}}>${foodCategory.originalPrice}</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="row my-2">
            {foodCategories2.map((foodCategory) => (
              <div className="food-items col-lg-3 col-md-6 col-sm-6" key={foodCategory.id}>
                <div className="Fastfood-btn">
                  <div className="fastFoods">
                    <img src={foodCategory.pic} alt={foodCategory.name} className='img-fluid'/>
                    <div className="love">
                      <img src={rateFood.heart} alt="Favorite" />
                    </div>
                  </div>
                  <button 
                    style={{width: '10rem'}} 
                    className='btn btn-secondary mx-auto display-btn'
                    onClick={() => handleAddToCart(foodCategory)}
                  >
                    Add To Cart
                  </button>
                </div>
                <div className="text pt-3">
                  <span>{foodCategory.name}</span>
                  <div className="img-rating">
                    <img src={rateFood.fullRate} alt="Ratings" />
                    <img src={rateFood.fullRate} alt="Ratings" />
                    <img src={rateFood.fullRate} alt="Ratings" />
                    <img src={rateFood.fullRate} alt="Ratings" />
                    <img src={rateFood.noRate} alt="Ratings" />
                  </div>
                  <p>${foodCategory.price} <span style={{textDecoration: 'line-through', fontSize: '12px'}}>${foodCategory.originalPrice}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FoodCollections;