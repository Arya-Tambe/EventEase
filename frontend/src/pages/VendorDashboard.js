import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Package, Building2, Image, Calendar, Star, MapPin, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const gold = '#C8A95B';

function VendorDashboard() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/vendors/profile');
        setVendor(res.data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading dashboard...</div>;

  if (notFound) {
    return (
      <div style={{ maxWidth: '500px', textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '20px', border: '1px solid #ECECEC', margin: '0 auto' }}>
        <div style={{ width: '72px', height: '72px', background: `${gold}12`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Building2 size={32} color={gold} />
        </div>
        <h2 style={{ margin: '0 0 10px', color: '#111' }}>Set Up Your Profile</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>
          You haven't set up your vendor profile yet. Create it to start receiving enquiries.
        </p>
        <Link to="/vendor/profile/setup">
          <button style={{
            padding: '13px 28px',
            background: `linear-gradient(135deg, ${gold}, #a8833a)`,
            color: '#000', border: 'none', borderRadius: '10px',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: `0 4px 16px ${gold}30`
          }}>Complete Profile Setup</button>
        </Link>
      </div>
    );
  }

  const stats = [
    { icon: <Package size={18} color={gold} />, value: vendor.packages.length, label: 'Packages', link: '/vendor/packages', bg: `${gold}10` },
    { icon: <Building2 size={18} color='#6366f1' />, value: vendor.facilities.length, label: 'Facilities', link: '/vendor/facilities', bg: '#eef2ff' },
    { icon: <Image size={18} color='#16a34a' />, value: vendor.portfolio.length, label: 'Portfolio', link: '/vendor/portfolio', bg: '#f0fdf4' },
    { icon: <Calendar size={18} color='#dc2626' />, value: vendor.availableDates.length, label: 'Available Dates', link: '/vendor/availability', bg: '#fff5f5' },
  ];

  const quickLinks = [
    { icon: <Package size={15} />, label: 'Manage Packages', path: '/vendor/packages' },
    { icon: <Building2 size={15} />, label: 'Manage Facilities', path: '/vendor/facilities' },
    { icon: <Calendar size={15} />, label: 'Set Availability', path: '/vendor/availability' },
    { icon: <Image size={15} />, label: 'Upload Portfolio', path: '/vendor/portfolio' },
  ];

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Vendor Portal
        </p>
        <h1 style={{ margin: '0 0 6px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
          Manage your profile, packages, and enquiries from here
        </p>
      </div>

      {/* Profile Hero Card */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid #ECECEC', overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '24px'
      }}>
        {/* Top banner */}
        <div style={{
          height: '90px', position: 'relative', overflow: 'hidden',
          background: `linear-gradient(135deg, ${gold}15, ${gold}05)`
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${gold}18 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '140px', height: '140px', background: `radial-gradient(circle, ${gold}12, transparent 70%)`, borderRadius: '50%' }} />
        </div>

        <div style={{ padding: '0 32px 28px', marginTop: '-32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div style={{
              width: '64px', height: '64px',
              background: `linear-gradient(135deg, ${gold}, #a8833a)`,
              borderRadius: '50%', border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '700', color: '#000',
              boxShadow: `0 4px 16px ${gold}30`
            }}>
              {vendor.businessName?.charAt(0).toUpperCase()}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                background: vendor.isVerified ? '#f0fdf4' : '#fefce8',
                border: `1px solid ${vendor.isVerified ? '#bbf7d0' : '#fde68a'}`,
                color: vendor.isVerified ? '#16a34a' : '#ca8a04',
                fontSize: '11px', fontWeight: '600', padding: '5px 12px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                <Shield size={11} />
                {vendor.isSuspended ? '🚫 Suspended' : vendor.isVerified ? 'Verified' : 'Pending Approval'}
              </span>
              <Link to="/vendor/profile/edit">
                <button style={{
                  padding: '8px 16px',
                  background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                  color: '#000', border: 'none', borderRadius: '8px',
                  fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                }}>Edit Profile</button>
              </Link>
            </div>
          </div>

          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '700', color: '#111' }}>{vendor.businessName}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={12} color={gold} /> {vendor.category} • {vendor.subcategory}
            </span>
            <span style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} color={gold} /> {vendor.location}
            </span>
            <span style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} color={gold} fill={gold} /> {vendor.rating} ({vendor.totalReviews} reviews)
            </span>
          </div>
          {vendor.description && (
            <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: '1.6', maxWidth: '600px' }}>
              {vendor.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <Link key={idx} to={stat.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: '14px', padding: '20px',
              border: '1px solid #ECECEC', display: 'flex', alignItems: 'center', gap: '14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.2s', cursor: 'pointer'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${gold}40`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
            >
              <div style={{ width: '44px', height: '44px', background: stat.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '24px', fontWeight: '700', color: '#111' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links + Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quickLinks.map((item, idx) => (
              <Link key={idx} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', background: '#FAFAFA',
                  border: '1px solid #F0EEE8', borderRadius: '10px',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${gold}40`; e.currentTarget.style.background = `${gold}06`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0EEE8'; e.currentTarget.style.background = '#FAFAFA'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: gold }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>{item.label}</span>
                  </div>
                  <ChevronRight size={14} color="#ccc" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Tips */}
        <div style={{ background: `linear-gradient(135deg, ${gold}10, ${gold}05)`, borderRadius: '16px', border: `1px solid ${gold}20`, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Star size={16} color={gold} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111' }}>Profile Tips</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { check: vendor.description, text: 'Add a business description', tip: 'Helps clients understand your service' },
              { check: vendor.packages.length > 0, text: 'Create at least 1 package', tip: 'Clients need pricing to enquire' },
              { check: vendor.portfolio.length > 0, text: 'Upload portfolio images', tip: 'Visual proof builds instant trust' },
              { check: vendor.availableDates.length > 0, text: 'Set your available dates', tip: 'Show real-time availability to clients' },
              { check: vendor.isVerified, text: 'Get admin verified', tip: 'Verified vendors appear in search' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '20px', height: '20px', flexShrink: 0,
                  background: item.check ? '#f0fdf4' : '#fff',
                  border: `1px solid ${item.check ? '#bbf7d0' : '#ECECEC'}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px'
                }}>
                  {item.check
                    ? <span style={{ color: '#16a34a', fontSize: '10px' }}>✓</span>
                    : <span style={{ color: '#ccc', fontSize: '10px' }}>○</span>
                  }
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '500', color: item.check ? '#888' : '#111', textDecoration: item.check ? 'line-through' : 'none' }}>
                    {item.text}
                  </p>
                  {!item.check && <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{item.tip}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;