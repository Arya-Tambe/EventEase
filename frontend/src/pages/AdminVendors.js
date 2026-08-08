import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Store, CheckCircle, XCircle, Trash2, Shield, MapPin, Search } from 'lucide-react';

const gold = '#C8A95B';

function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await API.get('/admin/vendors');
      setVendors(res.data);
    } catch (err) {
      setError('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (id) => {
    setActionLoading(id + 'approve');
    try {
      await API.put(`/admin/vendors/${id}/approve`);
      fetchVendors();
    } catch (err) {
      setError('Failed to approve vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const suspendVendor = async (id) => {
    setActionLoading(id + 'suspend');
    try {
      await API.put(`/admin/vendors/${id}/suspend`);
      fetchVendors();
    } catch (err) {
      setError('Failed to suspend vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const removeVendor = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this vendor?')) return;
    setActionLoading(id + 'remove');
    try {
      await API.delete(`/admin/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      setError('Failed to remove vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = vendors
    .filter(v => filter === 'all' ? true : filter === 'verified' ? v.isVerified && !v.isSuspended : filter === 'pending' ? !v.isVerified && !v.isSuspended : v.isSuspended)
    .filter(v => searchQuery ? v.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) || v.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  const statusConfig = {
    verified: { label: 'Verified', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    pending: { label: 'Pending', bg: '#fefce8', color: '#ca8a04', border: '#fde68a' },
    suspended: { label: 'Suspended', bg: '#fff5f5', color: '#dc2626', border: '#fecaca' },
  };

  const getStatus = (vendor) => vendor.isSuspended ? 'suspended' : vendor.isVerified ? 'verified' : 'pending';

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading vendors...</div>;

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Panel</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Vendor Management</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Approve, suspend, or remove vendors from the platform</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: vendors.length, color: gold },
          { label: 'Verified', value: vendors.filter(v => v.isVerified && !v.isSuspended).length, color: '#16a34a' },
          { label: 'Pending', value: vendors.filter(v => !v.isVerified && !v.isSuspended).length, color: '#ca8a04' },
          { label: 'Suspended', value: vendors.filter(v => v.isSuspended).length, color: '#dc2626' },
        ].map((s, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #ECECEC', textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: '500' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#fff', padding: '4px', borderRadius: '10px', border: '1px solid #ECECEC' }}>
          {['all', 'verified', 'pending', 'suspended'].map(f => (
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
          <input
            type="text" placeholder="Search vendors..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', height: '40px', padding: '0 16px 0 34px',
              border: '1.5px solid #ECECEC', borderRadius: '10px',
              fontSize: '13px', color: '#111', background: '#fff',
              outline: 'none', boxSizing: 'border-box'
            }}
            onFocus={e => { e.target.style.borderColor = gold; }}
            onBlur={e => { e.target.style.borderColor = '#ECECEC'; }}
          />
        </div>

        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
          Showing <strong style={{ color: '#111' }}>{filtered.length}</strong> vendors
        </p>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC' }}>
          <Store size={32} color="#ddd" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#888' }}>No vendors found</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((vendor) => {
          const status = statusConfig[getStatus(vendor)];
          return (
            <div key={vendor._id} style={{
              background: '#fff', borderRadius: '14px',
              border: '1px solid #ECECEC', padding: '20px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = `${gold}30`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
            >
              {/* Avatar */}
              <div style={{
                width: '48px', height: '48px', flexShrink: 0,
                background: `linear-gradient(135deg, ${gold}20, ${gold}10)`,
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: '700', color: gold
              }}>
                {vendor.businessName?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111' }}>{vendor.businessName}</h4>
                  <span style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color, fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>
                    {status.label}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>{vendor.category} • {vendor.subcategory}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#888' }}>
                    <MapPin size={11} color="#bbb" /> {vendor.location}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888' }}>Owner: {vendor.user?.name} ({vendor.user?.email})</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {!vendor.isVerified && !vendor.isSuspended && (
                  <button onClick={() => approveVendor(vendor._id)} disabled={actionLoading === vendor._id + 'approve'} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', background: '#f0fdf4',
                    border: '1px solid #bbf7d0', color: '#16a34a',
                    borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                  }}>
                    <CheckCircle size={13} /> Approve
                  </button>
                )}
                {vendor.isSuspended && (
                  <button onClick={() => approveVendor(vendor._id)} disabled={actionLoading === vendor._id + 'approve'} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', background: '#f0fdf4',
                    border: '1px solid #bbf7d0', color: '#16a34a',
                    borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                  }}>
                    <CheckCircle size={13} /> Reinstate
                  </button>
                )}
                {!vendor.isSuspended && (
                  <button onClick={() => suspendVendor(vendor._id)} disabled={actionLoading === vendor._id + 'suspend'} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', background: '#fefce8',
                    border: '1px solid #fde68a', color: '#ca8a04',
                    borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                  }}>
                    <Shield size={13} /> Suspend
                  </button>
                )}
                <button onClick={() => removeVendor(vendor._id)} disabled={actionLoading === vendor._id + 'remove'} style={{
                  width: '36px', height: '36px', background: '#fff5f5',
                  border: '1px solid #fecaca', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff5f5'}
                >
                  <Trash2 size={14} color="#dc2626" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminVendors;