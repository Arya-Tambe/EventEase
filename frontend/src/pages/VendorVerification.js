import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Shield, CheckCircle, Clock, AlertCircle, Package, Image, Phone, FileText, Building2 } from 'lucide-react';

const gold = '#C8A95B';

function VendorVerification() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/vendors/profile');
        setVendor(res.data);
      } catch (err) {
        console.log('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading...</div>;
  if (!vendor) return null;

  const checklistItems = [
    { icon: <Building2 size={16} color={gold} />, label: 'Business Name set', check: !!vendor.businessName, tip: 'Add your business name in profile' },
    { icon: <Phone size={16} color={gold} />, label: 'Phone Number added', check: !!vendor.phone, tip: 'Add contact number in profile' },
    { icon: <FileText size={16} color={gold} />, label: 'Business Description', check: !!vendor.description, tip: 'Describe your services in profile' },
    { icon: <Package size={16} color={gold} />, label: `Packages created (${vendor.packages.length})`, check: vendor.packages.length > 0, tip: 'Create at least 1 package' },
    { icon: <Image size={16} color={gold} />, label: `Portfolio images (${vendor.portfolio.length})`, check: vendor.portfolio.length > 0, tip: 'Upload at least 1 portfolio image' },
    { icon: <Shield size={16} color={gold} />, label: 'Admin Approval', check: vendor.isVerified && !vendor.isSuspended, tip: 'Submit your profile for admin review' },
  ];

  const completedCount = checklistItems.filter(i => i.check).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div style={{ maxWidth: '700px', fontFamily: "'Inter', sans-serif" }}>
      <Link to="/vendor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#888'}
      ><ArrowLeft size={14} /> Back to Dashboard</Link>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendor Settings</p>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Verification Status</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Complete your profile to get verified and appear in search results</p>
      </div>

      {/* Status Banner */}
      <div style={{
        background: vendor.isSuspended ? '#fff5f5'
          : vendor.isVerified ? '#f0fdf4'
          : `linear-gradient(135deg, ${gold}12, ${gold}05)`,
        border: `1px solid ${vendor.isSuspended ? '#fed7d7' : vendor.isVerified ? '#bbf7d0' : `${gold}30`}`,
        borderRadius: '16px', padding: '28px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '20px'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
          background: vendor.isSuspended ? '#fee2e2'
            : vendor.isVerified ? '#dcfce7'
            : `${gold}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {vendor.isSuspended
            ? <AlertCircle size={28} color="#c53030" />
            : vendor.isVerified
            ? <CheckCircle size={28} color="#16a34a" />
            : <Clock size={28} color={gold} />
          }
        </div>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#111' }}>
            {vendor.isSuspended ? '🚫 Profile Suspended'
              : vendor.isVerified ? '✅ Profile Verified'
              : '⏳ Pending Verification'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            {vendor.isSuspended
              ? 'Your profile has been suspended by our admin team. Please contact support for assistance.'
              : vendor.isVerified
              ? 'Congratulations! Your profile is verified. You are visible in vendor search results and clients can find you.'
              : 'Your profile is under review by our admin team. Complete all checklist items to speed up approval.'}
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111' }}>Profile Completion</h3>
          <span style={{ fontSize: '20px', fontWeight: '700', color: gold }}>{progressPercent}%</span>
        </div>
        <div style={{ height: '8px', background: '#ECECEC', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: `linear-gradient(90deg, ${gold}, #a8833a)`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
          {completedCount} of {checklistItems.length} requirements completed
        </p>
      </div>

      {/* Checklist */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Verification Checklist</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {checklistItems.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px',
              background: item.check ? '#f0fdf4' : '#FAFAFA',
              border: `1px solid ${item.check ? '#bbf7d0' : '#ECECEC'}`,
              borderRadius: '10px', transition: 'all 0.2s'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: item.check ? '#dcfce7' : `${gold}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {item.check
                  ? <CheckCircle size={18} color="#16a34a" />
                  : item.icon
                }
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: item.check ? '#166534' : '#111', textDecoration: item.check ? 'line-through' : 'none' }}>
                  {item.label}
                </p>
                {!item.check && (
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#aaa' }}>{item.tip}</p>
                )}
              </div>
              {item.check
                ? <span style={{ fontSize: '11px', fontWeight: '600', color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px' }}>Done</span>
                : <span style={{ fontSize: '11px', fontWeight: '600', color: '#ca8a04', background: '#fefce8', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '4px' }}>Pending</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* What happens after verification */}
      <div style={{ background: `${gold}08`, border: `1px solid ${gold}20`, borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700', color: '#111' }}>After Verification</h3>
        {[
          { icon: '🔍', text: 'Your profile appears in vendor search results' },
          { icon: '📩', text: 'Clients can send you enquiries directly' },
          { icon: '⭐', text: 'You can receive ratings and reviews from clients' },
          { icon: '📈', text: 'Higher chance of bookings and business growth' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: idx < 3 ? '10px' : 0 }}>
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{ fontSize: '13px', color: '#666' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorVerification;