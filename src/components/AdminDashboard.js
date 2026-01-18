import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    password: '',
    hasServices: false,
    services: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userStr = sessionStorage.getItem('loggedInUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (!user.admin) {
        window.location.href = "/";
        return;
      }
      setCurrentUser(user);
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = "/";
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.password) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const userData = newUser.hasServices ? {
        name: newUser.name,
        password: newUser.password,
        serviceDTO: {
          id: null,
          services: newUser.services,
          description: "User services package"
        }
      } : {
        name: newUser.name,
        password: newUser.password
      };

      const response = await UserService.createUser(userData);
      
      if (response.status === 200 || response.status === 201) {
        setMessage('User added successfully!');
        setNewUser({ name: '', password: '', hasServices: false, services: [] });
        setShowAddUser(false);
      } else {
        setMessage('Failed to add user. Please try again.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Error adding user. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    setNewUser(prev => ({
      ...prev,
      services: [...prev.services, { name: '', active: true, progress: 0 }]
    }));
  };

  const updateService = (index, field, value) => {
    setNewUser(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index) => {
    setNewUser(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addPresetUser = (preset) => {
    setNewUser(preset);
    setShowAddUser(true);
  };

  return (
    <>
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
      
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.logoSection}>
              <div style={styles.logo}>
                <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px', color: 'white' }}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 style={styles.title}>MarklenceMedia Admin</h1>
                <p style={styles.subtitle}>Administration Panel</p>
              </div>
            </div>
            <div style={styles.userSection}>
              {currentUser && (
                <div style={styles.welcomeText}>
                  Welcome, {currentUser.name}
                </div>
              )}
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <i data-lucide="log-out"></i>
                Log out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.content}>
            <h2 style={styles.pageTitle}>User Management</h2>
            
            {message && (
              <div style={message.includes('success') ? styles.successAlert : styles.errorAlert}>
                {message}
              </div>
            )}

            {/* Quick Add Buttons */}
            <div style={styles.quickActions}>
              <h3 style={styles.sectionTitle}>Quick Add Users</h3>
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => addPresetUser({
                    name: 'anna',
                    password: '54321',
                    hasServices: false,
                    services: []
                  })}
                  style={styles.presetBtn}
                >
                  Add Anna (Simple User)
                </button>
                <button 
                  onClick={() => addPresetUser({
                    name: 'John Doe',
                    password: 'password123',
                    hasServices: true,
                    services: [
                      { name: 'Internet Service', active: true, progress: 0 },
                      { name: 'Cable TV', active: false, progress: 25 }
                    ]
                  })}
                  style={styles.presetBtn}
                >
                  Add John Doe (With Services)
                </button>
              </div>
            </div>

            {/* Add Custom User */}
            <div style={styles.section}>
              <button 
                onClick={() => setShowAddUser(!showAddUser)}
                style={styles.toggleBtn}
              >
                {showAddUser ? 'Cancel' : 'Add Custom User'}
              </button>

              {showAddUser && (
                <div style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name:</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      style={styles.input}
                      placeholder="Enter user name"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                      type="text"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      style={styles.input}
                      placeholder="Enter password"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={newUser.hasServices}
                        onChange={(e) => setNewUser(prev => ({ ...prev, hasServices: e.target.checked }))}
                        style={styles.checkbox}
                      />
                      Add Services
                    </label>
                  </div>

                  {newUser.hasServices && (
                    <div style={styles.servicesSection}>
                      <div style={styles.servicesHeader}>
                        <h4 style={styles.servicesTitle}>Services</h4>
                        <button onClick={addService} style={styles.addServiceBtn}>
                          Add Service
                        </button>
                      </div>

                      {newUser.services.map((service, index) => (
                        <div key={index} style={styles.serviceItem}>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(index, 'name', e.target.value)}
                            placeholder="Service name"
                            style={styles.serviceInput}
                          />
                          <label style={styles.serviceCheckbox}>
                            <input
                              type="checkbox"
                              checked={service.active}
                              onChange={(e) => updateService(index, 'active', e.target.checked)}
                            />
                            Active
                          </label>
                          <input
                            type="number"
                            value={service.progress}
                            onChange={(e) => updateService(index, 'progress', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            placeholder="Progress"
                            style={styles.progressInput}
                          />
                          <button 
                            onClick={() => removeService(index)}
                            style={styles.removeBtn}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={handleAddUser}
                    disabled={loading}
                    style={{...styles.submitBtn, ...(loading ? styles.submitBtnDisabled : {})}}
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f9fafb',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    height: '80px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0,
  },
  userSection: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  welcomeText: {
    padding: '0.5rem 1rem',
    background: '#dbeafe',
    borderRadius: '9999px',
    color: '#2563eb',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  logoutBtn: {
    padding: '0.75rem 1.5rem',
    background: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  main: {
    flex: 1,
    padding: '2.5rem',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: 700,
    marginBottom: '2rem',
    color: '#1f2937',
  },
  successAlert: {
    background: '#d1fae5',
    color: '#059669',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #a7f3d0',
  },
  errorAlert: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fecaca',
  },
  quickActions: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  presetBtn: {
    padding: '0.75rem 1.5rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  section: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  toggleBtn: {
    padding: '0.75rem 1.5rem',
    background: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1f2937',
  },
  input: {
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  servicesSection: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1rem',
  },
  servicesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  servicesTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  addServiceBtn: {
    padding: '0.5rem 1rem',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  serviceItem: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
  },
  serviceInput: {
    flex: 1,
    minWidth: '150px',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
  },
  serviceCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#374151',
  },
  progressInput: {
    width: '80px',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
  },
  removeBtn: {
    padding: '6px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  submitBtn: {
    padding: '12px 24px',
    background: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '16px',
  },
  submitBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
  },
};

export default AdminDashboard;