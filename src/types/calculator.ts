/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TechnologyType = 'print3d' | 'laser' | 'cnc' | 'craft';

export type MaterialCategory =
  | 'Filamento'
  | 'Resina'
  | 'Legno'
  | 'Plastica'
  | 'Metallo'
  | 'Accessorio'
  | 'Imballaggio'
  | 'Altro';

export type UnitType = 'g' | 'm²' | 'pz' | 'ml';

export interface MachineItem {
  id: string;
  name: string; // es. "Bambu Lab X1-Carbon", "Laser CO2 80W Thunder", "Pantografo CNC 3 Assi"
  technology: TechnologyType;
  model: string;
  purchaseCost: number; // Costo acquisto (€)
  estimatedLifeHours: number; // Vita utile stimata (ore)
  powerWatts: number; // Potenza assorbita media (Watt)
  hourlyMaintenanceCost: number; // Manutenzione e usura ordinaria oraria (€/h)
  status: 'active' | 'maintenance' | 'idle';
  notes?: string;
  updatedAt: string;
}

export interface FixedCostsConfig {
  machineName: string;
  machineCost: number; // Costo acquisto macchina predefinita (€)
  estimatedLifeHours: number; // Vita stimata macchina in ore
  powerWatts: number; // Consumo medio in Watt
  electricityKwhCost: number; // Costo energia al kWh (€/kWh)
  laborHourlyRate: number; // Pagamento manodopera all'ora (€/h)
  currencySymbol: string; // "€"
}

export interface MaterialItem {
  id: string;
  name: string; // es. "Bobina PLA Nero 1.75mm", "Pannello Betulla 3mm"
  category: MaterialCategory;
  cost: number; // Costo d'acquisto (€)
  packageQuantity: number; // Quantità acquistata (1000g, 1 m², 100 pz)
  unit: UnitType; // g, m², pz, ml
  unitCost: number; // Costo unitario calcolato automaticamente: cost / packageQuantity
  stockQuantity: number; // Giacenza attuale a magazzino
  minStockThreshold: number; // Soglia minima per avviso sotto-scorta
  notes?: string;
  updatedAt: string;
}

export interface RecipeMaterialUsage {
  id: string;
  materialId: string;
  materialName: string;
  quantityUsed: number;
  unit: UnitType;
}

export type SalesChannelType = 'direct' | 'etsy' | 'shopify' | 'b2b' | 'custom';

export interface ProductRecipe {
  id: string;
  name: string; // Nome lavoro o prodotto (es. "Portachiavi in legno", "Vaso in PLA")
  technology: TechnologyType;
  machineId?: string; // Macchina specifica dal Parco Macchine
  machineName?: string;
  materialsUsed: RecipeMaterialUsage[]; // Lista di tutti i materiali impiegati
  materialId?: string; // retrocompatibilità
  materialName?: string;
  quantityUsed?: number;
  unit?: UnitType;
  machineHours: number; // Ore di stampa o lavorazione macchina
  laborMinutes: number; // Minuti di lavoro manuale pulizia/finitura/imballo
  wasteRiskPercent: number; // Percentuale fallimento / scarto (%)
  sellingPrice: number; // Prezzo base di vendita unitario al pubblico (€)
  salesChannel?: SalesChannelType; // Canale di vendita predefinito
  platformFeeFixed: number; // Commissione fissa listing (€)
  platformFeePercent: number; // Commissione % vendita (%)
  
  // Specifiche tecniche di produzione per la Scheda Officina
  technicalSpecs?: {
    layerHeightMm?: number; // es. 0.20 mm
    infillPercent?: number; // es. 30%
    nozzleSizeMm?: number; // es. 0.40 mm
    laserPowerPercent?: number; // es. 65%
    laserSpeedMmSec?: number; // es. 25 mm/s
    cncFeedRateMmMin?: number; // es. 1200 mm/min
    cncToolProfile?: string; // es. "Fresa 2 taglienti helicoidale D=3.175mm"
  };
  
  // Imballaggio e peso unitario stimato
  packagingWeightGrams?: number; // Peso stimato scatola/imballo singolo
  boxDimensionsCm?: { length: number; width: number; height: number };

  notes?: string;
  updatedAt: string;
}

export interface ClientInfo {
  id?: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  code: string; // es. "ORD-2026-081"
  title: string;
  recipeId?: string;
  recipeName: string;
  technology: TechnologyType;
  machineId?: string;
  machineName?: string;
  client: ClientInfo;
  quantity: number; // Quantità richiesta pezzi
  volumeDiscountPercent: number; // Sconto quantità offerto %
  minAcceptableMarginPercent: number; // Margine minimo accettabile %
  
  // Costi unitari ricetta
  costMaterialPerPiece: number;
  costMachinePerPiece: number;
  costLaborPerPiece: number;
  costWastePerPiece: number;
  costTotalPerPiece: number;
  
  // Prezzi e margini ordine
  salesChannel?: SalesChannelType;
  platformFeeTotal?: number;
  unitBasePrice: number;
  unitDiscountedPrice: number;
  totalRevenue: number;
  totalCost: number;
  totalMarginEur: number;
  realMarginPercent: number;
  isUnderMarginAlert: boolean;
  
  // Spedizione & Pesi calcolati
  totalMaterialWeightGrams: number; // Peso netto materiali per l'intero ordine
  totalPackagingWeightGrams: number; // Peso imballaggi
  totalGrossWeightKg: number; // Peso totale lordo in kg
  volumetricWeightKg: number; // Peso volumetrico stimato corriere
  suggestedCourierBracket: string; // es. "0-1 kg", "1-3 kg", "3-5 kg", "5-10 kg"
  shippingCostEur: number; // Costo corriere stimato inseribile nel computo

  // Stato magazzino per l'ordine
  stockShortageWarning?: string; // Avviso se le scorte non bastano
  materialsDeducted?: boolean; // Se i materiali sono stati scaricati da stock

  status: 'bozza' | 'inviato' | 'approvato' | 'rifiutato' | 'completato';
  deliveryDays: number;
  deliveryText?: string;
  validityDays: number;
  customTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopSettings {
  workshopName: string; // Nome ditta / Ragione Sociale per fattura
  artisanName: string; // Nome dell'artigiano titolare
  tagline: string; // Slogan o descrizione attività
  email: string;
  pec?: string; // PEC per fattura elettronica
  phone: string;
  website?: string; // Sito Web
  address: string; // Via e numero civico
  city?: string; // Città
  zipCode?: string; // CAP
  province?: string; // Sigla Provincia (es. MI)
  vatNumber: string; // Partita IVA
  fiscalCode?: string; // Codice Fiscale
  sdiCode?: string; // Codice Destinatario SDI (7 caratteri o 0000000)
  iban?: string; // IBAN bancario per bonifico
  bankName?: string; // Nome istituto di credito
  logoUrl?: string; // Logo aziendale (URL o Base64)
  fixedCosts: FixedCostsConfig;
  termsAndConditions: string;
  invoiceNotes?: string; // Note e diciture fiscali per fatture
}
