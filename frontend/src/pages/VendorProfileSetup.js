import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const categorySubcategories = {
  Venue: ['Banquet Hall', 'Lawn', 'Resort', 'Conference Hall', 'Auditorium', 'Farmhouse', 'Open Ground'],
  Catering: ['Veg Catering', 'Non-Veg Catering', 'Buffet Service', 'Live Counters', 'Snacks Service', 'Sweet/Dessert Service'],
  Decoration: ['Floral Decoration', 'Balloon Decoration', 'Theme Decoration', 'Stage Decoration', 'Mandap Decoration'],
  Photography: ['Event Photography', 'Wedding Photography', 'Drone Photography', 'Corporate Photography', 'Birthday Photography'],
  Videography: ['Event Videography', 'Drone Videography', 'Live Streaming', 'Wedding Film'],
  Entertainment: ['DJ', 'Singer', 'Live Band', 'Anchor', 'Magician'],
  'Sound & Lighting': ['Sound System', 'LED Wall', 'Projector', 'Generator', 'Microphone Setup', 'Stage Light']
};

function VendorProfileSetup() {
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    category: 'Venue',
    subcategory: '',
    location: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({ ...formData, category: value, subcategory: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/vendors', formData);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Set Up Your Vendor Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            {Object.keys(categorySubcategories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Subcategory</label>
          <select name="subcategory" value={formData.subcategory} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Subcategory</option>
            {categorySubcategories[formData.category].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Location (City)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Contact Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4F46E5', color: 'white', border: 'none' }}>
          Create Vendor Profile
        </button>
      </form>
    </div>
  );
}

export default VendorProfileSetup;