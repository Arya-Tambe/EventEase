import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { Search, MapPin, Calendar, Star, ChevronRight, SlidersHorizontal, ArrowLeft } from 'lucide-react';

const gold = '#C8A95B';

const categorySubcategories = {
  Venue: ['Banquet Hall', 'Lawn', 'Resort', 'Conference Hall', 'Auditorium', 'Farmhouse', 'Open Ground'],
  Catering: ['Veg Catering', 'Non-Veg Catering', 'Buffet Service', 'Live Counters', 'Snacks Service', 'Sweet/Dessert Service'],
  Decoration: ['Floral Decoration', 'Balloon Decoration', 'Theme Decoration', 'Stage Decoration', 'Mandap Decoration'],
  Photography: ['Event Photography', 'Wedding Photography', 'Drone Photography', 'Corporate Photography', 'Birthday Photography'],
  Videography: ['Event Videography', 'Drone Videography', 'Live Streaming', 'Wedding Film'],
  Entertainment: ['DJ', 'Singer', 'Live Band', 'Anchor', 'Magician'],
  'Sound & Lighting': ['Sound System', 'LED Wall', 'Projector', 'Generator', 'Microphone Setup', 'Stage Light']
};

const categories = Object.keys(categorySubcategories);

const serviceIcons = {
  Venue: '🏛️', Catering: '🍽️', Decoration: '🌸',
  Photography: '📸', Videography: '🎬',
  Entertainment: '🎵', 'Sound & Lighting': '🎙️'
};

const placeholderImages = {
  Venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
  Catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
  Decoration: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
  Photography: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&q=80',
  Videography: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80',
  'Sound & Lighting': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
};

