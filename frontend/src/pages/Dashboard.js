import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Calendar, TrendingUp, Plus, ChevronRight, Heart, Bell } from 'lucide-react';

const gold = '#C8A95B';

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, savedRes, notifRes] = await Promise.all([
          API.get('/events'),
          API.get('/auth/saved-vendors'),
          API.get('/notifications')
        ]);
        setEvents(eventsRes.data);
        setSavedCount(savedRes.data.length);
        setUnreadCount(notifRes.data.filter(n => !n.isRead).length);
      } catch (err) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
 
  const quickActions = [
    { icon: <Plus size={20} color={gold} />, title: 'Create New Event', desc: 'Start planning your next event', link: '/events/create', bg: `${gold}10` },
    { icon: <Calendar size={20} color='#6366f1' />, title: 'My Events', desc: 'View and manage all events', link: '/my-events', bg: '#eef2ff' },
    { icon: <Heart size={20} color='#dc2626' />, title: 'Saved Vendors', desc: 'Your bookmarked vendors', link: '/saved-vendors', bg: '#fff5f5' },
    { icon: <Bell size={20} color='#16a34a' />, title: 'Notifications', desc: 'Check vendor replies', link: '/notifications', bg: '#f0fdf4' },
  ];

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Welcome Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Welcome back
        </p>
        <h1 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#888' }}>
          Here's an overview of your event planning activity
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
        {[
          { icon: <Calendar size={18} color={gold} />, value: events.length, label: 'Total Events', bg: `${gold}10` },
          { icon: <TrendingUp size={18} color='#6366f1' />, value: upcoming.length, label: 'Upcoming Events', bg: '#eef2ff' },
          { icon: <Heart size={18} color='#dc2626' />, value: savedCount, label: 'Saved Vendors', bg: '#fff5f5', link: '/saved-vendors' },
          { icon: <Bell size={18} color='#16a34a' />, value: unreadCount, label: 'Notifications', bg: '#f0fdf4', link: '/notifications' },
        ].map((card, idx) => (
          <div key={idx} style={{
            background: '#fff', borderRadius: '14px', padding: '20px',
            border: '1px solid #ECECEC', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '40px', height: '40px', background: card.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              {card.icon}
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: '#111', letterSpacing: '-0.02em' }}>{card.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: '500' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
        {quickActions.map((action, idx) => (
          <Link key={idx} to={action.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: '14px', padding: '20px',
              border: '1px solid #ECECEC', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${gold}40`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: action.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {action.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#111' }}>{action.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{action.desc}</p>
                </div>
              </div>
              <ChevronRight size={15} color="#ccc" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Events */}
      {!loading && events.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111' }}>Recent Events</h3>
            <Link to="/my-events" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', background: 'transparent', border: `1px solid ${gold}40`, color: gold, borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                View All <ChevronRight size={13} />
              </button>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {events.slice(0, 3).map(event => (
              <Link key={event._id} to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid #ECECEC', padding: '16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = `${gold}40`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ background: `${gold}12`, color: gold, fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                      {event.eventType}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: event.readinessPercentage >= 80 ? '#16a34a' : '#ca8a04' }}>
                      {event.readinessPercentage}%
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{event.eventName}</h4>
                  <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#888' }}>
                    {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.city}
                  </p>
                  <div style={{ height: '4px', background: '#F7F5F2', borderRadius: '2px' }}>
                    <div style={{ height: '4px', width: `${event.readinessPercentage}%`, background: `linear-gradient(90deg, ${gold}, #a8833a)`, borderRadius: '2px' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {!loading && events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC' }}>
          <div style={{ width: '64px', height: '64px', background: `${gold}10`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Calendar size={28} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px' }}>No events yet</h3>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Start planning your first extraordinary event</p>
          <Link to="/events/create">
            <button style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${gold}, #a8833a)`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              Create Your First Event
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;