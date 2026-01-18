import React from "react";
import UserService from "../services/UserService";
import "./style.css";

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      email: "",
      password: "",
      rememberMe: false,
      showPassword: false,
      loading: false,
      error: "",
      showErrorPopup: false,
      success: false,
      redirectToDashboard: false,
      isAdmin: false,
    };
  }

  componentDidMount() {
    UserService.getUser()
      .then((response) => {
        console.log("Fetched users:", response.data);
        this.setState({ users: response.data || [] });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, rememberMe, users, isAdmin } = this.state;

    console.log("Login attempt:", { email, password, isAdmin, usersCount: users.length });

    this.setState({ error: "", success: false });

    if (!email || !password) {
      this.setState({
        error: "Please enter your email and password.",
        showErrorPopup: true,
      });
      return;
    }

    this.setState({ loading: true });
    
    setTimeout(() => {
      const inputEmail = email.trim().toLowerCase();
      const inputPassword = password.trim();
      
      const matchedUser = users.find(user => {
        const userEmail = user.name?.trim().toLowerCase() || '';
        const userPassword = user.password?.trim() || '';
        const adminFlag = user.admin || false;
        
        // If admin login is selected, check for admin flag
        if (isAdmin && !adminFlag) {
          return false;
        }
        
        return userEmail === inputEmail && userPassword === inputPassword;
      });

      console.log("Login attempt for:", inputEmail, "Found:", !!matchedUser);

      if (matchedUser) {
        // Check if regular login is selected but user is admin
        if (!isAdmin && matchedUser.admin) {
          this.setState({
            error: "Admin users must use admin login.",
            showErrorPopup: true,
            loading: false,
          });
          return;
        }

        this.setState({ success: true, loading: false });
        
        setTimeout(() => {
          console.log("Login successful, redirecting...");
          
          sessionStorage.setItem('loggedInUser', JSON.stringify({
            email: matchedUser.email,
            name: matchedUser.name,
            id: matchedUser.id,
            admin: matchedUser.admin || false
          }));
          
          // Redirect based on admin status
          if (matchedUser.admin) {
            window.location.href = "/admin-dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        }, 500);
      } else {
        // Specific error message for admin login attempts
        const errorMessage = isAdmin 
          ? "Invalid credentials or insufficient admin privileges."
          : "Invalid email or password.";
          
        console.log("No match found. All users:", users);
        this.setState({
          error: errorMessage,
          showErrorPopup: true,
          loading: false,
        });
      }
    }, 500);
  };

  togglePassword = () => this.setState((s) => ({ showPassword: !s.showPassword }));
  
  closeErrorPopup = () => {
    this.setState({ showErrorPopup: false });
  };

  render() {
    const { email, password, rememberMe, showPassword, loading, error, showErrorPopup, success, users, isAdmin } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
            <div style={styles.cardHeader}>
              <div style={styles.logo}>
                <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: 'white' }}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 style={styles.title}>MarklenceMedia</h1>
              <p style={styles.subtitle}>Client Access Portal</p>
            </div>

          <div style={styles.cardBody}>
            {users && users.length > 0 ? (
              <div style={styles.userCount}>
                Loaded users: {users.length}
              </div>
            ) : null}

            {error && !showErrorPopup && (
              <div style={styles.alertError} role="alert">
                {error}
              </div>
            )}

            {success && (
              <div style={styles.alertSuccess} role="status">
                ✓ Login successful!
              </div>
            )}

            <div style={styles.formContainer}>
              <div style={styles.formGroup}>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="userType"
                      checked={!isAdmin}
                      onChange={() => this.setState({ isAdmin: false })}
                      style={styles.radio}
                    />
                    <span>User Login</span>
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="userType"
                      checked={isAdmin}
                      onChange={() => this.setState({ isAdmin: true })}
                      style={styles.radio}
                    />
                    <span>Admin Login</span>
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon} aria-hidden="true">
                    ✉
                  </span>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon} aria-hidden="true">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') this.handleSubmit(e);
                    }}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    style={styles.toggleBtn}
                    onClick={this.togglePassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁" : "👁️"}
                  </button>
                </div>
              </div>

              <div style={styles.formFooter}>
                <label style={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => this.setState({ rememberMe: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" style={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>

              <button 
                onClick={this.handleSubmit} 
                style={{...styles.loginBtn, ...(loading ? styles.loginBtnDisabled : {})}} 
                disabled={loading}
              >
                <span style={styles.btnText}>{loading ? "Signing In…" : "Sign In"}</span>
              </button>
            </div>

            <div style={styles.divider}>
              <span style={styles.dividerText}>or</span>
            </div>

            <div style={styles.supportText}>
              Need help? <a href="#" style={styles.supportLink}>Contact support</a>
            </div>
          </div>
        </div>

        <div style={styles.footerText}>🔒 Secure CRM Access • Protected Connection</div>

        {showErrorPopup && (
          <div style={styles.popupOverlay} onClick={this.closeErrorPopup}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.popupTitle}>⚠️ Login Error</h3>
              <p style={styles.popupText}>{error}</p>
              <button style={styles.closeBtn} onClick={this.closeErrorPopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '440px',
    overflow: 'hidden',
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    color: '#ffffff',
    padding: '40px 32px',
    textAlign: 'center',
  },
  logo: {
    width: '48px',
    height: '48px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '24px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.9,
    color: '#ffffff',
  },
  cardBody: {
    padding: '32px',
  },
  userCount: {
    background: '#dbeafe',
    color: '#2563eb',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
  },
  alertError: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    border: '1px solid #fecaca',
  },
  alertSuccess: {
    background: '#d1fae5',
    color: '#059669',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    border: '1px solid #a7f3d0',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    padding: '16px',
    background: '#f3f4f6',
    borderRadius: '8px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '600',
  },
  radio: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '16px',
    color: '#6b7280',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'Segoe UI, sans-serif',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#6b7280',
    padding: '4px',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  rememberMe: {
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
  forgotLink: {
    color: '#06b6d4',
    textDecoration: 'none',
    fontWeight: '600',
  },
  loginBtn: {
    width: '100%',
    padding: '12px 24px',
    background: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: 'Segoe UI, sans-serif',
  },
  loginBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
  },
  btnText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '24px 0',
  },
  dividerText: {
    background: '#ffffff',
    color: '#6b7280',
    padding: '0 16px',
    fontSize: '14px',
  },
  supportText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
  supportLink: {
    color: '#06b6d4',
    textDecoration: 'none',
    fontWeight: '600',
  },
  footerText: {
    marginTop: '32px',
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  popupTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
  },
  popupText: {
    margin: '0 0 24px 0',
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  closeBtn: {
    padding: '12px 24px',
    background: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Segoe UI, sans-serif',
  },
};

export default LoginComponent;