import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const gold = '#C8A95B';

function VendorAvailability() {
  const [vendor, setVendor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
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

  const markAvailable = async () => {
    if (!selectedDate) return;
    setSaving(true);
    try {
      const updatedAvailable = [...new Set([...vendor.availableDates, selectedDate])];
      const updatedBooked = vendor.bookedDates.filter(d => d !== selectedDate);
      const res = await API.put('/vendors/profile', { availableDates: updatedAvailable, bookedDates: updatedBooked });
      setVendor(res.data);
      setSelectedDate('');
    } catch (err) {
      setError('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const markBooked = async () => {
    if (!selectedDate) return;
    setSaving(true);
    try {
      const updatedBooked = [...new Set([...vendor.bookedDates, selectedDate])];
      const updatedAvailable = vendor.availableDates.filter(d => d !== selectedDate);
      const res = await API.put('/vendors/profile', { availableDates: updatedAvailable, bookedDates: updatedBooked });
      setVendor(res.data);
      setSelectedDate('');
    } catch (err) {
      setError('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const removeDate = async (date, type) => {
    setSaving(true);
    try {
      if (type === 'booked') {
        const updated = vendor.bookedDates.filter(d => d !== date);
        const res = await API.put('/vendors/profile', { bookedDates: updated });
        setVendor(res.data);
      } else {
        const updated = vendor.availableDates.filter(d => d !== date);
        const res = await API.put('/vendors/profile', { availableDates: updated });
        setVendor(res.data);
      }
    } catch (err) {
      setError('Failed to remove date');
    } finally {
      setSaving(false);
    }
  };

  if (!vendor) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', fontFamily: "'Inter', sans-serif" }}>
      <Link to="/vendor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#888'}
      ><ArrowLeft size={14} /> Back to Dashboard</Link>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendor Settings</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Manage Availability</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Mark dates as available or booked for real-time visibility</p>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

      {/* Date Picker Card */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Add Date</h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#888' }}>Select a date and mark it as available or already booked</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Calendar size={14} color="#bbb" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              style={{
                height: '48px', padding: '0 16px 0 38px',
                border: '1.5px solid #ECECEC', borderRadius: '10px',
                fontSize: '14px', color: '#111', background: '#fff',
                outline: 'none', fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s', cursor: 'pointer'
              }}
              onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
              onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button onClick={markAvailable} disabled={saving || !selectedDate} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '11px 20px', background: '#f0fdf4',
            border: '1.5px solid #bbf7d0', color: '#16a34a',
            borderRadius: '10px', fontWeight: '600', fontSize: '13px',
            cursor: selectedDate ? 'pointer' : 'not-allowed', opacity: selectedDate ? 1 : 0.5, transition: 'all 0.2s'
          }}
          onMouseEnter={e => { if (selectedDate) e.currentTarget.style.background = '#dcfce7'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; }}
          >
            <CheckCircle size={15} /> Mark Available
          </button>
          <button onClick={markBooked} disabled={saving || !selectedDate} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '11px 20px', background: '#fff5f5',
            border: '1.5px solid #fed7d7', color: '#c53030',
            borderRadius: '10px', fontWeight: '600', fontSize: '13px',
            cursor: selectedDate ? 'pointer' : 'not-allowed', opacity: selectedDate ? 1 : 0.5, transition: 'all 0.2s'
          }}
          onMouseEnter={e => { if (selectedDate) e.currentTarget.style.background = '#fee2e2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; }}
          >
            <XCircle size={15} /> Mark Booked
          </button>
        </div>
      </div>

      {/* Two column date lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Available Dates */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ECECEC', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' }} />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111' }}>
              Available <span style={{ color: gold }}>({vendor.availableDates.length})</span>
            </h3>
          </div>
          {vendor.availableDates.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>No available dates set</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vendor.availableDates.map((date) => (
                <div key={date} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: '#f0fdf4',
                  border: '1px solid #bbf7d0', borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#166534' }}>
                    {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button onClick={() => removeDate(date, 'available')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#aaa', display: 'flex', transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c53030'}
                  onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
                  ><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booked Dates */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ECECEC', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }} />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111' }}>
              Booked <span style={{ color: gold }}>({vendor.bookedDates.length})</span>
            </h3>
          </div>
          {vendor.bookedDates.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>No booked dates yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vendor.bookedDates.map((date) => (
                <div key={date} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: '#fff5f5',
                  border: '1px solid #fed7d7', borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#c53030' }}>
                    {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button onClick={() => removeDate(date, 'booked')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#aaa', display: 'flex', transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c53030'}
                  onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
                  ><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorAvailability;