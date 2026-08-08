import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, Clock, ChevronRight, Star } from 'lucide-react';

const gold = '#C8A95B';

const eventImages = {
  Wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  Birthday: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
  Corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  Conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  Anniversary: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
  'Social Gathering': 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80',
  Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
};

const serviceIcons = {
  Venue: '🏛️', Catering: '🍽️', Decoration: '🌸',
  Photography: '📸', Videography: '🎬',
  Entertainment: '🎵', 'Sound & Lighting': '🎙️'
};

function CircularProgress({ percentage, size = 80 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#ECECEC" strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={gold} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>{percentage}%</span>
        <span style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ready</span>
      </div>
    </div>
  );
}

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [recommendations, setRecommendations] = useState({});
  const [error, setError] = useState('');
  const [addingVendor, setAddingVendor] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const getEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError('Failed to load event');
      }
    };
    const getRecs = async () => {
      try {
        const res = await API.get(`/events/${id}/recommendations`);
        setRecommendations(res.data);
        const keys = Object.keys(res.data);
        if (keys.length > 0) setActiveTab(keys[0]);
      } catch (err) {}
    };
    getEvent();
    getRecs();
  }, [id]);
  

  const handleQuickSelect = async (service, vendor) => {
    if (addingVendor) return;
    if (!vendor.packages || vendor.packages.length === 0) {
      setError(`${vendor.businessName} has no packages set up yet`);
      return;
    }
    setAddingVendor(vendor._id);
    setError('');
    try {
      const pkg = vendor.packages[0];
      await API.post(`/events/${id}/vendors`, {
        service, vendor: vendor._id,
        packageName: pkg.name, price: pkg.price
      });
      const eventRes = await API.get(`/events/${id}`);
      setEvent(eventRes.data);
      const recRes = await API.get(`/events/${id}/recommendations`);
      setRecommendations(recRes.data);
      const keys = Object.keys(recRes.data);
      if (keys.length > 0) setActiveTab(keys[0]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vendor');
    } finally {
      setAddingVendor(null);
    }
  };

  if (error && !event) return <p style={{ padding: '40px', color: '#c53030' }}>{error}</p>;
  if (!event) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
      <p>Loading event details...</p>
    </div>
  );

  const budgetRemaining = event.budget - (event.totalSpent || 0);

  return (
    <div style={{ maxWidth: '900px', fontFamily: "'Inter', sans-serif", paddingBottom: '100px' }}>

      {/* Back link */}
      <Link to="/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#888', fontSize: '13px', textDecoration: 'none',
        marginBottom: '24px', transition: 'color 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#111'}
      onMouseLeave={e => e.currentTarget.style.color = '#888'}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Hero Card */}
      <div style={{
        background: '#fff', borderRadius: '18px',
        border: '1px solid #ECECEC', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBottom: '24px', display: 'flex'
      }}>
        {/* Event Image */}
        <div style={{ width: '320px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img
            src={eventImages[event.eventType] || eventImages.Other}
            alt={event.eventType}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '280px' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.15), rgba(0,0,0,0.5))' }} />
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            border: `1px solid ${gold}50`, borderRadius: '6px',
            padding: '4px 12px'
          }}>
            <span style={{ color: gold, fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {event.eventType}
            </span>
          </div>
        </div>

        {/* Event Info */}
        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: '0 0 20px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
              {event.eventName}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { icon: <Calendar size={14} color={gold} />, label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: <MapPin size={14} color={gold} />, label: 'Location', value: event.city },
                { icon: <Users size={14} color={gold} />, label: 'Guests', value: `${event.guestCount} guests` },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', background: `${gold}12`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#111', fontWeight: '500' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Budget */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: '#F7F5F2', borderRadius: '10px', padding: '12px 14px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Budget</p>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111' }}>₹{event.budget.toLocaleString()}</p>
              </div>
              <div style={{ flex: 1, background: '#F7F5F2', borderRadius: '10px', padding: '12px 14px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Spent</p>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: gold }}>₹{(event.totalSpent || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Readiness */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ECECEC' }}>
            <CircularProgress percentage={event.readinessPercentage} size={80} />
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Event Readiness</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                {event.selectedVendors.length} of {event.requiredServices.length} services booked
              </p>
              {event.description && (
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>"{event.description}"</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Required Services */}
      <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECECEC', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700', color: '#111' }}>Required Services</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Services needed for your {event.eventType}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {event.requiredServices.map((service) => {
            const isBooked = event.selectedVendors.some(v => v.service === service);
            return (
              <div key={service} style={{
                background: isBooked ? '#f0fdf4' : '#FAFAFA',
                border: `1px solid ${isBooked ? '#bbf7d0' : '#ECECEC'}`,
                borderRadius: '12px', padding: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: isBooked ? '#dcfce7' : `${gold}12`,
                    borderRadius: '10px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {serviceIcons[service] || '✦'}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#111' }}>{service}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isBooked ? (
                        <><CheckCircle size={11} color="#16a34a" /><span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '500' }}>Booked</span></>
                      ) : (
                        <><Clock size={11} color="#888" /><span style={{ fontSize: '11px', color: '#888' }}>Pending</span></>
                      )}
                    </div>
                  </div>
                </div>
                {!isBooked && (
                  <Link to={`/vendors/search?category=${service}&eventId=${event._id}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '7px 14px',
                      background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                      color: '#000', border: 'none', borderRadius: '6px',
                      fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      Find <ChevronRight size={12} />
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Vendors */}
      {Object.keys(recommendations).length > 0 && (
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECECEC', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '700', color: '#111' }}>Recommended Vendors</h2>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#888' }}>Verified vendors matched to your event</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {Object.keys(recommendations).map((service) => (
              <button
                key={service}
                onClick={() => setActiveTab(service)}
                style={{
                  padding: '7px 16px',
                  background: activeTab === service ? `linear-gradient(135deg, ${gold}, #a8833a)` : '#F7F5F2',
                  color: activeTab === service ? '#000' : '#666',
                  border: activeTab === service ? 'none' : '1px solid #ECECEC',
                  borderRadius: '20px', fontWeight: '600',
                  fontSize: '12px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >{service}</button>
            ))}
          </div>

          {/* Vendor Cards */}
          {activeTab && recommendations[activeTab] && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {recommendations[activeTab].map((vendor) => (
                <div key={vendor._id} style={{
                  background: '#FAFAFA', borderRadius: '14px',
                  border: '1px solid #ECECEC', overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Vendor image */}
                  <div style={{ height: '100px', overflow: 'hidden', position: 'relative', background: '#f0f0f0' }}>
                    {vendor.portfolio && vendor.portfolio.length > 0 ? (
                      <img src={`http://localhost:5000${vendor.portfolio[0]}`} alt={vendor.businessName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${gold}20, ${gold}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                        {serviceIcons[vendor.category] || '🏪'}
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.3))' }} />
                  </div>

                  <div style={{ padding: '14px' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{vendor.businessName}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Star size={11} color={gold} fill={gold} />
                      <span style={{ fontSize: '12px', color: '#666' }}>{vendor.rating} • {vendor.location}</span>
                    </div>

                    {vendor.packages.length > 0 && (
                      <div style={{ background: '#fff', border: '1px solid #ECECEC', borderRadius: '8px', padding: '8px 10px', marginBottom: '10px' }}>
                        <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '600', color: '#111' }}>{vendor.packages[0].name}</p>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: gold }}>₹{vendor.packages[0].price.toLocaleString()}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleQuickSelect(activeTab, vendor)}
                        disabled={addingVendor === vendor._id || vendor.packages.length === 0}
                        style={{
                          flex: 1, padding: '7px',
                          background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                          color: '#000', border: 'none', borderRadius: '6px',
                          fontWeight: '600', fontSize: '11px', cursor: 'pointer'
                        }}
                      >
                        {addingVendor === vendor._id ? 'Adding...' : 'Select'}
                      </button>
                      <Link to={`/vendors/${vendor._id}?eventId=${event._id}`}>
                        <button style={{
                          padding: '7px 10px',
                          background: '#fff', color: '#666',
                          border: '1px solid #ECECEC', borderRadius: '6px',
                          fontWeight: '500', fontSize: '11px', cursor: 'pointer'
                        }}>View</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Optional Services */}
      {event.optionalServices && event.optionalServices.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECECEC', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '700', color: '#111' }}>Optional Services</h2>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#888' }}>Enhance your event with additional services</p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {event.optionalServices.map((service) => {
              const isBooked = event.selectedVendors.some(v => v.service === service);
              return (
                <div key={service} style={{
                  background: isBooked ? '#f0fdf4' : '#FAFAFA',
                  border: `1px solid ${isBooked ? '#bbf7d0' : '#ECECEC'}`,
                  borderRadius: '12px', padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '20px' }}>{serviceIcons[service] || '✦'}</span>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#111' }}>{service}</p>
                    {isBooked ? (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '500' }}>✓ Added</span>
                    ) : (
                      <Link to={`/vendors/search?category=${service}&eventId=${event._id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '11px', color: gold, fontWeight: '600', cursor: 'pointer' }}>+ Add Service</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booked Vendors */}
      {event.selectedVendors.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECECEC', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '700', color: '#111' }}>Booked Vendors</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {event.selectedVendors.map((v, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: '#f0fdf4',
                border: '1px solid #bbf7d0', borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {serviceIcons[v.service] || '✦'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111' }}>{v.service}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{v.packageName}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: gold }}>₹{v.price.toLocaleString()}</p>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '500' }}>✓ Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: '240px', right: 0,
        background: '#fff', borderTop: '1px solid #ECECEC',
        padding: '16px 48px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)', zIndex: 50
      }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget Used</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: gold }}>₹{(event.totalSpent || 0).toLocaleString()}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Remaining</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: budgetRemaining >= 0 ? '#16a34a' : '#dc2626' }}>
              ₹{Math.abs(budgetRemaining).toLocaleString()}
            </p>
          </div>
        </div>
        <Link to={`/vendors/search?eventId=${event._id}`}>
          <button style={{
            padding: '12px 28px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            color: '#000', border: 'none', borderRadius: '8px',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: `0 4px 16px ${gold}30`, display: 'flex',
            alignItems: 'center', gap: '8px'
          }}>
            Continue Planning <ChevronRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EventDetail;