/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ClientInfo,
  FixedCostsConfig,
  MachineItem,
  MaterialItem,
  OrderItem,
  ProductRecipe,
  WorkshopSettings,
} from '../types/calculator';
import {
  DEFAULT_FIXED_COSTS,
  SEED_MACHINES,
  SEED_MATERIALS,
  SEED_RECIPES,
  calculateOrderMetrics,
  calculateRecipeCosts,
  calculateShippingDetails,
} from './calculatorEngine';

const MACHINES_STORAGE_KEY = 'artigiani_digitali_machines_v3';
const MATERIALS_STORAGE_KEY = 'artigiani_digitali_materials_v3';
const RECIPES_STORAGE_KEY = 'artigiani_digitali_recipes_v3';
const ORDERS_STORAGE_KEY = 'artigiani_digitali_orders_v4';
const FIXED_COSTS_STORAGE_KEY = 'artigiani_digitali_fixed_costs_v3';
const CLIENTS_STORAGE_KEY = 'artigiani_digitali_clients_v3';
const SETTINGS_STORAGE_KEY = 'artigiani_digitali_settings_v4';

export const DEFAULT_WORKSHOP_SETTINGS: WorkshopSettings = {
  workshopName: 'Bottega Artigiani Digitali S.r.l.s.',
  artisanName: 'Marco Valenti',
  tagline: 'Stampa 3D, Taglio Laser, CNC e Manifattura Digitale su Misura',
  email: 'officina@artigianidigitali.it',
  pec: 'artigianidigitali@pec.it',
  phone: '+39 02 8945 1200',
  website: 'https://www.artigianidigitali.it',
  address: 'Via delle Manifatture 42',
  city: 'Milano',
  zipCode: '20100',
  province: 'MI',
  vatNumber: 'IT 09876543210',
  fiscalCode: 'VLNMRA85M15F205Z',
  sdiCode: 'M5UXCR1',
  iban: 'IT60X0542811101000000123456',
  bankName: 'Banca Intesa Sanpaolo - Sede Milano',
  logoUrl: '',
  fixedCosts: DEFAULT_FIXED_COSTS,
  termsAndConditions:
    '1. Validità preventivo: 30 giorni dalla data di emissione.\n2. Condizioni di pagamento: 50% all\'ordine, saldo alla consegna o spedizione.\n3. Tempi di consegna stimati: 5-7 giorni lavorativi dall\'approvazione esecutiva.\n4. I file 3D e vettoriali devono rispettare le tolleranze di processo concordate.',
  invoiceNotes:
    'Documento emesso per commessa digitale. Esente bollo per importi inferiori a € 77,47. Si prega di indicare il numero documento nella causale del bonifico.',
};

const SEED_CLIENTS: ClientInfo[] = [
  {
    id: 'cli-001',
    name: 'Arch. Sofia Bianchi',
    company: 'Studio Architettura & Spazio Srl',
    email: 'sofia.bianchi@spazioarch.it',
    phone: '+39 340 1234567',
    address: 'Corso Sempione 15, Milano',
    taxNumber: 'IT01234567891',
    notes: 'Committente per plastici e oggettistica promozionale su misura.',
  },
  {
    id: 'cli-002',
    name: 'Matteo Ferrari',
    company: 'Meccanica & Prototipi snc',
    email: 'm.ferrari@mechatronics-proto.it',
    phone: '+39 059 876543',
    address: 'Via Emilia Est 102, Modena',
    taxNumber: 'IT09876543212',
    notes: 'Richiede componenti funzionali e lotti di piccole tirature.',
  },
  {
    id: 'cli-003',
    name: 'Elena Moretti',
    company: 'Bottega Creativa',
    email: 'elena@bottegacreativa.com',
    phone: '+39 348 7654321',
    address: 'Via dei Mestieri 8, Firenze',
    taxNumber: 'MRT LNE 85H41 F205Z',
    notes: 'Ordini ripetitivi di portachiavi e merchandising inciso.',
  },
];

// Seed order conforme con calcolo spedizione e pesi
const rec001 = SEED_RECIPES[0];
const recCosts = calculateRecipeCosts(rec001, SEED_MATERIALS, DEFAULT_FIXED_COSTS, SEED_MACHINES[2]);
const shipping = calculateShippingDetails(recCosts.totalMaterialWeightGrams, 25, 80);
const ordMetrics = calculateOrderMetrics(
  recCosts.costTotal,
  rec001.sellingPrice,
  80,
  15,
  20,
  shipping.suggestedCostEur
);

const SEED_ORDERS: OrderItem[] = [
  {
    id: 'ord-001',
    code: 'ORD-2026-081',
    title: 'Fornitura 80x Portachiavi in legno inciso con calamite',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[2],
    quantity: 80,
    volumeDiscountPercent: 15,
    minAcceptableMarginPercent: 20,
    costMaterialPerPiece: recCosts.costMaterial,
    costMachinePerPiece: recCosts.costMachine,
    costLaborPerPiece: recCosts.costLabor,
    costWastePerPiece: recCosts.costWaste,
    costTotalPerPiece: recCosts.costTotal,
    unitBasePrice: rec001.sellingPrice,
    unitDiscountedPrice: ordMetrics.unitDiscountedPrice,
    totalRevenue: ordMetrics.totalRevenue,
    totalCost: ordMetrics.totalCost,
    totalMarginEur: ordMetrics.totalMarginEur,
    realMarginPercent: ordMetrics.realMarginPercent,
    isUnderMarginAlert: ordMetrics.isUnderMarginAlert,
    totalMaterialWeightGrams: shipping.totalMaterialWeightGrams,
    totalPackagingWeightGrams: shipping.totalPackagingWeightGrams,
    totalGrossWeightKg: shipping.totalGrossWeightKg,
    volumetricWeightKg: shipping.volumetricWeightKg,
    suggestedCourierBracket: shipping.suggestedCourierBracket,
    shippingCostEur: shipping.suggestedCostEur,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 5,
    validityDays: 30,
    notes: 'Incisione laser su pannello betulla 3mm levigato con 2 calamite ciascuno. Consegna effettuata con successo.',
    createdAt: '2026-10-22T14:30:00.000Z',
    updatedAt: '2026-10-26T16:00:00.000Z',
  },
  {
    id: 'ord-hist-11',
    code: 'ORD-2025-114',
    title: 'Lotto 50x Portachiavi promozionali in betulla',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[2],
    quantity: 50,
    volumeDiscountPercent: 10,
    minAcceptableMarginPercent: 25,
    costMaterialPerPiece: 0.44,
    costMachinePerPiece: 0.18,
    costLaborPerPiece: 2.50,
    costWastePerPiece: 0.01,
    costTotalPerPiece: 3.13,
    unitBasePrice: 12.00,
    unitDiscountedPrice: 10.80,
    totalRevenue: 540.00,
    totalCost: 156.50,
    totalMarginEur: 383.50,
    realMarginPercent: 71.0,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 1000,
    totalPackagingWeightGrams: 500,
    totalGrossWeightKg: 1.5,
    volumetricWeightKg: 1.2,
    suggestedCourierBracket: '1-3 kg',
    shippingCostEur: 9.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 4,
    validityDays: 30,
    notes: 'Lotto iniziale inaugurazione bottega artigiana',
    createdAt: '2025-11-18T10:00:00.000Z',
    updatedAt: '2025-11-23T11:00:00.000Z',
  },
  {
    id: 'ord-hist-12',
    code: 'ORD-2025-138',
    title: 'Fornitura Natale 120x Decorazioni e Vasi geometrici PLA',
    recipeId: 'rec-002',
    recipeName: 'Vaso geometrico decorativo PLA con imballo',
    technology: 'print3d',
    machineId: 'mac-001',
    machineName: 'Bambu Lab X1-Carbon (FDM)',
    client: SEED_CLIENTS[0],
    quantity: 45,
    volumeDiscountPercent: 12,
    minAcceptableMarginPercent: 30,
    costMaterialPerPiece: 1.29,
    costMachinePerPiece: 1.48,
    costLaborPerPiece: 5.00,
    costWastePerPiece: 0.06,
    costTotalPerPiece: 7.83,
    unitBasePrice: 28.00,
    unitDiscountedPrice: 24.64,
    totalRevenue: 1108.80,
    totalCost: 352.35,
    totalMarginEur: 756.45,
    realMarginPercent: 68.2,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 2025,
    totalPackagingWeightGrams: 1125,
    totalGrossWeightKg: 3.15,
    volumetricWeightKg: 4.2,
    suggestedCourierBracket: '3-5 kg',
    shippingCostEur: 14.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 8,
    validityDays: 30,
    notes: 'Campagna natalizia confezionata in scatole singole',
    createdAt: '2025-12-14T09:30:00.000Z',
    updatedAt: '2025-12-20T17:00:00.000Z',
  },
  {
    id: 'ord-hist-01',
    code: 'ORD-2026-009',
    title: 'Plastico architettonico & Dime di montaggio',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[0],
    quantity: 35,
    volumeDiscountPercent: 5,
    minAcceptableMarginPercent: 25,
    costMaterialPerPiece: 0.85,
    costMachinePerPiece: 0.35,
    costLaborPerPiece: 3.50,
    costWastePerPiece: 0.03,
    costTotalPerPiece: 4.73,
    unitBasePrice: 18.00,
    unitDiscountedPrice: 17.10,
    totalRevenue: 598.50,
    totalCost: 165.55,
    totalMarginEur: 432.95,
    realMarginPercent: 72.3,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 900,
    totalPackagingWeightGrams: 400,
    totalGrossWeightKg: 1.3,
    volumetricWeightKg: 1.5,
    suggestedCourierBracket: '1-3 kg',
    shippingCostEur: 9.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 5,
    validityDays: 30,
    createdAt: '2026-01-20T11:15:00.000Z',
    updatedAt: '2026-01-26T15:30:00.000Z',
  },
  {
    id: 'ord-hist-02',
    code: 'ORD-2026-018',
    title: 'Serie 60x Targhette incise e Ciondoli di precisione',
    recipeId: 'rec-003',
    recipeName: 'Ciondolo e medaglietta incisa su plexiglass',
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[2],
    quantity: 60,
    volumeDiscountPercent: 10,
    minAcceptableMarginPercent: 20,
    costMaterialPerPiece: 0.25,
    costMachinePerPiece: 0.29,
    costLaborPerPiece: 2.50,
    costWastePerPiece: 0.02,
    costTotalPerPiece: 3.06,
    unitBasePrice: 9.50,
    unitDiscountedPrice: 8.55,
    totalRevenue: 513.00,
    totalCost: 183.60,
    totalMarginEur: 329.40,
    realMarginPercent: 64.2,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 480,
    totalPackagingWeightGrams: 300,
    totalGrossWeightKg: 0.78,
    volumetricWeightKg: 0.9,
    suggestedCourierBracket: '0-1 kg',
    shippingCostEur: 7.00,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 4,
    validityDays: 30,
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-02-21T18:00:00.000Z',
  },
  {
    id: 'ord-hist-03',
    code: 'ORD-2026-029',
    title: 'Tiratura 70x Portachiavi aziendali personalizzati',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[1],
    quantity: 70,
    volumeDiscountPercent: 15,
    minAcceptableMarginPercent: 20,
    costMaterialPerPiece: 0.44,
    costMachinePerPiece: 0.18,
    costLaborPerPiece: 2.50,
    costWastePerPiece: 0.01,
    costTotalPerPiece: 3.13,
    unitBasePrice: 12.00,
    unitDiscountedPrice: 10.20,
    totalRevenue: 714.00,
    totalCost: 219.10,
    totalMarginEur: 494.90,
    realMarginPercent: 69.3,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 1400,
    totalPackagingWeightGrams: 700,
    totalGrossWeightKg: 2.1,
    volumetricWeightKg: 2.0,
    suggestedCourierBracket: '1-3 kg',
    shippingCostEur: 9.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 6,
    validityDays: 30,
    createdAt: '2026-03-12T14:00:00.000Z',
    updatedAt: '2026-03-19T11:30:00.000Z',
  },
  {
    id: 'ord-hist-04',
    code: 'ORD-2026-037',
    title: 'Lotto 55x Scatole decorative tagliate al laser',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[2],
    quantity: 55,
    volumeDiscountPercent: 8,
    minAcceptableMarginPercent: 20,
    costMaterialPerPiece: 0.88,
    costMachinePerPiece: 0.36,
    costLaborPerPiece: 3.00,
    costWastePerPiece: 0.02,
    costTotalPerPiece: 4.26,
    unitBasePrice: 16.00,
    unitDiscountedPrice: 14.72,
    totalRevenue: 809.60,
    totalCost: 234.30,
    totalMarginEur: 575.30,
    realMarginPercent: 71.1,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 1500,
    totalPackagingWeightGrams: 800,
    totalGrossWeightKg: 2.3,
    volumetricWeightKg: 2.5,
    suggestedCourierBracket: '1-3 kg',
    shippingCostEur: 9.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 5,
    validityDays: 30,
    createdAt: '2026-04-10T09:20:00.000Z',
    updatedAt: '2026-04-16T17:15:00.000Z',
  },
  {
    id: 'ord-hist-05',
    code: 'ORD-2026-049',
    title: 'Commesse Salone del Mobile: Espositori e Vasi d\'Arte',
    recipeId: 'rec-002',
    recipeName: 'Vaso geometrico decorativo PLA con imballo',
    technology: 'print3d',
    machineId: 'mac-001',
    machineName: 'Bambu Lab X1-Carbon (FDM)',
    client: SEED_CLIENTS[0],
    quantity: 85,
    volumeDiscountPercent: 10,
    minAcceptableMarginPercent: 30,
    costMaterialPerPiece: 1.29,
    costMachinePerPiece: 1.48,
    costLaborPerPiece: 5.00,
    costWastePerPiece: 0.06,
    costTotalPerPiece: 7.83,
    unitBasePrice: 32.00,
    unitDiscountedPrice: 28.80,
    totalRevenue: 2448.00,
    totalCost: 665.55,
    totalMarginEur: 1782.45,
    realMarginPercent: 72.8,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 3825,
    totalPackagingWeightGrams: 2125,
    totalGrossWeightKg: 5.95,
    volumetricWeightKg: 7.2,
    suggestedCourierBracket: '5-10 kg',
    shippingCostEur: 18.00,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 10,
    validityDays: 30,
    notes: 'Mese record con produzione a pieno carico per showroom',
    createdAt: '2026-05-08T08:00:00.000Z',
    updatedAt: '2026-05-18T19:00:00.000Z',
  },
  {
    id: 'ord-hist-06',
    code: 'ORD-2026-058',
    title: 'Merchandising Festival Estivo 110x Gadget personalizzati',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[2],
    quantity: 110,
    volumeDiscountPercent: 18,
    minAcceptableMarginPercent: 20,
    costMaterialPerPiece: 0.44,
    costMachinePerPiece: 0.18,
    costLaborPerPiece: 2.50,
    costWastePerPiece: 0.01,
    costTotalPerPiece: 3.13,
    unitBasePrice: 12.00,
    unitDiscountedPrice: 9.84,
    totalRevenue: 1082.40,
    totalCost: 344.30,
    totalMarginEur: 738.10,
    realMarginPercent: 68.2,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 2200,
    totalPackagingWeightGrams: 1100,
    totalGrossWeightKg: 3.3,
    volumetricWeightKg: 3.2,
    suggestedCourierBracket: '3-5 kg',
    shippingCostEur: 14.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 7,
    validityDays: 30,
    createdAt: '2026-06-14T11:00:00.000Z',
    updatedAt: '2026-06-22T14:45:00.000Z',
  },
  {
    id: 'ord-hist-07',
    code: 'ORD-2026-065',
    title: 'Prototipi Industriali CNC 25x Piastre alluminio e POM',
    recipeId: rec001.id,
    recipeName: 'Piastra tecnica fresata CNC',
    technology: 'cnc',
    machineId: 'mac-004',
    machineName: 'Pantografo CNC Stepcraft M.1000',
    client: SEED_CLIENTS[1],
    quantity: 25,
    volumeDiscountPercent: 5,
    minAcceptableMarginPercent: 30,
    costMaterialPerPiece: 4.50,
    costMachinePerPiece: 3.60,
    costLaborPerPiece: 6.00,
    costWastePerPiece: 0.20,
    costTotalPerPiece: 14.30,
    unitBasePrice: 42.00,
    unitDiscountedPrice: 39.90,
    totalRevenue: 997.50,
    totalCost: 357.50,
    totalMarginEur: 640.00,
    realMarginPercent: 64.2,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 2500,
    totalPackagingWeightGrams: 500,
    totalGrossWeightKg: 3.0,
    volumetricWeightKg: 2.8,
    suggestedCourierBracket: '3-5 kg',
    shippingCostEur: 14.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 6,
    validityDays: 30,
    createdAt: '2026-07-21T15:20:00.000Z',
    updatedAt: '2026-07-28T10:00:00.000Z',
  },
  {
    id: 'ord-hist-08',
    code: 'ORD-2026-072',
    title: 'Fornitura ricambi stampati 3D e dime manutenzione',
    recipeId: 'rec-002',
    recipeName: 'Vaso geometrico decorativo PLA con imballo',
    technology: 'print3d',
    machineId: 'mac-001',
    machineName: 'Bambu Lab X1-Carbon (FDM)',
    client: SEED_CLIENTS[1],
    quantity: 20,
    volumeDiscountPercent: 0,
    minAcceptableMarginPercent: 25,
    costMaterialPerPiece: 1.80,
    costMachinePerPiece: 2.10,
    costLaborPerPiece: 4.50,
    costWastePerPiece: 0.10,
    costTotalPerPiece: 8.50,
    unitBasePrice: 28.00,
    unitDiscountedPrice: 28.00,
    totalRevenue: 560.00,
    totalCost: 170.00,
    totalMarginEur: 390.00,
    realMarginPercent: 69.6,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 1000,
    totalPackagingWeightGrams: 400,
    totalGrossWeightKg: 1.4,
    volumetricWeightKg: 1.8,
    suggestedCourierBracket: '1-3 kg',
    shippingCostEur: 9.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 4,
    validityDays: 30,
    createdAt: '2026-08-19T09:40:00.000Z',
    updatedAt: '2026-08-25T16:10:00.000Z',
  },
  {
    id: 'ord-hist-09',
    code: 'ORD-2026-077',
    title: 'Lotto 90x Portachiavi e Segnaposto su misura',
    recipeId: rec001.id,
    recipeName: rec001.name,
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    client: SEED_CLIENTS[2],
    quantity: 90,
    volumeDiscountPercent: 15,
    minAcceptableMarginPercent: 20,
    costMaterialPerPiece: 0.44,
    costMachinePerPiece: 0.18,
    costLaborPerPiece: 2.50,
    costWastePerPiece: 0.01,
    costTotalPerPiece: 3.13,
    unitBasePrice: 12.00,
    unitDiscountedPrice: 10.20,
    totalRevenue: 918.00,
    totalCost: 281.70,
    totalMarginEur: 636.30,
    realMarginPercent: 69.3,
    isUnderMarginAlert: false,
    totalMaterialWeightGrams: 1800,
    totalPackagingWeightGrams: 900,
    totalGrossWeightKg: 2.7,
    volumetricWeightKg: 2.6,
    suggestedCourierBracket: '1-3 kg',
    shippingCostEur: 9.50,
    materialsDeducted: true,
    status: 'completato',
    deliveryDays: 5,
    validityDays: 30,
    createdAt: '2026-09-17T13:30:00.000Z',
    updatedAt: '2026-09-24T18:00:00.000Z',
  },
];

// --- 1. PARCO MACCHINE ---
export function getStoredMachines(): MachineItem[] {
  try {
    const raw = localStorage.getItem(MACHINES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(SEED_MACHINES));
      return SEED_MACHINES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MACHINES;
  }
}

export function saveStoredMachine(machine: MachineItem): MachineItem[] {
  const machines = getStoredMachines();
  const id = machine.id || `mac-${Date.now()}`;
  const itemToSave: MachineItem = {
    ...machine,
    id,
    updatedAt: new Date().toISOString(),
  };

  const index = machines.findIndex((m) => m.id === id);
  let updated: MachineItem[];
  if (index >= 0) {
    updated = [...machines];
    updated[index] = itemToSave;
  } else {
    updated = [itemToSave, ...machines];
  }
  localStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredMachine(id: string): MachineItem[] {
  const machines = getStoredMachines();
  const updated = machines.filter((m) => m.id !== id);
  localStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// --- 2. GESTIONE MATERIALI & GIACENZE MAGAZZINO ---
export function getStoredMaterials(): MaterialItem[] {
  try {
    const raw = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(SEED_MATERIALS));
      return SEED_MATERIALS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MATERIALS;
  }
}

export function saveStoredMaterial(material: MaterialItem): MaterialItem[] {
  const materials = getStoredMaterials();
  const id = material.id || `mat-${Date.now()}`;
  const unitCost =
    material.packageQuantity > 0 ? material.cost / material.packageQuantity : 0;

  const itemToSave: MaterialItem = {
    ...material,
    id,
    unitCost: Math.round((unitCost + Number.EPSILON) * 100000) / 100000,
    stockQuantity: Number(material.stockQuantity) || 0,
    minStockThreshold: Number(material.minStockThreshold) || 0,
    updatedAt: new Date().toISOString(),
  };

  const index = materials.findIndex((m) => m.id === id);
  let updated: MaterialItem[];
  if (index >= 0) {
    updated = [...materials];
    updated[index] = itemToSave;
  } else {
    updated = [itemToSave, ...materials];
  }
  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function replenishMaterialStock(materialId: string, quantityToAdd: number): MaterialItem[] {
  const materials = getStoredMaterials();
  const index = materials.findIndex((m) => m.id === materialId);
  if (index < 0) return materials;

  const updated = [...materials];
  updated[index] = {
    ...updated[index],
    stockQuantity: Math.round(((updated[index].stockQuantity || 0) + quantityToAdd) * 100) / 100,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deductStockForOrder(
  materialsUsed: { materialId: string; quantityUsed: number }[],
  orderQuantity: number
): { success: boolean; updatedMaterials: MaterialItem[] } {
  const materials = getStoredMaterials();
  const copy = [...materials];

  for (const usage of materialsUsed) {
    const idx = copy.findIndex((m) => m.id === usage.materialId);
    if (idx >= 0) {
      const required = (usage.quantityUsed || 0) * orderQuantity;
      copy[idx] = {
        ...copy[idx],
        stockQuantity: Math.max(0, Math.round((copy[idx].stockQuantity - required) * 100) / 100),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(copy));
  return { success: true, updatedMaterials: copy };
}

export function deleteStoredMaterial(id: string): MaterialItem[] {
  const materials = getStoredMaterials();
  const updated = materials.filter((m) => m.id !== id);
  localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// --- 3. GESTIONE RICETTE / CATALOGO PRODOTTI ---
export function getStoredRecipes(): ProductRecipe[] {
  try {
    const raw = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(SEED_RECIPES));
      return SEED_RECIPES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_RECIPES;
  }
}

export function saveStoredRecipe(recipe: ProductRecipe): ProductRecipe[] {
  const recipes = getStoredRecipes();
  const id = recipe.id || `rec-${Date.now()}`;
  const itemToSave: ProductRecipe = {
    ...recipe,
    id,
    updatedAt: new Date().toISOString(),
  };

  const index = recipes.findIndex((r) => r.id === id);
  let updated: ProductRecipe[];
  if (index >= 0) {
    updated = [...recipes];
    updated[index] = itemToSave;
  } else {
    updated = [itemToSave, ...recipes];
  }
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredRecipe(id: string): ProductRecipe[] {
  const recipes = getStoredRecipes();
  const updated = recipes.filter((r) => r.id !== id);
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// --- 4. GESTIONE ORDINI / PREVENTIVI ---
export function getStoredOrders(): OrderItem[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ORDERS;
  }
}

export function saveStoredOrder(order: OrderItem): OrderItem[] {
  const orders = getStoredOrders();
  const id = order.id || `ord-${Date.now()}`;
  const itemToSave: OrderItem = {
    ...order,
    id,
    updatedAt: new Date().toISOString(),
  };

  const index = orders.findIndex((o) => o.id === id);
  let updated: OrderItem[];
  if (index >= 0) {
    updated = [...orders];
    updated[index] = itemToSave;
  } else {
    updated = [itemToSave, ...orders];
  }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredOrder(id: string): OrderItem[] {
  const orders = getStoredOrders();
  const updated = orders.filter((o) => o.id !== id);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// --- 5. GESTIONE COSTI FISSI, CLIENTI E SETTINGS ---
export function getStoredFixedCosts(): FixedCostsConfig {
  try {
    const raw = localStorage.getItem(FIXED_COSTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FIXED_COSTS_STORAGE_KEY, JSON.stringify(DEFAULT_FIXED_COSTS));
      return DEFAULT_FIXED_COSTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FIXED_COSTS;
  }
}

export function saveStoredFixedCosts(config: FixedCostsConfig): FixedCostsConfig {
  localStorage.setItem(FIXED_COSTS_STORAGE_KEY, JSON.stringify(config));
  return config;
}

export function getStoredClients(): ClientInfo[] {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(SEED_CLIENTS));
      return SEED_CLIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_CLIENTS;
  }
}

export function saveStoredClient(client: ClientInfo): ClientInfo[] {
  const clients = getStoredClients();
  const id = client.id || `cli-${Date.now()}`;
  const index = clients.findIndex((c) => c.id === id);
  let updated: ClientInfo[];
  if (index >= 0) {
    updated = [...clients];
    updated[index] = { ...client, id };
  } else {
    updated = [{ ...client, id }, ...clients];
  }
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredClient(id: string): ClientInfo[] {
  const clients = getStoredClients();
  const updated = clients.filter((c) => c.id !== id);
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getWorkshopSettings(): WorkshopSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_WORKSHOP_SETTINGS));
      return DEFAULT_WORKSHOP_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WORKSHOP_SETTINGS;
  }
}

export function saveWorkshopSettings(settings: WorkshopSettings): WorkshopSettings {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  return settings;
}
