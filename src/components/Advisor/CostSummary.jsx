import { useState, useEffect, useMemo } from 'react';
import { useMaintenance } from '../../context/MaintenanceContext';
import { formatCurrency } from '../../utils/format';

export default function CostSummary() {
    const { finalMergedLists, selectedMaintenance, selectedLine, serviceType } = useMaintenance();
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [selectedLine, serviceType]);

    // Get the correct image URL based on service type
    const getVehicleImageUrl = () => {
        if (!selectedLine) return '';

        const isGranI10 = selectedLine.name.toUpperCase().includes('GRAN I10');
        const isStaria = selectedLine.name.toUpperCase().includes('STARIA');

        if (isGranI10) {
            // Gran i10: Show taxi (yellow) image when taxi, particular (white) when particular
            return serviceType === 'taxi' ? '/vehicles/gran_i10_taxi.png' : '/vehicles/gran_i10.png';
        }

        if (isStaria) {
            // STARIA: Show white image when publico, black image when particular
            return serviceType === 'publico' ? '/vehicles/staria.png' : '/vehicles/staria_particular.png';
        }

        return selectedLine.imageUrl;
    };


    // Local calculation for Total only
    const totalValue = useMemo(() => {
        if (!finalMergedLists) return 0;
        const { mergedParts, mergedLabor, mergedSupplies } = finalMergedLists;

        const sumParts = mergedParts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
        const sumLabor = mergedLabor.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
        const sumSupplies = mergedSupplies.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

        const subtotal = sumParts + sumLabor + sumSupplies;
        const tax = subtotal * 0.19;
        return subtotal + tax;
    }, [finalMergedLists]);


    if (!selectedMaintenance || !finalMergedLists) return null;

    const { mergedParts, mergedLabor, mergedSupplies } = finalMergedLists;
    const sumParts = mergedParts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const sumLabor = mergedLabor.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const sumSupplies = mergedSupplies.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

    // Calculate IVA (tax) from subtotal
    const subtotal = sumParts + sumLabor + sumSupplies;
    const ivaValue = subtotal * 0.19;


    const getInitials = (name) => {
        if (!name) return 'VE';
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="card cost-summary-card">
            {/* Decorative background element */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            <div className="cost-summary-content">

                {/* --- Vehicle Image Display (Restored) --- */}
                {selectedLine && (
                    <div className="vehicle-image-container">
                        {!imageError && getVehicleImageUrl() ? (
                            <img
                                src={getVehicleImageUrl()}
                                alt={selectedLine.name}
                                onError={(e) => {
                                    console.warn("Image load failed, switching to fallback", getVehicleImageUrl());
                                    setImageError(true);
                                }}
                                className="vehicle-image"
                            />
                        ) : (
                            <div className="vehicle-placeholder-box">
                                <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>{getInitials(selectedLine.name)}</span>
                                <span style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{selectedLine.name}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* --- Totals (Right) --- */}
                <div className="cost-totals-container">

                    <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.25rem', marginLeft: '0.5rem' }}>
                        Total Estimado
                    </h4>

                    <div className="total-main-display">
                        {formatCurrency(totalValue)}
                    </div>

                    {/* IVA Display */}
                    <div style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)', marginBottom: '0.5rem' }}>
                        Incluye IVA: {formatCurrency(ivaValue)}
                    </div>

                    <div className="subtotals-grid">
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '0.25rem' }}>Repuestos</span>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(sumParts)}</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '0.25rem' }}>Mano de Obra</span>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(sumLabor)}</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '0.25rem' }}>Insumos</span>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(sumSupplies)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
