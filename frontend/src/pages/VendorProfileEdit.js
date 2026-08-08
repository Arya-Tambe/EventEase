import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Building2, MapPin, Phone, FileText, Tag, Check, Instagram } from 'lucide-react';

const gold = '#C8A95B';

const categorySubcategories = {
  Venue: ['Banquet Hall', 'Lawn', 'Resort', 'Conference Hall', 'Auditorium', 'Farmhouse', 'Open Ground'],
  Catering: ['Veg Catering', 'Non-Veg Catering', 'Buffet Service', 'Live Counters', 'Snacks Service', 'Sweet/Dessert Service'],
  Decoration: ['Floral Decoration', 'Balloon Decoration', 'Theme Decoration', 'Stage Decoration', 'Mandap Decoration'],
  Photography: ['Event Photography', 'Wedding Photography', 'Drone Photography', 'Corporate Photography', 'Birthday Photography'],
  Videography: ['Event Videography', 'Drone Videography', 'Live Streaming', 'Wedding Film'],
  Entertainment: ['DJ', 'Singer', 'Live Band', 'Anchor', 'Magician'],
  'Sound & Lighting': ['Sound System', 'LED Wall', 'Projector', 'Generator', 'Microphone Setup', 'Stage Light']
};

function VendorProfileEdit() {
  const [formData, setFormData] = useState({
    businessName: '', description: '',
    category: 'Venue', subcategory: '',
    location: '', phone: '', instagramHandle: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/vendors/profile');
        setFormData({
          businessName: res.data.businessName || '',
          description: res.data.description || '',
          category: res.data.category || 'Venue',
          subcategory: res.data.subcategory || '',
          location: res.data.location || '',
          phone: res.data.phone || '',
          instagramHandle: res.data.instagramHandle || ''
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({ ...formData, category: value, subcategory: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await API.put('/vendors/profile', formData);
      setSuccess('Profile updated successfully!');
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

  const handleFocus = (e) => {
    e.target.style.borderColor = gold;
    e.target.style.boxShadow = `0 0 0 3px ${gold}12`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#ECECEC';
    e.target.style.boxShadow = 'none';
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '700px', fontFamily: "'Inter', sans-serif" }}>

      <Link to="/vendor/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#111'}
      onMouseLeave={e => e.currentTarget.style.color = '#888'}
      ><ArrowLeft size={14} /> Back to Dashboard</Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Vendor Settings
        </p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          Edit Business Profile
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
          Keep your profile updated to attract more clients
        </p>
      </div>

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

      {/* Form Card */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid #ECECEC', padding: '32px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '16px'
      }}>
        <form onSubmit={handleSubmit}>

          {/* Business Name */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Building2 size={13} color={gold} />
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Business Name</label>
            </div>
            <input type="text" name="businessName" value={formData.businessName}
              onChange={handleChange} required placeholder="e.g. Royal Banquet Hall"
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* Category + Subcategory */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Tag size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</label>
              </div>
              <select name="category" value={formData.category} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={handleFocus} onBlur={handleBlur}
              >
                {Object.keys(categorySubcategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Tag size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subcategory</label>
              </div>
              <select name="subcategory" value={formData.subcategory} onChange={handleChange} required
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={handleFocus} onBlur={handleBlur}
              >
                <option value="">Select Subcategory</option>
                {categorySubcategories[formData.category].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>City</label>
              </div>
              <input type="text" name="location" value={formData.location}
                onChange={handleChange} required placeholder="e.g. Pune"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Phone size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</label>
              </div>
              <input type="text" name="phone" value={formData.phone}
                onChange={handleChange} required placeholder="+91 98765 43210"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileText size={13} color={gold} />
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
            </div>
            <textarea name="description" value={formData.description}
              onChange={handleChange} rows="4"
              placeholder="Describe your business, experience and what makes you unique..."
              style={{ ...inputStyle, height: 'auto', padding: '14px 16px', resize: 'vertical', lineHeight: '1.6' }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
            
          </div>
          
          
          
          

          <div style={{ height: '1px', background: '#ECECEC', margin: '0 0 24px' }} />

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" disabled={saving} style={{
              padding: '13px 32px',
              background: saving ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
              color: saving ? '#999' : '#000',
              border: 'none', borderRadius: '12px',
              fontSize: '14px', fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : `0 4px 16px ${gold}30`,
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
            }}>
              <Check size={16} />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <Link to="/vendor/dashboard">
              <button type="button" style={{
                padding: '13px 24px', background: '#fff',
                color: '#666', border: '1.5px solid #ECECEC',
                borderRadius: '12px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer'
              }}>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
      

      {/* Tips Card */}
      <div style={{
        background: `${gold}08`, border: `1px solid ${gold}20`,
        borderRadius: '14px', padding: '20px',
        display: 'flex', alignItems: 'flex-start', gap: '14px'
      }}>
        <div style={{ width: '36px', height: '36px', background: `${gold}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '18px' }}>💡</span>
        </div>
        <div>
          <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '600', color: '#111' }}>Profile Tips</p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px', color: '#888', lineHeight: '1.8' }}>
            <li>A detailed description increases enquiry rates by 3x</li>
            <li>Keep your phone number updated for faster client contact</li>
            <li>Changing category requires re-approval from admin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VendorProfileEdit;