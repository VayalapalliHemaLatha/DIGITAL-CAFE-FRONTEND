import React, { useState } from 'react';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';

function WaiterMenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'BreakFast', 'Pizza', 'Italian', 'Chinese', 'Beverages', 'Desserts'];
  
  const menuItems = [
    { id: 1, name: 'Double Cheese Margherita', category: 'Pizza', price: 499, img: '1565299624946-b28f40a0ae38', available: true },
    { id: 2, name: 'Pasta Carbonara', category: 'Italian', price: 380, img: '1473093295043-cdd812d0e601', available: true },
    { id: 3, name: 'Schezwan Noodles', category: 'Chinese', price: 299, img: '1585032226651-759b368d7246', available: true },
    { id: 4, name: 'Cold Coffee with Ice Cream', category: 'Beverages', price: 180, img: '1461023058943-07fc0e6974fc', available: true },
    { id: 5, name: 'Grilled Chicken Sandwich', category: 'BreakFast', price: 240, img: '1475090169767-40ed8d18f67d', available: true },
    { id: 6, name: 'Tandoori Paneer Pizza', category: 'Pizza', price: 550, img: '1513104890138-7c749659a591', available: false },
    { id: 7, name: 'Vanilla Pancake with Fruits', category: 'BreakFast', price: 220, img: '1504753793613-22f1b3ff91f9', available: true },
    { id: 8, name: 'Chocolate Truffle Cake', category: 'Desserts', price: 150, img: '1551024601-bec78aea704b', available: true },
    { id: 9, name: 'Lemon Iced Tea', category: 'Beverages', price: 120, img: '1556881286-fc6915169721', available: true },
  ];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="chef-waiter-layout">
      <WaiterSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Menu Items</h1>
            <p className="chef-waiter-header-subtitle">Browse and suggest items to customers</p>
          </div>
          <div className="chef-waiter-header-right">
             <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Search dish..." />
             </div>
          </div>
        </header>

        <div className="chef-waiter-content">
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2 category-scroll">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`btn btn-sm rounded-pill px-4 fw-bold shadow-sm ${activeCategory === cat ? 'btn-primary' : 'btn-white border'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filteredItems.map(item => (
              <div key={item.id} className="col-lg-3 col-md-4 col-6">
                <div className="admin-chart-card p-0 overflow-hidden border-0 shadow-sm h-100 position-relative">
                  {!item.available && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center flex-column z-3" style={{ pointerEvents: 'none' }}>
                       <span className="badge bg-danger mb-1 fs-6">OUT OF STOCK</span>
                       <small className="text-dark fw-bold">Wait for refill</small>
                    </div>
                  )}
                  <img 
                    src={`https://images.unsplash.com/photo-${item.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                    alt={item.name} 
                    className="w-100" 
                    style={{ height: '140px', objectFit: 'cover' }} 
                  />
                  <div className="p-3">
                    <div className="text-primary small fw-bold mb-1 text-uppercase">{item.category}</div>
                    <h6 className="fw-bold text-dark text-truncate mb-2">{item.name}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                       <div className="fw-bold text-success fs-5">₹{item.price}</div>
                       <button className="btn btn-sm btn-outline-primary rounded-circle"><i className="fas fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiterMenuPage;
