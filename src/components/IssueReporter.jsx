import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';

const IssueReporter = () => {
    const { addIssue } = useMaintenance();
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim() || !email.trim()) return;

        addIssue(description, email);
        setSubmitted(true);
        setDescription('');

        // Auto close after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setIsOpen(false);
        }, 3000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: '#dc3545', // Red for "Problem"
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    zIndex: 1000
                }}
            >
                ⚠ ¿Hay algún problema?
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            width: '300px',
            zIndex: 1000,
            border: '1px solid #ddd'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#333' }}>Reportar Problema</h4>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}
                >
                    ×
                </button>
            </div>

            {submitted ? (
                <div style={{ color: 'green', textAlign: 'center', padding: '20px 0' }}>
                    ✅ ¡Gracias! Tu reporte ha sido enviado al administrador.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo (para responderte)"
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontFamily: 'inherit'
                        }}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe el problema aquí..."
                        style={{
                            width: '100%',
                            height: '100px',
                            marginBottom: '10px',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            resize: 'none',
                            fontFamily: 'inherit'
                        }}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!description.trim()}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: description.trim() ? 'var(--primary-color)' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: description.trim() ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold'
                        }}
                    >
                        Enviar Reporte
                    </button>
                </form>
            )}
        </div>
    );
};

export default IssueReporter;
