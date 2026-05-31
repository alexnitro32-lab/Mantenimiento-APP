import { useState } from 'react';

const ADMIN_PASSWORD = 'Automotor.2026#';
const EDITOR_EMAIL = 'editor@automotor.co';
const EDITOR_PASSWORD = 'Repuestos.2026#';

export default function LoginModal({ isOpen, onClose, onLogin }) {
    const [mode, setMode] = useState('admin'); // 'admin' | 'editor'
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'admin') {
            if (password === ADMIN_PASSWORD) {
                onLogin('admin');
                resetForm();
                onClose();
            } else {
                setError('Contraseña incorrecta');
            }
        } else {
            if (email === EDITOR_EMAIL && password === EDITOR_PASSWORD) {
                onLogin('editor');
                resetForm();
                onClose();
            } else {
                setError('Correo o contraseña incorrectos');
            }
        }
    };

    const resetForm = () => {
        setPassword('');
        setEmail('');
        setError('');
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setError('');
        setPassword('');
        setEmail('');
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{
                    marginTop: 0,
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-primary)'
                }}>
                    Acceso al Sistema
                </h2>

                {/* Selector de modo */}
                <div style={{
                    display: 'flex',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '4px',
                    marginBottom: '1.5rem'
                }}>
                    <button
                        type="button"
                        onClick={() => handleModeChange('admin')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: mode === 'admin' ? 'white' : 'transparent',
                            color: mode === 'admin' ? 'var(--primary-color)' : '#64748b',
                            fontWeight: mode === 'admin' ? 600 : 500,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            boxShadow: mode === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Administrador
                    </button>
                    <button
                        type="button"
                        onClick={() => handleModeChange('editor')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: mode === 'editor' ? 'white' : 'transparent',
                            color: mode === 'editor' ? 'var(--primary-color)' : '#64748b',
                            fontWeight: mode === 'editor' ? 600 : 500,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            boxShadow: mode === 'editor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Editor de Precios
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'editor' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                Correo
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-input)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                autoFocus
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-input)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                            autoFocus={mode === 'admin'}
                        />
                        {error && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '0.875rem',
                                marginTop: '0.5rem'
                            }}>
                                {error}
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => { onClose(); resetForm(); }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'transparent',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
