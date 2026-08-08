import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Heart, MapPin, Star, Trash2, ChevronRight, Package } from 'lucide-react';

const gold = '#C8A95B';

const placeholderImages = {
  Venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
  Catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
  Decoration: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
  Photography: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&q=80',
  Videography: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80',
  'Sound & Lighting': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
};

function SavedVendors() {
  const [savedVendors, setSavedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchSavedVendors();
  }, []);

  const fetchSavedVendors = async () => {
    try {
      const res = await API.get('/auth/saved-vendors');
      setSavedVendors(res.data);
    } catch (err) {
      setError('Failed to load saved vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (vendorId) => {
    setRemovingId(vendorId);
    try {
      await API.delete(`/auth/saved-vendors/${vendorId}`);
      setSavedVendors(savedVendors.filter(v => v._id !== vendorId));
    } catch (err) {
      setError('Failed to remove vendor');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      <p>Loading saved vendors...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          My Collection
        </p>
        <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
          Saved Vendors
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
          Your curated list of favourite vendors — ready when you are
        </p>
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {savedVendors.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '100px 40px',
          background: '#fff', borderRadius: '20px', border: '1px solid #ECECEC',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: '80px', height: '80px',
            background: `${gold}12`, border: `1px solid ${gold}25`,
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Heart size={32} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '10px', fontSize: '20px', fontWeight: '700' }}>
            No saved vendors yet
          </h3>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px', maxWidth: '320px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Browse our verified vendors and save your favourites to quickly access them when planning your events.
          </p>
          <Link to="/vendors/search">
            <button style={{
              padding: '13px 28px',
              background: `linear-gradient(135deg, ${gold}, #a8833a)`,
              color: '#000', border: 'none', borderRadius: '10px',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              boxShadow: `0 4px 16px ${gold}30`,
              display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}>
              <ChevronRight size={16} /> Browse Vendors
            </button>
          </Link>
        </div>
      )}

      {/* Vendor Grid */}
      {savedVendors.length > 0 && (
        <>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
            <strong style={{ color: '#111' }}>{savedVendors.length}</strong> vendor{savedVendors.length !== 1 ? 's' : ''} saved
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {savedVendors.map((vendor) => {
              const coverImage = vendor.portfolio && vendor.portfolio.length > 0
                ? `http://localhost:5000${vendor.portfolio[0]}`
                : placeholderImages[vendor.category] || placeholderImages.Venue;

              return (
                <div key={vendor._id} style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #ECECEC', overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${gold}40`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ECECEC'; }}
                >
                  {/* Image */}
                  <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                    <img src={coverImage} alt={vendor.businessName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.35))' }} />

                    {/* Verified */}
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                      borderRadius: '6px', padding: '3px 10px',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <div style={{ width: '5px', height: '5px', background: gold, borderRadius: '50%' }} />
                      <span style={{ color: gold, fontSize: '9px', fontWeight: '700', letterSpacing: '0.06em' }}>VERIFIED</span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(vendor._id)}
                      disabled={removingId === vendor._id}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '32px', height: '32px',
                        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                        border: 'none', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; }}
                    >
                      <Trash2 size={13} color={removingId === vendor._id ? '#ccc' : '#c53030'} />
                    </button>

                    {/* Category */}
                    <div style={{
                      position: 'absolute', bottom: '12px', left: '12px',
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                      borderRadius: '4px', padding: '3px 8px'
                    }}>
                      <span style={{ color: '#fff', fontSize: '10px', fontWeight: '500' }}>
                        {vendor.subcategory || vendor.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#111', letterSpacing: '-0.01em' }}>
                      {vendor.businessName}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#666' }}>
                        <Star size={11} color={gold} fill={gold} /> {vendor.rating}
                      </span>
                      <span style={{ width: '3px', height: '3px', background: '#ddd', borderRadius: '50%' }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#888' }}>
                        <MapPin size={11} color="#bbb" /> {vendor.location}
                      </span>
                    </div>

                    {/* Starting price */}
                    {vendor.packages.length > 0 && (
                      <div style={{
                        background: '#F7F5F2', borderRadius: '8px',
                        padding: '10px 12px', marginBottom: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Package size={12} color={gold} />
                          <span style={{ fontSize: '11px', color: '#888' }}>{vendor.packages.length} package{vendor.packages.length !== 1 ? 's' : ''}</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: gold }}>
                          From ₹{Math.min(...vendor.packages.map(p => p.price)).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <Link to={`/vendors/${vendor._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                        <button style={{
                          width: '100%', padding: '10px',
                          background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                          color: '#000', border: 'none', borderRadius: '8px',
                          fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}>
                          View Profile <ChevronRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default SavedVendors;