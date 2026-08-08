import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import {
  ArrowLeft, Type, Tag, Calendar, MapPin,
  Users, DollarSign, FileText, Shield, Sparkles
} from 'lucide-react';

const gold = '#C8A95B';

const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Conference', 'Anniversary', 'Social Gathering', 'Other'];

function FormField({ icon, label, helper, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ color: gold }}>{icon}</span>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#111', letterSpacing: '0.02em' }}>{label}</label>
      </div>
      {helper && <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#888', paddingLeft: '24px' }}>{helper}</p>}
      {children}
    </div>
  );
}

function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: '', eventType: 'Wedding', date: '',
    city: '', guestCount: '', budget: '', description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/events', formData);
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', height: '50px',
    padding: '0 16px 0 16px',
    border: '1.5px solid #ECECEC',
    borderRadius: '12px', fontSize: '14px',
    color: '#111', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = gold;
    e.target.style.boxShadow = `0 0 0 3px ${gold}15`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#ECECEC';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ maxWidth: '680px', fontFamily: "'Inter', sans-serif" }}>

      {/* Back link */}
      <Link to="/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#888', fontSize: '13px', textDecoration: 'none',
        marginBottom: '28px', transition: 'color 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#111'}
      onMouseLeave={e => e.currentTarget.style.color = '#888'}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            New Event
          </p>
          <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
            Create New Event
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
            Fill in the details below to start planning your perfect event.
          </p>
        </div>

        {/* Decorative illustration */}
        <div style={{ flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            {/* Decorative arch */}
            <path d="M20 80 Q20 20 50 20 Q80 20 80 80" stroke={gold} strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M30 80 Q30 30 50 30 Q70 30 70 80" stroke={gold} strokeWidth="1" fill="none" opacity="0.4" />
            {/* Stars/lights */}
            <circle cx="50" cy="18" r="2" fill={gold} opacity="0.8" />
            <circle cx="20" cy="18" r="1.5" fill={gold} opacity="0.5" />
            <circle cx="80" cy="18" r="1.5" fill={gold} opacity="0.5" />
            <circle cx="35" cy="10" r="1" fill={gold} opacity="0.4" />
            <circle cx="65" cy="10" r="1" fill={gold} opacity="0.4" />
            {/* Hanging lights */}
            <line x1="50" y1="18" x2="50" y2="30" stroke={gold} strokeWidth="1" opacity="0.4" />
            <line x1="35" y1="22" x2="35" y2="34" stroke={gold} strokeWidth="1" opacity="0.3" />
            <line x1="65" y1="22" x2="65" y2="34" stroke={gold} strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="31" r="2" fill={gold} opacity="0.6" />
            <circle cx="35" cy="35" r="1.5" fill={gold} opacity="0.4" />
            <circle cx="65" cy="35" r="1.5" fill={gold} opacity="0.4" />
            {/* Base stage */}
            <rect x="15" y="80" width="70" height="4" rx="2" stroke={gold} strokeWidth="1" fill="none" opacity="0.4" />
            <rect x="10" y="84" width="80" height="2" rx="1" fill={gold} opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fff5f5', border: '1px solid #fed7d7',
          color: '#c53030', padding: '12px 16px', borderRadius: '10px',
          marginBottom: '20px', fontSize: '14px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form Card */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid #ECECEC', padding: '36px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        marginBottom: '16px'
      }}>
        <form onSubmit={handleSubmit}>

          {/* Event Name */}
          <FormField icon={<Type size={14} />} label="Event Name" helper="Give your event a memorable name.">
            <input
              type="text" name="eventName"
              placeholder="e.g. Rahul & Priya Wedding"
              value={formData.eventName}
              onChange={handleChange} required
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </FormField>

          {/* Event Type */}
          <FormField icon={<Tag size={14} />} label="Event Type" helper="Select the type of event.">
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={handleFocus} onBlur={handleBlur}
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </FormField>

          {/* Two columns: Date + City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField icon={<Calendar size={14} />} label="Event Date" helper="When is your event?">
              <input
                type="date" name="date"
                value={formData.date}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </FormField>

            <FormField icon={<MapPin size={14} />} label="City" helper="Where is your event?">
              <input
                type="text" name="city"
                placeholder="e.g. Pune, Mumbai, Delhi"
                value={formData.city}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </FormField>
          </div>

          {/* Two columns: Guests + Budget */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField icon={<Users size={14} />} label="Guest Count" helper="Approximate number of guests.">
              <input
                type="number" name="guestCount"
                placeholder="e.g. 150"
                value={formData.guestCount}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </FormField>

            <FormField icon={<DollarSign size={14} />} label="Budget (₹)" helper="Estimated event budget.">
              <input
                type="number" name="budget"
                placeholder="e.g. 500000"
                value={formData.budget}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField icon={<FileText size={14} />} label="Description" helper="Add any special requirements, preferences or notes.">
            <textarea
              name="description"
              placeholder="e.g. We'd love a floral theme with pastel colors. Outdoor venue preferred..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{
                ...inputStyle, height: 'auto',
                padding: '14px 16px', resize: 'vertical',
                lineHeight: '1.6'
              }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </FormField>

          {/* Divider */}
          <div style={{ height: '1px', background: '#ECECEC', margin: '8px 0 28px' }} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: '54px',
              background: loading ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
              color: loading ? '#999' : '#000',
              border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : `0 4px 20px ${gold}30`,
              transition: 'all 0.25s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              letterSpacing: '0.02em',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${gold}40`; } }}
            onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${gold}30`; } }}
          >
            <Sparkles size={16} />
            {loading ? 'Creating your event...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Security Card */}
      <div style={{
        background: '#fff', borderRadius: '14px',
        border: '1px solid #ECECEC', padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: '14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          width: '40px', height: '40px',
          background: `${gold}12`, borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Shield size={18} color={gold} />
        </div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#111' }}>Your data is secure</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
            We never share your information with anyone. Your event details remain private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;