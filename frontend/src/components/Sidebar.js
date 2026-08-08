import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { LayoutDashboard, PlusCircle, Heart, Bell, User, LogOut, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const gold = '#C8A95B';

function NotificationBadge({ isExpanded, linkStyle, isActive }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get('/notifications');
        setUnread(res.data.filter(n => !n.isRead).length);
      } catch (err) {}
    };
    fetchCount();
  }, []);

  return (
    <Link to="/notifications" style={{ ...linkStyle('/notifications'), justifyContent: 'space-between' }}
      title={!isExpanded ? 'Notifications' : ''}
      onMouseEnter={e => { if (!isActive('/notifications')) { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#1e1e1e'; } }}
      onMouseLeave={e => { if (!isActive('/notifications')) { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent'; } }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <Bell size={16} style={{ flexShrink: 0 }} />
        {isExpanded && <span>Notifications</span>}
        {unread > 0 && !isExpanded && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '7px', height: '7px', background: '#dc2626', borderRadius: '50%' }} />
        )}
      </span>
      {unread > 0 && isExpanded && (
        <span style={{ background: '#7c1d1d', color: '#f87171', borderRadius: '20px', padding: '1px 7px', fontSize: '11px', fontWeight: '600' }}>
          {unread}
        </span>
      )}
    </Link>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 12px', borderRadius: '8px',
    textDecoration: 'none', fontSize: '13px', fontWeight: '500',
    color: isActive(path) ? gold : '#888',
    background: isActive(path) ? `${gold}12` : 'transparent',
    borderLeft: isActive(path) ? `2px solid ${gold}` : '2px solid transparent',
    marginBottom: '2px', transition: 'all 0.15s ease',
    whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative'
  });

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { path: '/my-events', icon: <Calendar size={16} />, label: 'My Events' },
    { path: '/events/create', icon: <PlusCircle size={16} />, label: 'Create Event' },
    { path: '/saved-vendors', icon: <Heart size={16} />, label: 'Saved Vendors' },
    { path: '/profile', icon: <User size={16} />, label: 'Profile' },
  ];

  return (
    <div style={{
      width: isExpanded ? '240px' : '64px',
      minHeight: '100vh', background: '#151515',
      borderRight: '1px solid #222', padding: '24px 14px',
      position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column',
      zIndex: 100, transition: 'width 0.25s ease', overflow: 'hidden'
    }}>
      {/* Logo + Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'space-between' : 'center', marginBottom: '28px', padding: '0 4px' }}>
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px',
              background: `linear-gradient(135deg, ${gold}, #a8833a)`,
              borderRadius: '7px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#000', fontWeight: '800', fontSize: '13px', flexShrink: 0
            }}>E</div>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>EventEase</span>
          </div>
        )}
        {!isExpanded && (
          <div style={{
            width: '30px', height: '30px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            borderRadius: '7px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#000', fontWeight: '800', fontSize: '13px'
          }}>E</div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: '#222', border: '1px solid #333',
            borderRadius: '6px', width: '28px', height: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: gold, flexShrink: 0,
            transition: 'all 0.2s', marginLeft: isExpanded ? '0' : '8px'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.borderColor = gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#333'; }}
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* User info */}
      {isExpanded ? (
        <div style={{
          background: '#1e1e1e', border: '1px solid #2a2a2a',
          borderRadius: '10px', padding: '12px',
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'
        }}>
          <div style={{
            width: '34px', height: '34px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#000', fontWeight: '700',
            fontSize: '13px', flexShrink: 0
          }}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <p style={{ margin: 0, fontSize: '10px', color: '#666' }}>Event Planner</p>
          </div>
        </div>
      ) : (
        <div style={{
          width: '36px', height: '36px',
          background: `linear-gradient(135deg, ${gold}, #a8833a)`,
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#000', fontWeight: '700',
          fontSize: '14px', margin: '0 auto 20px'
        }}>{user?.name?.charAt(0).toUpperCase()}</div>
      )}

      {isExpanded && (
        <p style={{ fontSize: '10px', fontWeight: '600', color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 6px', margin: '16px 0 8px' }}>
          Menu
        </p>
      )}

      <div style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            style={linkStyle(item.path)}
            title={!isExpanded ? item.label : ''}
            onMouseEnter={e => { if (!isActive(item.path)) { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#1e1e1e'; } }}
            onMouseLeave={e => { if (!isActive(item.path)) { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {isExpanded && <span>{item.label}</span>}
          </Link>
        ))}
        <NotificationBadge isExpanded={isExpanded} linkStyle={linkStyle} isActive={isActive} />
      </div>

      <button onClick={logout} title={!isExpanded ? 'Sign Out' : ''} style={{
        width: '100%', padding: '10px 12px',
        background: 'transparent', color: '#555',
        border: '1px solid #222', borderRadius: '8px',
        fontWeight: '500', fontSize: '13px', cursor: 'pointer',
        transition: 'all 0.2s', display: 'flex',
        alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'center',
        gap: '12px', marginTop: '16px'
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = '#7c1d1d'; e.currentTarget.style.background = '#1a0a0a'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = 'transparent'; }}
      >
        <LogOut size={15} />
        {isExpanded && <span>Sign Out</span>}
      </button>
    </div>
  );
}

export default Sidebar;