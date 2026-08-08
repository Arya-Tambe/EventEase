import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      login(res.data);
      if (res.data.role === 'vendor') navigate('/vendor/dashboard');
      else if (res.data.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    height: '50px',
    padding: '0 16px',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#ffffff',
    background: '#1a1a1a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    fontFamily: "'Inter', sans-serif"
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#D4AF37';
    e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#2a2a2a';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', sans-serif",
      background: '#0A0A0A'
    }}>
      {/* LEFT SIDE - Visual Panel */}
      <div style={{
        flex: '0 0 420px',
        background: '#0f0f0f',
        borderRight: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(#D4AF3710 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />

        {/* Gold orbs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, #D4AF3712 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-60px',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, #D4AF3708 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #D4AF37, #C9A227)',
                borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: '800', fontSize: '16px'
              }}>E</div>
              <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', letterSpacing: '0.02em' }}>EventEase</span>
            </div>
          </Link>

          {/* Main text */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '24px', height: '1px', background: '#D4AF37' }} />
              <span style={{ color: '#D4AF37', fontSize: '11px', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase' }}>
                Welcome Back
              </span>
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '700', lineHeight: '1.2', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Your Events<br />
              <span style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Await You
              </span>
            </h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Sign in to continue planning extraordinary events with verified vendors and smart tools.
            </p>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
            {[
              { icon: '✦', title: 'Event Planning Engine', desc: 'Auto-generate required services' },
              { icon: '✦', title: 'Verified Vendors', desc: '200+ trusted professionals' },
              { icon: '✦', title: 'Smart Package Builder', desc: 'Budget-aware recommendations' },
              { icon: '✦', title: 'Readiness Tracker', desc: 'Real-time progress monitoring' },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 14px',
                background: '#ffffff06',
                border: '1px solid #ffffff08',
                borderRadius: '8px'
              }}>
                <span style={{ color: '#D4AF37', fontSize: '10px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#ccc' }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#555' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, #D4AF3740, transparent)', marginBottom: '20px' }} />
            <p style={{ color: '#444', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
              Trusted by event planners across India for weddings, corporate events, birthdays, and more.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        background: '#0A0A0A'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Sign in to EventEase
            </h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#D4AF37', fontWeight: '600', textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#1a0a0a', border: '1px solid #3d1515',
              color: '#f87171', padding: '12px 16px',
              borderRadius: '10px', marginBottom: '20px',
              fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email" name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <span style={{ fontSize: '12px', color: '#D4AF37', cursor: 'pointer', fontWeight: '500' }}>
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange} required
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#555',
                    display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s', padding: 0
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              <input
                type="checkbox"
                id="remember"
                style={{ width: 'auto', accentColor: '#D4AF37', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '50px',
                background: loading ? '#2a2a2a' : 'linear-gradient(135deg, #D4AF37, #C9A227)',
                color: loading ? '#666' : '#000',
                border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(212,175,55,0.25)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.4)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.25)'; }}
            >
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#444', marginTop: '24px', lineHeight: '1.6' }}>
            By signing in, you agree to our{' '}
            <span style={{ color: '#666', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#666', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;