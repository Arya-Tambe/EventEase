import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Bell, CheckCheck, Mail, Clock, Inbox } from 'lucide-react';

const gold = '#C8A95B';

const notificationConfig = {
  enquiry_reply: {
    icon: <Mail size={18} color={gold} />,
    bg: `${gold}10`,
    label: 'Enquiry Reply',
    accent: gold
  },
  vendor_approved: {
    icon: <CheckCheck size={18} color='#16a34a' />,
    bg: '#f0fdf4',
    label: 'Vendor Approved',
    accent: '#16a34a'
  },
  general: {
    icon: <Bell size={18} color='#6366f1' />,
    bg: '#eef2ff',
    label: 'Notification',
    accent: '#6366f1'
  }
};

function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : filter === 'read'
    ? notifications.filter(n => n.isRead)
    : notifications;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      <p>Loading notifications...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '720px', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Updates
          </p>
          <h1 style={{ margin: '0 0 6px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: '12px', minWidth: '26px', height: '26px',
                background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                color: '#000', borderRadius: '20px',
                fontSize: '12px', fontWeight: '700', padding: '0 8px'
              }}>{unreadCount}</span>
            )}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
            Stay updated on vendor replies and platform activity
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px',
              background: '#fff', border: '1.5px solid #ECECEC',
              borderRadius: '10px', color: '#666',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ECECEC'; e.currentTarget.style.color = '#666'; }}
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: notifications.length, icon: <Bell size={16} color={gold} />, bg: `${gold}10` },
          { label: 'Unread', value: unreadCount, icon: <Inbox size={16} color='#6366f1' />, bg: '#eef2ff' },
          { label: 'Read', value: notifications.length - unreadCount, icon: <CheckCheck size={16} color='#16a34a' />, bg: '#f0fdf4' },
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: '#fff', borderRadius: '12px', padding: '16px 18px',
            border: '1px solid #ECECEC', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{ width: '36px', height: '36px', background: stat.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111' }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '4px', background: '#fff',
        padding: '4px', borderRadius: '12px', border: '1px solid #ECECEC',
        marginBottom: '20px', width: 'fit-content',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        {['all', 'unread', 'read'].map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            padding: '8px 20px', borderRadius: '8px',
            border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            background: filter === tab ? `linear-gradient(135deg, ${gold}, #a8833a)` : 'transparent',
            color: filter === tab ? '#000' : '#888',
            transition: 'all 0.2s', textTransform: 'capitalize'
          }}>
            {tab === 'all' ? `All (${notifications.length})` : tab === 'unread' ? `Unread (${unreadCount})` : `Read (${notifications.length - unreadCount})`}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 40px',
          background: '#fff', borderRadius: '20px', border: '1px solid #ECECEC',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: '72px', height: '72px',
            background: `${gold}10`, border: `1px solid ${gold}20`,
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Bell size={28} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px', fontSize: '18px', fontWeight: '700' }}>
            {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
          </h3>
          <p style={{ color: '#888', fontSize: '14px', maxWidth: '280px', margin: '0 auto', lineHeight: '1.6' }}>
            {filter === 'unread'
              ? 'You have no unread notifications at the moment.'
              : 'When vendors reply to your enquiries, you\'ll see updates here.'}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((notif, idx) => {
            const config = notificationConfig[notif.type] || notificationConfig.general;
            const isNew = !notif.isRead;

            return (
              <div
                key={notif._id}
                onClick={() => markAsRead(notif._id)}
                style={{
                  background: '#fff', borderRadius: '14px',
                  border: `1px solid ${isNew ? `${gold}30` : '#ECECEC'}`,
                  padding: '18px 20px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: isNew ? `0 2px 12px ${gold}12` : '0 1px 4px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = `${gold}50`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = isNew ? `0 2px 12px ${gold}12` : '0 1px 4px rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isNew ? `${gold}30` : '#ECECEC';
                }}
              >
                {/* Unread indicator line */}
                {isNew && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: '3px',
                    background: `linear-gradient(180deg, ${gold}, #a8833a)`
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  background: config.bg, borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${config.accent}20`
                }}>
                  {config.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em',
                        color: config.accent, textTransform: 'uppercase',
                        background: config.bg, padding: '2px 8px', borderRadius: '4px'
                      }}>{config.label}</span>
                      {isNew && (
                        <span style={{
                          fontSize: '9px', fontWeight: '700',
                          background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                          color: '#000', padding: '2px 7px', borderRadius: '4px',
                          letterSpacing: '0.06em'
                        }}>NEW</span>
                      )}
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#aaa', flexShrink: 0, marginLeft: '8px' }}>
                      <Clock size={11} /> {timeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#111', fontWeight: isNew ? '600' : '400', lineHeight: '1.5' }}>
                    {notif.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {isNew && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: gold, fontWeight: '600' }}>
                        Mark as read →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom info */}
      {notifications.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '28px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #ECECEC' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
            Showing {filtered.length} of {notifications.length} notifications •
            <span style={{ color: gold, cursor: 'pointer', marginLeft: '4px' }} onClick={() => setFilter('all')}>View all</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Notifications;