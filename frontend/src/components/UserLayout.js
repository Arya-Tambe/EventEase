import Sidebar from './Sidebar';

function UserLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        marginLeft: '240px', flex: 1,
        padding: '40px 48px', minHeight: '100vh',
        boxSizing: 'border-box',
        transition: 'margin-left 0.25s ease',
        position: 'relative',
        background: '#F7F5F2',
        backgroundImage: `radial-gradient(circle at 1px 1px, #C8A95B18 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }}>
        <div style={{
          position: 'fixed', top: '-120px', right: '-120px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #C8A95B08 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'fixed', bottom: '-100px', left: '200px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, #C8A95B06 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default UserLayout;