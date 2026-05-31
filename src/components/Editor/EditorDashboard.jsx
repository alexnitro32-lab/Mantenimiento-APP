import { useState } from 'react';
import { useMaintenance } from '../../context/MaintenanceContext';
import { CATEGORIAS_ACCESORIOS } from '../../data/accesoriosData';
import { formatCurrency } from '../../utils/format';

const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
};

const tabBtnStyle = (active) => ({
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    background: active ? 'white' : 'transparent',
    color: active ? 'var(--primary-color)' : '#64748b',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    fontSize: '0.9rem',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.15s'
});

function RepuestoRow({ part, onSave }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: part.name, price: part.price });

    const handleSave = () => {
        onSave(part.reference, form);
        setEditing(false);
    };

    return (
        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '0.75rem', fontWeight: 500, color: '#64748b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {part.reference}
            </td>
            {editing ? (
                <>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                        <input
                            style={{ ...inputStyle, padding: '4px 8px' }}
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                        <input
                            type="number"
                            style={{ ...inputStyle, padding: '4px 8px', textAlign: 'right', width: '120px' }}
                            value={form.price}
                            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                        />
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            <button onClick={handleSave} style={{ padding: '4px 10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Guardar</button>
                            <button onClick={() => { setEditing(false); setForm({ name: part.name, price: part.price }); }} style={{ padding: '4px 10px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Cancelar</button>
                        </div>
                    </td>
                </>
            ) : (
                <>
                    <td style={{ padding: '0.75rem' }}>{part.name}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                        {formatCurrency(part.price)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                            onClick={() => setEditing(true)}
                            style={{ padding: '4px 12px', background: 'none', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Editar
                        </button>
                    </td>
                </>
            )}
        </tr>
    );
}

function AccesorioRow({ acc, onSave }) {
    const [editing, setEditing] = useState(false);
    const [precio, setPrecio] = useState(acc.precio);

    const handleSave = () => {
        onSave(acc.id, precio);
        setEditing(false);
    };

    return (
        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '0.6rem 0.75rem', fontWeight: 500, color: '#1e293b' }}>
                <div>{acc.nombre}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{acc.referencia}</div>
            </td>
            <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.83rem', color: '#64748b' }}>{acc.aplicaPara}</td>
            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>
                {editing ? (
                    <input
                        type="number"
                        value={precio}
                        onChange={e => setPrecio(Number(e.target.value))}
                        style={{ width: '120px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'right', fontSize: '0.9rem' }}
                        autoFocus
                    />
                ) : (
                    <span style={{ fontWeight: 600, color: '#002c5f' }}>{formatCurrency(acc.precio)}</span>
                )}
            </td>
            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                {editing ? (
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button onClick={handleSave} style={{ padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Guardar</button>
                        <button onClick={() => { setEditing(false); setPrecio(acc.precio); }} style={{ padding: '4px 8px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} style={{ padding: '4px 8px', background: 'none', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Editar
                    </button>
                )}
            </td>
        </tr>
    );
}

export default function EditorDashboard() {
    const { parts, vehicleLines, updatePartsByReference, accesorios, updateAccesorioPrecio } = useMaintenance();
    const [activeTab, setActiveTab] = useState('repuestos');
    const [search, setSearch] = useState('');

    const generalPartsList = Object.values(
        parts
            .filter(part => vehicleLines.some(line => String(line.id) === String(part.lineId)))
            .reduce((acc, part) => {
                if (!acc[part.reference]) acc[part.reference] = part;
                return acc;
            }, {})
    )
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(part =>
            !search ||
            part.name.toLowerCase().includes(search.toLowerCase()) ||
            part.reference.toLowerCase().includes(search.toLowerCase())
        );

    const accesoriosFiltrados = accesorios.filter(acc =>
        !search ||
        acc.nombre.toLowerCase().includes(search.toLowerCase()) ||
        acc.referencia.toLowerCase().includes(search.toLowerCase()) ||
        acc.aplicaPara.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    Editor de Precios
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Edita precios de repuestos y accesorios. Los cambios se aplican en tiempo real.
                </p>
            </div>

            <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#1e40af'
            }}>
                <strong>Acceso restringido:</strong> Solo puedes editar precios y descripciones. No puedes crear ni eliminar registros.
            </div>

            {/* Pestañas */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem', width: 'fit-content' }}>
                <button style={tabBtnStyle(activeTab === 'repuestos')} onClick={() => { setActiveTab('repuestos'); setSearch(''); }}>
                    Repuestos ({Object.values(parts.filter(p => vehicleLines.some(l => String(l.id) === String(p.lineId))).reduce((a, p) => { if (!a[p.reference]) a[p.reference] = p; return a; }, {})).length})
                </button>
                <button style={tabBtnStyle(activeTab === 'accesorios')} onClick={() => { setActiveTab('accesorios'); setSearch(''); }}>
                    Accesorios ({accesorios.length})
                </button>
            </div>

            {/* Buscador */}
            <div style={{ marginBottom: '1.25rem' }}>
                <input
                    type="text"
                    placeholder={activeTab === 'repuestos' ? 'Buscar por nombre o referencia...' : 'Buscar por nombre, referencia o vehículo...'}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...inputStyle, maxWidth: '400px' }}
                />
            </div>

            {/* Tabla repuestos */}
            {activeTab === 'repuestos' && (
                <>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>Referencia</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>Descripción</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>Precio</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generalPartsList.length === 0 ? (
                                    <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No se encontraron repuestos</td></tr>
                                ) : (
                                    generalPartsList.map(part => (
                                        <RepuestoRow key={part.reference} part={part} onSave={updatePartsByReference} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
                        {generalPartsList.length} repuesto{generalPartsList.length !== 1 ? 's' : ''}
                    </div>
                </>
            )}

            {/* Tabla accesorios por categoría */}
            {activeTab === 'accesorios' && (
                <>
                    {CATEGORIAS_ACCESORIOS.map(cat => {
                        const items = accesoriosFiltrados.filter(a => a.categoriaId === cat.id);
                        if (items.length === 0) return null;
                        return (
                            <div key={cat.id} style={{ marginBottom: '2rem' }}>
                                <h4 style={{ margin: '0 0 0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>{cat.icono}</span> {cat.nombre}
                                </h4>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead style={{ background: '#f8fafc' }}>
                                            <tr>
                                                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Accesorio</th>
                                                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Aplica para</th>
                                                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600, width: '160px' }}>Precio</th>
                                                <th style={{ padding: '0.6rem 0.75rem', width: '80px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(acc => (
                                                <AccesorioRow key={acc.id} acc={acc} onSave={updateAccesorioPrecio} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                    {accesoriosFiltrados.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No se encontraron accesorios</div>
                    )}
                </>
            )}
        </div>
    );
}
