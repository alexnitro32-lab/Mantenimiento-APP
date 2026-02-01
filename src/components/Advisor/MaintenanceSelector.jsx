import { useMaintenance } from '../../context/MaintenanceContext';

export default function MaintenanceSelector() {
    const { selectedLine, selectedMaintenance, setSelectedMaintenance, availableMaintenances } = useMaintenance();

    if (!selectedLine) return null;

    return (
        <div className="card mt-4" style={{ marginTop: '1.5rem' }}>
            <h3 className="text-primary" style={{ marginBottom: '1rem' }}>2. Tipo de Servicio</h3>

            {availableMaintenances.length === 0 ? (
                <p>No hay mantenimientos disponibles para este vehículo.</p>
            ) : (
                <div className="maintenance-grid">
                    {availableMaintenances.map(maint => {
                        const isSelected = selectedMaintenance?.id === maint.id;
                        return (
                            <button
                                type="button"
                                key={maint.id}
                                onClick={() => setSelectedMaintenance(maint)}
                                style={{
                                    padding: '1rem',
                                    border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    backgroundColor: isSelected ? 'var(--primary-color)' : 'white',
                                    color: isSelected ? 'white' : 'var(--text-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all 0.2s',
                                    textAlign: 'center',
                                    fontWeight: 600
                                }}
                            >
                                {maint.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
