import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Users, Store, CheckCircle, Calendar, TrendingUp } from 'lucide-react';

const gold = '#C8A95B';

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading analytics...</div>;
  if (!stats) return <p style={{ color: '#c53030', padding: '20px' }}>{error}</p>;

  const statCards = [
    { icon: <Users size={18} color={gold} />, label: 'Total Users', value: stats.totalUsers, sub: 'Registered users', bg: `${gold}10`, trend: '↑ Growing' },
    { icon: <Store size={18} color='#6366f1' />, label: 'Total Vendors', value: stats.totalVendors, sub: 'On the platform', bg: '#eef2ff', trend: `${stats.verifiedVendors} verified` },
    { icon: <CheckCircle size={18} color='#16a34a' />, label: 'Verified Vendors', value: stats.verifiedVendors, sub: 'Admin approved', bg: '#f0fdf4', trend: `${Math.round((stats.verifiedVendors / stats.totalVendors) * 100) || 0}% approval rate` },
    { icon: <Calendar size={18} color='#dc2626' />, label: 'Total Events', value: stats.totalEvents, sub: 'Events created', bg: '#fff5f5', trend: 'All time' },
  ];

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Panel</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Reports & Analytics</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Platform overview and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{
            background: '#fff', borderRadius: '14px', padding: '22px',
            border: '1px solid #ECECEC', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '42px', height: '42px', background: card.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {card.icon}
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '30px', fontWeight: '800', color: '#111', letterSpacing: '-0.02em' }}>{card.value}</p>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#111' }}>{card.label}</p>
            <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#aaa' }}>{card.sub}</p>
            <span style={{ fontSize: '11px', fontWeight: '600', color: gold, background: `${gold}10`, padding: '3px 8px', borderRadius: '4px' }}>
              {card.trend}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Vendor Breakdown */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={16} color={gold} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111' }}>Vendor Breakdown</h3>
          </div>
          {[
            { label: 'Verified', value: stats.verifiedVendors, total: stats.totalVendors, color: '#16a34a', bg: '#dcfce7' },
            { label: 'Pending Approval', value: stats.totalVendors - stats.verifiedVendors, total: stats.totalVendors, color: '#ca8a04', bg: '#fef9c3' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: item.color }}>{item.value}</span>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>/ {item.total}</span>
                </div>
              </div>
              <div style={{ height: '8px', background: '#F7F5F2', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                  background: item.color, borderRadius: '4px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Popular Event Types */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Popular Event Types</h3>

          {stats.popularEventTypes && stats.popularEventTypes.length > 0 ? (
            <>
              {/* Bar Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #ECECEC' }}>
                {stats.popularEventTypes.map((item, idx) => {
                  const maxCount = stats.popularEventTypes[0].count;
                  const barHeight = Math.max((item.count / maxCount) * 100, 8);
                  const colors = [`linear-gradient(180deg, ${gold}, #a8833a)`, 'linear-gradient(180deg, #7c3aed, #a855f7)', 'linear-gradient(180deg, #2563eb, #60a5fa)', 'linear-gradient(180deg, #16a34a, #4ade80)'];
                  return (
                    <div key={item._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>{item.count}</span>
                      <div style={{ width: '100%', height: `${barHeight}px`, background: colors[idx] || '#e5e7eb', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {stats.popularEventTypes.map((item, idx) => (
                  <div key={item._id} style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '10px', color: '#888', fontWeight: '500' }}>{idx === 0 ? '🏆 ' : ''}{item._id}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: '#aaa', fontSize: '13px' }}>No event data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;