import { useState } from 'react';
import VehicleSelector from './VehicleSelector';
import MaintenanceSelector from './MaintenanceSelector';
import CostSummary from './CostSummary';
import DetailList from './DetailList';
import AccesoriosCatalogo from './AccesoriosCatalogo';
import './Advisor.css';

export default function AdvisorDashboard() {
    const [mostrarCatalogo, setMostrarCatalogo] = useState(false);

    if (mostrarCatalogo) {
        return (
            <div style={{ paddingBottom: '4rem' }}>
                <AccesoriosCatalogo onBack={() => setMostrarCatalogo(false)} />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div className="flex flex-col gap-md">
                <VehicleSelector />
                <MaintenanceSelector />
                <CostSummary />
                <DetailList />

                {/* Botón de acceso al catálogo de accesorios */}
                <div
                    onClick={() => setMostrarCatalogo(true)}
                    style={{
                        marginTop: '0.5rem',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,44,95,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                >
                    {/* Franja superior de color */}
                    <div style={{
                        height: '6px',
                        background: 'linear-gradient(90deg, #002c5f 0%, #2563eb 60%, #60a5fa 100%)'
                    }} />

                    {/* Contenido principal */}
                    <div style={{
                        padding: '1.75rem 1.75rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1.25rem'
                    }}>
                        {/* Ícono + texto */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Automotor.co
                                </p>
                                <h3 style={{ margin: '0.2rem 0 0.3rem', color: '#0f172a', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>
                                    Catálogo de Accesorios Hyundai
                                </h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                                    Alarmas · Polarizados · Cámaras · Tapetes · Barras de techo y más
                                </p>
                            </div>
                        </div>

                        {/* Botón CTA */}
                        <div style={{
                            background: 'linear-gradient(135deg, #002c5f 0%, #2563eb 100%)',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 8px rgba(0,44,95,0.3)'
                        }}>
                            Ver catálogo →
                        </div>
                    </div>

                    {/* Fila de categorías */}
                    <div style={{
                        padding: '0.75rem 1.75rem',
                        borderTop: '1px solid #f1f5f9',
                        background: '#f8fafc',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { emoji: '🔒', label: 'Seguridad' },
                            { emoji: '🌫️', label: 'Polarizados' },
                            { emoji: '📷', label: 'Cámaras' },
                            { emoji: '🚗', label: 'Exterior' },
                            { emoji: '🪑', label: 'Interior' },
                            { emoji: '📦', label: 'Transporte' },
                            { emoji: '🔑', label: 'Llave' },
                        ].map(cat => (
                            <span key={cat.label} style={{
                                fontSize: '0.78rem',
                                color: '#475569',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '20px',
                                padding: '3px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                {cat.emoji} {cat.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
