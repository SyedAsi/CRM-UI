import React, { useState, useEffect } from 'react';
import UserService from "../services/UserService";

// Mock UserService for demonstration
const UserServices = {
  getServices: () => Promise.resolve({
    data: [
      { name: 'Web Development', icon: 'code', progress: 75, color: '#f59e0b', bg: '#fef3c7', active: true },
      { name: 'SEO Optimization', icon: 'search', progress: 45, color: '#ef4444', bg: '#fee2e2', active: true },
      { name: 'Digital Marketing', icon: 'megaphone', progress: 60, color: '#f59e0b', bg: '#fffbeb', active: true },
      { name: 'Content Writing', icon: 'pencil', progress: 90, color: '#10b981', bg: '#d1fae5', active: true }
    ]
  })
};

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [userServices, setUserServices] = useState([]);

  // Check for logged-in user on mount
   // Check for logged-in user on mount
  useEffect(() => {
    const userStr = sessionStorage.getItem('loggedInUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("Logged in user:", user);
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      // Fetch user services with user id
      if (user.id) {
        UserService.getUserServices(user.id)
          .then((response) => {
            console.log("Fetched userServices:", response.data);
            // Handle the response structure: response.data[0].service or response.data.services
            const services = response.data.services || [];
            setUserServices(services);
          })
          .catch((error) => {
            console.error("Error fetching userServices:", error);
          });
      }
    } else {
      // No user found, redirect to login
    }
  }, []);

  // Re-create Lucide icons on every render
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const navItems = [
    { name: 'Dashboard', icon: 'home' },
    { name: 'Projects', icon: 'folder-kanban' },
    { name: 'Pricing', icon: 'dollar-sign' },
  ];

  // Different content for each page
  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardContent userServices={userServices} setActivePage={setActivePage} />;
      case 'Projects':
        return <ProjectsContent />;
      case 'Pricing':
        return <PricingContent />;
      default:
        return <DashboardContent userServices={userServices} setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

      <style jsx>{`
        .content h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 2rem; color: #1f2937; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .card { background: white; padding: 1.8rem; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: #1f2937; }
        .pricing-table { width: 100%; border-collapse: collapse; }
        .pricing-table th, .pricing-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .pricing-table th { background: #f3f4f6; }
        .btn { padding: 0.75rem 1.5rem; background: #06b6d4; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn:hover { background: #0891b2; }
      `}</style>

      <div className="dashboard" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9fafb', fontFamily: 'Segoe UI, sans-serif' }}>

        {/* Header */}
        <header className="header" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px', color: 'white' }}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937' }}>MarklenceMedia</h1>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>by your agency</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {currentUser && (
                <div style={{ padding: '0.5rem 1rem', background: '#dbeafe', borderRadius: '9999px', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
                  Welcome, {currentUser.name || currentUser.email}
                </div>
              )}
              <button onClick={handleLogout} style={{ padding: '0.75rem 1.5rem', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i data-lucide="log-out"></i>
                Log out
              </button>
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar */}
          <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #e5e7eb', padding: '1.5rem 0' }}>
            <nav>
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActivePage(item.name)}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: activePage === item.name ? '#dbeafe' : 'transparent',
                    color: activePage === item.name ? '#2563eb' : '#374151',
                    fontWeight: activePage === item.name ? 600 : 400,
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = activePage === item.name ? '#dbeafe' : 'transparent'}
                >
                  <i data-lucide={item.icon} style={{ width: '20px', height: '20px' }}></i>
                  {item.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1, padding: '2.5rem', background: '#f9fafb' }}>
            {renderContent()}
          </main>
        </div>

        {/* Footer */}
        <footer style={{ background: '#111827', color: 'white', padding: '3rem 2rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} MarklenceMedia. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

// Individual Page Components
const DashboardContent = ({ userServices, setActivePage }) => {
  console.log("DashboardContent received userServices:", userServices);
  
  return (
    <>
      <h1>Service Progress Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
        {userServices && userServices.length > 0 ? (
          userServices.map((serviceData, index) => {
            // Handle both flat and nested service structures
            const service = serviceData.services || serviceData;
            
            return (
              <div key={index} className="card" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'all 0.4s', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)' }}
              >
                <div style={{ width: '80px', height: '80px', background: service.bg || '#f3f4f6', borderRadius: '50%', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i data-lucide={service.icon || 'box'}></i>
                </div>
                <h3>{service.name}</h3>
                <div style={{ height: '12px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden', margin: '1rem 0' }}>
                  <div style={{ width: `${service.progress}%`, height: '100%', background: service.color || '#06b6d4', transition: 'width 1.2s ease-out' }}></div>
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{service.progress}% <span style={{ fontWeight: 'normal', color: '#6b7280', fontSize: '0.9rem' }}>Complete</span></p>
                {service.progress === 100 && (
                  <button 
                    onClick={() => setActivePage('Pricing')}
                    style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem 1.5rem', 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 600 
                    }}
                  >
                    Make Payment
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p>No services available. Loading...</p>
          </div>
        )}
      </div>
    </>
  );
};

const ProjectsContent = () => (
  <>
    <h1>Projects</h1>
    <div className="grid-2">
      <div className="card"><h3>Active Projects</h3><p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#06b6d4' }}>12</p></div>
      <div className="card"><h3>Completed This Month</h3><p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>8</p></div>
      <div className="card"><h3>On Hold</h3><p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>3</p></div>
      <div className="card"><h3>Upcoming</h3><p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>5</p></div>
    </div>
  </>
);



const PricingContent = () => (
  <>
    <h1>Pricing Plans</h1>
    <table className="pricing-table" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <thead>
        <tr><th>Plan</th><th>Price</th><th>Features</th><th></th></tr>
      </thead>
      <tbody>
        <tr><td>Basic</td><td>$99/mo</td><td>5 Projects, Email Support</td><td><button className="btn">Choose</button></td></tr>
        <tr><td>Pro</td><td>$299/mo</td><td>Unlimited Projects, Priority Support</td><td><button className="btn">Choose</button></td></tr>
        <tr><td>Enterprise</td><td>Custom</td><td>Dedicated Manager, API Access</td><td><button className="btn">Contact</button></td></tr>
      </tbody>
    </table>
  </>
);

export default Dashboard;