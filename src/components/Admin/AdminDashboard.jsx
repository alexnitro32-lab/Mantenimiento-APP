import { useState, useEffect } from 'react';
import { useMaintenance, calculateAvailableMaintenances } from '../../context/MaintenanceContext';
import { MOCK_MAINTENANCES } from '../../data/mockData';
import { formatCurrency } from '../../utils/format';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('global');
    const {
        parts,
        laborActivities,
        globalLaborRate,
        supplies,
        crossSellItems,
        maintenanceDefinitions,
        updatePart,
        addPart,
        deletePart,
        getPartsByLine,
        vehicleLines,
        updateGlobalLaborRate,
        updateLaborActivity,
        addLaborActivity,
        deleteLaborActivity,
        updateSupply,
        updateCrossSellItem,
        addCrossSellItem,
        deleteCrossSellItem,
        updateMaintenanceDefinition,
        resolveMaintenanceDefinition,
        updatePartsByReference,
        issues,
        deleteIssue,
        brands,
        addBrand,
        updateBrand,
        addVehicleLine,
        updateVehicleLine,
        deleteVehicleLine
    } = useMaintenance();

    // --- Local State for Forms ---
    const [newPart, setNewPart] = useState({ name: '', reference: '', price: 0 });
    const [newActivity, setNewActivity] = useState({ description: '', hours: 0 });
    const [newCrossSell, setNewCrossSell] = useState({ name: '', price: 0 });

    // --- Edit State for Labor Activities ---
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [editActivityForm, setEditActivityForm] = useState({ description: '', hours: 0 });

    // --- Parts Catalog Line Selection ---
    const [selectedPartsLine, setSelectedPartsLine] = useState('');
    const [catViewMode, setCatViewMode] = useState('line'); // 'line' or 'general'

    // --- Local State for Configurator ---
    const [confBrandId, setConfBrandId] = useState('');
    const [confLineId, setConfLineId] = useState('');
    const [confMaintId, setConfMaintId] = useState('');
    const [confServiceType, setConfServiceType] = useState('particular');
    const [tempDefinition, setTempDefinition] = useState({ laborIds: [], supplyIds: [], parts: [] });

    // --- Vehicle Management State ---
    const [newVehicle, setNewVehicle] = useState({
        brandId: '',
        customBrandName: '',
        name: '',
        freqType: '10k' // '5k' or '10k'
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [editingVehicleId, setEditingVehicleId] = useState(null);

    // --- Brand Management State ---
    const [editingBrandId, setEditingBrandId] = useState(null);
    const [editingBrandName, setEditingBrandName] = useState('');

    useEffect(() => {
        if (confLineId && confMaintId) {
            // Use the resolver to respect inheritance directly in the UI
            const existing = resolveMaintenanceDefinition(confLineId, confMaintId);
            // resolveMaintenanceDefinition always returns a default object if empty, so we just set it
            setTempDefinition({
                laborIds: existing.laborIds || [],
                supplyIds: existing.supplyIds || [],
                parts: existing.parts || []
            });
        }
    }, [confLineId, confMaintId, maintenanceDefinitions]);

    // --- Handlers ---
    const handleAddPart = (e) => {
        e.preventDefault();
        if (!newPart.name || !newPart.reference || !selectedPartsLine) {
            alert('Por favor completa todos los campos y selecciona una línea de vehículo.');
            return;
        }
        addPart({ ...newPart, lineId: selectedPartsLine, allocations: [] });
        setNewPart({ name: '', reference: '', price: 0 });
    };

    const handleAddActivity = (e) => {
        e.preventDefault();
        if (!newActivity.description) return;
        addLaborActivity(newActivity);
        setNewActivity({ description: '', hours: 0 });
    };

    const handleAddCrossSell = (e) => {
        e.preventDefault();
        if (!newCrossSell.name) return;
        addCrossSellItem(newCrossSell);
        setNewCrossSell({ name: '', price: 0 });
    };

    const confirmDeletePart = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este repuesto? Se eliminará de todas las configuraciones.')) {
            deletePart(id);
        }
    };

    const confirmDeleteLabor = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta actividad? Se eliminará de todas las configuraciones.')) {
            deleteLaborActivity(id);
        }
    };

    const confirmDeleteCrossSell = (id) => {
        if (window.confirm('¿Eliminar item de venta cruzada?')) {
            deleteCrossSellItem(id);
        }
    };

    // --- Labor Activity Edit Handlers ---
    const handleEditActivityClick = (activity) => {
        setEditingActivityId(activity.id);
        setEditActivityForm({ description: activity.description, hours: activity.hours });
    };

    const handleSaveActivityEdit = (id) => {
        updateLaborActivity(id, editActivityForm);
        setEditingActivityId(null);
    };

    const handleCancelActivityEdit = () => {
        setEditingActivityId(null);
    };

    const handleConfigToggleLabor = (laborId) => {
        setTempDefinition(prev => {
            const exists = prev.laborIds.includes(laborId);
            return {
                ...prev,
                laborIds: exists
                    ? prev.laborIds.filter(id => id !== laborId)
                    : [...prev.laborIds, laborId]
            };
        });
    };

    const handleConfigToggleSupply = (supplyId) => {
        setTempDefinition(prev => {
            const exists = prev.supplyIds.includes(supplyId);
            return {
                ...prev,
                supplyIds: exists
                    ? prev.supplyIds.filter(id => id !== supplyId)
                    : [...prev.supplyIds, supplyId]
            };
        });
    };

    const handleConfigTogglePart = (partId) => {
        setTempDefinition(prev => {
            const exists = prev.parts.some(p => p.id === partId);
            if (exists) {
                return {
                    ...prev,
                    parts: prev.parts.filter(p => p.id !== partId)
                };
            } else {
                return {
                    ...prev,
                    parts: [...prev.parts, { id: partId, quantity: 1 }]
                };
            }
        });
    };

    const handleConfigQuantityChange = (partId, qty) => {
        setTempDefinition(prev => ({
            ...prev,
            parts: prev.parts.map(p => p.id === partId ? { ...p, quantity: qty } : p)
        }));
    };

    const saveConfiguration = () => {
        if (confLineId && confMaintId) {
            updateMaintenanceDefinition(confLineId, confMaintId, tempDefinition);
            alert('¡Configuración Guardada!');
        }
    };

    // --- Styles ---
    const tabStyle = (tabName) => ({
        padding: '0.75rem 1rem',
        borderBottom: activeTab === tabName ? '2px solid var(--primary-color)' : '2px solid transparent',
        color: activeTab === tabName ? 'var(--primary-color)' : 'var(--text-secondary)',
        fontWeight: 600,
        background: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem'
    });

    const inputStyle = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', width: '100%' };
    const btnStyle = { padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const deleteBtnStyle = { marginLeft: '1rem', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' };

    // --- Edit State ---
    const [editingPartId, setEditingPartId] = useState(null);
    const [editPartForm, setEditPartForm] = useState({ name: '', reference: '', price: 0 });

    const handleEditClick = (part) => {
        setEditingPartId(part.id);
        setEditPartForm({ name: part.name, reference: part.reference, price: part.price });
    };

    const handleCancelEdit = () => {
        setEditingPartId(null);
        setEditPartForm({ name: '', reference: '', price: 0 });
    };

    const handleSaveEdit = (id) => {
        updatePart(id, editPartForm);
        setEditingPartId(null);
    };

    // Helper for formatting
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // --- GENERAL PARTS LOGIC ---
    const [editingGeneralPartRef, setEditingGeneralPartRef] = useState(null);
    const [generalPartForm, setGeneralPartForm] = useState({ name: '', price: 0 });

    // Group parts by reference for "General Parts" view
    // Only include parts from vehicle lines that still exist
    const generalPartsList = Object.values(
        parts
            // Filter to show only parts belonging to existing lines (hides orphans from deleted lines)
            // Using String check to ensure type safety between IDs
            .filter(part => vehicleLines.some(line => String(line.id) === String(part.lineId)))
            .reduce((acc, part) => {
                if (!acc[part.reference]) {
                    acc[part.reference] = part;
                }
                return acc;
            }, {})
    ).sort((a, b) => a.name.localeCompare(b.name));

    const handleEditGeneralClick = (part) => {
        setEditingGeneralPartRef(part.reference);
        setGeneralPartForm({ name: part.name, price: part.price });
    };

    const handleSaveGeneralEdit = (reference) => {
        updatePartsByReference(reference, generalPartForm);
        setEditingGeneralPartRef(null);
    };

    return (
        <div>
            {/* ... keeping existing structure until parts list ... */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    <button style={tabStyle('global')} onClick={() => setActiveTab('global')}>Global / Mano de Obra</button>
                    <button style={tabStyle('cat_parts')} onClick={() => setActiveTab('cat_parts')}>Catálogo Repuestos</button>
                    <button style={tabStyle('cross_sell')} onClick={() => setActiveTab('cross_sell')}>Venta Cruzada</button>
                    <button style={tabStyle('config')} onClick={() => setActiveTab('config')}>Configurador Recetas</button>
                    <button style={tabStyle('vehicles')} onClick={() => setActiveTab('vehicles')}>Vehículos</button>
                    <button style={tabStyle('reports')} onClick={() => setActiveTab('reports')}>Reportes</button>
                </div>

                {activeTab === 'global' && (
                    <div>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Configuración Global</h3>

                        {/* Global Labor Rate */}
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Valor Hora Mano de Obra (Global)</label>
                                    <div style={{ display: 'flex', gap: '1rem', maxWidth: '400px' }}>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            value={globalLaborRate}
                                            onChange={(e) => updateGlobalLaborRate(Number(e.target.value))}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#666' }}>COP</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Labor Activities Section */}
                            <div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Actividades de Mano de Obra</h4>
                                <form onSubmit={handleAddActivity} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        placeholder="Nueva actividad..."
                                        required
                                        style={{ ...inputStyle, flex: 2 }}
                                        value={newActivity.description}
                                        onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Hrs"
                                        required
                                        step="0.1"
                                        style={{ ...inputStyle, flex: 1 }}
                                        value={newActivity.hours || ''}
                                        onChange={e => setNewActivity({ ...newActivity, hours: Number(e.target.value) })}
                                    />
                                    <button type="submit" style={btnStyle}>+</button>
                                </form>
                                <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                                    {laborActivities.map(act => (
                                        <div key={act.id} style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                            {editingActivityId === act.id ? (
                                                <>
                                                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <input
                                                            style={{ flex: 2, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem' }}
                                                            value={editActivityForm.description}
                                                            onChange={e => setEditActivityForm({ ...editActivityForm, description: e.target.value })}
                                                            placeholder="Descripción"
                                                        />
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem' }}
                                                            value={editActivityForm.hours}
                                                            onChange={e => setEditActivityForm({ ...editActivityForm, hours: Number(e.target.value) })}
                                                            placeholder="Hrs"
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleSaveActivityEdit(act.id)}
                                                            style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={handleCancelActivityEdit}
                                                            style={{ padding: '0.5rem 1rem', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 500 }}>{act.description}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{act.hours} horas</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleEditActivityClick(act)}
                                                            style={{ padding: '0.5rem 1rem', background: 'none', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                            title="Editar"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            onClick={() => confirmDeleteLabor(act.id)}
                                                            title="Eliminar"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Supplies Section */}
                            <div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Insumos / Servicios Fijos</h4>
                                <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                                    {supplies.map(sup => (
                                        <div key={sup.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{sup.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    style={inputStyle}
                                                    value={sup.price}
                                                    onChange={(e) => updateSupply(sup.id, Number(e.target.value))}
                                                />
                                                <span style={{ fontSize: '0.8rem', color: '#666' }}>COP</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* ... CATALOG PARTS TAB ... */}
                {
                    activeTab === 'cat_parts' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0 }}>Catálogo Repuestos</h3>

                                {/* Sub-navigation for Parts Catalog */}
                                <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '6px' }}>
                                    <button
                                        onClick={() => setCatViewMode('line')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: catViewMode === 'line' ? 'white' : 'transparent',
                                            color: catViewMode === 'line' ? 'var(--primary-color)' : '#64748b',
                                            fontWeight: catViewMode === 'line' ? 600 : 500,
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            boxShadow: catViewMode === 'line' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        Por Línea de Vehículo
                                    </button>
                                    <button
                                        onClick={() => setCatViewMode('general')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: catViewMode === 'general' ? 'white' : 'transparent',
                                            color: catViewMode === 'general' ? 'var(--primary-color)' : '#64748b',
                                            fontWeight: catViewMode === 'general' ? 600 : 500,
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            boxShadow: catViewMode === 'general' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        Vista General (Todos)
                                    </button>
                                </div>
                            </div>

                            {catViewMode === 'line' ? (
                                /* --- EXISTING BY-LINE VIEW --- */
                                <>
                                    {/* Vehicle Line Selector */}
                                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e40af' }}>Selecciona una Línea de Vehículo</label>
                                        <select
                                            style={{ ...inputStyle, fontSize: '1rem', fontWeight: 500 }}
                                            value={selectedPartsLine}
                                            onChange={e => setSelectedPartsLine(e.target.value)}
                                        >
                                            <option value="">-- Seleccionar Línea --</option>
                                            {vehicleLines.map(line => (
                                                <option key={line.id} value={line.id}>{line.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedPartsLine ? (
                                        <>
                                            <form onSubmit={handleAddPart} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Referencia</label>
                                                        <input placeholder="REF-123" required style={inputStyle} value={newPart.reference} onChange={e => setNewPart({ ...newPart, reference: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Nombre</label>
                                                        <input placeholder="Filtro..." required style={inputStyle} value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Precio</label>
                                                        <input type="number" required style={inputStyle} value={newPart.price || ''} onChange={e => setNewPart({ ...newPart, price: Number(e.target.value) })} />
                                                    </div>
                                                    <button type="submit" style={btnStyle}>Agregar</button>
                                                </div>
                                            </form>
                                            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', maxHeight: '500px', overflowY: 'auto' }}>
                                                {getPartsByLine(selectedPartsLine).length > 0 ? (
                                                    getPartsByLine(selectedPartsLine).map(item => (
                                                        <div key={item.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            {editingPartId === item.id ? (
                                                                <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <input
                                                                            style={inputStyle}
                                                                            value={editPartForm.reference}
                                                                            onChange={(e) => setEditPartForm({ ...editPartForm, reference: e.target.value })}
                                                                            placeholder="Referencia"
                                                                        />
                                                                    </div>
                                                                    <div style={{ flex: 2 }}>
                                                                        <input
                                                                            style={inputStyle}
                                                                            value={editPartForm.name}
                                                                            onChange={(e) => setEditPartForm({ ...editPartForm, name: e.target.value })}
                                                                            placeholder="Nombre"
                                                                        />
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <input
                                                                            type="number"
                                                                            style={inputStyle}
                                                                            value={editPartForm.price}
                                                                            onChange={(e) => setEditPartForm({ ...editPartForm, price: Number(e.target.value) })}
                                                                            placeholder="Precio"
                                                                        />
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                        <button
                                                                            onClick={() => handleSaveEdit(item.id)}
                                                                            style={{ padding: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                            title="Guardar"
                                                                        >
                                                                            💾
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancelEdit}
                                                                            style={{ padding: '0.5rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                            title="Cancelar"
                                                                        >
                                                                            ❌
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div>
                                                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.reference}</div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0f172a' }}>
                                                                            {formatCurrency(item.price)}
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                            <button
                                                                                onClick={() => handleEditClick(item)}
                                                                                style={{ padding: '0.4rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                title="Editar"
                                                                            >
                                                                                ✏️
                                                                            </button>
                                                                            <button style={deleteBtnStyle} onClick={() => confirmDeletePart(item.id)} title="Eliminar">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                                        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No hay repuestos para esta línea</p>
                                                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Agrega el primer repuesto usando el formulario arriba</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Selecciona una línea de vehículo</p>
                                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Elige una línea arriba para ver y gestionar sus repuestos</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* --- GENERAL PARTS VIEW (MOVED HERE) --- */
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem', background: '#f0f9ff', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
                                        <strong>Modo Global:</strong> Aquí puede editar la descripción y precios de los repuestos de forma masiva.
                                        Los cambios se aplicarán a <strong>todos los vehículos</strong> que usen la misma referencia.
                                    </p>

                                    <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                                                <tr>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Referencia</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Descripción</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Precio</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {generalPartsList.map((part) => (
                                                    <tr key={part.reference} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '0.75rem', fontWeight: 500, color: '#666' }}>{part.reference}</td>
                                                        {editingGeneralPartRef === part.reference ? (
                                                            <>
                                                                <td style={{ padding: '0.75rem' }}>
                                                                    <input
                                                                        style={{ ...inputStyle, padding: '4px 8px' }}
                                                                        value={generalPartForm.name}
                                                                        onChange={e => setGeneralPartForm({ ...generalPartForm, name: e.target.value })}
                                                                    />
                                                                </td>
                                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                                                    <input
                                                                        type="number"
                                                                        style={{ ...inputStyle, padding: '4px 8px', textAlign: 'right', width: '100px' }}
                                                                        value={generalPartForm.price}
                                                                        onChange={e => setGeneralPartForm({ ...generalPartForm, price: Number(e.target.value) })}
                                                                    />
                                                                </td>
                                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                        <button
                                                                            onClick={() => handleSaveGeneralEdit(part.reference)}
                                                                            style={{ ...btnStyle, background: '#22c55e', padding: '4px 8px', fontSize: '0.8rem' }}
                                                                        >
                                                                            Guardar
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingGeneralPartRef(null)}
                                                                            style={{ ...btnStyle, background: '#94a3b8', padding: '4px 8px', fontSize: '0.8rem' }}
                                                                        >
                                                                            Cancelar
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td style={{ padding: '0.75rem' }}>{part.name}</td>
                                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                                                                    {formatCurrency(part.price)}
                                                                </td>
                                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                                    <button
                                                                        onClick={() => handleEditGeneralClick(part)}
                                                                        style={{ ...btnStyle, background: 'none', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '4px 8px', fontSize: '0.8rem' }}
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }



                {/* --- CROSS SELL TAB --- */}
                {
                    activeTab === 'cross_sell' && (
                        <div>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Precios Venta Cruzada</h3>

                            {/* New Cross Sell Form */}
                            <form onSubmit={handleAddCrossSell} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Nombre Item</label>
                                        <input placeholder="Ej: Nuevo Servicio" required style={inputStyle} value={newCrossSell.name} onChange={e => setNewCrossSell({ ...newCrossSell, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Precio</label>
                                        <input type="number" required style={inputStyle} value={newCrossSell.price || ''} onChange={e => setNewCrossSell({ ...newCrossSell, price: Number(e.target.value) })} />
                                    </div>
                                    <button type="submit" style={btnStyle}>Agregar</button>
                                </div>
                            </form>

                            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', maxHeight: '500px', overflowY: 'auto' }}>
                                {crossSellItems.map(item => (
                                    <div key={item.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ color: '#333', fontWeight: 500, fontSize: '1rem', minWidth: '120px', textAlign: 'right' }}>
                                                {formatCurrency(item.price)}
                                            </span>
                                            <button style={deleteBtnStyle} onClick={() => confirmDeleteCrossSell(item.id)} title="Eliminar">
                                                {/* Trash Icon SVG */}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* --- CONFIGURATOR TAB --- */}
                {
                    activeTab === 'config' && (
                        <div>
                            <h3 style={{ marginBottom: '1rem' }}>Configurador de Recetas (Mantenimiento)</h3>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <select style={inputStyle} value={confBrandId} onChange={e => setConfBrandId(Number(e.target.value))}>
                                    <option value="">Seleccionar Marca...</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                <select style={inputStyle} value={confLineId} onChange={e => { setConfLineId(e.target.value); setConfServiceType('particular'); }} disabled={!confBrandId}>
                                    <option value="">Seleccionar Línea...</option>
                                    {vehicleLines.filter(l => l.brandId === confBrandId).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>

                            {/* Service Type Selector (Dynamic based on name check for now, ideally per line config) */}
                            {confLineId && (vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('STARIA') || vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('GRAN I10')) && (
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e40af' }}>
                                        Tipo de Servicio {vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('STARIA') ? '(STARIA DIESEL)' : '(GRAN I10)'}
                                    </label>
                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="confServiceType"
                                                value="particular"
                                                checked={confServiceType === 'particular'}
                                                onChange={e => setConfServiceType(e.target.value)}
                                            />
                                            <span>
                                                {vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('STARIA') ? 'Particular (10k)' : 'PARTICULAR (10k)'}
                                            </span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="confServiceType"
                                                value={vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('STARIA') ? 'publico' : 'taxi'}
                                                checked={confServiceType === (vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('STARIA') ? 'publico' : 'taxi')}
                                                onChange={e => setConfServiceType(e.target.value)}
                                            />
                                            <span>
                                                {vehicleLines.find(l => l.id === confLineId)?.name.toUpperCase().includes('STARIA') ? 'Público / Especial (5k)' : 'TAXI (5k)'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Maintenance Selector */}
                            {confLineId && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Seleccionar Mantenimiento</label>
                                    <select
                                        key={`${confLineId}-${vehicleLines.find(l => l.id === confLineId)?.serviceInterval || 10000}`}
                                        style={inputStyle}
                                        value={confMaintId}
                                        onChange={e => setConfMaintId(e.target.value)}
                                    >
                                        <option value="">Seleccionar Mantenimiento...</option>
                                        {calculateAvailableMaintenances(
                                            vehicleLines.find(l => l.id === confLineId),
                                            MOCK_MAINTENANCES,
                                            confServiceType
                                        ).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                <strong>ℹ️ Nota Importante:</strong>
                                <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
                                    <li>Configurar <strong>10.000 KM</strong> aplicará automáticamente para: 30k, 70k y 90k.</li>
                                    <li>Configurar <strong>20.000 KM</strong> aplicará automáticamente para: 40k, 60k y 80k.</li>
                                </ul>
                            </div>

                            {confLineId && confMaintId ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {/* Select Labor */}
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>1. Mano de Obra STD</h4>
                                        {laborActivities.map(act => (
                                            <label key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={tempDefinition.laborIds.includes(act.id)}
                                                    onChange={() => handleConfigToggleLabor(act.id)}
                                                />
                                                <span>{act.description}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>2. Repuestos STD</h4>
                                        {parts.filter(part => part.lineId === confLineId).map(part => {
                                            const isSelected = tempDefinition.parts.some(p => p.id === part.id);
                                            const selectedPart = tempDefinition.parts.find(p => p.id === part.id);

                                            return (
                                                <div key={part.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleConfigTogglePart(part.id)}
                                                        />
                                                        <div>
                                                            <div>{part.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{part.reference}</div>
                                                        </div>
                                                    </label>

                                                    {isSelected && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <small translate="no" className="notranslate">Cantidad:</small>
                                                            <input
                                                                type="number"
                                                                style={{ width: '50px', padding: '2px' }}
                                                                value={selectedPart.quantity}
                                                                onChange={(e) => handleConfigQuantityChange(part.id, Number(e.target.value))}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Select Supplies/Fixed */}
                                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', gridColumn: 'span 2' }}>
                                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>3. Servicios Obligatorios Configurados</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                                            {supplies.filter(s => s.id !== 's_align').map(sup => (
                                                <label key={sup.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={tempDefinition.supplyIds.includes(sup.id)}
                                                        onChange={() => handleConfigToggleSupply(sup.id)}
                                                    />
                                                    <span style={{ fontWeight: 500 }}>{sup.name}</span>
                                                </label>
                                            ))}
                                            <p style={{ width: '100%', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                                * La Alineación y Venta Cruzada se gestionan en la vista del asesor, no aquí.
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ gridColumn: 'span 2', marginTop: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={saveConfiguration}
                                            style={{ ...btnStyle, fontSize: '1.2rem', padding: '0.75rem 2rem' }}
                                        >
                                            Guardar Configuración
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
                                    Selecciona un Vehículo y un Mantenimiento para configurar su receta.
                                </div>
                            )}
                        </div>
                    )
                }

                {/* --- VEHICLES TAB --- */}
                {activeTab === 'vehicles' && (
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                            {/* Force Update */}
                            Gestor de Vehículos (Total: {vehicleLines ? vehicleLines.length : 0})
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                            {/* FORM */}
                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', border: editingVehicleId ? '2px solid var(--primary-color)' : '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ margin: 0, color: editingVehicleId ? 'var(--primary-color)' : 'var(--primary-dark)' }}>
                                        {editingVehicleId ? '✏️ Editando Vehículo' : '✨ Nuevo Vehículo'}
                                    </h4>
                                    {editingVehicleId && (
                                        <button
                                            onClick={() => {
                                                setEditingVehicleId(null);
                                                setNewVehicle({ brandId: '', customBrandName: '', name: '', freqType: '10k' });
                                                setPreviewImage(null);
                                                setImageFile(null);
                                            }}
                                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#ccc', border: 'none', borderRadius: '4px' }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>

                                {/* Brand Selection */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Marca</label>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <select
                                            style={{ ...inputStyle, flex: 1 }}
                                            value={newVehicle.brandId}
                                            onChange={(e) => setNewVehicle(prev => ({ ...prev, brandId: e.target.value }))}
                                        >
                                            <option value="">-- Seleccionar --</option>
                                            {brands.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                            <option value="new">+ Nueva Marca...</option>
                                        </select>

                                        {newVehicle.brandId === 'new' && (
                                            <input
                                                style={{ ...inputStyle, flex: 1 }}
                                                placeholder="Nombre de la nueva marca..."
                                                value={newVehicle.customBrandName}
                                                onChange={(e) => setNewVehicle(prev => ({ ...prev, customBrandName: e.target.value }))}
                                                autoFocus
                                            />
                                        )}
                                    </div>

                                    {/* Existing Brands List with Edit Option */}
                                    {brands.length > 0 && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                                            <h5 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#666' }}>Marcas Existentes:</h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {brands.map(brand => (
                                                    <div key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {editingBrandId === brand.id ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={editingBrandName}
                                                                    onChange={(e) => setEditingBrandName(e.target.value)}
                                                                    style={{ ...inputStyle, flex: 1, padding: '0.5rem' }}
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        if (editingBrandName.trim()) {
                                                                            updateBrand(brand.id, editingBrandName.trim());
                                                                            setEditingBrandId(null);
                                                                            setEditingBrandName('');
                                                                        }
                                                                    }}
                                                                    style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                >
                                                                    ✓ Guardar
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingBrandId(null);
                                                                        setEditingBrandName('');
                                                                    }}
                                                                    style={{ padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                >
                                                                    ✕ Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span style={{ flex: 1, padding: '0.5rem', fontWeight: 500 }}>{brand.name}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingBrandId(brand.id);
                                                                        setEditingBrandName(brand.name);
                                                                    }}
                                                                    style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                >
                                                                    ✏️ Editar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Line Name */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre de la Línea</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Ej: TUCSON NX4, SONATA..."
                                        value={newVehicle.name}
                                        onChange={(e) => setNewVehicle(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                                    />
                                </div>

                                {/* Frequency Type (Hidden for simplicity as per request "frecuencia de mantenimiento", usually 10k or 5k) */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Frecuencia de Mantenimiento</label>
                                    <select
                                        style={inputStyle}
                                        value={newVehicle.freqType}
                                        onChange={(e) => setNewVehicle(prev => ({ ...prev, freqType: e.target.value }))}
                                    >
                                        <option value="10k">Estándar (Cada 10.000 KM)</option>
                                        <option value="5k">Intensivo (Cada 5.000 KM)</option>
                                    </select>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                        Define cada cuánto se generan las alertas y ciclos de mantenimiento.
                                    </p>
                                </div>

                                {/* Image Upload */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Foto del Vehículo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            // Validate size (max 800kb)
                                            if (file.size > 800 * 1024) {
                                                alert('La imagen es muy pesada. Por favor usa una imagen menor a 800KB.');
                                                return;
                                            }

                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setPreviewImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                            setImageFile(file);
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                        <strong>📏 Dimensiones recomendadas:</strong> 350px de ancho x 220px de alto<br />
                                        <strong>📄 Formato:</strong> PNG sin fondo para mejor apariencia<br />
                                        <em>Nota: La imagen se ajustará automáticamente al contenedor manteniendo su proporción</em>
                                    </p>
                                </div>

                                {/* Preview Card (Mini) */}
                                <div style={{
                                    marginBottom: '2rem',
                                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    height: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', zIndex: 1 }}
                                        />
                                    ) : (
                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Vista Previa Imagen</span>
                                    )}
                                </div>

                                <button
                                    style={{ ...btnStyle, width: '100%', fontSize: '1.1rem', padding: '0.75rem', background: editingVehicleId ? 'var(--warning)' : 'var(--primary-color)' }}
                                    onClick={() => {
                                        if (!newVehicle.name) return alert('Ingresa el nombre de la línea');
                                        if (!newVehicle.brandId) return alert('Selecciona una marca');
                                        if (newVehicle.brandId === 'new' && !newVehicle.customBrandName) return alert('Dale nombre a la nueva marca');
                                        if (!previewImage) return alert('Debes cargar una imagen del vehículo');

                                        let finalBrandId = newVehicle.brandId;
                                        if (finalBrandId === 'new') {
                                            const added = addBrand(newVehicle.customBrandName);
                                            finalBrandId = added.id;
                                        }

                                        // Ensure brandId is number if it comes from select value which is string
                                        finalBrandId = Number(finalBrandId);

                                        const vehicleData = {
                                            brandId: finalBrandId,
                                            name: newVehicle.name,
                                            imageUrl: previewImage,
                                            serviceInterval: newVehicle.freqType === '5k' ? 5000 : 10000
                                        };

                                        if (editingVehicleId) {
                                            updateVehicleLine(editingVehicleId, vehicleData);
                                            alert('Vehículo actualizado exitosamente.');
                                            setEditingVehicleId(null);
                                        } else {
                                            addVehicleLine(vehicleData);
                                            alert('Vehículo creado exitosamente.');
                                        }

                                        // Reset
                                        setNewVehicle({ brandId: '', customBrandName: '', name: '', freqType: '10k' });
                                        setPreviewImage(null);
                                        setImageFile(null);
                                    }}
                                >
                                    {editingVehicleId ? '💾 Guardar Cambios' : '+ Crear Vehículo'}
                                </button>
                            </div>

                            {/* RIGHT: LIST OF VEHICLES */}
                            <div>
                                <h4 style={{ marginBottom: '1rem', color: '#666' }}>Vehículos Existentes ({vehicleLines.length})</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
                                    {vehicleLines.map(line => {
                                        const brand = brands.find(b => b.id === line.brandId);
                                        return (
                                            <div key={line.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                background: 'white',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #eee',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}>
                                                <div style={{ width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '4px' }}>
                                                    <img src={line.imageUrl} alt={line.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{line.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        {brand ? brand.name : 'Marca desconocida'} • {line.serviceInterval === 5000 ? '5.000 KM' : '10.000 KM'}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setEditingVehicleId(line.id);
                                                        setNewVehicle({
                                                            brandId: line.brandId,
                                                            customBrandName: '',
                                                            name: line.name,
                                                            freqType: line.serviceInterval === 5000 ? '5k' : '10k'
                                                        });
                                                        setPreviewImage(line.imageUrl);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px' }}
                                                >
                                                    Editar
                                                </button>
                                                {/* Optional Delete Button */}
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`¿Estás seguro de eliminar ${line.name}?`)) {
                                                            deleteVehicleLine(line.id);
                                                        }
                                                    }}
                                                    style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {vehicleLines.length === 0 && (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#999', border: '2px dashed #eee', borderRadius: '8px' }}>
                                            No hay vehículos registrados.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* --- REPORTS TAB --- */}
                {activeTab === 'reports' && (
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Reportes de Actividad</h3>

                        {/* --- ISSUES SECTION --- */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#dc2626' }}>Problemas Reportados por Asesores</h4>
                            {issues && issues.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {issues.map(issue => (
                                        <div key={issue.id} style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 4px rgba(220, 38, 38, 0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#991b1b' }}>
                                                <span>{new Date(issue.date).toLocaleString()}</span>
                                                <span style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>Pendiente</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', fontWeight: 500 }}>
                                                De: {issue.email || 'Anónimo'}
                                            </div>
                                            <p style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '0.95rem' }}>
                                                {issue.description}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <a
                                                    href={`mailto:${issue.email}?subject=Respuesta a Reporte: ${issue.id}&body=Hola, respecto a tu reporte: "${issue.description}"...`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' }}
                                                >
                                                    ✉ Responder
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('¿Marcar como resuelto/eliminar?')) deleteIssue(issue.id);
                                                    }}
                                                    style={{ padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    ✓ Resolver
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ background: '#f0fdf4', color: '#15803d', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                    ¡Excelente! No hay problemas reportados pendientes.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
