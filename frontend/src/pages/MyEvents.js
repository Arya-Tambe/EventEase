import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Plus, Calendar, MapPin, Users, MoreVertical } from 'lucide-react';

const gold = '#C8A95B';

const eventImages = {
  Wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80',
  Birthday: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=80',
  Corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&q=80',
  Conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80',
  Anniversary: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=300&q=80',
  'Social Gathering': 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&q=80',
  Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80',
};

function CircularProgress({ percentage, size = 64 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#ECECEC" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={gold} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>{percentage}%</span>
      </div>
    </div>
  );
}

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      setMenuOpen(null);
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const filtered = filter === 'all' ? events
    : filter === 'upcoming' ? events.filter(e => new Date(e.date) >= new Date())
    : filter === 'completed' ? events.filter(e => e.readinessPercentage === 100)
    : events;

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Event Management</p>
          <h1 style={{ margin: '0 0 6px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>My Events</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Manage and track all your planned events</p>
        </div>
        <Link to="/events/create">
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            color: '#000', border: 'none', borderRadius: '10px',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            boxShadow: `0 4px 16px ${gold}30`
          }}>
            <Plus size={15} /> Create New Event
          </button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', padding: '4px', borderRadius: '12px', border: '1px solid #ECECEC', marginBottom: '24px', width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {[
          { key: 'all', label: `All (${events.length})` },
          { key: 'upcoming', label: `Upcoming (${events.filter(e => new Date(e.date) >= new Date()).length})` },
          { key: 'completed', label: `Completed (${events.filter(e => e.readinessPercentage === 100).length})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600',
            background: filter === tab.key ? `linear-gradient(135deg, ${gold}, #a8833a)` : 'transparent',
            color: filter === tab.key ? '#000' : '#888', transition: 'all 0.2s'
          }}>{tab.label}</button>
        ))}
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

      {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}><p>Loading events...</p></div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '20px', border: '2px dashed #ECECEC' }}>
          <div style={{ width: '64px', height: '64px', background: `${gold}10`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Calendar size={28} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px', fontSize: '20px' }}>No events found</h3>
          <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
            {filter === 'all' ? 'Start planning your first extraordinary event today' : `No ${filter} events found`}
          </p>
          {filter === 'all' && (
            <Link to="/events/create">
              <button style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${gold}, #a8833a)`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                Create Your First Event
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((event) => (
          <div key={event._id} style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid #ECECEC', overflow: 'hidden',
            display: 'flex', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${gold}30`; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
          >
            {/* Event Image */}
            <div style={{ width: '180px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              <img src={eventImages[event.eventType] || eventImages.Other} alt={event.eventType}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', minHeight: '140px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))' }} />
              <div style={{
                position: 'absolute', bottom: '10px', left: '10px',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                border: `1px solid ${gold}40`, borderRadius: '4px', padding: '3px 8px'
              }}>
                <span style={{ color: gold, fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{event.eventType}</span>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '700', color: '#111', letterSpacing: '-0.01em' }}>
                  {event.eventName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#666' }}>
                    <Calendar size={13} color={gold} />
                    {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#666' }}>
                    <MapPin size={13} color={gold} /> {event.city}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#666' }}>
                    <Users size={13} color={gold} /> {event.guestCount} guests
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: '#F7F5F2', borderRadius: '8px', padding: '8px 14px', display: 'flex', gap: '16px' }}>
                    <div>
                      <p style={{ margin: '0 0 1px', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111' }}>₹{event.budget.toLocaleString()}</p>
                    </div>
                    <div style={{ width: '1px', background: '#ECECEC' }} />
                    <div>
                      <p style={{ margin: '0 0 1px', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Spent</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: gold }}>₹{(event.totalSpent || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginLeft: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <CircularProgress percentage={event.readinessPercentage} size={64} />
                  <p style={{ margin: '6px 0 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ready</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/events/${event._id}`}>
                    <button style={{
                      padding: '8px 16px',
                      background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                      color: '#000', border: 'none', borderRadius: '8px',
                      fontWeight: '600', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}>View Event</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    style={{
                      padding: '8px 12px', background: '#fff5f5',
                      border: '1px solid #fecaca', color: '#dc2626',
                      borderRadius: '8px', fontWeight: '600',
                      fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff5f5'}
                  >Delete</button>

                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setMenuOpen(menuOpen === event._id ? null : event._id)}
                      style={{
                        width: '34px', height: '34px', background: '#F7F5F2',
                        border: '1px solid #ECECEC', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'
                      }}
                    ><MoreVertical size={14} /></button>

                    {menuOpen === event._id && (
                      <div style={{
                        position: 'absolute', right: 0, top: '40px',
                        background: '#fff', border: '1px solid #ECECEC',
                        borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        zIndex: 10, minWidth: '160px', overflow: 'hidden'
                      }}>
                        <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ padding: '10px 16px', fontSize: '13px', color: '#333', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F7F5F2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >📋 Continue Planning</div>
                        </Link>
                        <div style={{ height: '1px', background: '#ECECEC' }} />
                        <div
                          onClick={() => handleDeleteEvent(event._id)}
                          style={{ padding: '10px 16px', fontSize: '13px', color: '#dc2626', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >🗑️ Delete Event</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyEvents;