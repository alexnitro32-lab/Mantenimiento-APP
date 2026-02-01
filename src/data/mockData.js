export const MOCK_BRANDS = [
  { id: 1, name: 'Hyundai' }
];

const GENERIC_CAR = "";

// Updated with specific local images as requested
export const MOCK_LINES = [
  { id: 'l_hb20k', brandId: 1, name: 'HB20', imageUrl: '/vehicles/hb20.png' },
  { id: 'l_venue', brandId: 1, name: 'VENUE', imageUrl: '/vehicles/venue.png' },
  { id: 'l_tucson', brandId: 1, name: 'TUCSON NX4', imageUrl: '/vehicles/tucson_nx4.png' },
  { id: 'l_tucson_hev', brandId: 1, name: 'TUCSON NX4 HEV', imageUrl: '/vehicles/tucson_hev.png' },
  { id: 'l_kona_hev_v1', brandId: 1, name: 'KONA HEV V1', imageUrl: '/vehicles/kona_hev_v1.png' },
  { id: 'l_kona_hev_v2', brandId: 1, name: 'KONA HEV V2', imageUrl: '/vehicles/kona_hev_v2.png' },
  { id: 'l_kona_gas', brandId: 1, name: 'KONA GASOLINA', imageUrl: '/vehicles/kona_gasolina.png' },
  { id: 'l_kona_ev', brandId: 1, name: 'KONA EV', imageUrl: '/vehicles/kona_ev.png' },
  { id: 'l_ioniq5', brandId: 1, name: 'IONIQ 5', imageUrl: '/vehicles/ioniq5.png' },
  { id: 'l_i10', brandId: 1, name: 'GRAN I10', imageUrl: '/vehicles/gran_i10.png' },
  { id: 'l_santafe_hev', brandId: 1, name: 'SANTAFE HEV', imageUrl: '/vehicles/santafe_hev.png' },
  { id: 'l_palisade', brandId: 1, name: 'PALISADE', imageUrl: '/vehicles/palisade.png' },
  { id: 'l_staria', brandId: 1, name: 'STARIA DIESEL', imageUrl: '/vehicles/staria.png' }
];

export const MOCK_MAINTENANCES = [
  { id: 'm1', name: 'Mantenimiento 5.000 KM', type: 'mileage', interval: 5000 },
  { id: 'm2', name: 'Mantenimiento 10.000 KM', type: 'mileage', interval: 10000 },
  { id: 'm_15k', name: 'Mantenimiento 15.000 KM', type: 'mileage', interval: 15000 },
  { id: 'm3', name: 'Mantenimiento 20.000 KM', type: 'mileage', interval: 20000 },
  { id: 'm_25k', name: 'Mantenimiento 25.000 KM', type: 'mileage', interval: 25000 },
  { id: 'm5', name: 'Mantenimiento 30.000 KM', type: 'mileage', interval: 30000 },
  { id: 'm_35k', name: 'Mantenimiento 35.000 KM', type: 'mileage', interval: 35000 },
  { id: 'm6', name: 'Mantenimiento 40.000 KM', type: 'mileage', interval: 40000 },
  { id: 'm_45k', name: 'Mantenimiento 45.000 KM', type: 'mileage', interval: 45000 },
  { id: 'm7', name: 'Mantenimiento 50.000 KM', type: 'mileage', interval: 50000 },
  { id: 'm_55k', name: 'Mantenimiento 55.000 KM', type: 'mileage', interval: 55000 },
  { id: 'm8', name: 'Mantenimiento 60.000 KM', type: 'mileage', interval: 60000 },
  { id: 'm_65k', name: 'Mantenimiento 65.000 KM', type: 'mileage', interval: 65000 },
  { id: 'm9', name: 'Mantenimiento 70.000 KM', type: 'mileage', interval: 70000 },
  { id: 'm_75k', name: 'Mantenimiento 75.000 KM', type: 'mileage', interval: 75000 },
  { id: 'm10', name: 'Mantenimiento 80.000 KM', type: 'mileage', interval: 80000 },
  { id: 'm_85k', name: 'Mantenimiento 85.000 KM', type: 'mileage', interval: 85000 },
  { id: 'm11', name: 'Mantenimiento 90.000 KM', type: 'mileage', interval: 90000 },
  { id: 'm_95k', name: 'Mantenimiento 95.000 KM', type: 'mileage', interval: 95000 },
  { id: 'm12', name: 'Mantenimiento 100.000 KM', type: 'mileage', interval: 100000 },
  { id: 'm_oil', name: 'Cambio de Aceite (Solo)', type: 'service', interval: 0 },
  { id: 'm4', name: 'Mantenimiento Anual', type: 'time', interval: 12 }
];

// --- ADDITIVES ---
const COMMON_ADDITIVES = [
  { reference: 'NC024733166', name: 'Refrigerante azul', price: 86466 },
  { reference: '2151323001', name: 'Arandela tapón carter', price: 3853 },
  { reference: 'NC024725773', name: 'Líquido de frenos', price: 30420 },
  { reference: '890108011', name: 'Limpiador de frenos', price: 39496 },
  { reference: '0B506', name: 'Elevador de octanaje', price: 32000 },
  { reference: '210E', name: 'Limpiador de inyectores', price: 58824 },
  { reference: '893', name: 'Limpiador cuerpo aceleración', price: 35000 },
  { reference: 'NC20472', name: 'Líquido limpiabrisas', price: 11084 },
  { reference: 'VK011', name: 'Limpiador contactos electrónicos', price: 41008 },
  { reference: 'NC024735666', name: 'Refrigerante verde', price: 66043 },
  { reference: 'GRASA01', name: 'Grasa', price: 30000 },
  { reference: '1125141', name: 'Aceite transmisión (80W-90)', price: 43000 },
  { reference: '112427', name: 'Aceite diferencial (85W-140)', price: 55000 },
  { reference: '121287', name: 'Líquido hidráulico ATF', price: 51440 }
];

// --- VEHICLE PARTS DATA ---
const VEHICLE_PARTS_DATA = {
  'l_tucson_hev': [
    { reference: '6012431', name: 'Aceite motor (cuarto)', price: 73300 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 94391 },
    { reference: '2630035505', name: 'Filtro de aceite', price: 32001 },
    { reference: '28113N9000', name: 'Filtro de aire', price: 122380 },
    { reference: '97133N9000', name: 'Filtro de aire acond.', price: 154966 },
    { reference: '31112D5500', name: 'Filtro combustible', price: 135531 },
    { reference: '1884611090', name: 'Bujías', price: 91300 },
    { reference: '252122B170', name: 'Correa accesorios', price: 239332 }
  ],
  'l_kona_gas': [
    { reference: '6012431', name: 'Aceite motor (cuarto)', price: 31315 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 31341 },
    { reference: '2630035505', name: 'Filtro de aceite', price: 34156 },
    { reference: '28113J9100', name: 'Filtro de aire', price: 112534 },
    { reference: '97133J9000', name: 'Filtro caja polen', price: 137630 },
    { reference: '31112C9100', name: 'Filtro combustible', price: 210435 },
    { reference: '1884610060', name: 'Bujías', price: 112000 },
    { reference: '252122B140', name: 'Correa accesorios', price: 241000 }
  ],
  'l_hb20k': [
    { reference: '6012431', name: 'Aceite motor (cuarto)', price: 33300 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 71214 },
    { reference: '2630002503', name: 'Filtro de aceite', price: 29431 },
    { reference: '28113R1200', name: 'Filtro de aire', price: 122380 },
    { reference: '97133R1000', name: 'Filtro de aire acond.', price: 137456 },
    { reference: '31112R1000', name: 'Filtro combustible', price: 91231 },
    { reference: '1885514061', name: 'Bujías', price: 55000 },
    { reference: '252122B170', name: 'Correa accesorios', price: 190100 }
  ],
  'l_tucson': [ // Mapped from GRAVITY
    { reference: '6012431', name: 'Aceite motor', price: 33300 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 29141 },
    { reference: '2630035505', name: 'Filtro de aceite', price: 34431 },
    { reference: '28113K2100', name: 'Filtro de aire', price: 112432 },
    { reference: '97133J9000', name: 'Filtro de caja polen', price: 137630 },
    { reference: '31112C9100', name: 'Filtro combustible', price: 210435 }, // Inferred price
    { reference: '252122B170', name: 'Correa accesorios', price: 234332 }
  ],
  'l_venue': [
    { reference: '6012431', name: 'Aceite motor', price: 33300 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 29141 },
    { reference: '2630035505', name: 'Filtro de aceite', price: 34431 },
    { reference: '28113K2100', name: 'Filtro de aire', price: 105220 },
    { reference: '97133K2000', name: 'Filtro caja polen', price: 125732 },
    { reference: '31112C9100', name: 'Filtro combustible', price: 175755 },
    { reference: '1885514061', name: 'Bujías', price: 55000 },
    { reference: '252122B170', name: 'Correa accesorios', price: 190100 }
  ],
  'l_i10': [
    { reference: '6012431', name: 'Aceite motor', price: 33300 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 31341 },
    { reference: '2630002503', name: 'Filtro de aceite', price: 29431 },
    { reference: '28113C7000', name: 'Filtro de aire', price: 86881 },
    { reference: '97133D7000', name: 'Filtro de aire acond.', price: 91341 },
    { reference: '31112C7000', name: 'Filtro combustible', price: 115354 },
    { reference: '1885410081', name: 'Bujías', price: 55000 },
    { reference: '2521203000', name: 'Correa accesorios', price: 102731 }
  ],
  'l_palisade': [
    { reference: '6012431', name: 'Aceite motor', price: 63909 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 148684 },
    { reference: '263203CAA0', name: 'Filtro de aceite', price: 45000 },
    { reference: '28113S8000', name: 'Filtro de aire', price: 95000 },
    { reference: '97133S8000', name: 'Filtro combustible', price: 158600 },
    { reference: '31910S9000', name: 'Filtro combustible', price: 105652 },
    { reference: '252123N000', name: 'Correa accesorios', price: 250000 }
  ],
  'l_staria': [ // STARIA GASOLINA
    { reference: '6012431', name: 'Aceite motor', price: 63200 },
    { reference: '0450000121', name: 'Aceite transmisión', price: 104861 },
    { reference: '2630035505', name: 'Filtro aceite', price: 102834 },
    { reference: '97133R0000', name: 'Filtro caja polen', price: 151500 },
    { reference: '31112...', name: 'Filtro combustible', price: 0 },
    { reference: '1885510060', name: 'Bujías', price: 58999 },
    { reference: '25212...', name: 'Correa accesorios', price: 250000 }
  ],
  // ADD PENDING MAPPINGS FOR OTHERS (KONA HEV etc) WITH PLACEHOLDERS OR SIMILAR
  'l_kona_hev_v1': [
    { reference: '6012431', name: 'Aceite motor', price: 73300 }, // Copied from Tucson HEV as rollback
    { reference: '2630035505', name: 'Filtro de aceite', price: 32001 }
  ],
  'l_kona_hev_v2': [
    { reference: '6012431', name: 'Aceite motor', price: 73300 },
    { reference: '2630035505', name: 'Filtro de aceite', price: 32001 }
  ]
};

