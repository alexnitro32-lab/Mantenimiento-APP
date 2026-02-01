import { useState } from 'react';
import { MaintenanceProvider } from './context/MaintenanceContext';
import AdvisorDashboard from './components/Advisor/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import LoginModal from './components/Auth/LoginModal';
import IssueReporter from './components/IssueReporter';
import logo from './assets/logo.png';

function App() {
  const [role, setRole] = useState('advisor'); // 'advisor' | 'admin'
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAdminClick = () => {
    if (role === 'admin') {
      return; // Already admin
    }
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setRole('admin');
    setShowLoginModal(false);
  };

  return (
    <MaintenanceProvider>
      <div className="container" style={{ marginTop: '-4rem' }}> {/* Margen negativo AGRESIVO */}
        <header style={{
          marginBottom: '-4rem', // Margen negativo AGRESIVO
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div
              onClick={handleAdminClick}
              style={{
                cursor: 'default',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem' // Espacio entre logo y texto
              }}
            >
              <img
                src={logo}
                alt="Automotor.co"
                style={{
                  height: '280px',
                  display: 'block'
                }}
              />
              <div style={{ height: '100px', width: '2px', background: '#e0e0e0', borderRadius: '2px' }}></div> {/* Separador alto */}
              <p style={{
                margin: 0,
                fontSize: '2rem', // Texto acorde al logo gigante
                color: '#495057', // Gris oscuro profesional
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
                letterSpacing: '-0.5px'
              }}>
                App de Mantenimiento
              </p>
            </div>

          </div>

          {role === 'admin' && (
            <div className="flex gap-md items-center">
              <button
                onClick={() => setRole('advisor')}
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
          {role === 'advisor' ? <AdvisorDashboard /> : <AdminDashboard />}
        </main>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />

        {/* Helper for Advisors to report bugs/requests */}
        {role === 'advisor' && <IssueReporter />}
      </div>
    </MaintenanceProvider>
  )
}

export default App
