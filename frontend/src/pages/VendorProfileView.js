import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Star, MapPin, Phone, Shield, Heart, Mail } from 'lucide-react';

const gold = '#C8A95B';
const facilityIcons = {
  Chairs: '🪑', Tables: '🪑', Parking: '🚗', AC: '❄️', Generator: '⚡',
  WiFi: '📶', 'Changing Room': '🚪', Restrooms: '🚻', Stage: '🎤',
  'Catering Area': '🍽️', 'Power Backup': '🔋'
};


const placeholderImages = {
  Venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80',
  Catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80',
  Decoration: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=80',
  Photography: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=900&q=80',
  Videography: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&q=80',
  'Sound & Lighting': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80',
};

function VendorProfileView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingPackage, setAddingPackage] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savingVendor, setSavingVendor] = useState(false);

  useEffect(() => {
    const getVendor = async () => {
      try {
        const res = await API.get(`/vendors/${id}`);
        setVendor(res.data);
      } catch (err) {
        setError('Failed to load vendor profile');
      } finally {
        setLoading(false);
      }
    };
    getVendor();
  }, [id]);

  

  const handleSaveVendor = async () => {
    setSavingVendor(true);
    try {
      await API.post(`/auth/saved-vendors/${id}`);
      setSaved(true);
    } catch (err) {
      if (err.response?.data?.message === 'Vendor already saved') setSaved(true);
    } finally {
      setSavingVendor(false);
    }
  };

  const handleSelectPackage = async (pkg) => {
    if (!eventId) {
      setError('No event selected. Please go through "Find Vendor" from your event page.');
      return;
    }
    setAddingPackage(pkg.name);
    setError('');
    try {
      await API.post(`/events/${eventId}/vendors`, {
        service: vendor.category, vendor: vendor._id,
        packageName: pkg.name, price: pkg.price
      });
      navigate(`/events/${eventId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add package');
    } finally {
      setAddingPackage(null);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading vendor profile...</div>;
  if (error && !vendor) return <p style={{ padding: '40px', color: '#c53030' }}>{error}</p>;
  if (!vendor) return null;

  const coverImage = vendor.portfolio && vendor.portfolio.length > 0
    ? `http://localhost:5000${vendor.portfolio[0]}`
    : placeholderImages[vendor.category] || placeholderImages.Venue;

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif", paddingBottom: '40px' }}>

      {/* Back link */}
      <Link to={eventId ? `/vendors/search?eventId=${eventId}` : '/vendors/search'} style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '20px'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#111'}
      onMouseLeave={e => e.currentTarget.style.color = '#888'}
      >
        <ArrowLeft size={14} /> Back to Search
      </Link>

      {/* Hero Banner */}
      <div style={{
        position: 'relative', borderRadius: '20px', overflow: 'hidden',
        height: '320px', marginBottom: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
      }}>
        <img src={coverImage} alt={vendor.businessName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Verified badge top */}
        {vendor.isVerified && (
          <div style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
            borderRadius: '8px', padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Shield size={13} color={gold} />
            <span style={{ color: gold, fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em' }}>VERIFIED VENDOR</span>
          </div>
        )}

        {/* Bottom info overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px' }}>
          <span style={{
            background: `${gold}30`, border: `1px solid ${gold}60`,
            color: '#fff', fontSize: '11px', fontWeight: '600',
            padding: '4px 12px', borderRadius: '4px', letterSpacing: '0.06em'
          }}>{vendor.subcategory || vendor.category}</span>
          <h1 style={{ margin: '12px 0 8px', fontSize: '32px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>
            {vendor.businessName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff', fontSize: '13px' }}>
              <Star size={14} color={gold} fill={gold} /> {vendor.rating} ({vendor.totalReviews} reviews)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#eee', fontSize: '13px' }}>
              <MapPin size={14} color={gold} /> {vendor.location}
            </span>
            {vendor.packages.length > 0 && (
              <span style={{ color: gold, fontSize: '13px', fontWeight: '700' }}>
                Starting from ₹{Math.min(...vendor.packages.map(p => p.price)).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '28px' }}>

        {/* LEFT COLUMN */}
        <div>
          {/* About */}
          {vendor.description && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '700', color: '#111' }}>About</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.7' }}>{vendor.description}</p>
            </div>
          )}

          {/* Facilities */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Facilities Included</h3>
            {vendor.facilities.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#aaa' }}>No facilities listed.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {vendor.facilities.map((f, idx) => (
                  <span key={idx} style={{
                    background: `${gold}08`, border: `1px solid ${gold}25`,
                    color: '#111', padding: '8px 16px', borderRadius: '24px', fontSize: '13px',
                    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500'
                  }}>
                    <span>{facilityIcons[f] || '✦'}</span> {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Packages */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Packages</h3>
            {vendor.packages.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#aaa' }}>No packages listed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vendor.packages.map((pkg, idx) => (
                  <div key={idx} style={{
                    border: '1px solid #ECECEC', borderRadius: '12px', padding: '18px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${gold}60`; e.currentTarget.style.background = '#FAFAFA'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ECECEC'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#111' }}>{pkg.name}</p>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888' }}>{pkg.description}</p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: gold }}>₹{pkg.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      disabled={addingPackage === pkg.name}
                      style={{
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                        color: '#000', border: 'none', borderRadius: '8px',
                        fontWeight: '600', fontSize: '13px', cursor: 'pointer', flexShrink: 0
                      }}
                    >
                      {addingPackage === pkg.name ? 'Adding...' : 'Select Package'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#111' }}>Portfolio</h3>
            {vendor.portfolio.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#aaa' }}>No portfolio images yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {vendor.portfolio.map((imgPath, idx) => (
                  <img key={idx} src={`http://localhost:5000${imgPath}`} alt={`Portfolio ${idx + 1}`}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', marginTop: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111' }}>Reviews</h3>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={14} color={gold} fill={gold} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>{vendor.rating}</span>
                <span style={{ fontSize: '13px', color: '#888' }}>({vendor.totalReviews} reviews)</span>
              </span>
            </div>
            {vendor.totalReviews === 0 ? (
              <p style={{ fontSize: '13px', color: '#aaa' }}>No reviews yet. Be the first to book and review this vendor.</p>
            ) : (
              <p style={{ fontSize: '13px', color: '#aaa' }}>Reviews coming soon.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Sticky sidebar */}
        <div>
          <div style={{
            background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC',
            padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            position: 'sticky', top: '20px'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Contact Information</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', background: `${gold}12`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={14} color={gold} />
              </div>
              <span style={{ fontSize: '13px', color: '#111' }}>{vendor.phone || 'Not provided'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', background: `${gold}12`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={14} color={gold} />
              </div>
              <span style={{ fontSize: '13px', color: '#111' }}>{vendor.location}</span>
            </div>

            <div style={{ height: '1px', background: '#ECECEC', margin: '0 0 20px' }} />

            {/* Trust Score */}
            <div style={{ background: '#F7F5F2', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>Trust Score</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: gold }}>{vendor.trustScore}/100</span>
              </div>
              <div style={{ height: '6px', background: '#ECECEC', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${vendor.trustScore}%`, background: `linear-gradient(90deg, ${gold}, #a8833a)`, borderRadius: '3px' }} />
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleSaveVendor}
              disabled={saved || savingVendor}
              style={{
                width: '100%', padding: '12px',
                background: saved ? '#f0fdf4' : '#fff',
                color: saved ? '#16a34a' : '#111',
                border: `1.5px solid ${saved ? '#bbf7d0' : '#ECECEC'}`,
                borderRadius: '10px', fontWeight: '600', fontSize: '13px',
                cursor: 'pointer', marginBottom: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Heart size={15} fill={saved ? '#16a34a' : 'none'} />
              {saved ? 'Saved to Favorites' : savingVendor ? 'Saving...' : 'Save Vendor'}
            </button>

            <Link to={`/enquiry/${vendor._id}${eventId ? `?eventId=${eventId}` : ''}`} style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '13px',
                background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                color: '#000', border: 'none', borderRadius: '10px',
                fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: `0 4px 16px ${gold}30`
              }}>
                <Mail size={15} /> Contact Vendor
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorProfileView;