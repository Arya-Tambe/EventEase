import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Store, Users, BarChart2, ChevronRight, TrendingUp, Calendar } from 'lucide-react';

const gold = '#C8A95B';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.log('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { icon: <Store size={18} color={gold} />, title: 'Vendor Management', desc: 'Approve, suspend or remove vendors', link: '/admin/vendors', count: stats ? `${stats.totalVendors - stats.verifiedVendors} pending` : '...', bg: `${gold}10` },
    { icon: <Users size={18} color='#6366f1' />, title: 'User Management', desc: 'View and manage user accounts', link: '/admin/users', count: stats ? `${stats.totalUsers} users` : '...', bg: '#eef2ff' },
    { icon: <BarChart2 size={18} color='#16a34a' />, title: 'Reports & Analytics', desc: 'Platform statistics and insights', link: '/admin/analytics', count: stats ? `${stats.totalEvents} events` : '...', bg: '#f0fdf4' },
  ];

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Portal</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Here's what's happening on EventEase today</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading stats...</div>
      ) : stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { icon: <Users size={18} color={gold} />, value: stats.totalUsers, label: 'Total Users', sub: 'Registered users', bg: `${gold}10`, trend: '+12% this month' },
              { icon: <Store size={18} color='#6366f1' />, value: stats.totalVendors, label: 'Total Vendors', sub: 'Registered vendors', bg: '#eef2ff', trend: `${stats.verifiedVendors} verified` },
              { icon: <TrendingUp size={18} color='#16a34a' />, value: stats.verifiedVendors, label: 'Verified Vendors', sub: 'Admin approved', bg: '#f0fdf4', trend: `${stats.totalVendors - stats.verifiedVendors} pending` },
              { icon: <Calendar size={18} color='#dc2626' />, value: stats.totalEvents, label: 'Total Events', sub: 'Events created', bg: '#fff5f5', trend: 'All time' },
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
                <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>{card.value}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#111' }}>{card.label}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{card.trend}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: '14px', padding: '22px',
                  border: '1px solid #ECECEC', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${gold}40`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', background: action.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {action.icon}
                    </div>
                    <ChevronRight size={16} color="#ccc" />
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{action.title}</h4>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#888' }}>{action.desc}</p>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: gold, background: `${gold}10`, padding: '3px 8px', borderRadius: '4px' }}>
                    {action.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Popular Event Types */}
          {stats.popularEventTypes && stats.popularEventTypes.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Most Popular Event Types</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {stats.popularEventTypes.map((item, idx) => {
                  const gradients = [
                    `linear-gradient(135deg, ${gold}, #a8833a)`,
                    'linear-gradient(135deg, #7c3aed, #a855f7)',
                    'linear-gradient(135deg, #2563eb, #60a5fa)',
                    'linear-gradient(135deg, #16a34a, #4ade80)',
                  ];
                  return (
                    <div key={item._id} style={{
                      background: gradients[idx] || '#f1f5f9',
                      padding: '16px 24px', borderRadius: '12px',
                      textAlign: 'center', minWidth: '120px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {idx === 0 && <p style={{ margin: '0 0 4px', fontSize: '16px' }}>🏆</p>}
                      <p style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '800', color: '#fff' }}>{item.count}</p>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{item._id}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;