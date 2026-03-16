import React from 'react';
import { Link } from 'react-router-dom';
import UserList from '../UserList';
import { authApi } from '../api';

const HERO_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const ABOUT_BG = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800';

const services = [
  { icon: 'fa-user-tie', title: 'Master Chefs', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
  { icon: 'fa-utensils', title: 'Quality Food', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
  { icon: 'fa-cart-plus', title: 'Online Order', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
  { icon: 'fa-headset', title: '24/7 Service', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
];

const roleCards = [
  { 
    role: 'Customer', 
    icon: 'fa-user', 
    color: '#6366F1', 
    features: ['Book tables in advance', 'Pre-order food & beverages', 'Track order status real-time', 'Secure online payments'] 
  },
  { 
    role: 'Café Owner', 
    icon: 'fa-hotel', 
    color: '#D946EF', 
    features: ['Manage multiple cafés', 'Add & edit menu items', 'Create staff accounts', 'View analytics & reports'] 
  },
  { 
    role: 'Chef', 
    icon: 'fa-fire-burner', 
    color: '#F97316', 
    features: ['Real-time order notifications', 'Update order progress', 'View kitchen queue', 'Manage preparation time'] 
  },
  { 
    role: 'Waiter', 
    icon: 'fa-concierge-bell', 
    color: '#10B981', 
    features: ['View assigned tables', 'Check order status', 'Serve ready orders', 'Handle customer requests'] 
  },
  { 
    role: 'Admin', 
    icon: 'fa-user-shield', 
    color: '#475569', 
    features: ['Platform-wide management', 'User & role administration', 'System health monitoring', 'Analytics dashboard'] 
  }
];

function HomePage({ isLoggedIn }) {
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';
  
  return (
    <>
      {/* Cinematic Gourmet Hero */}
      <div className="hero-ultimate">
        <div className="container py-5 hero-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-start">
              <div className="badge-premium mb-4">
                <i className="fas fa-crown me-2"></i>PREMIUM GASTRONOMY EXPERIENCE
              </div>
              <h1 className="display-2 fw-bold mb-4 text-white lh-1">
                Culinary Art<br />
                <span className="text-primary">Perfected.</span>
              </h1>
              <p className="lead mb-5 pe-lg-5 opacity-90 fw-medium">
                Indulge in an immersive dining experience where world-class cuisine meets cutting-edge technology. skip the wait, pre-book your sanctuary, and let us handle the rest.
              </p>
              
              <div className="d-flex flex-wrap gap-4 mb-5">
                <Link to="/login" className="btn btn-premium shadow-lg">Reserve Your Experience <i className="fas fa-chevron-right ms-2"></i></Link>
                <div className="d-flex align-items-center bg-white bg-opacity-10 p-2 pe-4 rounded-pill border border-white border-opacity-10 shadow-lg" style={{ backdropFilter: 'blur(5px)' }}>
                  <div className="bg-primary rounded-circle p-2 me-3 shadow-lg">
                    <i className="fas fa-play text-dark small"></i>
                  </div>
                  <span className="text-white small fw-bold">Executive Tour</span>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5 d-none d-lg-block">
              <div className="glass-card p-4 text-center border-0 shadow-2xl" style={{ animation: 'float-img 4s ease-in-out infinite' }}>
                <div className="position-relative mb-4">
                  <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop&q=100" className="img-fluid rounded-4 shadow-xl" alt="Dish of the day" />
                  <div className="position-absolute top-100 start-50 translate-middle w-75">
                    <div className="bg-white rounded-pill px-4 py-3 shadow-2xl d-flex align-items-center justify-content-center">
                      <i className="fas fa-fire text-danger me-2"></i>
                      <span className="text-dark fw-bold small">Trending: Signature Plating</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 px-3">
                  <h4 className="text-white fw-bold mb-1">Epicurean Mastery</h4>
                  <p className="small text-white opacity-75">Curated by our Michelin-starred team</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-5 pt-5 justify-content-center">
            <div className="col-lg-10">
              <div className="glass-card p-4 rounded-pill border border-white border-opacity-10 d-flex justify-content-around align-items-center bg-opacity-25" style={{ backdropFilter: 'blur(10px)' }}>
                <div className="text-center px-4">
                  <div className="h2 fw-bold text-primary mb-0">500+</div>
                  <div className="small text-white text-uppercase opacity-75 tracking-wider">Boutique Cafés</div>
                </div>
                <div className="vr bg-white opacity-25"></div>
                <div className="text-center px-4">
                  <div className="h2 fw-bold text-primary mb-0">1.2M+</div>
                  <div className="small text-white text-uppercase opacity-75 tracking-wider">Epicurean Users</div>
                </div>
                <div className="vr bg-white opacity-25"></div>
                <div className="text-center px-4">
                  <div className="h2 fw-bold text-primary mb-0">98%</div>
                  <div className="small text-white text-uppercase opacity-75 tracking-wider">Gold Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Intelligence - Deep Midnight Texture */}
      <div id="operating-model" className="py-5 bg-deep-midnight">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3">HYPER-CONNECTED ECOSYSTEM</div>
            <h2 className="display-5 text-white fw-bold mb-3">Modular Operations</h2>
            <p className="text-light opacity-50">Industrial-grade functionality for every stakeholder</p>
          </div>
          <div className="row g-4 row-cols-1 row-cols-md-3 row-cols-lg-5 justify-content-center">
            {roleCards.map((card, i) => (
              <div key={i} className="col">
                <div className="role-card border-0 shadow-2xl transition-all" style={{ backgroundColor: card.color }}>
                  <div className="bg-white bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4 shadow-sm">
                    <i className={`fas ${card.icon} h3 mb-0`}></i>
                  </div>
                  <h4 className="fw-bold mb-4">{card.role}</h4>
                  <ul className="list-unstyled text-start small opacity-90 px-3">
                    {card.features.map((feat, idx) => (
                      <li key={idx} className="mb-3 d-flex align-items-center"><i className="fas fa-check-circle me-3 small text-white opacity-50"></i>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us - Luxury Marble Texture */}
      <div id="about" className="py-5 bg-soft-carrara">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="rounded-5 overflow-hidden shadow-2xl border border-white border-opacity-10" style={{ height: 500, background: `url(${ABOUT_BG}) center/cover` }}>
                </div>
                <div className="position-absolute -bottom-10 -right-10 glass-card p-4 text-dark shadow-2xl bg-white bg-opacity-75" style={{ backdropFilter: 'blur(10px)', borderRadius: '30px', bottom: '-20px', right: '-20px' }}>
                  <div className="h1 fw-bold text-primary mb-0">14+</div>
                  <p className="small fw-bold text-uppercase mb-0 tracking-widest">Years of Excellence</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-label text-primary">Est. 2010</div>
              <h2 className="display-4 fw-bold text-dark mb-4 lh-sm">We Orchestrate<br/>Flavor and Service</h2>
              <p className="text-muted lead mb-5">At Digital Cafe, we redefine the synergy between gastronomy and technology. Our mission is to eliminate the friction from fine dining, allowing you to focus on what truly matters: the taste.</p>
              <div className="row g-4 mb-5">
                <div className="col-6">
                  <div className="p-4 rounded-4 bg-white shadow-xl hover-up border-bottom border-4 border-primary transition-all">
                    <h5 className="fw-bold mb-1">Artisan Core</h5>
                    <p className="small text-muted mb-0">100% Organic Supply</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 bg-white shadow-xl hover-up border-bottom border-4 border-primary transition-all">
                    <h5 className="fw-bold mb-1">Smart Engine</h5>
                    <p className="small text-muted mb-0">Cloud-Native Logistics</p>
                  </div>
                </div>
              </div>
              <Link to="/login" className="btn btn-premium px-5">Join the Movement</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gastronomy - Minimalist Luxury with Seasonal Background */}
      <div id="menu" className="py-5 bg-seasonal-premium border-top border-white border-opacity-50">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="section-label">THE ART OF THE PLATE</div>
            <h2 className="display-5 fw-bold text-dark mb-3">Seasonal Curations</h2>
            <p className="text-muted">Precision-crafted delicacies that redefine contemporary dining</p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Artisan Latte', price: '$8', img: '1509042239860-f550ce710b93' },
              { name: 'Avocado Toast', price: '$12', img: '1525562823861-167417e6a1ab' },
              { name: 'Beef Brisket', price: '$24', img: '1504674900247-0877df9cc836' },
              { name: 'Signature Prawn Linguine', price: '$26', img: '1559339352-11d035aa65de' },
              { name: 'Crispy Calamari', price: '$18', img: '1554118811-1e0d58224f24' },
              { name: 'Truffle Tagliatelle', price: '$28', img: '1473093226795-af9932fe5856' }
            ].map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="bg-white rounded-5 overflow-hidden shadow-2xl hover-up transition-all border-0">
                  <div className="position-relative">
                    <img src={`https://images.unsplash.com/photo-${item.img}?w=600&h=450&fit=crop`} alt={item.name} className="w-100" style={{ height: '280px', objectFit: 'cover' }} />
                    <div className="position-absolute top-0 end-0 m-4">
                      <div className="badge rounded-pill bg-white text-dark shadow-lg px-4 py-2 fw-bold" style={{ fontSize: '1rem' }}>{item.price}</div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h5 className="fw-bold text-dark mb-2">{item.name}</h5>
                    <p className="small text-muted mb-3 italic">"A symphony of texture and aroma"</p>
                    <div className="text-warning small mb-0">
                      <i className="fas fa-star mx-1"></i>
                      <i className="fas fa-star mx-1"></i>
                      <i className="fas fa-star mx-1"></i>
                      <i className="fas fa-star mx-1"></i>
                      <i className="fas fa-star mx-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Gastronomy - The World on Your Plate */}
      <div id="global-gastronomy" className="py-5 bg-soft-carrara">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="badge-premium mb-3 mx-auto" style={{ maxWidth: 'fit-content' }}>WORLD CLASS FLAVORS</div>
            <h2 className="display-4 fw-bold text-dark mb-3">Global Gastronomy</h2>
            <p className="text-muted lead">Embark on a culinary journey across continents from the comfort of our sanctuary</p>
          </div>
          <div className="row g-4 h-100">
            {[
              { name: 'Neapolitan Charcoal Pizza', price: '$22', img: '1513104890138-7c749659a591', origin: 'Italian Mastery' },
              { name: 'Wagyu Beef Burger', price: '$32', img: '1594212699903-ec8a3eca50f5', origin: 'Japanese Fusion' },
              { name: 'Seared Scallops', price: '$28', img: '1599084993091-1cb5c0721cc6', origin: 'Coastal French' },
              { name: 'Wild Berry Acai Bowl', price: '$16', img: '1590301157890-4810ed352733', origin: 'Amazonian Fresh' },
              { name: 'Madagascar Lava Cake', price: '$14', img: '1624353365286-3f8d62daad51', origin: 'Island Sweets' },
              { name: 'Moroccan Mint Tea', price: '$9', img: '1572442388796-11668a67e53d', origin: 'North African Ritual' }
            ].map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="dashboard-glass-card h-100 border-0 overflow-hidden shadow-2xl">
                  <div className="position-relative overflow-hidden" style={{ height: '260px' }}>
                    <img src={`https://images.unsplash.com/photo-${item.img}?w=600&h=450&fit=crop`} alt={item.name} className="w-100 h-100 object-fit-cover transition-all hover-zoom" />
                    <div className="position-absolute top-0 start-0 m-3">
                         <span className="badge bg-primary text-dark fw-bold rounded-pill px-3 py-2">{item.origin}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0 text-dark">{item.name}</h5>
                        <div className="h5 fw-bold text-primary mb-0">{item.price}</div>
                    </div>
                    <p className="small text-muted mb-4 italic">"An authentic representation of centuries-old culinary heritage."</p>
                    <button className="btn btn-premium w-100 rounded-pill">Explore Senses</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gourmet Selections - Expanded Culinary Universe */}
      <div id="gourmet-selections" className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="section-label">EXPLORE THE EXTRAORDINARY</div>
            <h2 className="display-4 fw-bold text-dark mb-3">Gourmet Selections</h2>
            <p className="text-muted lead">An expanded palette of world-class flavors</p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Prime Ribeye Steak', price: '$42', img: '1546039907-7e0e54ad4581', category: 'Main' },
              { name: 'Honey Glazed Salmon', price: '$34', img: '1519708227418-c8fd9a32b7a2', category: 'Seafood' },
              { name: 'Burrata & Tomato', price: '$18', img: '1608674485771-3bec9f131177', category: 'Starter' },
              { name: 'Wild Mushroom Risotto', price: '$26', img: '1476124369491-e7addf5db371', category: 'Pasta' },
              { name: 'Lobster Bisque', price: '$22', img: '1534080355112-36b48a52892d', category: 'Soup' },
              { name: 'Classic Tiramisu', price: '$14', img: '1571877609102-1efd756bb0b5', category: 'Dessert' }
            ].map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-lg h-100 rounded-5 transition-all hover-up overflow-hidden">
                  <div className="position-relative">
                    <img src={`https://images.unsplash.com/photo-${item.img}?w=600&h=400&fit=crop`} alt={item.name} className="card-img-top" style={{ height: '240px', objectFit: 'cover' }} />
                    <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-primary text-dark fw-bold rounded-pill small">
                      {item.category}
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0 text-dark">{item.name}</h5>
                      <span className="h5 fw-bold text-primary mb-0">{item.price}</span>
                    </div>
                    <p className="text-muted small mb-3">Chef's special preparation with organic ingredients and global spices.</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-warning small">
                        <i className="fas fa-star"></i> 4.9 (120+ reviews)
                      </div>
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signature Booking Masterpiece */}
      <div id="reservation" className="py-5 position-relative overflow-hidden" style={{ background: '#0B0E14' }}>
        {/* Cinematic Background Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-20" style={{ background: 'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920) center/cover' }}></div>
        <div className="position-absolute bottom-0 start-0 w-100 h-50 bg-gradient-to-t from-dark"></div>
        
        <div className="container py-5 position-relative z-index-2">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 text-start">
              <div className="badge-premium mb-4">SIGNATURE RESERVATIONS</div>
              <h2 className="display-3 fw-bold text-white mb-4">Your Sanctuary <br/><span className="text-primary">Awaits.</span></h2>
              <p className="lead text-white opacity-75 mb-5 pe-lg-5">Experience culinary excellence without the wait. Our intelligent booking system ensures your table is ready the moment you arrive.</p>
              
              <div className="d-flex flex-column gap-4 mb-5">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-4 shadow-lg">
                    <i className="fas fa-check text-dark"></i>
                  </div>
                  <div>
                    <h5 className="text-white mb-1">Instant Confirmation</h5>
                    <p className="small text-white opacity-50 mb-0">No more waiting for callbacks</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-4 shadow-lg">
                    <i className="fas fa-magic text-dark"></i>
                  </div>
                  <div>
                    <h5 className="text-white mb-1">Custom Pre-Ordering</h5>
                    <p className="small text-white opacity-50 mb-0">Meal prep starts before you park</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 border border-white border-opacity-10 bg-opacity-10 d-inline-flex align-items-center">
                 <div className="text-start me-5">
                    <div className="small text-white opacity-50 text-uppercase tracking-widest mb-1">Tonight's Availability</div>
                    <div className="h4 fw-bold text-primary mb-0">94% Booked</div>
                 </div>
                 <div className="vr bg-white opacity-25"></div>
                 <div className="text-start ms-5">
                    <div className="small text-white opacity-50 text-uppercase tracking-widest mb-1">Current Wait</div>
                    <div className="h4 fw-bold text-primary mb-0">0 Minutes</div>
                 </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="booking-card-premium">
                <h4 className="text-white fw-bold mb-5 text-center">Secure Your Experience</h4>
                <div className="row g-4">
                  <div className="col-md-6 text-start">
                    <label className="label-premium">Full Name</label>
                    <input type="text" className="form-control input-premium" placeholder="Enter name" />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="label-premium">Email Address</label>
                    <input type="email" className="form-control input-premium" placeholder="Enter email" />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="label-premium">Arrival Date</label>
                    <input type="date" className="form-control input-premium" />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="label-premium">Party Size</label>
                    <select className="form-select input-premium">
                      <option>Signature for 2</option>
                      <option>Family Table for 4</option>
                      <option>Executive Suite (6+)</option>
                    </select>
                  </div>
                  <div className="col-12 mt-5">
                    <Link to="/login" className="btn btn-premium w-100 py-3">Finalize Booking <i className="fas fa-chevron-right ms-2"></i></Link>
                    <p className="text-white opacity-30 small text-center mt-3">Priority status applied for pre-orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User List - admin only (legacy; prefer Admin Dashboard & Cafe Owners) */}
      {isLoggedIn && isAdmin && (
        <div className="container py-5">
          <div className="text-center mb-4">
            <div className="section-label">Admin</div>
            <h2 className="section-title text-center">User List</h2>
          </div>
          <div className="auth-card p-4 p-lg-4">
            <UserList isLoggedIn={isLoggedIn} />
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
