import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Send, MapPin, Star, Shield, MessageSquare, Calendar, Users, DollarSign, CheckCircle } from 'lucide-react';

const gold = '#C8A95B';

function SendEnquiry() {
  const { vendorId } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  

  const [vendor, setVendor] = useState(null);
  const [formData, setFormData] = useState({
    message: '', eventType: '', eventDate: '', guestCount: '', budget: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const vendorRes = await API.get(`/vendors/${vendorId}`);
        setVendor(vendorRes.data);
        if (eventId) {
          const eventRes = await API.get(`/events/${eventId}`);
          setFormData({
            message: `Hi, I'm interested in your services for my ${eventRes.data.eventType} event on ${new Date(eventRes.data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Could you please share more details about your packages and availability?`,
            eventType: eventRes.data.eventType,
            eventDate: eventRes.data.date.split('T')[0],
            guestCount: eventRes.data.guestCount,
            budget: eventRes.data.budget
          });
        }
      } catch (err) {
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [vendorId, eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      await API.post('/enquiries', {
        vendor: vendorId,
        event: eventId || undefined,
        ...formData
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enquiry');
    } finally {
      setSending(false);
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

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading...</div>;
  if (!vendor) return <p style={{ padding: '40px', color: '#c53030' }}>{error}</p>;

  if (success) {
    return (
      <div style={{ maxWidth: '600px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{
          background: '#fff', borderRadius: '24px',
          border: '1px solid #ECECEC', padding: '60px 40px',
          textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
        }}>
          {/* Success animation */}
          <div style={{
            width: '80px', height: '80px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: `0 8px 32px ${gold}30`
          }}>
            <CheckCircle size={36} color="#000" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '1px', background: `${gold}40` }} />
            <span style={{ color: gold, fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Enquiry Sent</span>
            <div style={{ width: '40px', height: '1px', background: `${gold}40` }} />
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#111', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Your Enquiry is on its Way!
          </h2>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.7', margin: '0 0 8px' }}>
            <strong style={{ color: '#111' }}>{vendor.businessName}</strong> has received your enquiry and will get back to you shortly.
          </p>
          <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 36px', lineHeight: '1.6' }}>
            You'll receive a notification once they respond. Most vendors reply within 24 hours.
          </p>

          {/* What happens next */}
          <div style={{ background: '#F7F5F2', borderRadius: '14px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What happens next?</p>
            {[
              { step: '01', text: 'Vendor reviews your enquiry' },
              { step: '02', text: 'They send you a reply with details' },
              { step: '03', text: 'You receive a notification' },
              { step: '04', text: 'Book your preferred package' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: idx < 3 ? '10px' : 0 }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: gold, minWidth: '24px' }}>{item.step}</span>
                <span style={{ fontSize: '13px', color: '#666' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {eventId && (
              <Link to={`/events/${eventId}`}>
                <button style={{
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                  color: '#000', border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  boxShadow: `0 4px 16px ${gold}30`
                }}>Back to Event</button>
              </Link>
            )}
            <Link to="/dashboard">
              <button style={{
                padding: '12px 24px',
                background: '#fff', color: '#666',
                border: '1.5px solid #ECECEC', borderRadius: '10px',
                fontWeight: '600', fontSize: '14px', cursor: 'pointer'
              }}>Go to Dashboard</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Back */}
      <Link to={`/vendors/${vendorId}${eventId ? `?eventId=${eventId}` : ''}`} style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#111'}
      onMouseLeave={e => e.currentTarget.style.color = '#888'}
      >
        <ArrowLeft size={14} /> Back to Profile
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Send Enquiry
        </p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          Contact {vendor.businessName}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
          Fill in your event details and send a personalised enquiry
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '28px' }}>

        {/* LEFT - Form */}
        <div>
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ECECEC', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

            <form onSubmit={handleSubmit}>
              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MessageSquare size={14} color={gold} />
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Your Message
                  </label>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required rows="5"
                  placeholder="Introduce yourself and share what you're looking for..."
                  style={{
                    ...inputStyle, height: 'auto',
                    padding: '14px 16px', resize: 'vertical', lineHeight: '1.6'
                  }}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              {/* Event Type */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Star size={14} color={gold} />
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Event Type</label>
                </div>
                <input
                  type="text" name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  placeholder="e.g. Wedding, Birthday, Corporate"
                  style={inputStyle}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              {/* Date + Guests */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={14} color={gold} />
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Event Date</label>
                  </div>
                  <input
                    type="date" name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Users size={14} color={gold} />
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Guest Count</label>
                  </div>
                  <input
                    type="number" name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                    style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Budget */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <DollarSign size={14} color={gold} />
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget (₹)</label>
                </div>
                <input
                  type="number" name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 100000"
                  style={inputStyle}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              <div style={{ height: '1px', background: '#ECECEC', margin: '0 0 24px' }} />

              <button
                type="submit" disabled={sending}
                style={{
                  width: '100%', height: '52px',
                  background: sending ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
                  color: sending ? '#999' : '#000',
                  border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '700', cursor: sending ? 'not-allowed' : 'pointer',
                  boxShadow: sending ? 'none' : `0 4px 20px ${gold}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.boxShadow = `0 8px 32px ${gold}40`; }}
                onMouseLeave={e => { if (!sending) e.currentTarget.style.boxShadow = `0 4px 20px ${gold}30`; }}
              >
                <Send size={16} />
                {sending ? 'Sending Enquiry...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT - Vendor Summary */}
        <div>
          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid #ECECEC', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            position: 'sticky', top: '20px'
          }}>
            {/* Vendor image */}
            <div style={{ height: '160px', position: 'relative', background: `${gold}10` }}>
              <img
                src={vendor.portfolio && vendor.portfolio.length > 0
                  ? `http://localhost:5000${vendor.portfolio[0]}`
                  : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80'}
                alt={vendor.businessName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }} />
              {vendor.isVerified && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'rgba(255,255,255,0.95)', borderRadius: '6px',
                  padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Shield size={10} color={gold} />
                  <span style={{ fontSize: '9px', fontWeight: '700', color: gold, letterSpacing: '0.06em' }}>VERIFIED</span>
                </div>
              )}
            </div>

            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#111' }}>{vendor.businessName}</h3>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#888' }}>{vendor.subcategory || vendor.category}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
                  <Star size={12} color={gold} fill={gold} />
                  <span>{vendor.rating} rating • {vendor.totalReviews} reviews</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
                  <MapPin size={12} color={gold} />
                  <span>{vendor.location}</span>
                </div>
              </div>

              {vendor.packages.length > 0 && (
                <div style={{ background: '#F7F5F2', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888' }}>Starting from</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: gold }}>
                    ₹{Math.min(...vendor.packages.map(p => p.price)).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Tips */}
              <div style={{ borderTop: '1px solid #ECECEC', paddingTop: '16px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tips for a great enquiry</p>
                {[
                  'Be specific about your event date',
                  'Mention your guest count & budget',
                  'Ask about availability first',
                ].map((tip, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: gold, fontSize: '10px', marginTop: '2px' }}>✦</span>
                    <span style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendEnquiry;