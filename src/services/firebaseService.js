import { ref, set, get, onValue, off } from 'firebase/database';
import { database } from '../firebase.config';

// Storage keys for Firebase paths
const PATHS = {
    PARTS: 'parts',
    LABOR: 'laborActivities',
    SUPPLIES: 'supplies',
    DEFINITIONS: 'maintenanceDefinitions',
    GLOBAL_RATE: 'globalLaborRate',
    CROSS_SELL: 'crossSellItems',
    ISSUES: 'issues',
    BRANDS: 'brands',
    LINES: 'vehicleLines'
};

/**
 * Save data to Firebase
 */
export const saveToFirebase = async (path, data) => {
    try {
        const dbRef = ref(database, path);
        await set(dbRef, data);
        return { success: true };
    } catch (error) {
        console.error(`Error saving to Firebase (${path}):`, error);
        return { success: false, error };
    }
};

/**
 * Load data from Firebase (one-time read)
 */
export const loadFromFirebase = async (path, fallback = null) => {
    try {
        const dbRef = ref(database, path);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return fallback;
    } catch (error) {
        console.error(`Error loading from Firebase (${path}):`, error);
        return fallback;
    }
};

/**
 * Subscribe to real-time updates from Firebase
 */
export const subscribeToFirebase = (path, callback) => {
    const dbRef = ref(database, path);
    onValue(dbRef, (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : null);
    });
    return dbRef;
};

/**
 * Unsubscribe from Firebase updates
 */
export const unsubscribeFromFirebase = (dbRef) => {
    off(dbRef);
};

/**
 * Initialize Firebase with data from LocalStorage (migration helper)
 */
export const migrateFromLocalStorage = async () => {
    const STORAGE_KEYS = {
        PARTS: 'maint_app_parts',
        LABOR: 'maint_app_labor',
        SUPPLIES: 'maint_app_supplies',
        DEFINITIONS: 'maint_app_definitions',
        GLOBAL_RATE: 'maint_app_global_rate',
        CROSS_SELL: 'maint_app_cross_sell',
        ISSUES: 'maint_app_issues',
        BRANDS: 'maint_app_brands',
        LINES: 'maint_app_lines'
    };

    const migrations = [];

    for (const [firebasePath, localStorageKey] of Object.entries({
        [PATHS.PARTS]: STORAGE_KEYS.PARTS,
        [PATHS.LABOR]: STORAGE_KEYS.LABOR,
        [PATHS.SUPPLIES]: STORAGE_KEYS.SUPPLIES,
        [PATHS.DEFINITIONS]: STORAGE_KEYS.DEFINITIONS,
        [PATHS.GLOBAL_RATE]: STORAGE_KEYS.GLOBAL_RATE,
        [PATHS.CROSS_SELL]: STORAGE_KEYS.CROSS_SELL,
        [PATHS.ISSUES]: STORAGE_KEYS.ISSUES,
        [PATHS.BRANDS]: STORAGE_KEYS.BRANDS,
        [PATHS.LINES]: STORAGE_KEYS.LINES
    })) {
        try {
            const localData = localStorage.getItem(localStorageKey);
            if (localData) {
                const parsedData = JSON.parse(localData);
                migrations.push(saveToFirebase(firebasePath, parsedData));
            }
        } catch (error) {
            console.error(`Error migrating ${localStorageKey}:`, error);
        }
    }

    await Promise.all(migrations);
    console.log('Migration from LocalStorage to Firebase completed');
};

export { PATHS };
