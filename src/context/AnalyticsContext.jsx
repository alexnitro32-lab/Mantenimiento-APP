import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useMaintenance } from './MaintenanceContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

const STORAGE_KEY_ANALYTICS = 'maint_app_analytics_v1';

export const AnalyticsProvider = ({ children }) => {
    // --- State ---
    const [stats, setStats] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_ANALYTICS);
            return stored ? JSON.parse(stored) : {
                visits: 0,
                totalTime: 0, // seconds
                vehicles: {}, // { 'Kia Picanto': 12 }
                maintenances: {}, // { '10.000 Km': 5 }
                lastUpdated: Date.now()
            };
        } catch (e) {
            console.error("Analytics load error", e);
            return { visits: 0, totalTime: 0, vehicles: {}, maintenances: {} };
        }
    });

    const { selectedLine, selectedMaintenance } = useMaintenance();

    // --- Persistence ---
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(stats));
    }, [stats]);

    // --- Automatic Tracking ---

    // 1. Track Visits & Session Duration
    useEffect(() => {
        // Increment visits on mount (new session)
        setStats(prev => ({ ...prev, visits: (prev.visits || 0) + 1, lastUpdated: Date.now() }));

        const startTime = Date.now();

        // Update duration on unmount
        return () => {
            const duration = (Date.now() - startTime) / 1000;
            if (duration > 1) { // Ignore flickers
                setStats(prev => ({
                    ...prev,
                    totalTime: (prev.totalTime || 0) + duration
                }));
            }
        };
    }, []);

    // 2. Track Vehicle Searches
    // Use ref to avoid double counting if effect re-runs for other reasons
    const lastTrackedLineRef = useRef(null);
    useEffect(() => {
        if (selectedLine && selectedLine.id !== lastTrackedLineRef.current) {
            lastTrackedLineRef.current = selectedLine.id;

            setStats(prev => {
                const currentCount = prev.vehicles[selectedLine.name] || 0;
                return {
                    ...prev,
                    vehicles: {
                        ...prev.vehicles,
                        [selectedLine.name]: currentCount + 1
                    }
                };
            });
        }
    }, [selectedLine]);

    // 3. Track Maintenance Quotes
    const lastTrackedMaintRef = useRef(null);
    useEffect(() => {
        if (selectedMaintenance && selectedMaintenance.id !== lastTrackedMaintRef.current) {
            lastTrackedMaintRef.current = selectedMaintenance.id;

            // Generate a readable name for custom/special cases
            let maintName = selectedMaintenance.name;
            if (selectedMaintenance.type === 'mileage') {
                maintName = `${selectedMaintenance.interval.toLocaleString()} Km`;
            }

            setStats(prev => {
                const currentCount = prev.maintenances[maintName] || 0;
                return {
                    ...prev,
                    maintenances: {
                        ...prev.maintenances,
                        [maintName]: currentCount + 1
                    }
                };
            });
        }
    }, [selectedMaintenance]);

    const value = {
        stats
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};
