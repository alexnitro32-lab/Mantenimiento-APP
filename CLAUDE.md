# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aplicación de Mantenimiento Vehicular** is a React web application for Hyundai service advisors to quickly quote vehicle maintenance services. It features a dual-role system:
- **Advisor Role**: Service advisors select vehicles, maintenance types, and calculate costs with dynamic add-ons
- **Admin Role**: Administrators configure maintenance recipes (parts, labor, supplies), vehicle lines, pricing, and review advisor feedback

The app persists data to Firebase Realtime Database with automatic migration from LocalStorage on first startup.

## Quick Start Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Architecture Overview

### Stack
- **Frontend**: React 19 with Vite (ES modules)
- **State Management**: React Context API (MaintenanceContext)
- **Backend**: Firebase Realtime Database (RTDB)
- **Styling**: CSS with CSS variables (index.css), inline styles throughout
- **Build Tool**: Vite with React plugin
- **Linting**: ESLint with React Hooks plugin

### Core Data Model

The application manages interconnected data stored in Firebase under these paths:
- `brands` — Vehicle brands (e.g., Hyundai)
- `vehicleLines` — Vehicle models (e.g., TUCSON NX4, KONA HEV) with serviceInterval
- `parts` — Spare parts catalog per vehicle line (reference, name, price, lineId)
- `laborActivities` — Labor tasks (description, hours)
- `supplies` — Fixed supply costs (e.g., diagnostic fee)
- `globalLaborRate` — Hourly labor cost used across all calculations
- `maintenanceDefinitions` — Recipes mapping (lineId + maintenanceId) to parts/labor/supplies
- `crossSellItems` — Fixed-price upsell items (tires, batteries, etc.)
- `issues` — Advisor feedback/bug reports with email and timestamp

### Key Context: MaintenanceContext

Located in `src/context/MaintenanceContext.jsx`, this is the application's state hub:

**Selection State** (Advisor workflow):
- `selectedBrand`, `selectedLine`, `selectedMaintenance` — User selections
- `serviceType` — 'particular', 'taxi' (Gran i10), or 'publico' (STARIA)
- `selectedAdditionals`, `selectedCrossSell` — Dynamic add-ons user toggles

**Mutable Admin Data** (synced with Firebase):
- `parts`, `laborActivities`, `supplies`, `crossSellItems`, `brands`, `vehicleLines`, `maintenanceDefinitions`
- `globalLaborRate` — Single numeric value affecting all labor cost calculations

**Computed Values** (memoized from selections + catalog):
- `currentParts`, `currentLabor`, `currentSupplies` — Items in the selected maintenance
- `currentAdditionals`, `currentCrossSell` — Resolved selected add-ons with prices
- `finalMergedLists` — Combined lists with quantities and totals
- `totals` — Parts/Labor/Supplies/Subtotal/IVA/Total (IVA = 19%)

**Key Functions**:
- `calculateAvailableMaintenances(selectedLine, maintenances, serviceType)` — Filters mileage intervals per vehicle type (Gran i10 and STARIA have special 5k/10k logic)
- `getEffectiveMaintenanceId(maintenanceId)` — Inheritance logic: 30k/70k/90k inherit from 10k master; 40k/60k/80k inherit from 20k master
- `resolveMaintenanceDefinition(lineId, maintenanceId)` — Resolves actual definition with inheritance
- `migrateFromLocalStorage()` — One-time migration helper on app startup

### Maintenance Configuration Inheritance

Two "master" maintenance intervals define recipes that cascade to others:
- **10k Master** (m2): Applies to 30k, 70k, 90k
- **20k Master** (m3): Applies to 40k, 60k, 80k

When you save a 10k or 20k configuration in the Admin Configurator, it automatically affects derived intervals. Direct definitions for intermediate intervals (5k, 15k, 25k, 35k, 45k, etc.) are allowed but don't affect others.

### Role-Based Navigation

In `src/App.jsx`:
- Default role is 'advisor'
- Clicking the logo or navigating to admin prompts a password modal (LoginModal.jsx)
- Password: `Automotor.2026#` (hardcoded)
- On success, role switches to 'admin' and shows AdminDashboard; footer button "Volver a Vista Asesor" resets to advisor

### Advisor Flow (src/components/Advisor/)

1. **VehicleSelector**: Brand → Line → Service Type (if STARIA or GRAN I10)
2. **MaintenanceSelector**: Filters available maintenances based on line and serviceType
3. **CostSummary**: Displays vehicle image, calculates totals (Parts + Labor + Supplies + 19% IVA)
4. **DetailList**: Lists parts, labor, supplies, additionals, and cross-sell with toggle options
5. **IssueReporter**: Floating button for advisors to report problems (fixed bottom-right)

### Admin Dashboard (src/components/Admin/AdminDashboard.jsx)

Tabbed interface with 6 sections:

1. **Global / Mano de Obra**
   - Global labor rate (single input, affects all calculations)
   - Labor activities CRUD (description, hours)
   - Supplies CRUD (fixed-price items like diagnostic fee)

2. **Catálogo Repuestos** (Parts Catalog)
   - Two views: "Por Línea de Vehículo" (per-vehicle parts) and "Vista General" (bulk edit by reference)
   - Per-line view: Select a vehicle line, add/edit/delete parts
   - General view: Edit all parts with same reference across all vehicles simultaneously (via updatePartsByReference)

3. **Venta Cruzada** (Cross-Sell)
   - Add/remove fixed-price upsell items

4. **Configurador Recetas** (Maintenance Recipes)
   - Select Brand → Line → Maintenance
   - Assign labor, parts (with quantities), and supplies to the maintenance
   - Respects inheritance rules (10k and 20k masters)
   - On save, persists to Firebase under maintenanceDefinitions[lineId_maintenanceId]

5. **Vehículos** (Vehicle Management)
   - Add new vehicle lines: Brand (select or create), Name, Service Frequency (10k or 5k), Image upload
   - Edit/delete existing vehicles
   - Images stored as Base64 dataURLs in Firebase

6. **Reportes** (Issue Reports)
   - Display advisor-submitted issues with timestamps and emails
   - "Responder" button opens email client pre-filled with issue context
   - "Resolver" button deletes the issue

### Firebase Integration

**firebaseService.js** exports:
- `saveToFirebase(path, data)` — Overwrites entire path
- `loadFromFirebase(path, fallback)` — One-time async read
- `subscribeToFirebase(path, callback)` — Real-time listener, calls callback on every update
- `unsubscribeFromFirebase(ref)` — Detach listener
- `migrateFromLocalStorage()` — Helper to push LocalStorage data to Firebase on first load

**Config** (firebase.config.js):
```
projectId: "mantenimiento-app-bb003"
databaseURL: "https://mantenimiento-app-bb003-default-rtdb.firebaseio.com"
```

### Special Vehicle Logic

**GRAN I10** and **STARIA DIESEL** have conditional maintenance intervals:
- GRAN I10 + TAXI: Show 5k, 10k, 15k, 20k, ..., 100k
- GRAN I10 + PARTICULAR: Show only 10k multiples (10k, 20k, 30k, ..., 100k)
- STARIA + PUBLICO: Show 5k, 10k, 15k, 20k, ..., 100k
- STARIA + PARTICULAR: Show only 10k multiples

Logic in calculateAvailableMaintenances() and MaintenanceSelector component.

### Data Types & IDs

- **Brand ID**: Numeric (e.g., 1)
- **Vehicle Line ID**: String prefixed l_ (e.g., l_tucson_hev)
- **Maintenance ID**: String (m1, m2, m3, m5, m6, etc.; custom maintenance is id: 'custom')
- **Part ID**: String prefixed p followed by timestamp (e.g., p1612137600000)
- **Labor ID**: String prefixed la
- **Supply ID**: String prefixed s_
- **Cross-Sell ID**: String prefixed cs_
- **Issue ID**: String prefixed issue_

## File Structure Highlights

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Role switcher, header, navigation
├── firebase.config.js          # Firebase initialization
├── index.css                   # Global CSS variables and utilities
├── context/
│   └── MaintenanceContext.jsx  # Central state management
├── components/
│   ├── Advisor/
│   │   ├── Dashboard.jsx       # Advisor layout (4-step flow)
│   │   ├── VehicleSelector.jsx # Brand/Line/ServiceType selection
│   │   ├── MaintenanceSelector.jsx # Maintenance interval picker
│   │   ├── CostSummary.jsx     # Total display + vehicle image
│   │   ├── DetailList.jsx      # Parts/Labor/Supplies/Add-ons list
│   │   └── Advisor.css         # Advisor-specific styles
│   ├── Admin/
│   │   └── AdminDashboard.jsx  # 6-tab admin interface
│   ├── Auth/
│   │   └── LoginModal.jsx      # Password entry modal
│   ├── IssueReporter.jsx       # Floating feedback widget
│   └── AnalyticsContext.jsx    # Unused placeholder
├── data/
│   └── mockData.js             # Initial mock data for all collections
├── services/
│   └── firebaseService.js      # Firebase CRUD helpers
└── utils/
    └── format.js               # Colombian peso currency formatter
```

## Common Workflows

### Adding a New Vehicle Line

1. Admin → Vehículos tab
2. Select or create Brand
3. Enter Line Name (e.g., "TUCSON NX5")
4. Choose service frequency (10k or 5k)
5. Upload PNG vehicle image (recommended 350×220px, max 800KB)
6. Click "Crear Vehículo"
7. Firebase auto-generates ID (l_<timestamp>)

### Configuring a Maintenance Recipe

1. Admin → Configurador Recetas
2. Select Brand → Line → Maintenance (e.g., "TUCSON NX4" → "Mantenimiento 10.000 KM")
3. Check labor activities (e.g., "Oil Change", "Filter Change")
4. Check spare parts and set quantities
5. Check mandatory supplies
6. Click "Guardar Configuración"
7. If editing 10k or 20k, it cascades to inherited intervals

### Bulk Edit Parts by Reference

1. Admin → Catálogo Repuestos → Vista General
2. Find part by reference (e.g., "6012431" Oil)
3. Click "Editar"
4. Change name and/or price
5. Click "Guardar"
6. Updates all vehicles using this reference via updatePartsByReference()

### Advisor Workflow

1. Select Brand → Line
2. [If STARIA/GRAN I10] Select Service Type
3. Select Maintenance
4. View cost breakdown; toggle optional additionals and cross-sell items
5. See real-time total with 19% IVA
6. [If problem] Click "¿Hay algún problema?" button to report issue

## Implementation Details

### IVA (Sales Tax)

Set to 19% in mockData.js as IVA_RATE = 0.19. All calculations use:
```
Total = (Parts + Labor + Supplies) x (1 + IVA_RATE)
```

### Currency Formatting

Colombian Pesos (COP) formatted with no decimal places via formatCurrency() in src/utils/format.js.

### Image Handling

- Vehicle images: Stored as Base64 dataURLs in Firebase
- Size limit: 800KB per vehicle
- Recommended dimensions: 350px × 220px (PNG without background)
- For Gran i10 and STARIA, conditional image paths:
  - `/vehicles/gran_i10_taxi.png` (yellow taxi variant)
  - `/vehicles/staria_particular.png` (black private variant)
  - Falls back to stored imageUrl if files not found

### Admin Form Validation

Most admin forms validate required fields before submit. Uses alert() dialogs for feedback.

### Password Security

Admin password is hardcoded in LoginModal.jsx. For production, replace with proper authentication (Firebase Auth or OAuth).

## Firebase Persistence Flow

1. **Startup**: MaintenanceContext useEffect checks if Firebase has data via loadFromFirebase(PATHS.BRANDS)
2. **If empty**: Call migrateFromLocalStorage() to push mockData to Firebase
3. **Subscriptions**: subscribeToFirebase() attaches real-time listeners on all paths
4. **Every Change**: Admin actions call saveToFirebase() immediately
5. **Offline**: Changes go to UI state; Firebase SDK queues writes

## Linting & Code Quality

ESLint config in eslint.config.js:
- Enforces React Hooks rules
- No unused variables (except uppercase/underscore-prefixed ones)

Run with `npm run lint`.

## Notes for Future Development

- **Hardcoded Admin Password**: Replace with Firebase Authentication for multi-user access
- **Image Storage**: Base64 in Firebase works but consider Firebase Storage for scalability
- **LocalStorage Migration**: One-time helper; can be removed after all users migrated
- **Unused Files**: AnalyticsContext.jsx is imported but not used; can remove if no future plans
- **Responsive Design**: Mobile-first CSS with breakpoints at 768px; test on tablet/mobile
- **Custom Maintenance**: Advisors can select "Personalizado" (custom) maintenance with no preset parts/labor
