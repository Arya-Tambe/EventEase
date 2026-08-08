import {
  Calendar, Search, Package, BarChart2,
  Mail, ArrowRight, Shield, Award,
  Heart, Cake, Building2, GraduationCap,
  Sparkles, Home, Music, Baby, PartyPopper,
  Users, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function EventCard({ gridStyle, image, label, title, desc, num, gold, small }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      ...gridStyle,
      borderRadius: '12px', overflow: 'hidden',
      border: `1px solid ${hovered ? gold + '80' : gold + '25'}`,
      position: 'relative', cursor: 'pointer',
      transition: 'all 0.4s ease',
      transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
      boxShadow: hovered ? `0 20px 60px ${gold}30` : 'none',
      background: '#111'
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)'
        }}
      />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(160deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)'
          : 'linear-gradient(160deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)'
      }} />

      {/* Gold top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
        opacity: hovered ? 1 : 0.5, transition: 'opacity 0.3s'
      }} />

      {/* Decorative number */}
      <div style={{
        position: 'absolute', top: '12px', right: '14px',
        fontSize: small ? '32px' : '60px',
        fontWeight: '800', color: `${gold}15`, lineHeight: 1,
        transition: 'color 0.3s',
        ...(hovered ? { color: `${gold}25` } : {})
      }}>{num}</div>

      {/* Label badge */}
      {label && (
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          background: `${gold}20`, border: `1px solid ${gold}50`,
          borderRadius: '4px', padding: '4px 10px'
        }}>
          <span style={{ color: gold, fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: small ? '10px 14px' : '20px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
      }}>
        {!small && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '20px', height: '1px', background: gold }} />
            <span style={{ color: gold, fontSize: '10px', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>EventEase</span>
          </div>
        )}
        <h3 style={{
          color: '#fff', margin: '0 0 3px',
          fontSize: small ? '13px' : '20px',
          fontWeight: '700', letterSpacing: '-0.01em'
        }}>{title}</h3>
        {!small && desc && (
          <p style={{ color: '#B8B8B8', fontSize: '12px', margin: 0 }}>{desc}</p>
        )}
      </div>

      {/* Gold glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${gold}08, transparent 70%)`,
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
}

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const gold = '#D4AF37';
  const darkGold = '#C9A227';
  const bg = '#0A0A0A';
  const card = '#171717';
  const white = '#FFFFFF';
  const gray = '#B8B8B8';

  return (
    <div style={{ background: bg, color: white, fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${gold}22` : 'none',
        padding: '20px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '16px', color: '#000'
          }}>E</div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: white, letterSpacing: '0.02em' }}>EventEase</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Features', 'Categories', 'How It Works', 'Vendors'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
              color: gray, fontSize: '14px', textDecoration: 'none',
              fontWeight: '500', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.target.style.color = gold}
            onMouseLeave={e => e.target.style.color = gray}
            >{item}</a>
          ))}
          <Link to="/login">
            <button style={{
              padding: '10px 24px',
              background: 'transparent',
              border: `1px solid ${gold}`,
              borderRadius: '6px', color: gold,
              fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.2s', marginRight: '8px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = gold; }}
            >Sign In</button>
          </Link>
          <Link to="/register">
            <button style={{
              padding: '10px 24px',
              background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
              border: 'none', borderRadius: '6px',
              color: '#000', fontWeight: '700', fontSize: '14px',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 60px 80px',
        position: 'relative',
        overflow: 'hidden',
        gap: '60px'
      }}>
        {/* Background gradient orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '5%',
          width: '600px', height: '600px',
          background: `radial-gradient(circle, ${gold}12 0%, transparent 70%)`,
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: '400px', height: '400px',
          background: `radial-gradient(circle, ${gold}08 0%, transparent 70%)`,
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* LEFT SIDE - Content */}
        <div style={{ flex: '0 0 520px', position: 'relative', zIndex: 1 }}>
          {/* Premium badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${gold}12`, border: `1px solid ${gold}35`,
            borderRadius: '4px', padding: '8px 16px', marginBottom: '32px'
          }}>
            <div style={{ width: '6px', height: '6px', background: gold, borderRadius: '50%' }} />
            <span style={{ color: gold, fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Premium Event Planning Platform
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '62px', fontWeight: '800', lineHeight: '1.05',
            color: white, margin: '0 0 12px', letterSpacing: '-0.03em'
          }}>
            Every Event,
          </h1>
          <h1 style={{
            fontSize: '62px', fontWeight: '800', lineHeight: '1.05',
            margin: '0 0 28px', letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, ${gold} 0%, #f0d060 50%, ${gold} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Beautifully Planned
          </h1>

          {/* Gold divider */}
          <div style={{ width: '60px', height: '2px', background: `linear-gradient(90deg, ${gold}, transparent)`, marginBottom: '24px' }} />

          {/* Subheadline */}
          <p style={{
            fontSize: '17px', color: '#B8B8B8', lineHeight: '1.75',
            marginBottom: '44px', maxWidth: '460px', fontWeight: '300'
          }}>
            From birthdays and weddings to corporate gatherings and celebrations, EventEase helps you discover trusted vendors, build custom packages, and bring every event to life with confidence.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
            <Link to="/register">
              <button style={{
                padding: '16px 36px',
                background: `linear-gradient(135deg, ${gold} 0%, ${darkGold} 100%)`,
                border: 'none', borderRadius: '4px',
                color: '#000', fontWeight: '700', fontSize: '15px',
                cursor: 'pointer', letterSpacing: '0.04em',
                boxShadow: `0 8px 32px ${gold}35`,
                transition: 'all 0.3s', textTransform: 'uppercase'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${gold}50`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 32px ${gold}35`; }}
              >Plan Your Event</button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: '16px 36px',
                background: 'transparent',
                border: `1px solid ${gold}50`,
                borderRadius: '4px', color: white,
                fontWeight: '500', fontSize: '15px',
                cursor: 'pointer', transition: 'all 0.3s',
                letterSpacing: '0.04em', textTransform: 'uppercase'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; e.currentTarget.style.background = `${gold}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${gold}50`; e.currentTarget.style.color = white; e.currentTarget.style.background = 'transparent'; }}
              >Explore Vendors</button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {[
              { value: '500+', label: 'Events Planned' },
              { value: '200+', label: 'Verified Vendors' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: gold, letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#666', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Luxury Event Showcase */}
        <div style={{
          flex: 1, position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '280px 180px 120px',
          gap: '12px',
          height: '600px'
        }}>
          {/* Card 1 - Wedding - Large */}
          <EventCard
            gridStyle={{ gridColumn: '1', gridRow: '1 / 3' }}
            image="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80"
            label="Featured"
            title="Wedding"
            desc="Grand celebrations & ceremonies"
            num="01"
            gold={gold}
          />

          {/* Card 2 - Birthday */}
          <EventCard
            gridStyle={{ gridColumn: '2', gridRow: '1' }}
            image="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80"
            title="Birthday"
            desc="Memorable celebrations"
            num="02"
            gold={gold}
          />

          {/* Card 3 - Corporate */}
          <EventCard
            gridStyle={{ gridColumn: '2', gridRow: '2' }}
            image="https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80"
            title="Corporate"
            desc="Professional gatherings"
            num="03"
            gold={gold}
          />

          {/* Bottom row */}
          <EventCard
            gridStyle={{ gridColumn: '1', gridRow: '3' }}
            image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80"
            title="Conference"
            desc="Professional summits"
            num="04"
            gold={gold}
            small
          />
          <EventCard
            gridStyle={{ gridColumn: '2', gridRow: '3' }}
            image="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=300&q=80"
            title="Anniversary"
            desc="Timeless celebrations"
            num="05"
            gold={gold}
            small
          />
        </div>
      </section>

      {/* ===== GOLD DIVIDER ===== */}
      <div style={{ padding: '0 60px', marginBottom: '80px' }}>
        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${gold}60, transparent)` }} />
      </div>

      {/* ===== TRUST STATS ===== */}
      <section style={{ padding: '0 60px 100px' }}>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0',
          background: card, border: `1px solid ${gold}20`,
          borderRadius: '16px', overflow: 'hidden'
        }}>
          {[
            { value: '500+', label: 'Events Planned', icon: <Calendar size={28} color={gold} /> },
            { value: '200+', label: 'Verified Vendors', icon: <Shield size={28} color={gold} /> },
            { value: '7', label: 'Vendor Categories', icon: <Package size={28} color={gold} /> },
            { value: '98%', label: 'Client Satisfaction', icon: <Award size={28} color={gold} /> },
          ].map((stat, idx) => (
            <div key={idx} style={{
              flex: 1, padding: '40px 20px', textAlign: 'center',
              borderRight: idx < 3 ? `1px solid ${gold}20` : 'none'
            }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{stat.icon}</span>
              <p style={{ fontSize: '36px', fontWeight: '800', color: gold, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{stat.value}</p>
              <p style={{ color: gray, fontSize: '14px', margin: 0, fontWeight: '500' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding: '0 60px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: gold, fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            ✦ Platform Features
          </p>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: white, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Everything You Need
          </h2>
          <p style={{ color: gray, fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Powerful tools designed for seamless event planning and vendor management.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { icon: <Calendar size={24} color={gold} />, title: 'Event Planning Engine', desc: 'Automatically generates required and optional services based on your event type, saving hours of planning time.' },
            { icon: <Search size={24} color={gold} />, title: 'Availability-Based Search', desc: 'Find vendors available on your exact event date. Filter by category, subcategory, and location instantly.' },
            { icon: <Package size={24} color={gold} />, title: 'Smart Package Builder', desc: 'Get intelligent vendor recommendations and build your perfect event package with real-time budget tracking.' },
            { icon: <BarChart2 size={24} color={gold} />, title: 'Event Readiness Tracker', desc: 'Track your event planning progress in real-time. Know exactly what\'s booked and what\'s still pending.' },
            { icon: <Shield size={24} color={gold} />, title: 'Vendor Verification', desc: 'All vendors are admin-verified before appearing in search results. Only trusted, reliable professionals.' },
            { icon: <Mail size={24} color={gold} />, title: 'Direct Vendor Enquiry', desc: 'Send enquiries directly to vendors with your event details. Get responses and quotes without leaving the platform.' },
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: card, border: `1px solid ${gold}20`,
              borderRadius: '14px', padding: '32px',
              transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${gold}60`;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 16px 48px ${gold}15`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = `1px solid ${gold}20`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
                opacity: 0
              }} />
              <div style={{
                width: '52px', height: '52px',
                background: `${gold}15`, border: `1px solid ${gold}30`,
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', marginBottom: '20px'
              }}>{feature.icon}</div>
              <h3 style={{ color: white, fontSize: '17px', fontWeight: '700', margin: '0 0 12px' }}>{feature.title}</h3>
              <p style={{ color: gray, fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== EVENT CATEGORIES ===== */}
      <section id="categories" style={{ padding: '0 60px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: gold, fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>✦ Event Categories</p>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: white, margin: '0 0 16px', letterSpacing: '-0.02em' }}>Built For Every Occasion</h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {[
            { icon: <Heart size={28} color={gold} />, label: 'Wedding' },
            { icon: <Cake size={28} color={gold} />, label: 'Birthday' },
            { icon: <Building2 size={28} color={gold} />, label: 'Corporate Event' },
            { icon: <GraduationCap size={28} color={gold} />, label: 'Conference' },
            { icon: <Music size={28} color={gold} />, label: 'College Fest' },
            { icon: <Baby size={28} color={gold} />, label: 'Baby Shower' },
            { icon: <Home size={28} color={gold} />, label: 'Housewarming' },
            { icon: <Sparkles size={28} color={gold} />, label: 'Anniversary' },
            { icon: <PartyPopper size={28} color={gold} />, label: 'Social Gathering' },
          ].map((cat, idx) => (
            <div key={idx} style={{
              background: card, border: `1px solid ${gold}25`,
              borderRadius: '12px', padding: '24px 32px',
              textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.3s', minWidth: '140px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${gold}80`;
              e.currentTarget.style.background = `${gold}10`;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = `1px solid ${gold}25`;
              e.currentTarget.style.background = card;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{cat.icon}</div>
              <span style={{ color: gray, fontSize: '13px', fontWeight: '500' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ padding: '0 60px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: gold, fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>✦ Simple Process</p>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: white, margin: '0', letterSpacing: '-0.02em' }}>How EventEase Works</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', top: '32px', left: '10%', right: '10%',
            height: '1px', background: `linear-gradient(90deg, transparent, ${gold}40, ${gold}40, transparent)`
          }} />

          {[
            { step: '01', icon: <Calendar size={26} color={gold} />, title: 'Create Event', desc: 'Enter your event details and let our engine generate required services.' },
            { step: '02', icon: <Search size={26} color={gold} />, title: 'Get Recommended Vendors', desc: 'Browse verified vendors filtered by category, location, and availability.' },
            { step: '03', icon: <Package size={26} color={gold} />, title: 'Build Package', desc: 'Select packages from vendors and build your complete event package.' },
            { step: '04', icon: <BarChart2 size={26} color={gold} />, title: 'Track Readiness', desc: 'Monitor your event planning progress with our real-time tracker.' },
            { step: '05', icon: <Award size={26} color={gold} />, title: 'Celebrate', desc: 'Enjoy your perfectly planned, unforgettable event.' },
          ].map((step, idx) => (
            <div key={idx} style={{ flex: 1, textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '64px', height: '64px',
                background: card, border: `2px solid ${gold}`,
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: `0 0 24px ${gold}30`
              }}>{step.icon}</div>
              <p style={{ color: gold, fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', margin: '0 0 8px' }}>STEP {step.step}</p>
              <h3 style={{ color: white, fontSize: '15px', fontWeight: '700', margin: '0 0 10px' }}>{step.title}</h3>
              <p style={{ color: gray, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: '0 60px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: gold, fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>✦ Testimonials</p>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: white, margin: '0', letterSpacing: '-0.02em' }}>What Our Users Say</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { name: 'Priya Sharma', role: 'Wedding Planner', text: 'EventEase transformed how I plan weddings. Finding verified vendors in Pune has never been easier. The readiness tracker is a game changer!', rating: 5 },
            { name: 'Rahul Mehta', role: 'Corporate Event Manager', text: 'The availability-based search saved us countless hours. We found the perfect venue and catering vendor for our annual conference in just minutes.', rating: 5 },
            { name: 'Sneha Patel', role: 'Birthday Party Host', text: 'I planned my daughter\'s birthday entirely through EventEase. The package builder made it so easy to stay within budget while getting everything we needed.', rating: 5 },
          ].map((review, idx) => (
            <div key={idx} style={{
              background: card, border: `1px solid ${gold}20`,
              borderRadius: '14px', padding: '32px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${gold}50`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${gold}20`; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ color: gold, fontSize: '20px', marginBottom: '16px', letterSpacing: '2px' }}>
                {'★'.repeat(review.rating)}
              </div>
              <p style={{ color: gray, fontSize: '15px', lineHeight: '1.7', margin: '0 0 24px', fontStyle: 'italic' }}>
                "{review.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', color: '#000', fontSize: '16px'
                }}>{review.name.charAt(0)}</div>
                <div>
                  <p style={{ color: white, fontWeight: '600', fontSize: '14px', margin: 0 }}>{review.name}</p>
                  <p style={{ color: gray, fontSize: '12px', margin: 0 }}>{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '0 60px 100px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${gold}20, ${gold}08, ${gold}15)`,
          border: `1px solid ${gold}40`,
          borderRadius: '24px', padding: '80px 60px',
          textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-100px', left: '50%',
            transform: 'translateX(-50%)',
            width: '400px', height: '400px',
            background: `radial-gradient(circle, ${gold}15 0%, transparent 70%)`,
            borderRadius: '50%', pointerEvents: 'none'
          }} />
          <p style={{ color: gold, fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>✦ Get Started Today</p>
          <h2 style={{ fontSize: '48px', fontWeight: '800', color: white, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Let's Make Something<br />
            <span style={{ background: `linear-gradient(135deg, ${gold}, ${darkGold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Amazing Together
            </span>
          </h2>
          <p style={{ color: gray, fontSize: '18px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            Join thousands of event planners already using EventEase to create extraordinary experiences.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register">
              <button style={{
                padding: '16px 40px',
                background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
                border: 'none', borderRadius: '8px',
                color: '#000', fontWeight: '700', fontSize: '16px',
                cursor: 'pointer', boxShadow: `0 8px 32px ${gold}40`,
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>Get Started Free <ArrowRight size={16} /></button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: '16px 40px',
                background: 'transparent',
                border: `1px solid ${gold}60`,
                borderRadius: '8px', color: white,
                fontWeight: '600', fontSize: '16px', cursor: 'pointer'
              }}>Explore Vendors</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        borderTop: `1px solid ${gold}20`,
        padding: '60px 60px 40px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ maxWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px',
                background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
                borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', color: '#000'
              }}>E</div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: white }}>EventEase</span>
            </div>
            <p style={{ color: gray, fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              The premium event planning platform connecting you with verified vendors for extraordinary experiences.
            </p>
          </div>

          {[
            { title: 'Platform', links: ['Features', 'Vendor Search', 'Package Builder', 'Readiness Tracker'] },
            { title: 'Event Types', links: ['Wedding', 'Birthday', 'Corporate', 'Conference', 'Anniversary'] },
            { title: 'Company', links: ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Us'] },
          ].map((col, idx) => (
            <div key={idx}>
              <h4 style={{ color: white, fontSize: '14px', fontWeight: '700', margin: '0 0 16px', letterSpacing: '0.05em' }}>{col.title}</h4>
              {col.links.map(link => (
                <p key={link} style={{ color: gray, fontSize: '14px', margin: '0 0 10px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = gold}
                onMouseLeave={e => e.target.style.color = gray}
                >{link}</p>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${gold}20`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: gray, fontSize: '13px', margin: 0 }}>© 2026 EventEase. All rights reserved.</p>
          <p style={{ color: gray, fontSize: '13px', margin: 0 }}>Made with ❤️ for extraordinary events</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;