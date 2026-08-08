import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Upload, Image, Plus } from 'lucide-react';

const gold = '#C8A95B';

function VendorPortfolio() {
  const [vendor, setVendor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const res = await API.post('/vendors/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setVendor(res.data);
      setSelectedFile(null);
      setPreview(null);
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!vendor) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', fontFamily: "'Inter', sans-serif" }}>
      <Link to="/vendor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#888'}
      ><ArrowLeft size={14} /> Back to Dashboard</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendor Settings</p>
          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>Portfolio Gallery</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Showcase your best work to attract more clients</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 2px', fontSize: '24px', fontWeight: '700', color: gold }}>{vendor.portfolio.length}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Images uploaded</p>
        </div>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
      {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>✓ {success}</div>}

      {/* Upload Card */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ECECEC', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: '#111' }}>Upload New Image</h3>

        {/* Drop Zone */}
        <label htmlFor="portfolio-upload" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{
            border: `2px dashed ${preview ? gold : '#ECECEC'}`,
            borderRadius: '16px', padding: '40px',
            textAlign: 'center', background: preview ? `${gold}05` : '#FAFAFA',
            transition: 'all 0.3s',
            position: 'relative', overflow: 'hidden'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = `${gold}05`; }}
          onMouseLeave={e => { if (!preview) { e.currentTarget.style.borderColor = '#ECECEC'; e.currentTarget.style.background = '#FAFAFA'; } }}
          >
            {preview ? (
              <div>
                <img src={preview} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '10px', objectFit: 'cover', marginBottom: '12px' }} />
                <p style={{ fontSize: '13px', color: gold, fontWeight: '600' }}>{selectedFile?.name}</p>
                <p style={{ fontSize: '12px', color: '#aaa' }}>Click to change image</p>
              </div>
            ) : (
              <div>
                <div style={{ width: '56px', height: '56px', background: `${gold}12`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Upload size={24} color={gold} />
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '600', color: '#111' }}>
                  Drop your image here or <span style={{ color: gold }}>browse</span>
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                  Supports JPG, PNG, WEBP — Max 5MB
                </p>
              </div>
            )}
          </div>
        </label>
        <input id="portfolio-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

        {selectedFile && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleUpload} disabled={uploading} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
              background: uploading ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
              color: uploading ? '#999' : '#000', border: 'none', borderRadius: '10px',
              fontWeight: '700', fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer',
              boxShadow: uploading ? 'none' : `0 4px 16px ${gold}30`
            }}>
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button onClick={() => { setSelectedFile(null); setPreview(null); }} style={{
              padding: '12px 20px', background: '#fff', color: '#666',
              border: '1.5px solid #ECECEC', borderRadius: '10px',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer'
            }}>Cancel</button>
          </div>
        )}
      </div>

      {/* Portfolio Grid */}
      {vendor.portfolio.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC' }}>
          <div style={{ width: '64px', height: '64px', background: `${gold}12`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Image size={28} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px' }}>No images yet</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Upload your first portfolio image to showcase your work to clients.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: '#111' }}>
            Your Portfolio <span style={{ color: gold }}>({vendor.portfolio.length} images)</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
            {vendor.portfolio.map((imgPath, idx) => (
              <div key={idx} style={{
                borderRadius: '12px', overflow: 'hidden',
                position: 'relative', aspectRatio: '4/3',
                border: '1px solid #ECECEC',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15)`; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <img src={`http://localhost:5000${imgPath}`} alt={`Portfolio ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                >
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                  <span style={{
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    fontSize: '10px', padding: '3px 7px', borderRadius: '4px'
                  }}>#{idx + 1}</span>
                </div>
              </div>
            ))}

            {/* Add more */}
            <label htmlFor="portfolio-upload-extra" style={{ cursor: 'pointer' }}>
              <div style={{
                borderRadius: '12px', border: `2px dashed ${gold}30`,
                aspectRatio: '4/3', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: `${gold}05`, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = `${gold}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${gold}30`; e.currentTarget.style.background = `${gold}05`; }}
              >
                <Plus size={24} color={gold} />
                <span style={{ fontSize: '12px', color: gold, fontWeight: '600' }}>Add More</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorPortfolio;