import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Store, Users, BarChart2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const gold = '#C8A95B';

function AdminSidebar() {
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
    whiteSpace: 'nowrap', overflow: 'hidden'
  });

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { path: '/admin/vendors', icon: <Store size={16} />, label: 'Vendor Management' },
    { path: '/admin/users', icon: <Users size={16} />, label: 'User Management' },
    { path: '/admin/analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
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
            <p style={{ margin: 0, fontSize: '10px', color: '#ef4444', fontWeight: '600', letterSpacing: '0.06em' }}>ADMIN</p>
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
          Admin Panel
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

function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <div style={{
        marginLeft: '240px', flex: 1,
        padding: '40px 48px', minHeight: '100vh',
        boxSizing: 'border-box',
        transition: 'margin-left 0.25s ease',
        position: 'relative',
        background: '#F7F5F2',
        backgroundImage: `radial-gradient(circle at 1px 1px, #C8A95B18 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }}>
        <div style={{
          position: 'fixed', top: '-120px', right: '-120px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #C8A95B08 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'fixed', bottom: '-100px', left: '200px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, #C8A95B06 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;