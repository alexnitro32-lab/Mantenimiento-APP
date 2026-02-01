import { useMaintenance } from '../../context/MaintenanceContext';

export default function VehicleSelector() {
    const {
        selectedBrand,
        setSelectedBrand,
        selectedLine,
        setSelectedLine,
        serviceType,
        setServiceType,
        resetSelection,
        brands,        // FROM CONTEXT
        vehicleLines   // FROM CONTEXT
    } = useMaintenance();

    const handleBrandChange = (e) => {
        const brandId = Number(e.target.value);
        const brand = brands.find(b => b.id === brandId);
        setSelectedBrand(brand);
        setSelectedLine(null);
        resetSelection();
    };

    const handleLineChange = (e) => {
        const lineId = e.target.value;
        const line = vehicleLines.find(l => l.id === lineId);
        setSelectedLine(line);
        // Reset service type to particular by default when changing lines
        setServiceType('particular');
        resetSelection();
    };

    const filteredLines = selectedBrand
        ? vehicleLines.filter(l => l.brandId === selectedBrand.id)
        : [];

    const isStaria = selectedLine?.name.toUpperCase().includes('STARIA');

    return (
        <div className="card">
            <h2 className="text-primary" style={{ marginBottom: '1.5rem' }}>1. Selección del Vehículo</h2>
            <div className="vehicle-selector-grid">

                {/* Brand Selector */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Marca</label>
                    <select
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        value={selectedBrand?.id || ''}
                        onChange={handleBrandChange}
                    >
                        <option value="">Seleccionar Marca</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>

                {/* Line Selector */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Línea</label>
                    <select
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        value={selectedLine?.id || ''}
                        onChange={handleLineChange}
                        disabled={!selectedBrand}
                    >
                        <option value="">Seleccionar Línea</option>
                        {filteredLines.map(line => (
                            <option key={line.id} value={line.id}>{line.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Service Type Toggle for Staria and GRAN i10 */}
            {(isStaria || selectedLine?.name.toUpperCase().includes('GRAN I10')) && (
                <div className="service-type-box">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e40af' }}>
                        Tipo de Servicio {isStaria ? '(STARIA DIESEL)' : '(GRAN I10)'}
                    </label>
                    <div className="service-type-options">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="serviceType"
                                value="particular"
                                checked={serviceType === 'particular'}
                                onChange={(e) => setServiceType(e.target.value)}
                            />
                            <span>
                                {isStaria ? 'Particular (Cada 10.000 KM)' : 'PARTICULAR (Cada 10.000 KM)'}
                            </span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="serviceType"
                                value={isStaria ? 'publico' : 'taxi'}
                                checked={serviceType === (isStaria ? 'publico' : 'taxi')}
                                onChange={(e) => setServiceType(e.target.value)}
                            />
                            <span>
                                {isStaria ? 'Público / Especial (Cada 5.000 KM)' : 'TAXI (Cada 5.000 KM)'}
                            </span>
                        </label>
                    </div>
                </div>
            )}

        </div>
    );
}
