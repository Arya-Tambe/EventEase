import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Mail, Send, Calendar, Users, DollarSign, Clock, CheckCircle, Inbox } from 'lucide-react';

const gold = '#C8A95B';

function VendorEnquiries() {
  const [, setVendor] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const vendorRes = await API.get('/vendors/profile');
      setVendor(vendorRes.data);
      const enquiriesRes = await API.get(`/enquiries/vendor/${vendorRes.data._id}`);
      setEnquiries(enquiriesRes.data);
    } catch (err) {
      setError('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (id) => {
    if (!replyText[id]) return;
    setSending(id);
    try {
      const res = await API.put(`/enquiries/${id}/reply`, { reply: replyText[id] });
      setEnquiries(enquiries.map(e => e._id === id ? res.data : e));
      setReplyText({ ...replyText, [id]: '' });
    } catch (err) {
      setError('Failed to send reply');
    } finally {
      setSending(null);
    }
  };

  const statusConfig = {
    pending: { label: 'Pending', bg: '#fefce8', color: '#ca8a04', border: '#fde68a' },
    viewed: { label: 'Viewed', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    replied: { label: 'Replied', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    closed: { label: 'Closed', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  };

  const filtered = filter === 'all' ? enquiries
    : filter === 'pending' ? enquiries.filter(e => e.status === 'pending')
    : filter === 'replied' ? enquiries.filter(e => e.status === 'replied')
    : enquiries;

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading enquiries...</div>;

  return (
    <div style={{ maxWidth: '800px', fontFamily: "'Inter', sans-serif" }}>
      <Link to="/vendor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#888'}
      ><ArrowLeft size={14} /> Back to Dashboard</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '600', color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Vendor Portal</p>
          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: '#111', letterSpacing: '-0.02em' }}>
            Enquiries
            {enquiries.filter(e => e.status === 'pending').length > 0 && (
              <span style={{ marginLeft: '10px', padding: '3px 10px', background: `linear-gradient(135deg, ${gold}, #a8833a)`, color: '#000', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                {enquiries.filter(e => e.status === 'pending').length} new
              </span>
            )}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>View and respond to client enquiries</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: <Mail size={16} color={gold} />, value: enquiries.length, label: 'Total Enquiries', bg: `${gold}10` },
          { icon: <Clock size={16} color='#ca8a04' />, value: enquiries.filter(e => e.status === 'pending').length, label: 'Pending Reply', bg: '#fefce8' },
          { icon: <CheckCircle size={16} color='#16a34a' />, value: enquiries.filter(e => e.status === 'replied').length, label: 'Replied', bg: '#f0fdf4' },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #ECECEC', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '36px', height: '36px', background: stat.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111' }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', padding: '4px', borderRadius: '12px', border: '1px solid #ECECEC', marginBottom: '20px', width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {[
          { key: 'all', label: `All (${enquiries.length})` },
          { key: 'pending', label: `Pending (${enquiries.filter(e => e.status === 'pending').length})` },
          { key: 'replied', label: `Replied (${enquiries.filter(e => e.status === 'replied').length})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600',
            background: filter === tab.key ? `linear-gradient(135deg, ${gold}, #a8833a)` : 'transparent',
            color: filter === tab.key ? '#000' : '#888', transition: 'all 0.2s'
          }}>{tab.label}</button>
        ))}
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '16px', border: '1px solid #ECECEC' }}>
          <div style={{ width: '64px', height: '64px', background: `${gold}12`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Inbox size={28} color={gold} />
          </div>
          <h3 style={{ color: '#111', marginBottom: '8px' }}>No enquiries yet</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>When clients contact you, their enquiries will appear here.</p>
        </div>
      )}

      {/* Enquiries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((enq) => {
          const status = statusConfig[enq.status] || statusConfig.pending;
          return (
            <div key={enq._id} style={{
              background: '#fff', borderRadius: '16px',
              border: `1px solid ${enq.status === 'pending' ? `${gold}25` : '#ECECEC'}`,
              overflow: 'hidden', boxShadow: enq.status === 'pending' ? `0 2px 12px ${gold}10` : '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              {/* Top accent line for pending */}
              {enq.status === 'pending' && (
                <div style={{ height: '3px', background: `linear-gradient(90deg, ${gold}, #a8833a)` }} />
              )}

              <div style={{ padding: '22px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      background: `linear-gradient(135deg, ${gold}, #a8833a)`,
                      borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#000', fontWeight: '700', fontSize: '15px'
                    }}>
                      {enq.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{enq.user?.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{enq.user?.email} • {enq.user?.phone}</p>
                    </div>
                  </div>
                  <span style={{
                    background: status.bg, border: `1px solid ${status.border}`,
                    color: status.color, fontSize: '11px', fontWeight: '600',
                    padding: '4px 12px', borderRadius: '6px', letterSpacing: '0.04em'
                  }}>{status.label}</span>
                </div>

                {/* Event Details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  {enq.eventType && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666', background: '#F7F5F2', padding: '5px 10px', borderRadius: '6px' }}>
                      <Mail size={11} color={gold} /> {enq.eventType}
                    </span>
                  )}
                  {enq.eventDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666', background: '#F7F5F2', padding: '5px 10px', borderRadius: '6px' }}>
                      <Calendar size={11} color={gold} /> {new Date(enq.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {enq.guestCount && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666', background: '#F7F5F2', padding: '5px 10px', borderRadius: '6px' }}>
                      <Users size={11} color={gold} /> {enq.guestCount} guests
                    </span>
                  )}
                  {enq.budget && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666', background: '#F7F5F2', padding: '5px 10px', borderRadius: '6px' }}>
                      <DollarSign size={11} color={gold} /> ₹{Number(enq.budget).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div style={{ background: '#F7F5F2', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{enq.message}</p>
                </div>

                {/* Existing Reply */}
                {enq.reply && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Reply</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#166534', lineHeight: '1.6' }}>{enq.reply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {!enq.reply && (
                  <div>
                    <textarea
                      value={replyText[enq._id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [enq._id]: e.target.value })}
                      placeholder="Write a professional reply..."
                      rows="3"
                      style={{
                        width: '100%', padding: '14px 16px',
                        border: '1.5px solid #ECECEC', borderRadius: '10px',
                        fontSize: '14px', color: '#111', background: '#fff',
                        outline: 'none', resize: 'vertical', lineHeight: '1.6',
                        fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
                        marginBottom: '12px', transition: 'all 0.2s'
                      }}
                      onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = `0 0 0 3px ${gold}12`; }}
                      onBlur={e => { e.target.style.borderColor = '#ECECEC'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button
                      onClick={() => sendReply(enq._id)}
                      disabled={!replyText[enq._id] || sending === enq._id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '11px 22px',
                        background: !replyText[enq._id] ? '#e5e0d5' : `linear-gradient(135deg, ${gold}, #a8833a)`,
                        color: !replyText[enq._id] ? '#999' : '#000',
                        border: 'none', borderRadius: '10px',
                        fontWeight: '600', fontSize: '13px',
                        cursor: !replyText[enq._id] ? 'not-allowed' : 'pointer',
                        boxShadow: !replyText[enq._id] ? 'none' : `0 4px 12px ${gold}25`
                      }}
                    >
                      <Send size={14} />
                      {sending === enq._id ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VendorEnquiries;