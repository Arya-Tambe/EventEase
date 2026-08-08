import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Users, Search, UserX, UserCheck, Mail, Phone } from 'lucide-react';

const gold = '#C8A95B';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/users/${id}/block`);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users
    .filter(u => filter === 'all' ? true : filter === 'active' ? !u.isBlocked : u.isBlocked)
    .filter(u => searchQuery ? u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading users...</div>;

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Panel</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>User Management</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>View, manage and moderate user accounts</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Users', value: users.length, color: gold, bg: `${gold}10` },
          { label: 'Active', value: users.filter(u => !u.isBlocked).length, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Blocked', value: users.filter(u => u.isBlocked).length, color: '#dc2626', bg: '#fff5f5' },
        ].map((s, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #ECECEC', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color={s.color} />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#fff', padding: '4px', borderRadius: '10px', border: '1px solid #ECECEC' }}>
          {['all', 'active', 'blocked'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
              background: filter === f ? `linear-gradient(135deg, ${gold}, #a8833a)` : 'transparent',
              color: filter === f ? '#000' : '#888', transition: 'all 0.2s'
            }}>{f}</button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={14} color="#bbb" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search users..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '40px', padding: '0 16px 0 34px', border: '1.5px solid #ECECEC', borderRadius: '10px', fontSize: '13px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = gold; }}
            onBlur={e => { e.target.style.borderColor = '#ECECEC'; }}
          />
        </div>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC' }}>
          <Users size={32} color="#ddd" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#888' }}>No users found</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((u) => (
          <div key={u._id} style={{
            background: '#fff', borderRadius: '12px',
            border: `1px solid ${u.isBlocked ? '#fecaca' : '#ECECEC'}`,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
          >
            <div style={{
              width: '44px', height: '44px', flexShrink: 0,
              background: u.isBlocked ? '#fff5f5' : `${gold}12`,
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700',
              color: u.isBlocked ? '#dc2626' : gold
            }}>
              {u.name?.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111' }}>{u.name}</h4>
                <span style={{
                  fontSize: '10px', fontWeight: '600', padding: '2px 7px', borderRadius: '4px',
                  background: u.isBlocked ? '#fff5f5' : '#f0fdf4',
                  color: u.isBlocked ? '#dc2626' : '#16a34a',
                  border: `1px solid ${u.isBlocked ? '#fecaca' : '#bbf7d0'}`
                }}>
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#888' }}>
                  <Mail size={11} color="#bbb" /> {u.email}
                </span>
                {u.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#888' }}>
                    <Phone size={11} color="#bbb" /> {u.phone}
                  </span>
                )}
              </div>
            </div>

            <button onClick={() => toggleBlockUser(u._id)} disabled={actionLoading === u._id} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: '600', fontSize: '12px', border: 'none',
              background: u.isBlocked ? '#f0fdf4' : '#fff5f5',
              color: u.isBlocked ? '#16a34a' : '#dc2626',
              transition: 'all 0.2s', flexShrink: 0
            }}>
              {u.isBlocked ? <><UserCheck size={13} /> Unblock</> : <><UserX size={13} /> Block</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;