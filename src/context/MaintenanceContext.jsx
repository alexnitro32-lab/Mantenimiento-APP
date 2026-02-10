import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import {
    MOCK_PARTS,
    MOCK_GLOBAL_LABOR_RATE,
    MOCK_LABOR_ACTIVITIES,
    MOCK_MAINTENANCE_ACTIVITIES,
    MOCK_SUPPLIES,
    MOCK_MAINTENANCES,
    MOCK_LINES,
    MOCK_BRANDS,
    MOCK_CROSS_SELL_ITEMS,
    IVA_RATE
} from '../data/mockData';
import { saveToFirebase, loadFromFirebase, subscribeToFirebase, PATHS, migrateFromLocalStorage } from '../services/firebaseService';

// --- HELPER FOR SHARED FILTERING LOGIC ---
export const calculateAvailableMaintenances = (selectedLine, maintenances, serviceType) => {
    if (!selectedLine) return [];

    // Normalize string to handle case sensitivity safely
    const lineName = selectedLine.name ? selectedLine.name.toUpperCase() : '';
    const isStaria = lineName.includes('STARIA');
    const isGranI10 = lineName.includes('GRAN I10');

    const filtered = maintenances.filter(m => {
        // Always show non-mileage based
        if (m.type === 'service' || m.type === 'time') return true;

        // GRAN i10 TAXI: Show all intervals (5k, 10k, 15k, 20k, ... 100k)
        if (isGranI10 && serviceType === 'taxi') {
            return m.interval > 0 && m.interval <= 100000 && m.interval % 5000 === 0;
        }

        // GRAN i10 PARTICULAR: Show only 10k increments
        if (isGranI10 && serviceType === 'particular') {
            return m.interval > 0 && m.interval % 10000 === 0;
        }

        // STARIA PARTICULAR: Show only 10k increments
        if (isStaria && serviceType === 'particular') {
            return m.interval > 0 && m.interval % 10000 === 0;
        }

        // STARIA PÚBLICA: Show all intervals (5k, 10k, 15k, 20k, ... 100k)
        if (isStaria && serviceType === 'publico') {
            return m.interval > 0 && m.interval <= 100000 && m.interval % 5000 === 0;
        }

        // All other vehicles: Use the vehicle's serviceInterval setting
        if (m.type === 'mileage') {
            const vehicleInterval = selectedLine.serviceInterval || 10000; // Default to 10k if not set
            return m.interval > 0 && m.interval % vehicleInterval === 0;
        }

        return true;
    });

    return [...filtered, { id: 'custom', name: 'Personalizado', type: 'custom', interval: 0 }];
};

const MaintenanceContext = createContext();

export const useMaintenance = () => useContext(MaintenanceContext);

