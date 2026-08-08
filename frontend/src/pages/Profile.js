import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Edit3, Check, ArrowRight } from 'lucide-react';

const gold = '#C8A95B';

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/auth/profile');
      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await API.put('/auth/profile', formData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', height: '50px',
    padding: '0 16px', border: '1.5px solid #ECECEC',
    borderRadius: '12px', fontSize: '14px',
    color: '#111', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '700px', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Account
        </p>
        <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          My Profile
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Card */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid #ECECEC', overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        marginBottom: '20px'
      }}>
        {/* Gold banner top */}
        <div style={{
          height: '100px',
          background: `linear-gradient(135deg, ${gold}20, ${gold}08)`,
          borderBottom: `1px solid ${gold}20`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(${gold}20 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
          <div style={{
            position: 'absolute', right: '-40px', top: '-40px',
            width: '160px', height: '160px',
            background: `radial-gradient(circle, ${gold}15, transparent 70%)`,
            borderRadius: '50%'
          }} />
        </div>

        {/* Avatar */}
        <div style={{ padding: '0 32px 32px', marginTop: '-40px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            borderRadius: '50%', border: '4px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: '700', color: '#000',
            boxShadow: `0 4px 16px ${gold}30`, marginBottom: '16px'
          }}>
            {formData.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#111' }}>{formData.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: `${gold}12`, border: `1px solid ${gold}30`,
                  color: gold, fontSize: '11px', fontWeight: '600',
                  padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.06em'
                }}>Event Planner</span>
                <span style={{
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  color: '#16a34a', fontSize: '11px', fontWeight: '600',
                  padding: '3px 10px', borderRadius: '4px'
                }}>✓ Active</span>
              </div>
            </div>

            <button
              onClick={() => { setEditMode(!editMode); setSuccess(''); setError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 18px',
                background: editMode ? '#F7F5F2' : `linear-gradient(135deg, ${gold}, #a8833a)`,
                color: editMode ? '#666' : '#000',
                border: editMode ? '1px solid #ECECEC' : 'none',
                borderRadius: '8px', fontWeight: '600', fontSize: '13px',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {editMode ? <><Check size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
            </button>
          </div>

          {/* Success/Error */}
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} /> {success}
            </div>
          )}
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          {editMode ? (
            /* Edit Form */
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Full Name
                  </label>
                  <input
                    type="text" name="name"
                    value={formData.name} onChange={handleChange} required
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                    onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Phone Number
                  </label>
                  <input
                    type="text" name="phone"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                    onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email Address
                </label>
                <input
                  type="email" name="email"
                  value={formData.email} onChange={handleChange} required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                  onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button
                type="submit" disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px',
                  background: saving ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
                  color: saving ? '#999' : '#000',
                  border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : `0 4px 16px ${gold}30`
                }}
              >
                {saving ? 'Saving...' : <><ArrowRight size={16} /> Save Changes</>}
              </button>
            </form>
          ) : (
            /* View Mode */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: <User size={15} color={gold} />, label: 'Full Name', value: formData.name },
                { icon: <Mail size={15} color={gold} />, label: 'Email Address', value: formData.email },
                { icon: <Phone size={15} color={gold} />, label: 'Phone Number', value: formData.phone || 'Not provided' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: '#FAFAFA',
                  borderRadius: '12px', border: '1px solid #F0EEE8'
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: `${gold}10`, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>{item.icon}</div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Security Card */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #ECECEC', padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Account Security</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: '#F7F5F2', borderRadius: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: `${gold}12`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color={gold} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#111' }}>Your account is secure</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Password protected • JWT authenticated</p>
          </div>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px' }}>
            ✓ Protected
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;