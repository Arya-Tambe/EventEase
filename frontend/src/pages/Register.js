import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Building2, ArrowRight } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'user'
  });
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
      const res = await API.post('/auth/register', formData);
      login(res.data);
      if (res.data.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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

        {/* Gold orb */}
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, #D4AF3712 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '-80px',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, #D4AF3708 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
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
                Join EventEase
              </span>
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '700', lineHeight: '1.2', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Start Planning<br />
              <span style={{ background: 'linear-gradient(135deg, #D4AF37, #f0d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Extraordinary Events
              </span>
            </h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Create your free account and access verified vendors, smart planning tools, and real-time event tracking.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
            {[
              { icon: '✦', text: 'Access 200+ verified vendors' },
              { icon: '✦', text: 'Smart event planning engine' },
              { icon: '✦', text: 'Real-time readiness tracking' },
              { icon: '✦', text: 'Custom package builder' },
              { icon: '✦', text: 'Direct vendor communication' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#D4AF37', fontSize: '10px' }}>{item.icon}</span>
                <span style={{ color: '#888', fontSize: '14px' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom gold divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, #D4AF3740, transparent)' }} />
          <p style={{ color: '#444', fontSize: '12px', marginTop: '20px', lineHeight: '1.6' }}>
            Trusted by event planners across India for weddings, corporate events, birthdays, and more.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        overflowY: 'auto',
        background: '#0A0A0A'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#D4AF37', fontWeight: '600', textDecoration: 'none' }}>
                Sign in here
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

          {/* Role Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              I am registering as
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { value: 'user', label: 'Event Planner', desc: 'Plan & manage events', icon: <User size={16} /> },
                { value: 'vendor', label: 'Vendor', desc: 'Offer event services', icon: <Building2 size={16} /> }
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setFormData({ ...formData, role: option.value })}
                  style={{
                    flex: 1, padding: '14px',
                    border: formData.role === option.value ? '1px solid #D4AF37' : '1px solid #2a2a2a',
                    borderRadius: '10px', cursor: 'pointer',
                    background: formData.role === option.value ? '#D4AF3710' : '#111',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: formData.role === option.value ? '#D4AF37' : '#555' }}>{option.icon}</span>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: formData.role === option.value ? '#D4AF37' : '#888' }}>
                      {option.label}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#555' }}>{option.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <input
                type="text" name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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

            {/* Phone */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Phone Number
              </label>
              <input
                type="text" name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
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
              {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#444', marginTop: '20px', lineHeight: '1.6' }}>
            By creating an account, you agree to our{' '}
            <span style={{ color: '#666', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#666', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;