// Generate MOCK_PARTS
let generatedParts = [];

MOCK_LINES.forEach(line => {
  // 1. Add Specific Parts
  const specificParts = VEHICLE_PARTS_DATA[line.id] || [];
  specificParts.forEach(p => {
    generatedParts.push({
      id: `p_${line.id}_${p.reference}`,
      reference: p.reference,
      name: p.name,
      price: p.price,
      lineId: line.id,
      allocations: [],
      category: 'main'
    });
  });

  // 2. Add Common Additives
  COMMON_ADDITIVES.forEach(a => {
    generatedParts.push({
      id: `add_${line.id}_${a.reference}`,
      reference: a.reference,
      name: a.name,
      price: a.price,
      lineId: line.id,
      allocations: [],
      category: 'additive'
    });
  });
});

export const MOCK_PARTS = generatedParts;

export const MOCK_GLOBAL_LABOR_RATE = 85000;

export const MOCK_LABOR_ACTIVITIES = [
  { id: 'la1', description: 'Cambio de Aceite y Filtros', hours: 0.5 },
  { id: 'la2', description: 'Revisión General (Frenos, Suspensión)', hours: 1.5 },
  { id: 'la3', description: 'Alineación y Balanceo', hours: 1.0 },
  { id: 'la4', description: 'Sincronización', hours: 2.5 },
  { id: 'la5', description: 'Mantenimiento Frenos', hours: 1.2 }
];

export const MOCK_MAINTENANCE_ACTIVITIES = {
  'm1': ['la1', 'la2'],
  'm2': ['la1', 'la2', 'la3'],
  'm3': ['la1', 'la2', 'la3', 'la4'],
  'm_oil': ['la1']
};

export const MOCK_SUPPLIES = [
  { id: 's1', name: 'Insumos / Materiales', price: 25000 }
];

export const MOCK_CROSS_SELL_ITEMS = [
  { id: 'cs1', name: 'Purificación de ductos', price: 80000 },
  { id: 'cs2', name: 'Extintor', price: 65000 },
  { id: 'cs3', name: 'Traslado vehicular', price: 50000 },
  { id: 'cs4', name: 'Embellecimiento', price: 120000 },
  { id: 'cs5', name: 'Lavado de motor', price: 40000 },
  { id: 'cs6', name: 'Polichado', price: 150000 },
  { id: 'cs7', name: 'Kit 1 de lavado', price: 35000 },
  { id: 'cs8', name: 'Kit 2 de lavado', price: 55000 },
  { id: 'cs9', name: 'Kit 3 de lavado', price: 85000 },
  { id: 'cs10', name: 'Kit 4 de lavado', price: 120000 },
  { id: 'cs11', name: 'GardX', price: 450000 },
  { id: 'cs12', name: 'Ceramico', price: 1200000 }
];

export const IVA_RATE = 0.19;
