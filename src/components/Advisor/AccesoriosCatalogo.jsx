import { useState } from 'react';
import { useMaintenance } from '../../context/MaintenanceContext';
import { CATEGORIAS_ACCESORIOS } from '../../data/accesoriosData';
import { formatCurrency } from '../../utils/format';

// Iconos SVG por categoría
const CategoryIcon = ({ categoriaId }) => {
    const icons = {
        seguridad: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        polarizados: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
        ),
        camaras: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
        exterior: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
        interior: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        transporte: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
        llave: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
        ),
    };
    return icons[categoriaId] || null;
};

const COLORES_CATEGORIA = {
    seguridad: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '#fee2e2' },
    polarizados: { bg: '#f0f9ff', border: '#bae6fd', text: '#0284c7', badge: '#e0f2fe' },
    camaras: { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a', badge: '#dcfce7' },
    exterior: { bg: '#fdf4ff', border: '#e9d5ff', text: '#9333ea', badge: '#f3e8ff' },
    interior: { bg: '#fffbeb', border: '#fde68a', text: '#d97706', badge: '#fef3c7' },
    transporte: { bg: '#fff7ed', border: '#fed7aa', text: '#ea580c', badge: '#ffedd5' },
    llave: { bg: '#f8fafc', border: '#cbd5e1', text: '#475569', badge: '#f1f5f9' },
};

export default function AccesoriosCatalogo({ onBack }) {
    const { accesorios } = useMaintenance();
    const [categoriaActiva, setCategoriaActiva] = useState('todas');
    const [busqueda, setBusqueda] = useState('');

    const accesoriosFiltrados = accesorios.filter(acc => {
        const matchCategoria = categoriaActiva === 'todas' || acc.categoriaId === categoriaActiva;
        const matchBusqueda = !busqueda ||
            acc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            acc.aplicaPara.toLowerCase().includes(busqueda.toLowerCase()) ||
            acc.referencia.toLowerCase().includes(busqueda.toLowerCase());
        return matchCategoria && matchBusqueda;
    });

    const totalCategoria = (catId) => accesorios.filter(a => a.categoriaId === catId).length;

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Header del catálogo */}
            <div style={{
                borderRadius: '16px',
                marginBottom: '2rem',
                overflow: 'hidden',
                border: '1px solid #bfdbfe',
                boxShadow: '0 4px 20px rgba(37,99,235,0.1)'
            }}>
                {/* Franja superior decorativa */}
                <div style={{
                    height: '5px',
                    background: 'linear-gradient(90deg, #002c5f 0%, #2563eb 50%, #60a5fa 100%)'
                }} />

                {/* Área principal con gradiente azul claro */}
                <div style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 60%, #bfdbfe 100%)',
                    padding: '2rem 2.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Círculos decorativos sutiles */}
                    <div style={{
                        position: 'absolute', top: '-50px', right: '-30px',
                        width: '220px', height: '220px', borderRadius: '50%',
                        background: 'rgba(37,99,235,0.07)'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-70px', right: '80px',
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: 'rgba(37,99,235,0.05)'
                    }} />

                    {/* Botón volver */}
                    <button
                        onClick={onBack}
                        style={{
                            background: 'white',
                            border: '1px solid #bfdbfe',
                            color: '#2563eb',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}
                    >
                        ← Volver
                    </button>

                    {/* Contenido del header */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <p style={{ margin: '0 0 0.3rem', fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Automotor.co
                            </p>
                            <h1 style={{ margin: '0 0 0.4rem', fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                                Catálogo de Accesorios
                            </h1>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
                                Accesorios originales Hyundai · Precios con IVA incluido
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Buscador */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', maxWidth: '480px' }}>
                    <svg
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, referencia o vehículo..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.95rem',
                            backgroundColor: 'white',
                            boxSizing: 'border-box',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                    />
                </div>
            </div>

            {/* Filtros de categoría */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '2rem'
            }}>
                <button
                    onClick={() => setCategoriaActiva('todas')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1.5px solid',
                        borderColor: categoriaActiva === 'todas' ? '#002c5f' : '#e2e8f0',
                        background: categoriaActiva === 'todas' ? '#002c5f' : 'white',
                        color: categoriaActiva === 'todas' ? 'white' : '#64748b',
                        fontWeight: categoriaActiva === 'todas' ? 600 : 500,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s'
                    }}
                >
                    Todos ({accesorios.length})
                </button>
                {CATEGORIAS_ACCESORIOS.map(cat => {
                    const colores = COLORES_CATEGORIA[cat.id] || COLORES_CATEGORIA.llave;
                    const activo = categoriaActiva === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setCategoriaActiva(cat.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1.5px solid',
                                borderColor: activo ? colores.text : '#e2e8f0',
                                background: activo ? colores.text : 'white',
                                color: activo ? 'white' : '#64748b',
                                fontWeight: activo ? 600 : 500,
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s'
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{cat.icono}</span>
                            {cat.nombre} ({totalCategoria(cat.id)})
                        </button>
                    );
                })}
            </div>

            {/* Grid de productos */}
            {accesoriosFiltrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No se encontraron accesorios</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Intenta con otro término de búsqueda</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {accesoriosFiltrados.map(acc => {
                        const colores = COLORES_CATEGORIA[acc.categoriaId] || COLORES_CATEGORIA.llave;
                        const catInfo = CATEGORIAS_ACCESORIOS.find(c => c.id === acc.categoriaId);
                        return (
                            <div
                                key={acc.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Franja de color superior */}
                                <div style={{
                                    height: '6px',
                                    background: `linear-gradient(90deg, ${colores.text}, ${colores.text}aa)`
                                }} />

                                {/* Área de imagen */}
                                <div style={{
                                    height: '160px',
                                    background: colores.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {acc.imagen
                                        ? <img
                                            src={acc.imagen}
                                            alt={acc.nombre}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          />
                                        : <div style={{ opacity: 0.4, transform: 'scale(2.5)', color: colores.text }}>
                                            <CategoryIcon categoriaId={acc.categoriaId} />
                                          </div>
                                    }
                                </div>

                                {/* Contenido */}
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Badge categoría */}
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: colores.text,
                                            background: colores.badge,
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {catInfo?.icono} {catInfo?.nombre}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        margin: '0 0 0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        lineHeight: 1.3
                                    }}>
                                        {acc.nombre}
                                    </h3>

                                    <p style={{
                                        margin: '0 0 0.75rem',
                                        fontSize: '0.85rem',
                                        color: '#64748b',
                                        lineHeight: 1.5,
                                        flex: 1
                                    }}>
                                        {acc.descripcion}
                                    </p>

                                    {/* Aplica para */}
                                    <div style={{
                                        fontSize: '0.78rem',
                                        color: '#94a3b8',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '5px'
                                    }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
                                            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                        </svg>
                                        <span>{acc.aplicaPara}</span>
                                    </div>

                                    {/* Precio */}
                                    <div style={{
                                        borderTop: '1px solid #f1f5f9',
                                        paddingTop: '1rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#002c5f' }}>
                                                {formatCurrency(acc.precio)}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>
                                                IVA incluido
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.72rem',
                                            color: '#94a3b8',
                                            textAlign: 'right',
                                            fontFamily: 'monospace'
                                        }}>
                                            Ref: {acc.referencia}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pie de página */}
            <div style={{
                marginTop: '3rem',
                padding: '1rem',
                borderTop: '1px solid #e2e8f0',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#94a3b8'
            }}>
                Precios válidos del 1 de abril al 30 de junio de 2026. Aplican términos y condiciones.
            </div>
        </div>
    );
}
