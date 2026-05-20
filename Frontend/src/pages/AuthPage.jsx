import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleMock, setShowGoogleMock] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const { user, login, register, isLoggedIn, googleLogin, pendingAction, setPendingAction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state)?.from || '/';

  // Better default for the mock based on user feedback
  const displayEmail = email.trim() || 'aaryangulati7@gmail.com';
  const displayName = name.trim() || 'Aaryan Gulati';

  // If already logged in, redirect
  useEffect(() => {
    if (isLoggedIn && !showGoogleMock && !isDetecting) {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      
      if (user?.isAdmin) {
        navigate('/dashboard');
      } else {
        navigate(from, { state: location.state, replace: true });
      }
    }
  }, [isLoggedIn, user, navigate, pendingAction, setPendingAction, showGoogleMock, isDetecting, from, location.state]);

  const handleGoogleClick = () => {
    setIsDetecting(true);
    setShowGoogleMock(true);
    // Fake detection delay
    setTimeout(() => {
      setIsDetecting(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isLogin && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email.trim(), password.trim());
      } else {
        await register(name.trim(), email.trim(), password.trim());
      }
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleGoogleContinue = async () => {
    setShowGoogleMock(false);
    setIsSubmitting(true);
    
    try {
      await googleLogin(displayName, displayEmail);
      navigate(from, { state: location.state, replace: true });
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-page-wrapper">
        <div className="auth-card">
          {/* Left Side — Branding */}
          <div className="auth-branding">
            <div className="auth-brand-content">
              <div className="auth-brand-icon">🌍</div>
              <h2>TravelSphere</h2>
              <p>Your smart travel companion. Explore destinations, book hotels, and plan your perfect trip.</p>
              <div className="auth-features-list">
                <div className="auth-feature-item">
                  <span>✈️</span> Explore 14+ destinations
                </div>
                <div className="auth-feature-item">
                  <span>🏨</span> Best hotel deals
                </div>
                <div className="auth-feature-item">
                  <span>📝</span> Smart itinerary planning
                </div>
                <div className="auth-feature-item">
                  <span>💰</span> Budget-friendly options
                </div>
              </div>
            </div>
          </div>

          {/* Right Side — Form */}
          <div className="auth-form-side">
            <div className="auth-form-header">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Sign in to continue your journey' : 'Join TravelSphere and start exploring'}</p>
            </div>

            <div className="auth-socials">
              <button 
                type="button" 
                className="auth-social-btn google-btn"
                onClick={handleGoogleClick}
              >
                <span className="auth-social-icon">
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </span>
                Continue with Google
              </button>
              {/* <button type="button" className="auth-social-btn facebook-btn">
                <span className="auth-social-icon">📘</span>
                Continue with Facebook
              </button> */}
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">👤</span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">📧</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">🔒</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="auth-forgot">
                  <a href="#">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button className="auth-switch-btn" onClick={switchMode} type="button">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Mock Modal */}
      {showGoogleMock && (
        <div className="modal-overlay" onClick={() => setShowGoogleMock(false)}>
          <div className="google-mock-card" onClick={(e) => e.stopPropagation()}>
            {isDetecting ? (
              <div className="google-mock-loading" style={{ padding: '60px 40px', textAlign: 'center' }}>
                <div className="itin-loading-spinner" style={{ marginBottom: '20px' }}></div>
                <h3 style={{ color: '#202124', fontSize: '1.2rem' }}>Checking for Google accounts...</h3>
              </div>
            ) : (
              <>
                <div className="google-mock-header">
                  <svg className="google-logo-svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <h3>Sign in</h3>
                  <p>to continue to TravelSphere</p>
                </div>

                <div className="google-mock-body">
                  <div className="google-account-item" onClick={handleGoogleContinue} title="Click to continue with this account">
                    <div className="google-avatar">{displayName.charAt(0).toUpperCase()}</div>
                    <div className="google-acc-info">
                      <span className="google-acc-name">{displayName}</span>
                      <span className="google-acc-email">{displayEmail}</span>
                    </div>
                    <div className="google-edit-icon" style={{ fontSize: '0.8rem', opacity: 0.5 }}>✏️</div>
                  </div>
                  <button className="google-switch-acc" onClick={() => { setEmail(''); setName(''); setShowGoogleMock(false); }}>
                    Use another account
                  </button>
                </div>

                <div className="google-legal-text">
                  To continue, Google will share your name, email address, language preference, and profile picture with TravelSphere. Before using this app, you can review TravelSphere's <a href="#">privacy policy</a> and <a href="#">terms of service</a>.
                </div>

                <div className="google-mock-footer">
                  <button className="google-continue-btn" onClick={handleGoogleContinue}>
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthPage;

