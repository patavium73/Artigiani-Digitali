/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FixedCostsConfig,
  MachineItem,
  MaterialItem,
  ProductRecipe,
  RecipeMaterialUsage,
  SalesChannelType,
  TechnologyType,
} from '../types/calculator';
import {
  calculateRecipeCosts,
  formatCurrency,
  formatCurrency4,
  formatPercent,
} from '../utils/calculatorEngine';
import {
  Layers,
  Flame,
  Cpu,
  Palette,
  X,
  Check,
  AlertTriangle,
  Coins,
  Plus,
  Trash2,
  Box,
  Clock,
  Wrench,
  Store,
  ChevronDown,
} from 'lucide-react';

interface RecipeModalProps {
  recipe: ProductRecipe | null;
  materials: MaterialItem[];
  machines?: MachineItem[];
  fixedConfig: FixedCostsConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: ProductRecipe) => void;
  onOpenMaterialModal: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  materials,
  machines = [],
  fixedConfig,
  isOpen,
  onClose,
  onSave,
  onOpenMaterialModal,
}) => {
  const [name, setName] = useState('');
  const [technology, setTechnology] = useState<TechnologyType>('print3d');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');

  // Lista dinamica dei materiali impiegati per questo lavoro
  const [materialsUsed, setMaterialsUsed] = useState<RecipeMaterialUsage[]>([]);

  // Tempo Macchina (supporto input stringa per evitare problemi con virgola e backspace)
  const [machineHoursStr, setMachineHoursStr] = useState<string>('3.5');

  // Tempo Manodopera Operatore: inseribile sia in ORE che in MINUTI
  const [laborHoursInput, setLaborHoursInput] = useState<string>('0');
  const [laborMinutesInput, setLaborMinutesInput] = useState<string>('25');

  const [wasteRiskPercent, setWasteRiskPercent] = useState<number>(5);
  const [sellingPrice, setSellingPrice] = useState<number>(28.0);

  // Canale di vendita e Commissioni
  const [salesChannel, setSalesChannel] = useState<SalesChannelType>('etsy');
  const [platformFeeFixed, setPlatformFeeFixed] = useState<number>(0.20);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(6.5);
  const [notes, setNotes] = useState('');

  // Parametri tecnici
  const [layerHeight, setLayerHeight] = useState<number>(0.2);
  const [infill, setInfill] = useState<number>(20);
  const [nozzle, setNozzle] = useState<number>(0.4);
  const [laserPower, setLaserPower] = useState<number>(65);
  const [laserSpeed, setLaserSpeed] = useState<number>(25);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setTechnology(recipe.technology);
      setSelectedMachineId(recipe.machineId || (machines.find((m) => m.technology === recipe.technology)?.id || ''));

      // Inizializza i materiali usati (multipli o retrocompatibile singolo)
      if (recipe.materialsUsed && recipe.materialsUsed.length > 0) {
        setMaterialsUsed(recipe.materialsUsed);
      } else if (recipe.materialId) {
        const mat = materials.find((m) => m.id === recipe.materialId);
        setMaterialsUsed([
          {
            id: 'rm-legacy',
            materialId: recipe.materialId,
            materialName: mat?.name || recipe.materialName || 'Materiale',
            quantityUsed: recipe.quantityUsed || 1,
            unit: mat?.unit || recipe.unit || 'g',
          },
        ]);
      } else if (materials.length > 0) {
        setMaterialsUsed([
          {
            id: 'rm-' + Date.now(),
            materialId: materials[0].id,
            materialName: materials[0].name,
            quantityUsed: 45,
            unit: materials[0].unit,
          },
        ]);
      }

      setMachineHoursStr(String(recipe.machineHours ?? 3.5));

      // Scomponi minuti in ore e minuti
      const totalMins = recipe.laborMinutes ?? 25;
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      setLaborHoursInput(String(h));
      setLaborMinutesInput(String(m));

      setWasteRiskPercent(recipe.wasteRiskPercent ?? 5);
      setSellingPrice(recipe.sellingPrice ?? 28.0);
      setSalesChannel(recipe.salesChannel || 'etsy');
      setPlatformFeeFixed(recipe.platformFeeFixed ?? 0.20);
      setPlatformFeePercent(recipe.platformFeePercent ?? 6.5);
      setNotes(recipe.notes || '');

      if (recipe.technicalSpecs) {
        setLayerHeight(recipe.technicalSpecs.layerHeightMm ?? 0.2);
        setInfill(recipe.technicalSpecs.infillPercent ?? 20);
        setNozzle(recipe.technicalSpecs.nozzleSizeMm ?? 0.4);
        setLaserPower(recipe.technicalSpecs.laserPowerPercent ?? 65);
        setLaserSpeed(recipe.technicalSpecs.laserSpeedMmSec ?? 25);
      }
    } else {
      setName('');
      setTechnology('print3d');
      const defaultMac = machines.find((m) => m.technology === 'print3d');
      setSelectedMachineId(defaultMac ? defaultMac.id : '');

      const defaultMat = materials.length > 0 ? materials[0] : null;
      setMaterialsUsed([
        {
          id: 'rm-' + Date.now(),
          materialId: defaultMat?.id || '',
          materialName: defaultMat?.name || 'Seleziona materiale',
          quantityUsed: 45,
          unit: defaultMat?.unit || 'g',
        },
      ]);

      setMachineHoursStr('3.5');
      setLaborHoursInput('0');
      setLaborMinutesInput('25');
      setWasteRiskPercent(5);
      setSellingPrice(28.0);
      setSalesChannel('etsy');
      setPlatformFeeFixed(0.20);
      setPlatformFeePercent(6.5);
      setNotes('');
    }
  }, [recipe, isOpen, materials, machines]);

  if (!isOpen) return null;

  // Conversione pulita tempi (supporta virgola italiana '3,5' e punto '3.5')
  const parsedMachineHours = Math.max(
    0,
    parseFloat(machineHoursStr.replace(',', '.')) || 0
  );

  const parsedLaborHours = Math.max(0, parseFloat(laborHoursInput.replace(',', '.')) || 0);
  const parsedLaborMinutes = Math.max(0, parseInt(laborMinutesInput) || 0);
  const totalLaborMinutes = Math.round(parsedLaborHours * 60 + parsedLaborMinutes);
  const totalLaborHoursDecimal = totalLaborMinutes / 60;

  // Gestione preset Canali di Vendita
  const applyChannelPreset = (channel: SalesChannelType) => {
    setSalesChannel(channel);
    switch (channel) {
      case 'direct':
        setPlatformFeeFixed(0);
        setPlatformFeePercent(0);
        break;
      case 'etsy':
        setPlatformFeeFixed(0.20); // €0.20 per listing
        setPlatformFeePercent(6.5); // 6.5% transazione (+ elaborazione)
        break;
      case 'shopify':
        setPlatformFeeFixed(0.25); // gateway fisso
        setPlatformFeePercent(1.9); // tariffa Stripe/gateway
        break;
      case 'b2b':
        setPlatformFeeFixed(0);
        setPlatformFeePercent(0);
        break;
      case 'custom':
        // Mantiene i valori attuali per personalizzazione
        break;
    }
  };

  const handleAddMaterialRow = () => {
    const firstMat = materials[0];
    setMaterialsUsed((prev) => [
      ...prev,
      {
        id: 'rm-' + Date.now(),
        materialId: firstMat?.id || '',
        materialName: firstMat?.name || 'Nuovo materiale',
        quantityUsed: 1,
        unit: firstMat?.unit || 'g',
      },
    ]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    if (materialsUsed.length <= 1) return;
    setMaterialsUsed((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index: number, newMaterialId: string) => {
    const found = materials.find((m) => m.id === newMaterialId);
    setMaterialsUsed((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        materialId: newMaterialId,
        materialName: found?.name || '',
        unit: found?.unit || 'g',
      };
      return copy;
    });
  };

  const handleQuantityChange = (index: number, qty: number) => {
    setMaterialsUsed((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        quantityUsed: qty,
      };
      return copy;
    });
  };

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);

  // Calcolo costi in tempo reale
  const primaryMaterial = materialsUsed[0];
  const tempRecipe: ProductRecipe = {
    id: recipe?.id || '',
    name,
    technology,
    machineId: selectedMachineId || undefined,
    machineName: selectedMachine?.name || undefined,
    materialsUsed,
    materialId: primaryMaterial?.materialId,
    materialName: primaryMaterial?.materialName,
    quantityUsed: primaryMaterial?.quantityUsed,
    unit: primaryMaterial?.unit,
    machineHours: parsedMachineHours,
    laborMinutes: totalLaborMinutes,
    wasteRiskPercent,
    sellingPrice,
    salesChannel,
    platformFeeFixed,
    platformFeePercent,
    notes,
    technicalSpecs: {
      layerHeightMm: layerHeight,
      infillPercent: infill,
      nozzleSizeMm: nozzle,
      laserPowerPercent: laserPower,
      laserSpeedMmSec: laserSpeed,
    },
    updatedAt: new Date().toISOString(),
  };

  const costs = calculateRecipeCosts(tempRecipe, materials, fixedConfig, selectedMachine);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (materialsUsed.length === 0) return;

    onSave({
      ...tempRecipe,
      materialsUsed,
      materialName: materialsUsed.map((m) => m.materialName).filter(Boolean).join(' + '),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header Modale */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {recipe ? 'Modifica Lavorazione / Ricetta' : 'Nuova Lavorazione / Calcolo Prezzo'}
              </h3>
              <p className="text-xs text-blue-200">
                Aggiungi più materiali, seleziona l'impianto e calcola le commissioni per canale di vendita.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form con Scroll Interno */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-4 text-xs font-semibold pb-1 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-3 h-3 bg-amber-200 border border-amber-400 rounded-xs"></span>
              Giallo = da compilare
            </span>
            <span className="flex items-center gap-1.5 text-sky-800">
              <span className="w-3 h-3 bg-sky-200 border border-sky-400 rounded-xs"></span>
              Azzurro = calcolato
            </span>
          </div>

          {/* Nome e Selezione Tecnologia */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome Prodotto / Lavorazione *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Portachiavi in legno con magneti o Vaso PLA con scatola"
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tecnologia di Lavorazione
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'print3d', label: 'Stampa 3D', icon: Layers, color: 'indigo' },
                  { key: 'laser', label: 'Laser', icon: Flame, color: 'amber' },
                  { key: 'cnc', label: 'CNC', icon: Cpu, color: 'emerald' },
                  { key: 'craft', label: 'Artigianato', icon: Palette, color: 'rose' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = technology === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setTechnology(item.key as TechnologyType);
                        // Filtra prima macchina compatibile
                        const matched = machines.find((m) => m.technology === item.key);
                        if (matched) setSelectedMachineId(matched.id);
                      }}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SELETTORE MACCHINA DAL PARCO MACCHINE */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Impianto Assegnato (dal Parco Macchine)
                </label>
                <p className="text-2xs text-slate-500">
                  Determina il costo orario di ammortamento, corrente ed usura per questo lavoro.
                </p>
              </div>

              <select
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 cursor-pointer min-w-64"
              >
                <option value="">-- Macchina Standard di Laboratorio --</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.technology.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEZIONE MATERIALI MULTIPLI (CON TASTO AGGIUNGI E SOMMA PREZZI) */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Materiali Impiegati nel Lavoro ({materialsUsed.length})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenMaterialModal}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                >
                  + Nuovo a Magazzino
                </button>

                <button
                  type="button"
                  onClick={handleAddMaterialRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Aggiungi Materiale</span>
                </button>
              </div>
            </div>

            {/* Lista righe materiali */}
            <div className="space-y-2.5">
              {materialsUsed.map((row, index) => {
                const foundMat = materials.find((m) => m.id === row.materialId);
                const unitPrice = foundMat ? foundMat.unitCost : 0;
                const rowCost = unitPrice * (row.quantityUsed || 0);

                return (
                  <div
                    key={row.id || index}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <div className="sm:col-span-1 text-center font-bold text-slate-400 text-xs">
                      #{index + 1}
                    </div>

                    <div className="sm:col-span-5">
                      <select
                        required
                        value={row.materialId}
                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                        className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                      >
                        <option value="">-- Seleziona Materiale --</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} [{m.category}] ({formatCurrency4(m.unitCost)}/{m.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          required
                          value={row.quantityUsed === 0 ? '' : row.quantityUsed}
                          onChange={(e) =>
                            handleQuantityChange(index, parseFloat(e.target.value) || 0)
                          }
                          placeholder="Quantità"
                          className="w-full bg-amber-50/60 border border-amber-300 rounded-lg pl-2.5 pr-10 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                        <span className="absolute right-2.5 top-1.5 text-xs font-bold text-slate-500 font-mono">
                          {row.unit || foundMat?.unit || 'g'}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 text-right">
                      <span className="text-[10px] text-slate-400 block leading-tight">Parziale</span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {formatCurrency4(rowCost)}
                      </span>
                    </div>

                    <div className="sm:col-span-1 text-right">
                      {materialsUsed.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterialRow(index)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Rimuovi materiale da questo lavoro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOX SOMMA DEI PREZZI MATERIALI */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between bg-sky-50 p-3 rounded-xl border border-sky-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
                  Somma Totale Prezzi Materiali:
                </span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-black font-mono text-sky-950">
                  {formatCurrency4(costs.costMaterial)}
                </span>
              </div>
            </div>
          </div>

          {/* PARAMETRI DI TEMPO (RISOLTO IL BUG ORE / MINUTI) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tempi di Lavorazione Macchina e Manodopera Artigiana</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. ORE MACCHINA / STAMPA */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Tempo Macchina / Stampa (Ore)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={machineHoursStr}
                    onChange={(e) => setMachineHoursStr(e.target.value)}
                    placeholder="es. 3.5 o 3,5"
                    className="w-full bg-amber-50/70 border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono shrink-0">ore</span>
                </div>
                <div className="text-2xs text-slate-500 flex justify-between">
                  <span>Equivale a: <strong>{Math.floor(parsedMachineHours)}h {Math.round((parsedMachineHours % 1) * 60)}m</strong></span>
                  <span className="text-blue-700 font-semibold font-mono">
                    Costo: {formatCurrency(costs.costMachine)}
                  </span>
                </div>
              </div>

              {/* 2. MANODOPERA ARTIGIANA (DUALE: ORE + MINUTI) */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Lavoro Manuale Artigiano (Ore & Minuti)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={laborHoursInput}
                      onChange={(e) => setLaborHoursInput(e.target.value)}
                      placeholder="0"
                      className="w-full bg-amber-50/70 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-right"
                    />
                    <span className="text-xs font-bold text-slate-500">ore</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={laborMinutesInput}
                      onChange={(e) => setLaborMinutesInput(e.target.value)}
                      placeholder="25"
                      className="w-full bg-amber-50/70 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-right"
                    />
                    <span className="text-xs font-bold text-slate-500">min</span>
                  </div>
                </div>
                <div className="text-2xs text-slate-500 flex justify-between">
                  <span>Totale: <strong>{totalLaborMinutes} minuti</strong> ({totalLaborHoursDecimal.toFixed(2)}h)</span>
                  <span className="text-blue-700 font-semibold font-mono">
                    Costo: {formatCurrency(costs.costLabor)} (@{formatCurrency(fixedConfig.laborHourlyRate)}/h)
                  </span>
                </div>
              </div>
            </div>

            {/* % Scarto / Fallimento */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Rischio Scarto / Fallimenti (% sui materiali):</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={wasteRiskPercent}
                  onChange={(e) => setWasteRiskPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-amber-50/70 border border-amber-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right"
                />
                <span className="font-bold text-slate-500">%</span>
                <span className="text-slate-400 font-mono">({formatCurrency(costs.costWaste)})</span>
              </div>
            </div>
          </div>

          {/* SEZIONE COMMISSIONI IN BASE AL CANALE DI VENDITA (DOVE INSERIRLE) */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Canale di Vendita & Commissioni Piattaforma
                </h4>
              </div>
              <span className="text-2xs text-slate-500 italic">
                Scegli il canale per caricare le commissioni automatiche
              </span>
            </div>

            {/* Tasti Preset Canali di Vendita */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { key: 'direct', label: 'Diretto', desc: '0% fees' },
                { key: 'etsy', label: 'Etsy', desc: '6.5% + €0,20' },
                { key: 'shopify', label: 'Shopify / Web', desc: '1.9% + €0,25' },
                { key: 'b2b', label: 'B2B Ingrosso', desc: '0% fees' },
                { key: 'custom', label: 'Personalizzato', desc: 'Libero' },
              ].map((ch) => (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => applyChannelPreset(ch.key as SalesChannelType)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    salesChannel === ch.key
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{ch.label}</div>
                  <div className={`text-3xs ${salesChannel === ch.key ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {ch.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Input Dettaglio Commissioni */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Prezzo vendita base (€) *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">€</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    placeholder="28.00"
                    className="w-full bg-amber-50/60 border border-amber-300 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Prezzo di listino al pubblico
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commissione di vendita (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={platformFeePercent}
                    onChange={(e) => {
                      setSalesChannel('custom');
                      setPlatformFeePercent(parseFloat(e.target.value) || 0);
                    }}
                    className="w-full bg-amber-50/60 border border-amber-300 rounded-lg pr-6 pl-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs font-bold text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                  Etsy: 6,5% · Shopify: 1,9%
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quota fissa / listing (€)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">€</span>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={platformFeeFixed}
                    onChange={(e) => {
                      setSalesChannel('custom');
                      setPlatformFeeFixed(parseFloat(e.target.value) || 0);
                    }}
                    className="w-full bg-amber-50/60 border border-amber-300 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                  Etsy: €0,20 / listing
                </span>
              </div>
            </div>
          </div>

          {/* BOX AZZURRO: CALCOLO COSTI AUTOMATICO (CONFORME ALLO SCREENSHOT 3) */}
          <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-sky-900 block">
              CALCOLO COSTI (AUTOMATICO)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white/80 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Costo materiali</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(costs.costMaterial)}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Costo macchina</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(costs.costMachine)}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Costo manodopera</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(costs.costLabor)}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Costo scarto</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(costs.costWaste)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-sky-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-sky-900 uppercase block">
                  COSTO TOTALE DI PRODUZIONE:
                </span>
                <span className="text-lg font-black font-mono text-slate-950">
                  {formatCurrency(costs.costTotal)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-sky-900 uppercase block">
                  COMMISSIONE CANALE ({salesChannel.toUpperCase()}):
                </span>
                <span className="text-sm font-black font-mono text-amber-800">
                  -{formatCurrency(costs.platformFee)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-sky-900 uppercase block">
                  MARGINE NETTO:
                </span>
                <span
                  className={`text-lg font-black font-mono ${
                    costs.isNegativeMargin ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  +{formatCurrency(costs.marginEur)} ({formatPercent(costs.marginPercent)})
                </span>
              </div>
            </div>
          </div>

          {/* Bottoni Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salva Ricetta nel Catalogo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
