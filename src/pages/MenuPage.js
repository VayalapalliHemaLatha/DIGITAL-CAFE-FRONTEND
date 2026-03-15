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
      // API: GET /api/menu
      const items = await getMenu();
      setMenuItems(items);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error fetching menu:', err);
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading menu...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{error}</h2>
        <button onClick={fetchMenuItems} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Digital Cafe Menu</h1>
      
      {/* Category Filter */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              margin: '0 10px',
              padding: '8px 16px',
              backgroundColor: selectedCategory === category ? '#007bff' : '#f8f9fa',
              color: selectedCategory === category ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredItems.map(item => (
          <div key={item.id} style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              />
            )}
            
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.name}</h3>
            
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
              {item.description}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '15px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                Rs {item.price}
              </span>
              {getCartQuantity(item.id) === 0 ? (
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Add to Cart
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      const q = getCartQuantity(item.id);
                      if (q <= 1) removeFromCart(item.id);
                      else updateQuantity(item.id, q - 1);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      color: '#333'
                    }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{
                    minWidth: '36px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}>
                    {getCartQuantity(item.id)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      color: '#333'
                    }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No items found in {selectedCategory} category</h3>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
