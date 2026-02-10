import { useMemo } from 'react';
import { useMaintenance } from '../../context/MaintenanceContext';
import { formatCurrency } from '../../utils/format';

export default function DetailTable() {
    const {
        finalMergedLists,
        totals,
        selectedMaintenance,
        selectedAdditionals,
        toggleAdditional,
        crossSellItems,
        selectedCrossSell,
        toggleCrossSell,
        parts,
        laborActivities,
        currentParts,
        currentLabor,
        selectedLine
    } = useMaintenance();

    // --- DYNAMIC SUGGESTED ADDITIONALS ---
    // Filter parts/labor that are NOT in the current maintenance recipe
    const suggestedItems = useMemo(() => {
        if (!currentParts || !currentLabor || !selectedLine) return [];

        // Get IDs currently in the recipe (base items)
        const currentPartIds = new Set(currentParts.map(p => p.id));
        const currentLaborIds = new Set(currentLabor.map(l => l.id));

        // Check if current labor includes comprehensive services
        const hasRutinaMantenimiento = currentLabor.some(l =>
            l.description && l.description.toLowerCase().includes('rutina de mantenimiento')
        );

        // Find unused items
        // 1. Parts: Must belong to selectedLine AND not be in current recipe
        const unusedParts = parts.filter(p =>
            p.lineId === selectedLine.id &&
            !currentPartIds.has(p.id)
        );

        // 2. Labor: Must not be in current recipe
        let unusedLabor = laborActivities.filter(l => !currentLaborIds.has(l.id));

        // 3. INTELLIGENT FILTERING: If recipe has "Rutina de Mantenimiento", 
        //    exclude redundant services
        if (hasRutinaMantenimiento) {
            const redundantServices = [
                'cambio de aceite',
                'rutina de mantenimiento',
                'mantenimiento de frenos'
            ];

            unusedLabor = unusedLabor.filter(l => {
                const desc = (l.description || '').toLowerCase();
                return !redundantServices.some(service => desc.includes(service));
            });
        }

        return [
            ...unusedLabor.map(l => ({ id: l.id, name: l.description, type: 'labor' })),
            ...unusedParts.map(p => ({ id: p.id, name: p.name, type: 'part' }))
        ];
    }, [parts, laborActivities, currentParts, currentLabor, selectedLine]);

    if (!selectedMaintenance) return null;

    const sectionHeaderStyle = {
        // Keep this for now if dynamic, or move to className 'section-header'
        // But for this refactor, I moved it to CSS class .section-header and will remove this object in next step or just not use it.
    };

    // rowStyle moved to .detail-row class


    const renderSection = (title, subtotal, items, type = 'normal') => (
        <div>
            <div className="section-header">
                <span>{title}</span>
                <span style={{ fontSize: '1rem', color: 'var(--primary-color)' }}>
                    {formatCurrency(subtotal)}
                </span>
            </div>
            {items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="detail-row">
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{item.name || item.description}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {type === 'part' && item.quantity && (
                                <span>
                                    {item.quantity} unds x {formatCurrency(item.price)}
                                </span>
                            )}
                            {type === 'part' && !item.quantity && (
                                <span className="text-secondary">(Adicional)</span>
                            )}

                            {type === 'labor' && item.hours && (
                                <span>{item.hours} horas</span>
                            )}
                            {type === 'labor' && !item.hours && (
                                <span className="text-secondary">(Adicional)</span>
                            )}
                        </div>
                    </div>

                    <div style={{ marginLeft: '1rem', fontWeight: 500 }}>
                        {formatCurrency(item.total || item.price)}
                    </div>
                </div>
            ))}
            {items.length === 0 && <div style={{ padding: '0.5rem 1rem', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No incluye</div>}
        </div>
    );

    return (
        <div className="card detail-list-card">
            <div style={{ padding: '1rem', background: 'var(--primary-dark)', color: 'white' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Detalle del Servicio</h3>
            </div>

            <div className="detail-list-grid">

                {/* --- LEFT COLUMN: CORE DETAILS + MERGED ITEMS --- */}
                <div className="detail-left-col">
                    <h4 className="text-primary" style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>1. Desglose de Costos</h4>

                    {/* Render sections using Context Data directly */}
                    {/* Render sections using Context Data directly */}
                    {/* CUSTOM RENDER FOR PARTS TO SPLIT ADDITIVES */}
                    {(() => {
                        const allParts = finalMergedLists.mergedParts;
                        const mainParts = allParts.filter(p => p.category !== 'additive');
                        const additiveParts = allParts.filter(p => p.category === 'additive');

                        return (
                            <div>
                                {renderSection('Repuestos',
                                    mainParts.reduce((sum, p) => sum + (p.total || 0), 0),
                                    mainParts,
                                    'part'
                                )}
                                {additiveParts.length > 0 && (
                                    <div style={{ marginTop: '1rem', paddingLeft: '0.5rem', borderLeft: '3px solid var(--primary-color)' }}>
                                        <h5 style={{ margin: '0.5rem 0', color: 'var(--primary-color)', fontWeight: 600 }}>Aditivos</h5>
                                        {additiveParts.map((item, idx) => (
                                            <div key={`${item.id}-${idx}`} className="detail-row">
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        {item.quantity ?
                                                            `${item.quantity} unds x ${formatCurrency(item.price)}` :
                                                            '(Adicional)'}
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft: '1rem', fontWeight: 500 }}>
                                                    {formatCurrency(item.total || item.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {renderSection('Mano de Obra', totals.labor, finalMergedLists.mergedLabor, 'labor')}
                    {renderSection('Insumos y Otros', totals.supplies, finalMergedLists.mergedSupplies)}
                </div>

                {/* --- RIGHT COLUMN: ADDITIONALS & CROSS SELL SELECTION --- */}
                <div className="detail-right-col">

                    {/* PART 2: ADICIONALES SUGERIDOS */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h4 className="text-primary" style={{ marginBottom: '1rem' }}>
                            2. Adicionales Sugeridos
                            <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'normal', marginTop: '2px' }}>Seleccione para agregar a la lista</div>
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                            {suggestedItems.length === 0 && <p style={{ fontSize: '0.8rem', color: '#888' }}>No hay sugerencias disponibles.</p>}
                            {suggestedItems.map(item => {
                                // Check if this item is already in 'selectedAdditionals' by checking partial name match or exact match
                                // Since we switched to ID-based additionals in context, we need to handle "how to select".
                                // For now, we reuse the existing string-based 'toggleAdditional' by passing the Name, 
                                // BUT the user requested "items que sobran". 
                                // To make this work with the existing 'selectedAdditionals' (which stores strings), 
                                // we will pass the item NAME.
                                const isChecked = selectedAdditionals.includes(item.name);
                                return (
                                    <label key={item.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        borderRadius: '4px',
                                        backgroundColor: isChecked ? '#e0f2fe' : 'transparent',
                                        transition: 'background-color 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleAdditional(item.name)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <span style={{ fontWeight: isChecked ? 600 : 400 }}>{item.name} {item.type === 'part' ? '(Repuesto)' : '(MO)'}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* PART 3: VENTA CRUZADA */}
                    <div style={{ padding: '1.5rem', flex: 1 }}>
                        <h4 className="text-primary" style={{ marginBottom: '1rem' }}>
                            3. Venta Cruzada
                            <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'normal', marginTop: '2px' }}>Productos y servicios extra</div>
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                            {crossSellItems.map(item => {
                                const isChecked = selectedCrossSell.includes(item.id);
                                return (
                                    <label key={item.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        borderRadius: '4px',
                                        backgroundColor: isChecked ? '#f0fdf4' : 'transparent',
                                        transition: 'background-color 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleCrossSell(item.id)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <span style={{ flex: 1, fontWeight: isChecked ? 600 : 400 }}>{item.name}</span>
                                        <span style={{ fontWeight: 500, color: '#333' }}>{formatCurrency(item.price)}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
