/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FixedCostsConfig,
  MachineItem,
  MaterialItem,
  ProductRecipe,
  RecipeMaterialUsage,
} from '../types/calculator';

/**
 * Parco Macchine Iniziale Precaricato
 */
export const SEED_MACHINES: MachineItem[] = [
  {
    id: 'mac-001',
    name: 'Bambu Lab X1-Carbon (FDM)',
    technology: 'print3d',
    model: 'X1-Carbon Combo AMS CoreXY',
    purchaseCost: 1400.00,
    estimatedLifeHours: 3000,
    powerWatts: 350,
    hourlyMaintenanceCost: 0.50, // Usura ugello temprato, cinghie, pulizia
    status: 'active',
    notes: 'Camera riscaldata passiva, ideale per PLA, PETG, ABS e nylon carbonio',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mac-002',
    name: 'Elegoo Saturn 4 Ultra (Resina 12K)',
    technology: 'print3d',
    model: 'Saturn 4 Ultra MSLA',
    purchaseCost: 550.00,
    estimatedLifeHours: 1500,
    powerWatts: 120,
    hourlyMaintenanceCost: 0.85, // Usura film release PFA/FEP e display LCD
    status: 'active',
    notes: 'Risoluzione 12K per miniature, gioielleria e prototipi ad altissima precisione',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mac-003',
    name: 'Laser CO2 80W Thunder Nova 24',
    technology: 'laser',
    model: 'Thunder Nova 24 CO2 Glass Tube',
    purchaseCost: 4500.00,
    estimatedLifeHours: 2500,
    powerWatts: 650, // Con aspiratore fumi e chiller ad acqua
    hourlyMaintenanceCost: 2.80, // Usura tubo laser CO2 e lenti specchi al silicio
    status: 'active',
    notes: 'Taglio e incisione su legno, acrilico, cuoio e anodizzato fino a 10mm',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mac-004',
    name: 'Pantografo CNC Stepcraft M.1000',
    technology: 'cnc',
    model: 'Stepcraft M.1000 3-Axis',
    purchaseCost: 3200.00,
    estimatedLifeHours: 3500,
    powerWatts: 1800, // Elettromandrino HF 1.4kW + pompa refrigerante
    hourlyMaintenanceCost: 1.80, // Usura cuscinetti, guide a ricircolo e lubrificanti
    status: 'active',
    notes: 'Fresatura alluminio 6082, ottone, massello e polimeri tecnici',
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Valori di configurazione costi fissi generici
 */
export const DEFAULT_FIXED_COSTS: FixedCostsConfig = {
  machineName: 'Laboratorio Digitale Primario',
  machineCost: 600.00,
  estimatedLifeHours: 2000,
  powerWatts: 250,
  electricityKwhCost: 0.250,
  laborHourlyRate: 15.00,
  currencySymbol: '€',
};

/**
 * Archivio Materiali con Giacenze Stock e Soglie Minime
 */
export const SEED_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-001',
    name: 'Bobina PLA Nero 1.75mm',
    category: 'Filamento',
    cost: 22.00,
    packageQuantity: 1000,
    unit: 'g',
    unitCost: 0.022,
    stockQuantity: 2850, // 2.85 kg disponibili a magazzino
    minStockThreshold: 1000,
    notes: 'Spool 1kg per prototipi e dime',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-002',
    name: 'Bobina PLA Bianco 1.75mm',
    category: 'Filamento',
    cost: 22.00,
    packageQuantity: 1000,
    unit: 'g',
    unitCost: 0.022,
    stockQuantity: 650, // SOTTO SCORTA! (Soglia 1000)
    minStockThreshold: 1000,
    notes: 'Spool 1kg finitura liscia',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-003',
    name: 'Bobina PETG Trasparente',
    category: 'Filamento',
    cost: 25.00,
    packageQuantity: 1000,
    unit: 'g',
    unitCost: 0.025,
    stockQuantity: 3000,
    minStockThreshold: 1000,
    notes: 'Spool 1kg alta resistenza meccanica',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-004',
    name: 'Bobina TPU Flessibile',
    category: 'Filamento',
    cost: 28.00,
    packageQuantity: 1000,
    unit: 'g',
    unitCost: 0.028,
    stockQuantity: 1500,
    minStockThreshold: 500,
    notes: 'Spool 1kg guarnizioni e cover',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-005',
    name: 'Pannello MDF 3mm',
    category: 'Legno',
    cost: 18.00,
    packageQuantity: 1,
    unit: 'm²',
    unitCost: 18.00,
    stockQuantity: 8.5,
    minStockThreshold: 2.0,
    notes: 'Pannello standard per taglio laser',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-006',
    name: 'Pannello Betulla 3mm',
    category: 'Legno',
    cost: 22.00,
    packageQuantity: 1,
    unit: 'm²',
    unitCost: 22.00,
    stockQuantity: 6.0,
    minStockThreshold: 2.0,
    notes: 'Pannello multistrato alta qualità',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-007',
    name: 'Plexiglass 3mm',
    category: 'Plastica',
    cost: 35.00,
    packageQuantity: 1,
    unit: 'm²',
    unitCost: 35.00,
    stockQuantity: 4.0,
    minStockThreshold: 1.5,
    notes: 'Lastra trasparente colata protetta',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-008',
    name: 'Calamite 10mm (100 pz)',
    category: 'Accessorio',
    cost: 8.00,
    packageQuantity: 100,
    unit: 'pz',
    unitCost: 0.08,
    stockQuantity: 420,
    minStockThreshold: 100,
    notes: 'Neodimio N52 per portachiavi',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-009',
    name: 'Scatola imballo piccola',
    category: 'Imballaggio',
    cost: 15.00,
    packageQuantity: 50,
    unit: 'pz',
    unitCost: 0.30,
    stockQuantity: 95,
    minStockThreshold: 30,
    notes: 'Scatolina kraft con finestra',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-010',
    name: 'Viteria mista (100 pz)',
    category: 'Accessorio',
    cost: 10.00,
    packageQuantity: 100,
    unit: 'pz',
    unitCost: 0.10,
    stockQuantity: 350,
    minStockThreshold: 100,
    notes: 'Viti M3, dadi, rondelle brunite',
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Ricette / Prodotti di catalogo con macchine associate
 */
export const SEED_RECIPES: ProductRecipe[] = [
  {
    id: 'rec-001',
    name: 'Portachiavi in legno inciso con calamite',
    technology: 'laser',
    machineId: 'mac-003',
    machineName: 'Laser CO2 80W Thunder Nova 24',
    materialsUsed: [
      {
        id: 'rm-1',
        materialId: 'mat-006',
        materialName: 'Pannello Betulla 3mm',
        quantityUsed: 0.02,
        unit: 'm²',
      },
      {
        id: 'rm-2',
        materialId: 'mat-008',
        materialName: 'Calamite 10mm (100 pz)',
        quantityUsed: 2,
        unit: 'pz',
      },
    ],
    machineHours: 0.5,
    laborMinutes: 10,
    wasteRiskPercent: 2,
    sellingPrice: 12.00,
    platformFeeFixed: 0.20,
    platformFeePercent: 6.5,
    packagingWeightGrams: 25,
    technicalSpecs: {
      laserPowerPercent: 65,
      laserSpeedMmSec: 25,
    },
    notes: 'Incisione vettoriale su betulla con finitura ad olio e 2 magneti al neodimio',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-002',
    name: 'Vaso geometrico decorativo PLA con imballo',
    technology: 'print3d',
    machineId: 'mac-001',
    machineName: 'Bambu Lab X1-Carbon (FDM)',
    materialsUsed: [
      {
        id: 'rm-3',
        materialId: 'mat-001',
        materialName: 'Bobina PLA Nero 1.75mm',
        quantityUsed: 45,
        unit: 'g',
      },
      {
        id: 'rm-4',
        materialId: 'mat-009',
        materialName: 'Scatola imballo piccola',
        quantityUsed: 1,
        unit: 'pz',
      },
    ],
    machineHours: 3.5,
    laborMinutes: 20,
    wasteRiskPercent: 5,
    sellingPrice: 28.00,
    platformFeeFixed: 0.20,
    platformFeePercent: 6.5,
    packagingWeightGrams: 40,
    boxDimensionsCm: { length: 15, width: 15, height: 22 },
    technicalSpecs: {
      layerHeightMm: 0.28,
      nozzleSizeMm: 0.40,
      infillPercent: 0, // spiralize mode
    },
    notes: 'Stampa FDM modalità vaso (spiralize) layer 0.28mm + scatolina kraft',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-003',
    name: 'Ciondolo personalizzato PLA',
    technology: 'print3d',
    machineId: 'mac-001',
    machineName: 'Bambu Lab X1-Carbon (FDM)',
    materialsUsed: [
      {
        id: 'rm-5',
        materialId: 'mat-002',
        materialName: 'Bobina PLA Bianco 1.75mm',
        quantityUsed: 8,
        unit: 'g',
      },
    ],
    machineHours: 0.8,
    laborMinutes: 15,
    wasteRiskPercent: 10,
    sellingPrice: 4.00,
    platformFeeFixed: 0.20,
    platformFeePercent: 6.5,
    packagingWeightGrams: 10,
    notes: 'Oggetto piccolo con tempo manodopera alto rispetto al prezzo',
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Calcolo Costo Orario Specifico per Macchina del Parco Macchine
 */
export function calculateMachineHourlyRate(
  machine: MachineItem,
  electricityCostKwh: number
) {
  const depreciationHourly =
    machine.estimatedLifeHours > 0
      ? machine.purchaseCost / machine.estimatedLifeHours
      : 0;

  const electricityHourly = (machine.powerWatts / 1000) * electricityCostKwh;
  const maintenanceHourly = machine.hourlyMaintenanceCost || 0;
  const machineCostHourly = depreciationHourly + electricityHourly + maintenanceHourly;

  return {
    depreciationHourly: round4(depreciationHourly),
    electricityHourly: round4(electricityHourly),
    maintenanceHourly: round4(maintenanceHourly),
    machineCostHourly: round4(machineCostHourly),
  };
}

/**
 * Calcolo Costi Fissi Base
 */
export function calculateFixedHourlyRates(config: FixedCostsConfig) {
  const depreciationHourly =
    config.estimatedLifeHours > 0
      ? config.machineCost / config.estimatedLifeHours
      : 0;

  const electricityHourly = (config.powerWatts / 1000) * config.electricityKwhCost;
  const machineCostHourly = depreciationHourly + electricityHourly;

  return {
    depreciationHourly: round4(depreciationHourly),
    electricityHourly: round4(electricityHourly),
    machineCostHourly: round4(machineCostHourly),
  };
}

/**
 * Calcolo Costi per Singolo Prodotto con supporto Macchina Specifica e Materiali Multipli
 */
export function calculateRecipeCosts(
  recipe: ProductRecipe,
  materialsOrSingle: MaterialItem[] | MaterialItem | undefined,
  fixedConfig: FixedCostsConfig,
  specificMachine?: MachineItem
) {
  // Calcolo costo orario: se specificata una macchina del Parco Macchine, usa la sua tariffa!
  let machineCostHourly = 0;
  if (specificMachine) {
    machineCostHourly = calculateMachineHourlyRate(
      specificMachine,
      fixedConfig.electricityKwhCost
    ).machineCostHourly;
  } else {
    machineCostHourly = calculateFixedHourlyRates(fixedConfig).machineCostHourly;
  }

  // 1. Somma di tutti i materiali usati
  let costMaterial = 0;
  let totalMaterialWeightGrams = 0;

  if (recipe.materialsUsed && recipe.materialsUsed.length > 0) {
    for (const item of recipe.materialsUsed) {
      const foundMat = Array.isArray(materialsOrSingle)
        ? materialsOrSingle.find((m) => m.id === item.materialId)
        : (materialsOrSingle?.id === item.materialId ? materialsOrSingle : undefined);

      const unitCost = foundMat ? foundMat.unitCost : 0;
      costMaterial += unitCost * (item.quantityUsed || 0);

      // Stima peso in grammi per il calcolo spedizione
      if (item.unit === 'g') {
        totalMaterialWeightGrams += item.quantityUsed;
      } else if (item.unit === 'ml') {
        totalMaterialWeightGrams += item.quantityUsed * 1.1; // densità resina ~1.1g/ml
      } else if (item.unit === 'm²') {
        totalMaterialWeightGrams += item.quantityUsed * 2200; // densità media legno 3mm ~2.2kg/m²
      } else if (item.unit === 'pz') {
        totalMaterialWeightGrams += item.quantityUsed * 5; // minuteria ~5g a pezzo
      }
    }
  } else {
    const singleMat = Array.isArray(materialsOrSingle)
      ? materialsOrSingle.find((m) => m.id === recipe.materialId)
      : materialsOrSingle;
    const unitMaterialCost = singleMat ? singleMat.unitCost : 0;
    costMaterial = unitMaterialCost * (recipe.quantityUsed || 0);
    totalMaterialWeightGrams = recipe.unit === 'g' ? (recipe.quantityUsed || 0) : 50;
  }

  // 2. Costo macchina
  const costMachine = machineCostHourly * recipe.machineHours;

  // 3. Costo manodopera
  const costLabor = (recipe.laborMinutes / 60) * fixedConfig.laborHourlyRate;

  // 4. Costo scarto
  const costWaste = costMaterial * (recipe.wasteRiskPercent / 100);

  // 5. Costo totale unitario
  const costTotal = costMaterial + costMachine + costLabor + costWaste;

  // Commissioni piattaforma
  const platformFee =
    (recipe.platformFeeFixed || 0) +
    recipe.sellingPrice * ((recipe.platformFeePercent || 0) / 100);

  // Margine (€) e (%)
  const marginEur = recipe.sellingPrice - costTotal - platformFee;
  const marginPercent =
    recipe.sellingPrice > 0 ? (marginEur / recipe.sellingPrice) * 100 : 0;

  return {
    costMaterial: round4(costMaterial),
    costMachine: round4(costMachine),
    costLabor: round4(costLabor),
    costWaste: round4(costWaste),
    costTotal: round4(costTotal),
    platformFee: round4(platformFee),
    marginEur: round2(marginEur),
    marginPercent: round1(marginPercent),
    isNegativeMargin: marginPercent < 0,
    totalMaterialWeightGrams: Math.round(totalMaterialWeightGrams),
  };
}

/**
 * 2. Verifica Giacenze di Magazzino per un Ordine
 */
export function checkStockAvailability(
  materialsUsed: RecipeMaterialUsage[],
  orderQuantity: number,
  inventory: MaterialItem[]
) {
  const missingItems: {
    materialName: string;
    needed: number;
    available: number;
    missing: number;
    unit: string;
  }[] = [];

  for (const usage of materialsUsed) {
    const totalNeeded = (usage.quantityUsed || 0) * orderQuantity;
    const itemInStock = inventory.find((m) => m.id === usage.materialId);
    const available = itemInStock ? itemInStock.stockQuantity : 0;

    if (totalNeeded > available) {
      missingItems.push({
        materialName: usage.materialName,
        needed: round2(totalNeeded),
        available: round2(available),
        missing: round2(totalNeeded - available),
        unit: usage.unit,
      });
    }
  }

  return {
    isSufficient: missingItems.length === 0,
    missingItems,
  };
}

/**
 * 3. Simulatore Commissioni Marketplace a Confronto (Etsy, Shopify, B2B, Diretto)
 */
export function calculateMarketplaceComparison(
  sellingPrice: number,
  costTotal: number,
  quantity = 1
) {
  const revenue = sellingPrice * quantity;
  const totalProductionCost = costTotal * quantity;

  // 1. Vendita Diretta (0% fees)
  const directRevenue = revenue;
  const directFees = 0;
  const directProfit = directRevenue - totalProductionCost;
  const directMarginPercent = directRevenue > 0 ? (directProfit / directRevenue) * 100 : 0;

  // 2. Etsy (0.20€ listing + 6.5% vendita + 4% + 0.30€ elaborazione pagamento)
  const etsyFeeFixed = 0.20 * Math.ceil(quantity / 1);
  const etsyFeeSale = revenue * 0.065;
  const etsyFeePayment = (revenue * 0.04) + 0.30;
  const etsyTotalFees = etsyFeeFixed + etsyFeeSale + etsyFeePayment;
  const etsyProfit = revenue - totalProductionCost - etsyTotalFees;
  const etsyMarginPercent = revenue > 0 ? (etsyProfit / revenue) * 100 : 0;

  // 3. Shopify / Sito Web proprio (1.9% gateway Stripe + 0.25€)
  const shopifyGateway = (revenue * 0.019) + 0.25;
  const shopifyTotalFees = shopifyGateway;
  const shopifyProfit = revenue - totalProductionCost - shopifyTotalFees;
  const shopifyMarginPercent = revenue > 0 ? (shopifyProfit / revenue) * 100 : 0;

  // 4. B2B / Ingrosso (Sconto volume 25% senza commissioni di terzi)
  const b2bDiscountedPrice = sellingPrice * 0.75;
  const b2bRevenue = b2bDiscountedPrice * quantity;
  const b2bFees = 0;
  const b2bProfit = b2bRevenue - totalProductionCost;
  const b2bMarginPercent = b2bRevenue > 0 ? (b2bProfit / b2bRevenue) * 100 : 0;

  return {
    direct: {
      channel: 'Vendita Diretta / Laboratorio',
      revenue: round2(directRevenue),
      fees: round2(directFees),
      netProfit: round2(directProfit),
      marginPercent: round1(directMarginPercent),
      effectivePerPiece: round2(directProfit / quantity),
    },
    etsy: {
      channel: 'Etsy Marketplace',
      revenue: round2(revenue),
      fees: round2(etsyTotalFees),
      netProfit: round2(etsyProfit),
      marginPercent: round1(etsyMarginPercent),
      effectivePerPiece: round2(etsyProfit / quantity),
    },
    shopify: {
      channel: 'Sito Web / Shopify (Stripe)',
      revenue: round2(revenue),
      fees: round2(shopifyTotalFees),
      netProfit: round2(shopifyProfit),
      marginPercent: round1(shopifyMarginPercent),
      effectivePerPiece: round2(shopifyProfit / quantity),
    },
    b2b: {
      channel: 'B2B / Ingrosso (-25%)',
      revenue: round2(b2bRevenue),
      fees: round2(b2bFees),
      netProfit: round2(b2bProfit),
      marginPercent: round1(b2bMarginPercent),
      effectivePerPiece: round2(b2bProfit / quantity),
    },
  };
}

/**
 * 5. Calcolatore Spese di Spedizione & Peso Volumetrico
 */
export function calculateShippingDetails(
  unitMaterialWeightGrams: number,
  unitPackagingWeightGrams: number,
  quantity: number,
  boxDimensionsCm?: { length: number; width: number; height: number }
) {
  const totalMaterialWeightGrams = unitMaterialWeightGrams * quantity;
  // Scatole stimate (1 ogni pezzo per confezioni individuali o lotto)
  const packagingWeight = unitPackagingWeightGrams > 0 ? unitPackagingWeightGrams * quantity : 50;
  const totalPackagingWeightGrams = packagingWeight;
  const totalGrossWeightKg = (totalMaterialWeightGrams + totalPackagingWeightGrams) / 1000;

  // Calcolo peso volumetrico corriere: (L x W x H cm) / 5000
  let volumetricWeightKg = 0;
  if (boxDimensionsCm && boxDimensionsCm.length > 0) {
    const volumeBox = (boxDimensionsCm.length * boxDimensionsCm.width * boxDimensionsCm.height);
    volumetricWeightKg = (volumeBox * Math.ceil(quantity / 5)) / 5000;
  } else {
    // Stima volumetrica standard basata sul peso reale moltiplicato per fattore ingombro 1.3
    volumetricWeightKg = totalGrossWeightKg * 1.25;
  }

  // Il corriere applica la tariffa sul maggiore tra peso reale e volumetrico
  const chargeableWeightKg = Math.max(totalGrossWeightKg, volumetricWeightKg);

  // Fasce corriere standard italiane (es. GLS, BRT, DHL, Poste Crono)
  let bracketLabel = 'Fascia 0-1 kg';
  let suggestedCostEur = 6.90;

  if (chargeableWeightKg <= 1.0) {
    bracketLabel = 'Fascia 0-1 kg (Spedizione Piccola)';
    suggestedCostEur = 6.90;
  } else if (chargeableWeightKg <= 3.0) {
    bracketLabel = 'Fascia 1-3 kg (Standard)';
    suggestedCostEur = 8.50;
  } else if (chargeableWeightKg <= 5.0) {
    bracketLabel = 'Fascia 3-5 kg (Media)';
    suggestedCostEur = 10.90;
  } else if (chargeableWeightKg <= 10.0) {
    bracketLabel = 'Fascia 5-10 kg (Grande)';
    suggestedCostEur = 14.90;
  } else {
    bracketLabel = 'Fascia >10 kg (Maxi / Bancale)';
    suggestedCostEur = 19.50 + Math.ceil(chargeableWeightKg - 10) * 0.80;
  }

  return {
    totalMaterialWeightGrams: Math.round(totalMaterialWeightGrams),
    totalPackagingWeightGrams: Math.round(totalPackagingWeightGrams),
    totalGrossWeightKg: round2(totalGrossWeightKg),
    volumetricWeightKg: round2(volumetricWeightKg),
    chargeableWeightKg: round2(chargeableWeightKg),
    suggestedCourierBracket: bracketLabel,
    suggestedCostEur: round2(suggestedCostEur),
  };
}

/**
 * Calcolo Ordine Completo
 */
export function calculateOrderMetrics(
  costTotalPerPiece: number,
  unitBasePrice: number,
  quantity: number,
  discountPercent: number,
  minAcceptableMarginPercent: number,
  shippingCostEur = 0,
  platformFeeTotal = 0
) {
  const safeQuantity = Math.max(1, quantity);
  const discountRatio = Math.max(0, discountPercent) / 100;
  
  // Prezzo dopo sconto
  const unitDiscountedPrice = unitBasePrice * (1 - discountRatio);

  // Ricavo fornitura + spedizione
  const revenueGoods = unitDiscountedPrice * safeQuantity;
  const totalRevenue = revenueGoods + shippingCostEur;

  // Costo totale ordine (costo produzione + costo vivo spedizione + commissione piattaforma)
  const productionCost = costTotalPerPiece * safeQuantity;
  const totalCost = productionCost + shippingCostEur + platformFeeTotal;

  // Margine totale (€) = Ricavo - Costo
  const totalMarginEur = totalRevenue - totalCost;

  // Margine % reale = Margine totale ÷ Ricavo fornitura
  const realMarginPercent = revenueGoods > 0 ? (totalMarginEur / revenueGoods) * 100 : 0;

  // Allarme se il margine reale è inferiore alla soglia minima accettabile
  const isUnderMarginAlert = realMarginPercent < minAcceptableMarginPercent;

  return {
    unitDiscountedPrice: round2(unitDiscountedPrice),
    totalRevenue: round2(totalRevenue),
    totalCost: round2(totalCost),
    totalMarginEur: round2(totalMarginEur),
    realMarginPercent: round1(realMarginPercent),
    isUnderMarginAlert,
    platformFeeTotal: round2(platformFeeTotal),
  };
}

export function round4(val: number): number {
  return Math.round((val + Number.EPSILON) * 10000) / 10000;
}

export function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function round1(val: number): number {
  return Math.round((val + Number.EPSILON) * 10) / 10;
}

export function formatCurrency(amount: number, decimals = 2): string {
  if (isNaN(amount) || !isFinite(amount)) return '€ 0,00';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatCurrency4(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '€ 0,0000';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  if (isNaN(rate) || !isFinite(rate)) return '0%';
  return `${rate.toFixed(1)}%`;
}