export const MaintenanceProvider = ({ children }) => {
    const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

    // --- Admin Mutable State (With Firebase Persistence) ---
    const [brands, setBrands] = useState(MOCK_BRANDS);
    const [vehicleLines, setVehicleLines] = useState(MOCK_LINES);
    const [parts, setParts] = useState(MOCK_PARTS);
    const [laborActivities, setLaborActivities] = useState(MOCK_LABOR_ACTIVITIES);
    const [supplies, setSupplies] = useState(MOCK_SUPPLIES);
    const [crossSellItems, setCrossSellItems] = useState(MOCK_CROSS_SELL_ITEMS);
    const [globalLaborRate, setGlobalLaborRate] = useState(MOCK_GLOBAL_LABOR_RATE);
    const [maintenances, setMaintenances] = useState(MOCK_MAINTENANCES);
    const [maintenanceDefinitions, setMaintenanceDefinitions] = useState({});
    const [issues, setIssues] = useState([]);

    // --- Initialize Firebase Data ---
    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                // Check if Firebase has data, if not migrate from LocalStorage
                const firebaseBrands = await loadFromFirebase(PATHS.BRANDS);

                if (!firebaseBrands) {
                    console.log('No data in Firebase, migrating from LocalStorage...');
                    await migrateFromLocalStorage();
                }

                // Load all data from Firebase
                const [
                    fbBrands,
                    fbLines,
                    fbParts,
                    fbLabor,
                    fbSupplies,
                    fbCrossSell,
                    fbGlobalRate,
                    fbDefinitions,
                    fbIssues
                ] = await Promise.all([
                    loadFromFirebase(PATHS.BRANDS, MOCK_BRANDS),
                    loadFromFirebase(PATHS.LINES, MOCK_LINES),
                    loadFromFirebase(PATHS.PARTS, MOCK_PARTS),
                    loadFromFirebase(PATHS.LABOR, MOCK_LABOR_ACTIVITIES),
                    loadFromFirebase(PATHS.SUPPLIES, MOCK_SUPPLIES),
                    loadFromFirebase(PATHS.CROSS_SELL, MOCK_CROSS_SELL_ITEMS),
                    loadFromFirebase(PATHS.GLOBAL_RATE, MOCK_GLOBAL_LABOR_RATE),
                    loadFromFirebase(PATHS.DEFINITIONS, {}),
                    loadFromFirebase(PATHS.ISSUES, [])
                ]);

                setBrands(fbBrands);
                setVehicleLines(fbLines);
                setParts(fbParts);
                setLaborActivities(fbLabor);
                setSupplies(fbSupplies);
                setCrossSellItems(fbCrossSell);
                setGlobalLaborRate(fbGlobalRate);
                setMaintenanceDefinitions(fbDefinitions);
                setIssues(fbIssues);

                // Initialize definitions if empty
                if (Object.keys(fbDefinitions).length === 0) {
                    const initialDefs = {};
                    MOCK_LINES.forEach(line => {
                        MOCK_MAINTENANCES.forEach(maint => {
                            const laborIds = MOCK_MAINTENANCE_ACTIVITIES[maint.id] || [];
                            let supplyIds = MOCK_SUPPLIES.map(s => s.id);

                            const allocatedParts = MOCK_PARTS
                                .filter(p => p.allocations && p.allocations.some(a => a.lineId === line.id))
                                .map(p => ({
                                    id: p.id,
                                    quantity: p.allocations.find(a => a.lineId === line.id).quantity
                                }));

                            if (allocatedParts.length === 0 && (maint.type === 'mileage' || maint.id === 'm_oil')) {
                                const oilFilter = MOCK_PARTS.find(p => p.name.toLowerCase().includes('filtro de aceite') && p.lineId === line.id);
                                const oil = MOCK_PARTS.find(p => p.name.toLowerCase().includes('aceite') && !p.name.toLowerCase().includes('transmision') && p.lineId === line.id);
                                if (oilFilter) allocatedParts.push({ id: oilFilter.id, quantity: 1 });
                                if (oil) allocatedParts.push({ id: oil.id, quantity: 4 });
                            }

                            if (laborIds.length > 0 || allocatedParts.length > 0 || supplyIds.length > 0) {
                                initialDefs[`${line.id}_${maint.id}`] = {
                                    laborIds,
                                    supplyIds,
                                    parts: allocatedParts
                                };
                            }
                        });
                    });
                    setMaintenanceDefinitions(initialDefs);
                    await saveToFirebase(PATHS.DEFINITIONS, initialDefs);
                }

                setIsFirebaseInitialized(true);
            } catch (error) {
                console.error('Error initializing Firebase:', error);
                setIsFirebaseInitialized(true); // Continue with mock data
            }
        };

        initializeFirebase();
    }, []);

    // --- Firebase Persistence Effects ---
    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.PARTS, parts);
        }
    }, [parts, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.LABOR, laborActivities);
        }
    }, [laborActivities, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.SUPPLIES, supplies);
        }
    }, [supplies, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.CROSS_SELL, crossSellItems);
        }
    }, [crossSellItems, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.GLOBAL_RATE, globalLaborRate);
        }
    }, [globalLaborRate, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.DEFINITIONS, maintenanceDefinitions);
        }
    }, [maintenanceDefinitions, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.BRANDS, brands);
        }
    }, [brands, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.LINES, vehicleLines);
        }
    }, [vehicleLines, isFirebaseInitialized]);

    useEffect(() => {
        if (isFirebaseInitialized) {
            saveToFirebase(PATHS.ISSUES, issues);
        }
    }, [issues, isFirebaseInitialized]);

    const addBrand = (name) => {
        const newBrand = { id: Date.now(), name };
        setBrands(prev => [...prev, newBrand]);
        return newBrand;
    };

    const updateBrand = (id, name) => {
        setBrands(prev => prev.map(brand =>
            brand.id === id ? { ...brand, name } : brand
        ));
    };

    const addVehicleLine = (lineData) => {
        const newLine = {
            ...lineData,
            id: `l_${Date.now()}`
        };
        setVehicleLines(prev => [...prev, newLine]);
    };

    const updateVehicleLine = (id, updates) => {
        setVehicleLines(prev => prev.map(line =>
            line.id === id ? { ...line, ...updates } : line
        ));
    };

    const deleteVehicleLine = (id) => {
        setVehicleLines(prev => prev.filter(line => line.id !== id));
        setParts(prev => prev.filter(part => part.lineId !== id));
    };

    // --- Advisor Selection State ---
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedLine, setSelectedLine] = useState(null);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [serviceType, setServiceType] = useState('particular');

    const [selectedAdditionals, setSelectedAdditionals] = useState([]);
    const [selectedCrossSell, setSelectedCrossSell] = useState([]);

    // Reset additionals and cross-sell when maintenance type changes
    useEffect(() => {
        setSelectedAdditionals([]);
        setSelectedCrossSell([]);
    }, [selectedMaintenance?.id]);

    // --- Actions ---
    const updatePart = (id, updates) => setParts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const addPart = (newPart) => setParts(prev => [...prev, { ...newPart, id: `p${Date.now()}` }]);
    const deletePart = (id) => setParts(prev => prev.filter(p => p.id !== id));

    const getPartsByLine = (lineId) => parts.filter(p => p.lineId === lineId);

    const updateGlobalLaborRate = (newRate) => setGlobalLaborRate(newRate);

    const updateLaborActivity = (id, newHours) => setLaborActivities(prev => prev.map(l => l.id === id ? { ...l, hours: newHours } : l));
    const addLaborActivity = (newActivity) => setLaborActivities(prev => [...prev, { ...newActivity, id: `la${Date.now()}` }]);
    const deleteLaborActivity = (id) => setLaborActivities(prev => prev.filter(l => l.id !== id));

    const updateSupply = (id, newPrice) => setSupplies(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
    const updateCrossSellItem = (id, newPrice) => setCrossSellItems(prev => prev.map(i => i.id === id ? { ...i, price: newPrice } : i));
    const addCrossSellItem = (newItem) => setCrossSellItems(prev => [...prev, { ...newItem, id: `cs${Date.now()}` }]);
    const deleteCrossSellItem = (id) => setCrossSellItems(prev => prev.filter(i => i.id !== id));

    const updatePartsByReference = (reference, updates) => {
        setParts(prev => prev.map(p => p.reference === reference ? { ...p, ...updates } : p));
    };

    // --- INHERITANCE LOGIC ---
    const getEffectiveMaintenanceId = (maintId) => {
        if (['m5', 'm9', 'm11'].includes(maintId)) return 'm2'; // 10k Master
        if (['m6', 'm8', 'm10'].includes(maintId)) return 'm3'; // 20k Master
        return maintId;
    };

    const updateMaintenanceDefinition = (lineId, maintenanceId, definition) => {
        const targetId = getEffectiveMaintenanceId(maintenanceId);
        setMaintenanceDefinitions(prev => ({
            ...prev,
            [`${lineId}_${targetId}`]: definition
        }));
    };

    const resolveMaintenanceDefinition = (lineId, maintenanceId) => {
        if (maintenanceId === 'custom') {
            return { laborIds: [], supplyIds: [], parts: [] };
        }
        const targetId = getEffectiveMaintenanceId(maintenanceId);
        return maintenanceDefinitions[`${lineId}_${targetId}`] || { laborIds: [], supplyIds: [], parts: [] };
    };

    const toggleAdditional = (itemName) => {
        setSelectedAdditionals(prev => {
            if (prev.includes(itemName)) return prev.filter(i => i !== itemName);
            return [...prev, itemName];
        });
    };

    const toggleCrossSell = (itemId) => {
        setSelectedCrossSell(prev => {
            if (prev.includes(itemId)) return prev.filter(i => i !== itemId);
            return [...prev, itemId];
        });
    };

    const availableMaintenances = useMemo(() => {
        return calculateAvailableMaintenances(selectedLine, maintenances, serviceType);
    }, [selectedLine, maintenances, serviceType]);

    // --- MONOLITHIC CALCULATION ---
    const contextData = useMemo(() => {
        let definition = null;
        if (selectedLine && selectedMaintenance) {
            definition = resolveMaintenanceDefinition(selectedLine.id, selectedMaintenance.id);
        }

        let currentParts = [];
        let currentLabor = [];
        let currentSupplies = [];

        if (definition) {
            currentParts = definition.parts
                .map(defPart => {
                    const partData = parts.find(p => p.id === defPart.id);
                    if (!partData) return null;
                    if (partData.lineId !== selectedLine.id) return null;
                    const qty = Number(defPart.quantity) || 0;
                    const unitPrice = Number(partData.price) || 0;
                    return {
                        ...partData,
                        quantity: qty,
                        price: unitPrice,
                        total: unitPrice * qty
                    };
                })
                .filter(Boolean);

            currentLabor = (definition.laborIds || []).map(lId => {
                const activity = laborActivities.find(a => a.id === lId);
                if (!activity) return null;
                const hours = Number(activity.hours) || 0;
                const rate = Number(globalLaborRate) || 0;
                return {
                    ...activity,
                    hours: hours,
                    total: hours * rate
                };
            }).filter(Boolean);

            currentSupplies = (definition.supplyIds || [])
                .map(sId => {
                    const supply = supplies.find(s => s.id === sId);
                    if (!supply) return null;
                    return { ...supply, total: Number(supply.price) || 0 };
                })
                .filter(Boolean);
        }

        const resolvedAdditionals = selectedAdditionals.map(name => {
            const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const searchName = normalize(name);

            if (searchName.includes('alineacion')) {
                const align = laborActivities.find(l => normalize(l.description).includes('alineacion'));
                if (align) {
                    const total = (Number(align.hours) || 0) * (Number(globalLaborRate) || 0);
                    return { id: align.id, name: align.description, price: total, total: total, type: 'labor' };
                }
            }

            if (searchName.includes('sincronizacion')) {
                const sync = laborActivities.find(l => l.description.includes('Sincronización'));
                if (sync) {
                    const total = (Number(sync.hours) || 0) * (Number(globalLaborRate) || 0);
                    return { id: sync.id, name: sync.description, price: total, total: total, type: 'labor' };
                }
            }

            const foundLabor = laborActivities.find(l => normalize(l.description).includes(searchName));
            if (foundLabor) {
                const total = (Number(foundLabor.hours) || 0) * (Number(globalLaborRate) || 0);
                return { id: foundLabor.id, name: foundLabor.description, price: total, total: total, type: 'labor' };
            }

            const foundPart = parts.find(p => normalize(p.name).includes(searchName) && p.lineId === selectedLine.id);
            if (foundPart) {
                const price = Number(foundPart.price) || 0;
                return { id: foundPart.id, name: foundPart.name, price: price, quantity: 1, total: price, type: 'part' };
            }

            return { id: name, name: name, price: 0, total: 0, type: 'unknown' };
        });

        const resolvedCrossSell = selectedCrossSell
            .map(id => {
                const item = crossSellItems.find(i => i.id === id);
                if (!item) return null;
                return { ...item, total: Number(item.price) || 0 };
            })
            .filter(Boolean);

        const mergedParts = [
            ...currentParts,
            ...resolvedAdditionals.filter(i => i.type === 'part')
        ];
        const mergedLabor = [
            ...currentLabor,
            ...resolvedAdditionals.filter(i => i.type === 'labor')
        ];
        const mergedSupplies = [
            ...currentSupplies,
            ...resolvedCrossSell,
            ...resolvedAdditionals.filter(i => i.type === 'unknown')
        ];

        const totalParts = mergedParts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
        const totalLabor = mergedLabor.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
        const totalSupplies = mergedSupplies.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

        const subtotal = totalParts + totalLabor + totalSupplies;
        const taxValue = subtotal * IVA_RATE;
        const total = subtotal + taxValue;

        return {
            currentParts, currentLabor, currentSupplies,
            currentAdditionals: resolvedAdditionals,
            currentCrossSell: resolvedCrossSell,
            finalMergedLists: { mergedParts, mergedLabor, mergedSupplies },
            totals: { parts: totalParts, labor: totalLabor, supplies: totalSupplies, subtotal, taxValue, total }
        };

    }, [
        selectedLine, selectedMaintenance, maintenanceDefinitions,
        parts, laborActivities, supplies, crossSellItems, globalLaborRate,
        selectedAdditionals, selectedCrossSell
    ]);

    const resetSelection = () => {
        setSelectedMaintenance(null);
        setSelectedAdditionals([]);
        setSelectedCrossSell([]);
    };

    const value = {
        selectedBrand, setSelectedBrand,
        selectedLine, setSelectedLine,
        selectedMaintenance, setSelectedMaintenance,
        serviceType, setServiceType,

        parts, globalLaborRate, laborActivities, supplies, crossSellItems, maintenanceDefinitions,
        availableMaintenances,

        ...contextData,

        selectedAdditionals, toggleAdditional,
        selectedCrossSell, toggleCrossSell,

        resetSelection, updatePart, addPart, deletePart, getPartsByLine,
        updateGlobalLaborRate, updateLaborActivity, addLaborActivity, deleteLaborActivity,
        updateSupply, updateCrossSellItem, addCrossSellItem, deleteCrossSellItem, updateMaintenanceDefinition, resolveMaintenanceDefinition, updatePartsByReference,

        issues,
        addIssue: (description, email) => {
            const newIssue = { id: `issue_${Date.now()}`, description, email, date: new Date().toISOString(), status: 'open' };
            setIssues(prev => [newIssue, ...prev]);
        },
        deleteIssue: (id) => setIssues(prev => prev.filter(i => i.id !== id)),

        vehicleLines,
        brands,
        addBrand,
        updateBrand,
        addVehicleLine,
        updateVehicleLine,
        deleteVehicleLine
    };

    return (
        <MaintenanceContext.Provider value={value}>
            {children}
        </MaintenanceContext.Provider>
    );
};
