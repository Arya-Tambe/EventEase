import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Plus, X, Check } from 'lucide-react';

const gold = '#C8A95B';

const commonFacilities = [
  { name: 'Chairs', icon: '🪑' },
  { name: 'Tables', icon: '🪑' },
  { name: 'Parking', icon: '🚗' },
  { name: 'AC', icon: '❄️' },
  { name: 'Generator', icon: '⚡' },
  { name: 'WiFi', icon: '📶' },
  { name: 'Changing Room', icon: '🚪' },
  { name: 'Restrooms', icon: '🚻' },
  { name: 'Stage', icon: '🎤' },
  { name: 'Catering Area', icon: '🍽️' },
  { name: 'Power Backup', icon: '🔋' },
];

function VendorFacilities() {
  const [vendor, setVendor] = useState(null);
  const [customFacility, setCustomFacility] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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

  const toggleFacility = async (facility) => {
    setSaving(true);
    try {
      const updatedFacilities = vendor.facilities.includes(facility)
        ? vendor.facilities.filter(f => f !== facility)
        : [...vendor.facilities, facility];
      const res = await API.put('/vendors/profile', { facilities: updatedFacilities });
      setVendor(res.data);
    } catch (err) {
      setError('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const addCustomFacility = async (e) => {
    e.preventDefault();
    if (!customFacility.trim()) return;
    setSaving(true);
    try {
      const updatedFacilities = [...vendor.facilities, customFacility.trim()];
      const res = await API.put('/vendors/profile', { facilities: updatedFacilities });
      setVendor(res.data);
      setCustomFacility('');
    } catch (err) {
      setError('Failed to add facility');
    } finally {
      setSaving(false);
    }
  };

  const removeFacility = async (facility) => {
    try {
      const updated = vendor.facilities.filter(f => f !== facility);
      const res = await API.put('/vendors/profile', { facilities: updated });
      setVendor(res.data);
    } catch (err) {
      setError('Failed to remove');
    }
  };

  if (!vendor) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>;

  const customFacilities = vendor.facilities.filter(f => !commonFacilities.map(c => c.name).includes(f));

  return (
    <div style={{ maxWidth: '760px', fontFamily: "'Inter', sans-serif" }}>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendor Portal</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Facilities</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Select the facilities included with your service</p>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

      {/* Common Facilities */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Standard Facilities</h3>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#888' }}>Click to toggle facilities you offer</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {commonFacilities.map((facility) => {
            const isSelected = vendor.facilities.includes(facility.name);
            return (
              <button
                key={facility.name}
                onClick={() => toggleFacility(facility.name)}
                disabled={saving}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isSelected ? `1.5px solid ${gold}` : '1.5px solid #ECECEC',
                  background: isSelected ? `${gold}10` : '#FAFAFA',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = `${gold}60`; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#ECECEC'; }}
              >
                <span style={{ fontSize: '16px' }}>{facility.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: isSelected ? gold : '#555' }}>{facility.name}</span>
                {isSelected && <Check size={12} color={gold} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Facilities */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Custom Facilities</h3>
        <form onSubmit={addCustomFacility} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text" value={customFacility}
            onChange={e => setCustomFacility(e.target.value)}
            placeholder="e.g. Valet Parking, Swimming Pool..."
            style={{
              flex: 1, height: '46px', padding: '0 14px',
              border: '1.5px solid #ECECEC', borderRadius: '10px',
              fontSize: '14px', color: '#111', outline: 'none',
              fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
            }}
            onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}10`; }}
            onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
          />
          <button type="submit" disabled={saving || !customFacility.trim()} style={{
            padding: '0 20px', height: '46px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            color: '#000', border: 'none', borderRadius: '10px',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: `0 4px 12px ${gold}20`
          }}>
            <Plus size={15} /> Add
          </button>
        </form>

        {customFacilities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {customFacilities.map((f, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: `${gold}10`, border: `1px solid ${gold}30`,
                borderRadius: '20px', padding: '6px 12px 6px 14px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>{f}</span>
                <button onClick={() => removeFacility(f)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: 0
                }}>
                  <X size={13} color="#999" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Summary */}
      <div style={{ background: `${gold}08`, borderRadius: '14px', border: `1px solid ${gold}20`, padding: '18px 20px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
          <strong style={{ color: '#111' }}>{vendor.facilities.length}</strong> facilities selected
          {vendor.facilities.length > 0 && (
            <span style={{ color: '#aaa' }}> — {vendor.facilities.slice(0, 4).join(', ')}{vendor.facilities.length > 4 ? ` +${vendor.facilities.length - 4} more` : ''}</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default VendorFacilities;