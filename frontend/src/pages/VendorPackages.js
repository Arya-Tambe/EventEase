import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Plus, Trash2, Package, IndianRupee, FileText } from 'lucide-react';

const gold = '#C8A95B';

function VendorPackages() {
  const [vendor, setVendor] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/vendors/profile');
      setVendor(res.data);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updatedPackages = [...vendor.packages, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price)
      }];
      const res = await API.put('/vendors/profile', { packages: updatedPackages });
      setVendor(res.data);
      setFormData({ name: '', description: '', price: '' });
      setSuccess('Package added successfully!');
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add package');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (index) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      const updatedPackages = vendor.packages.filter((_, i) => i !== index);
      const res = await API.put('/vendors/profile', { packages: updatedPackages });
      setVendor(res.data);
    } catch (err) {
      setError('Failed to delete package');
    }
  };

  const inputStyle = {
    width: '100%', height: '50px',
    padding: '0 16px', border: '1.5px solid #ECECEC',
    borderRadius: '12px', fontSize: '14px',
    color: '#111', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
  };

  if (!vendor) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', fontFamily: "'Inter', sans-serif" }}>

      <Link to="/vendor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#888'}
      ><ArrowLeft size={14} /> Back to Dashboard</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendor Settings</p>
          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Manage Packages</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Create service packages for clients to choose from</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '11px 20px',
          background: showForm ? '#fff' : `linear-gradient(135deg, ${gold}, #a8833a)`,
          color: showForm ? '#666' : '#000',
          border: showForm ? '1.5px solid #ECECEC' : 'none',
          borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
          boxShadow: showForm ? 'none' : `0 4px 16px ${gold}30`
        }}>
          <Plus size={15} /> {showForm ? 'Cancel' : 'Add Package'}
        </button>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
      {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>✓ {success}</div>}

      {/* Add Package Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${gold}30`, padding: '28px', marginBottom: '24px', boxShadow: `0 4px 24px ${gold}12` }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '700', color: '#111' }}>New Package</h3>
          <form onSubmit={handleAddPackage}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Package size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Package Name</label>
              </div>
              <input type="text" placeholder="e.g. Premium Wedding Package" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FileText size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
              </div>
              <textarea placeholder="What's included in this package?" value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows="3" style={{ ...inputStyle, height: 'auto', padding: '14px 16px', resize: 'vertical' }}
                onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IndianRupee size={13} color={gold} />
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price (₹)</label>
              </div>
              <input type="number" placeholder="e.g. 150000" value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })} required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button type="submit" disabled={saving} style={{
              padding: '12px 28px',
              background: saving ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
              color: saving ? '#999' : '#000', border: 'none', borderRadius: '10px',
              fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : `0 4px 16px ${gold}30`
            }}>{saving ? 'Adding...' : 'Add Package'}</button>
          </form>
        </div>
      )}

      {/* Packages List */}
      {vendor.packages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC' }}>
          <div style={{ width: '64px', height: '64px', background: `${gold}12`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Package size={28} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px' }}>No packages yet</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Add your first package to start receiving enquiries from clients.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {vendor.packages.map((pkg, idx) => (
            <div key={idx} style={{
              background: '#fff', borderRadius: '14px',
              border: '1px solid #ECECEC', padding: '22px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`; e.currentTarget.style.borderColor = `${gold}40`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: `${gold}10`, border: `1px solid ${gold}25`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={20} color={gold} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#111' }}>{pkg.name}</h4>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#888' }}>{pkg.description}</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: gold }}>₹{pkg.price.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => handleDeletePackage(idx)} style={{
                width: '36px', height: '36px', background: '#fff5f5',
                border: '1px solid #fed7d7', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; }}
              >
                <Trash2 size={15} color="#c53030" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorPackages;