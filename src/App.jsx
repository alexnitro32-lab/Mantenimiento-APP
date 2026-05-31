import { useState } from 'react';
import { MaintenanceProvider } from './context/MaintenanceContext';
import AdvisorDashboard from './components/Advisor/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import EditorDashboard from './components/Editor/EditorDashboard';
import LoginModal from './components/Auth/LoginModal';
import IssueReporter from './components/IssueReporter';
import logo from './assets/logo.png';

function AppContent() {
  const [role, setRole] = useState('advisor'); // 'advisor' | 'admin' | 'editor'
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = (loginRole) => {
    setRole(loginRole);
    setShowLoginModal(false);
  };

  const handleBack = () => {
    setRole('advisor');
  };

  return (
    <>
      {/* Piñón fijo esquina superior derecha — solo en vista asesor */}
      {role === 'advisor' && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: '1.25rem',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 500
        }}>
          <button
            onClick={() => setShowLoginModal(true)}
            title="Acceso al sistema"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              transition: 'color 0.2s, background 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.74-.07-1.08l2.32-1.82c.21-.16.27-.45.14-.68l-2.2-3.81c-.13-.23-.41-.31-.65-.23l-2.73 1.1c-.57-.44-1.17-.8-1.84-1.07L14.05 2.4c-.04-.25-.26-.4-.51-.4h-4.4c-.25 0-.47.15-.51.4l-.41 2.51c-.67.27-1.27.63-1.84 1.07l-2.73-1.1c-.24-.08-.52 0-.65.23L1.8 8.42c-.13.23-.07.52.14.68l2.32 1.82c-.04.34-.07.68-.07 1.08s.03.74.07 1.08L1.94 14.9c-.21.16-.27.45-.14.68l2.2 3.81c.13.23.41.31.65.23l2.73-1.1c.57.44 1.17.8 1.84 1.07l.41 2.51c.04.25.26.4.51.4h4.4c.25 0 .47-.15.51-.4l.41-2.51c.67-.27 1.27-.63 1.84-1.07l2.73 1.1c.24.08.52 0 .65-.23l2.2-3.81c.13-.23.07-.52-.14-.68l-2.32-1.82z"/>
            </svg>
          </button>
        </div>
      )}

      <div className="container" style={{ marginTop: '-4rem' }}>
        <header style={{
          marginBottom: '-4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <img
              src={logo}
              alt="Automotor.co"
              style={{ height: '280px', display: 'block' }}
            />
            <div style={{ height: '100px', width: '2px', background: '#e0e0e0', borderRadius: '2px' }} />
            <p style={{
              margin: 0,
              fontSize: '2rem',
              color: '#495057',
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}>
              App de Mantenimiento
            </p>
          </div>

          {(role === 'admin' || role === 'editor') && (
            <div className="flex gap-md items-center">
              <button
                onClick={handleBack}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'var(--bg-color)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Volver a Vista Asesor
              </button>
            </div>
          )}
        </header>

        <main>
          {role === 'advisor' && <AdvisorDashboard />}
          {role === 'admin' && <AdminDashboard />}
          {role === 'editor' && <EditorDashboard />}
        </main>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />

        {role === 'advisor' && <IssueReporter />}
      </div>
    </>
  );
}

function App() {
  return (
    <MaintenanceProvider>
      <AppContent />
    </MaintenanceProvider>
  );
}

export default App;
