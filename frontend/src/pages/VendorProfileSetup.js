import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const categorySubcategories = {
  Venue: [
    'Banquet Hall',
    'Lawn',
    'Resort',
    'Conference Hall',
    'Auditorium',
    'Farmhouse',
    'Open Ground'
  ],
  Catering: [
    'Veg Catering',
    'Non-Veg Catering',
    'Buffet Service',
    'Live Counters',
    'Snacks Service',
    'Sweet/Dessert Service'
  ],
  Decoration: [
    'Floral Decoration',
    'Balloon Decoration',
    'Theme Decoration',
    'Stage Decoration',
    'Mandap Decoration'
  ],
  Photography: [
    'Event Photography',
    'Wedding Photography',
    'Drone Photography',
    'Corporate Photography',
    'Birthday Photography'
  ],
  Videography: [
    'Event Videography',
    'Drone Videography',
    'Live Streaming',
    'Wedding Film'
  ],
  Entertainment: [
    'DJ',
    'Singer',
    'Live Band',
    'Anchor',
    'Magician'
  ],
  'Sound & Lighting': [
    'Sound System',
    'LED Wall',
    'Projector',
    'Generator',
    'Microphone Setup',
    'Stage Light'
  ]
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
      setFormData({
        ...formData,
        category: value,
        subcategory: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await API.post('/vendors', formData);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create profile'
      );
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .vendor-setup-page {
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(212, 175, 55, 0.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(212, 175, 55, 0.045),
              transparent 30%
            ),
            #f8f7f3;
          color: #181818;
          padding: 42px 32px 70px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .vendor-setup-container {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
        }

        /* BRAND */

        .vendor-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 52px;
        }

        .vendor-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          width: 43px;
          height: 43px;
          border-radius: 10px;
          background: linear-gradient(
            145deg,
            #e2bf55,
            #c49b35
          );
          color: #171717;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          box-shadow:
            0 7px 18px rgba(182, 145, 47, 0.18);
        }

        .brand-name {
          font-size: 20px;
          font-weight: 750;
          color: #161616;
          letter-spacing: -0.4px;
        }

        .onboarding-label {
          color: #9a8a63;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        /* HERO */

        .hero-section {
          text-align: center;
          margin-bottom: 38px;
        }

        .hero-line {
          width: 42px;
          height: 2px;
          background: #d4af37;
          margin: 0 auto 18px;
        }

        .eyebrow {
          color: #b28a28;
          font-size: 12px;
          font-weight: 750;
          letter-spacing: 2.3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .hero-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(32px, 5vw, 45px);
          line-height: 1.12;
          font-weight: 600;
          letter-spacing: -1px;
          color: #171717;
        }

        .hero-title span {
          color: #bd9228;
        }

        .hero-description {
          max-width: 650px;
          margin: 15px auto 0;
          color: #85837e;
          font-size: 15px;
          line-height: 1.7;
        }

        /* CARD */

        .profile-card {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #e8e5dc;
          border-radius: 20px;
          padding: 38px;
          box-shadow:
            0 15px 45px rgba(35, 31, 20, 0.07),
            0 2px 8px rgba(35, 31, 20, 0.025);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 23px;
          border-bottom: 1px solid #eeeae1;
        }

        .card-title {
          margin: 0 0 6px;
          font-size: 19px;
          font-weight: 700;
          color: #1b1b1b;
        }

        .card-subtitle {
          margin: 0;
          color: #96938d;
          font-size: 13px;
        }

        .step-indicator {
          text-align: right;
          white-space: nowrap;
        }

        .step-label {
          display: block;
          color: #b58c2b;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .step-number {
          color: #aaa69e;
          font-size: 12px;
        }

        /* FORM */

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 23px 22px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          color: #4b4945;
          font-size: 13px;
          font-weight: 650;
          letter-spacing: 0.15px;
        }

        .required-star {
          color: #c49a30;
          margin-left: 3px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          border: 1px solid #dfddd7;
          border-radius: 10px;
          background: #ffffff;
          color: #242321;
          font-size: 14px;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .form-input,
        .form-select {
          height: 50px;
          padding: 0 15px;
        }

        .form-textarea {
          min-height: 125px;
          padding: 14px 15px;
          resize: vertical;
          line-height: 1.6;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #aaa8a2;
        }

        .form-input:hover,
        .form-select:hover,
        .form-textarea:hover {
          border-color: #cfcac0;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #c9a43b;
          background: #fffefa;
          box-shadow:
            0 0 0 3px rgba(212, 175, 55, 0.10);
        }

        .form-select {
          appearance: none;
          cursor: pointer;
          background-image:
            linear-gradient(
              45deg,
              transparent 50%,
              #77736b 50%
            ),
            linear-gradient(
              135deg,
              #77736b 50%,
              transparent 50%
            );
          background-position:
            calc(100% - 19px) 21px,
            calc(100% - 14px) 21px;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }

        .form-select option {
          background: #ffffff;
          color: #222222;
        }

        /* ERROR */

        .error-message {
          margin-bottom: 24px;
          padding: 13px 15px;
          border: 1px solid #edcfcf;
          border-radius: 10px;
          background: #fff6f6;
          color: #b64b4b;
          font-size: 13px;
          line-height: 1.5;
        }

        /* BUTTON */

        .submit-section {
          grid-column: 1 / -1;
          margin-top: 5px;
          padding-top: 28px;
          border-top: 1px solid #eeeae1;
        }

        .submit-button {
          width: 100%;
          height: 54px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #dfbb48,
            #c79c32
          );
          color: #161616;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.35px;
          cursor: pointer;
          box-shadow:
            0 8px 22px rgba(190, 150, 43, 0.20);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow:
            0 12px 28px rgba(190, 150, 43, 0.27);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .security-note {
          text-align: center;
          margin: 15px 0 0;
          color: #aaa69f;
          font-size: 11px;
        }

        .security-note span {
          color: #a88736;
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .vendor-setup-page {
            padding: 26px 16px 45px;
          }

          .vendor-topbar {
            margin-bottom: 38px;
          }

          .onboarding-label {
            display: none;
          }

          .hero-section {
            margin-bottom: 28px;
          }

          .hero-title {
            font-size: 34px;
          }

          .hero-description {
            font-size: 14px;
          }

          .profile-card {
            padding: 24px 18px;
            border-radius: 16px;
          }

          .card-header {
            margin-bottom: 25px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .form-group.full-width,
          .submit-section {
            grid-column: auto;
          }

          .step-indicator {
            display: none;
          }
        }
      `}</style>

      <div className="vendor-setup-page">
        <div className="vendor-setup-container">

          <div className="vendor-topbar">
            <div className="vendor-brand">
              <div className="brand-mark">E</div>
              <div className="brand-name">
                EventEase
              </div>
            </div>

            <div className="onboarding-label">
              Vendor Onboarding
            </div>
          </div>

          <section className="hero-section">
            <div className="hero-line"></div>

            <div className="eyebrow">
              Build Your Presence
            </div>

            <h1 className="hero-title">
              Set Up Your <span>Vendor Profile</span>
            </h1>

            <p className="hero-description">
              Tell us about your business and connect with
              customers looking for trusted event professionals.
            </p>
          </section>

          <div className="profile-card">

            <div className="card-header">
              <div>
                <h2 className="card-title">
                  Business Information
                </h2>

                <p className="card-subtitle">
                  Add your details to start receiving enquiries.
                </p>
              </div>

              <div className="step-indicator">
                <span className="step-label">
                  Profile Setup
                </span>

                <span className="step-number">
                  01 / 01
                </span>
              </div>
            </div>

            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label className="form-label">
                    Business Name
                    <span className="required-star">*</span>
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Category
                    <span className="required-star">*</span>
                  </label>

                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {Object.keys(categorySubcategories).map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Location (City)
                    <span className="required-star">*</span>
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Pune"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Subcategory
                    <span className="required-star">*</span>
                  </label>

                  <select
                    className="form-select"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Subcategory
                    </option>

                    {categorySubcategories[
                      formData.category
                    ].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Contact Phone
                    <span className="required-star">*</span>
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    About Your Business
                  </label>

                  <textarea
                    className="form-textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell customers about your services, experience and what makes your business special..."
                    rows="5"
                  />
                </div>

                <div className="submit-section">
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    CREATE VENDOR PROFILE&nbsp;&nbsp; →
                  </button>

                  <p className="security-note">
                    Your information is used to create your
                    <span> EventEase vendor profile.</span>
                  </p>
                </div>

              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default VendorProfileSetup;