function VendorSearch() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: '',
    location: '',
    date: ''
  });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    if (filters.category) handleSearch();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFilters({ ...filters, category: value, subcategory: '' });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.location) params.append('location', filters.location);
      if (filters.date) params.append('date', filters.date);
      const res = await API.get(`/vendors/search?${params.toString()}`);
      setVendors(res.data);
    } catch (err) {
      setError('Failed to search vendors');
    } finally {
      setLoading(false);
    }
  };

  const getSortedVendors = () => {
    const sorted = [...vendors];
    if (sortBy === 'highest-rated') return sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'lowest-price') return sorted.sort((a, b) => Math.min(...(a.packages.map(p => p.price) || [0])) - Math.min(...(b.packages.map(p => p.price) || [0])));
    if (sortBy === 'highest-price') return sorted.sort((a, b) => Math.min(...(b.packages.map(p => p.price) || [0])) - Math.min(...(a.packages.map(p => p.price) || [0])));
    return sorted;
  };

  const inputStyle = {
    height: '44px', padding: '0 14px',
    border: '1.5px solid #ECECEC', borderRadius: '10px',
    fontSize: '13px', color: '#111', background: '#fff',
    outline: 'none', fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s', width: '100%', boxSizing: 'border-box'
  };

  const sortedVendors = getSortedVendors();

  return (
    <div style={{ maxWidth: '100%', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          {eventId && (
            <Link to={`/events/${eventId}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '12px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#111'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
            >
              <ArrowLeft size={13} /> Back to Event
            </Link>
          )}
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Vendor Marketplace
          </p>
          <h1 style={{ margin: '0 0 6px', fontSize: '30px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
            Find Perfect Vendors
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
            Discover trusted professionals curated specifically for your event
          </p>
        </div>

        {/* Decorative SVG */}
        <div style={{ flexShrink: 0, opacity: 0.6 }}>
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <path d="M15 75 Q15 20 45 20 Q75 20 75 75" stroke={gold} strokeWidth="1.2" fill="none" />
            <path d="M25 75 Q25 30 45 30 Q65 30 65 75" stroke={gold} strokeWidth="0.8" fill="none" opacity="0.6" />
            <circle cx="45" cy="18" r="2" fill={gold} />
            <circle cx="20" cy="18" r="1.2" fill={gold} opacity="0.5" />
            <circle cx="70" cy="18" r="1.2" fill={gold} opacity="0.5" />
            <line x1="45" y1="18" x2="45" y2="28" stroke={gold} strokeWidth="0.8" opacity="0.5" />
            <circle cx="45" cy="29" r="1.5" fill={gold} opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Filter Card */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #ECECEC', padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <SlidersHorizontal size={15} color={gold} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>Filter Vendors</span>
        </div>

        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Category</label>
              <select name="category" value={filters.category} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}15`; }}
                onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{serviceIcons[cat]} {cat}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Subcategory</label>
              <select name="subcategory" value={filters.subcategory} onChange={handleChange}
                style={{ ...inputStyle, cursor: filters.category ? 'pointer' : 'not-allowed', opacity: filters.category ? 1 : 0.5 }}
                disabled={!filters.category}
                onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}15`; }}
                onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}>
                <option value="">All Subcategories</option>
                {filters.category && categorySubcategories[filters.category].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>City</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={13} color="#bbb" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" name="location" placeholder="e.g. Pune"
                  value={filters.location} onChange={handleChange}
                  style={{ ...inputStyle, paddingLeft: '32px' }}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}15`; }}
                  onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Event Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={13} color="#bbb" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="date" name="date" value={filters.date} onChange={handleChange}
                  style={{ ...inputStyle, paddingLeft: '32px' }}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}15`; }}
                  onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 28px',
            background: loading ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
            color: loading ? '#999' : '#000', border: 'none', borderRadius: '10px',
            fontWeight: '600', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : `0 4px 12px ${gold}25`, transition: 'all 0.2s'
          }}>
            <Search size={14} />
            {loading ? 'Searching...' : 'Search Vendors'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Results header */}
      {searched && !loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {vendors.length > 0 ? (
              <>Showing <strong style={{ color: '#111' }}>{vendors.length}</strong> verified vendor{vendors.length !== 1 ? 's' : ''}</>
            ) : 'No vendors found'}
          </p>
          {vendors.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                height: '36px', padding: '0 12px',
                border: '1px solid #ECECEC', borderRadius: '8px',
                fontSize: '12px', color: '#111', background: '#fff',
                outline: 'none', cursor: 'pointer'
              }}>
                <option value="recommended">Recommended</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="lowest-price">Lowest Price</option>
                <option value="highest-price">Highest Price</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '15px' }}>Searching for verified vendors...</p>
        </div>
      )}

      {/* No results */}
      {!loading && searched && vendors.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 40px',
          background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC'
        }}>
          <div style={{ width: '64px', height: '64px', background: `${gold}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>
            🔍
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px', fontSize: '18px' }}>No vendors found</h3>
          <p style={{ color: '#888', fontSize: '14px', maxWidth: '360px', margin: '0 auto' }}>
            Try adjusting your filters. Vendors need admin approval before appearing in results.
          </p>
        </div>
      )}

      {/* Vendor Grid */}
      {!loading && sortedVendors.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {sortedVendors.map((vendor) => (
            <div key={vendor._id} style={{
              background: '#fff', borderRadius: '16px',
              border: '1px solid #ECECEC', overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.12)`;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = `${gold}50`;
              e.currentTarget.querySelector('img') && (e.currentTarget.querySelector('img').style.transform = 'scale(1.06)');
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#ECECEC';
              e.currentTarget.querySelector('img') && (e.currentTarget.querySelector('img').style.transform = 'scale(1)');
            }}
            >
              {/* Card Image */}
              <div style={{ height: '240px', overflow: 'hidden', position: 'relative', background: `${gold}10` }}>
                <img
                  src={vendor.portfolio && vendor.portfolio.length > 0
                    ? `http://localhost:5000${vendor.portfolio[0]}`
                    : placeholderImages[vendor.category] || placeholderImages.Venue}
                  alt={vendor.businessName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.3))' }} />

                {/* Verified badge */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                  border: `1px solid ${gold}40`, borderRadius: '6px',
                  padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <div style={{ width: '5px', height: '5px', background: gold, borderRadius: '50%' }} />
                  <span style={{ color: gold, fontSize: '9px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Verified</span>
                </div>

                {/* Category badge */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                  borderRadius: '4px', padding: '3px 8px'
                }}>
                  <span style={{ color: '#fff', fontSize: '10px', fontWeight: '500' }}>{vendor.subcategory || vendor.category}</span>
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700', color: '#111', letterSpacing: '-0.01em' }}>
                    {vendor.businessName}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={11} color={gold} fill={gold} />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{vendor.rating}</span>
                      <span style={{ fontSize: '11px', color: '#aaa' }}>({vendor.totalReviews})</span>
                    </div>
                    <span style={{ width: '3px', height: '3px', background: '#ddd', borderRadius: '50%' }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#888' }}>
                      <MapPin size={10} color="#bbb" /> {vendor.location}
                    </span>
                  </div>

                  {vendor.packages.length > 0 && (
                    <div style={{ background: '#F7F5F2', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#888' }}>Starting from</p>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: gold }}>
                        ₹{Math.min(...vendor.packages.map(p => p.price)).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/vendors/${vendor._id}${eventId ? `?eventId=${eventId}` : ''}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', padding: '9px',
                      background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                      color: '#000', border: 'none', borderRadius: '8px',
                      fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>View Profile</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorSearch;