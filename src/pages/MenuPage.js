import React, { useState, useEffect } from 'react';
import { getMenu } from '../api';
import { useCart } from '../contexts/CartContext';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { items: cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const items = await getMenu();
      setMenuItems(items);
    } catch (err) {
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getCartQuantity = (itemId) => {
    const entry = cartItems.find((c) => c.id === itemId);
    return entry ? entry.quantity : 0;
  };

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center bg-dashboard-canvas"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="bg-dashboard-canvas min-vh-100 py-5" style={{ isolation: 'isolate' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="badge-premium mb-3 mx-auto" style={{ maxWidth: 'fit-content' }}>Our Culinary Universe</div>
          <h1 className="display-3 fw-bold text-dark mb-4">Digital Cafe <span className="text-primary">Menu</span></h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
            Experience the fusion of tradition and innovation. Each dish is a masterpiece, prepared with ingredients sourced from the finest artisans.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn rounded-pill px-4 py-2 transition-all fw-bold ${
                selectedCategory === category 
                ? 'btn-primary shadow-lg' 
                : 'btn-light border text-muted opacity-75'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="row g-4 justify-content-center">
          {filteredItems.map(item => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <div className="dashboard-glass-card h-100 overflow-hidden border-0">
                <div className="position-relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-100"
                    style={{ height: '240px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <div className="badge bg-white text-dark rounded-pill px-3 py-2 shadow-sm fw-bold">
                       Rs {item.price}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="fw-bold text-dark mb-0">{item.name}</h4>
                    <div className="text-warning small mt-1">
                      <i className="fas fa-star"></i> 4.9
                    </div>
                  </div>
                  
                  <p className="text-muted small mb-4" style={{ minHeight: '40px' }}>
                    {item.description}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    {getCartQuantity(item.id) === 0 ? (
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="btn btn-premium w-100 py-2 fw-bold"
                      >
                         Add to Order
                      </button>
                    ) : (
                      <div className="d-flex align-items-center bg-light rounded-pill w-100 justify-content-between p-1 shadow-inner">
                        <button
                          type="button"
                          onClick={() => {
                            const q = getCartQuantity(item.id);
                            if (q <= 1) removeFromCart(item.id);
                            else updateQuantity(item.id, q - 1);
                          }}
                          className="btn btn-sm btn-white rounded-circle shadow-sm"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <i className="fas fa-minus fs-xs"></i>
                        </button>
                        <span className="fw-bold px-3">{getCartQuantity(item.id)} in Cart</span>
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="btn btn-sm btn-white rounded-circle shadow-sm"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <i className="fas fa-plus fs-xs"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-search-minus display-1 text-muted opacity-25 mb-4"></i>
            <h3 className="text-muted">No culinary treasures found in "{selectedCategory}"</h3>
            <button onClick={() => setSelectedCategory('All')} className="btn btn-link text-primary mt-2">View all selections</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
