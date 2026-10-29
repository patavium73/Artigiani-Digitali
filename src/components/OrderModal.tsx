/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ClientInfo,
  FixedCostsConfig,
  MaterialItem,
  OrderItem,
  ProductRecipe,
  SalesChannelType,
} from '../types/calculator';
import {
  calculateOrderMetrics,
  calculateRecipeCosts,
  calculateShippingDetails,
  checkStockAvailability,
  formatCurrency,
  formatPercent,
} from '../utils/calculatorEngine';
import {
  ShoppingCart,
  X,
  Check,
  AlertTriangle,
  Scale,
  Truck,
  Package,
  Layers,
  Info,
  Store,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react';

interface OrderModalProps {
  order: OrderItem | null;
  recipes: ProductRecipe[];
  materials: MaterialItem[];
  fixedConfig: FixedCostsConfig;
  clients: ClientInfo[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: OrderItem) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  recipes,
  materials,
  fixedConfig,
  clients,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [clientId, setClientId] = useState('');
  const [quantity, setQuantity] = useState<number>(80);
  const [volumeDiscountPercent, setVolumeDiscountPercent] = useState<number>(15);
  const [minAcceptableMarginPercent, setMinAcceptableMarginPercent] = useState<number>(20);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [validityDays, setValidityDays] = useState<number>(30);
  const [customTerms, setCustomTerms] = useState<string>('');

  // Canale di vendita & Commissioni piattaforma
  const [salesChannel, setSalesChannel] = useState<SalesChannelType>('direct');
  const [channelFeePercent, setChannelFeePercent] = useState<number>(0);
  const [channelFeeFixed, setChannelFeeFixed] = useState<number>(0);

  // Spedizione & Pesi
  const [includeShippingInCalculation, setIncludeShippingInCalculation] = useState(false);
  const [customShippingCost, setCustomShippingCost] = useState<number>(0);

  useEffect(() => {
    if (order) {
      setSelectedRecipeId(order.recipeId || (recipes[0]?.id || ''));
      setClientId(order.client?.id || '');
      setQuantity(order.quantity);
      setVolumeDiscountPercent(order.volumeDiscountPercent);
      setMinAcceptableMarginPercent(order.minAcceptableMarginPercent);
      setTitle(order.title);
      setNotes(order.notes || '');
      setDeliveryDays(order.deliveryDays || 5);
      setOrderDate(order.createdAt ? order.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setValidityDays(order.validityDays || 30);
      setCustomTerms(order.customTerms || '');
      setSalesChannel(order.salesChannel || 'direct');
      setIncludeShippingInCalculation(order.shippingCostEur > 0);
      setCustomShippingCost(order.shippingCostEur || 0);
    } else {
      const defaultRec = recipes[0];
      setSelectedRecipeId(defaultRec?.id || '');
      setClientId(clients[0]?.id || '');
      setQuantity(80);
      setVolumeDiscountPercent(15);
      setMinAcceptableMarginPercent(20);
      setTitle(defaultRec ? `Fornitura ${defaultRec.name}` : 'Nuovo Ordine');
      setNotes('');
      setDeliveryDays(5);
      setOrderDate(new Date().toISOString().slice(0, 10));
      setValidityDays(30);
      setCustomTerms('');
      setSalesChannel(defaultRec?.salesChannel || 'direct');
      setChannelFeePercent(defaultRec?.platformFeePercent || 0);
      setChannelFeeFixed(defaultRec?.platformFeeFixed || 0);
      setIncludeShippingInCalculation(false);
      setCustomShippingCost(0);
    }
  }, [order, isOpen, recipes, clients]);

  if (!isOpen) return null;

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId);

  const recipeCosts = currentRecipe
    ? calculateRecipeCosts(currentRecipe, materials, fixedConfig)
    : {
        costMaterial: 0,
        costMachine: 0,
        costLabor: 0,
        costWaste: 0,
        costTotal: 0,
        totalMaterialWeightGrams: 0,
      };

  const unitBasePrice = currentRecipe?.sellingPrice || 0;

  // Calcolo Pesi e Spedizione
  const unitMaterialWeight = recipeCosts.totalMaterialWeightGrams || 0;
  const unitPackagingWeight = currentRecipe?.packagingWeightGrams || 40;
  const shippingInfo = calculateShippingDetails(
    unitMaterialWeight,
    unitPackagingWeight,
    quantity,
    currentRecipe?.boxDimensionsCm
  );

  const activeShippingCost = includeShippingInCalculation
    ? (customShippingCost > 0 ? customShippingCost : shippingInfo.suggestedCostEur)
    : 0;

  // Calcolo Commissioni Piattaforma Canale
  const discountRatio = Math.max(0, volumeDiscountPercent) / 100;
  const unitDiscountedPrice = unitBasePrice * (1 - discountRatio);
  const goodsRevenue = unitDiscountedPrice * quantity;
  const orderPlatformFee = (goodsRevenue * (channelFeePercent / 100)) + (channelFeeFixed * Math.ceil(quantity / 1));

  const metrics = calculateOrderMetrics(
    recipeCosts.costTotal,
    unitBasePrice,
    quantity,
    volumeDiscountPercent,
    minAcceptableMarginPercent,
    activeShippingCost,
    orderPlatformFee
  );

  // Controllo Scorte Magazzino in Tempo Reale
  const stockCheck = checkStockAvailability(
    currentRecipe?.materialsUsed || [],
    quantity,
    materials
  );

  const selectedClient = clients.find((c) => c.id === clientId) || {
    name: 'Cliente Diretto',
    email: '',
  };

  const handleRecipeChange = (recId: string) => {
    setSelectedRecipeId(recId);
    const rec = recipes.find((r) => r.id === recId);
    if (rec) {
      setTitle(`Fornitura ${quantity}x ${rec.name}`);
      if (rec.salesChannel) {
        setSalesChannel(rec.salesChannel);
        setChannelFeePercent(rec.platformFeePercent || 0);
        setChannelFeeFixed(rec.platformFeeFixed || 0);
      }
    }
  };

  const handleChannelSelect = (channel: SalesChannelType) => {
    setSalesChannel(channel);
    switch (channel) {
      case 'direct':
        setChannelFeePercent(0);
        setChannelFeeFixed(0);
        break;
      case 'etsy':
        setChannelFeePercent(6.5);
        setChannelFeeFixed(0.20);
        break;
      case 'shopify':
        setChannelFeePercent(1.9);
        setChannelFeeFixed(0.25);
        break;
      case 'b2b':
        setChannelFeePercent(0);
        setChannelFeeFixed(0);
        break;
      case 'custom':
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecipe) return;

    const now = new Date();
    const orderId = order?.id || `ord-${Date.now()}`;
    const orderCode =
      order?.code || `ORD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const shortageWarningText = !stockCheck.isSufficient
      ? stockCheck.missingItems
          .map((m) => `Mancano ${m.missing} ${m.unit} di ${m.materialName}`)
          .join('; ')
      : undefined;

    const savedOrder: OrderItem = {
      id: orderId,
      code: orderCode,
      title: title.trim() || `Ordine ${currentRecipe.name}`,
      recipeId: currentRecipe.id,
      recipeName: currentRecipe.name,
      technology: currentRecipe.technology,
      machineId: currentRecipe.machineId,
      machineName: currentRecipe.machineName,
      client: selectedClient,
      quantity,
      volumeDiscountPercent,
      minAcceptableMarginPercent,
      costMaterialPerPiece: recipeCosts.costMaterial,
      costMachinePerPiece: recipeCosts.costMachine,
      costLaborPerPiece: recipeCosts.costLabor,
      costWastePerPiece: recipeCosts.costWaste,
      costTotalPerPiece: recipeCosts.costTotal,
      unitBasePrice,
      unitDiscountedPrice: metrics.unitDiscountedPrice,
      totalRevenue: metrics.totalRevenue,
      totalCost: metrics.totalCost,
      totalMarginEur: metrics.totalMarginEur,
      realMarginPercent: metrics.realMarginPercent,
      isUnderMarginAlert: metrics.isUnderMarginAlert,
      
      // Canale di vendita e commissioni
      salesChannel,
      platformFeeTotal: orderPlatformFee,

      // Spedizione & Pesi
      totalMaterialWeightGrams: shippingInfo.totalMaterialWeightGrams,
      totalPackagingWeightGrams: shippingInfo.totalPackagingWeightGrams,
      totalGrossWeightKg: shippingInfo.totalGrossWeightKg,
      volumetricWeightKg: shippingInfo.volumetricWeightKg,
      suggestedCourierBracket: shippingInfo.suggestedCourierBracket,
      shippingCostEur: activeShippingCost,

      // Magazzino
      stockShortageWarning: shortageWarningText,
      materialsDeducted: order?.materialsDeducted || false,

      status: order?.status || 'bozza',
      deliveryDays,
      deliveryText: `${deliveryDays} giorni lavorativi`,
      validityDays,
      customTerms: customTerms.trim() || undefined,
      notes: notes.trim(),
      createdAt: orderDate ? new Date(orderDate).toISOString() : (order?.createdAt || now.toISOString()),
      updatedAt: now.toISOString(),
    };

    onSave(savedOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modale */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {order ? 'Modifica Ordine Lotto' : 'Nuovo Calcolo Ordine / Preventivo'}
              </h3>
              <p className="text-xs text-teal-100">
                Calcolo parametri ordine, canali di vendita, scorte e spese corriere.
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

        {/* Form Conforme allo Screenshot 4 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* Legenda Giallo / Azzurro */}
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

          {/* AVVISO SOTTO-SCORTA MAGAZZINO */}
          {!stockCheck.isSufficient && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-black text-red-900 block">
                  ATTENZIONE: Scorte di magazzino insufficienti per produrre {quantity} pezzi!
                </span>
                <ul className="list-disc list-inside mt-1 text-red-700 font-medium space-y-0.5">
                  {stockCheck.missingItems.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.materialName}</strong>: Necessari {item.needed} {item.unit}, Disponibili {item.available} {item.unit} (Mancano <span className="underline font-bold">{item.missing} {item.unit}</span>)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* PARAMETRI ORDINE */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white bg-slate-800 px-2.5 py-0.5 rounded">
              PARAMETRI ORDINE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Prodotto (dal Catalogo Ricette) *
                </label>
                <select
                  required
                  value={selectedRecipeId}
                  onChange={(e) => handleRecipeChange(e.target.value)}
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden cursor-pointer"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.technology.toUpperCase()}) — Base {formatCurrency(r.sellingPrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Cliente Assegnato
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="">-- Cliente Occasionale --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Quantità richiesta (pz) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  placeholder="80"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                  Numero di pezzi richiesti
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Sconto quantità offerto (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={volumeDiscountPercent}
                  onChange={(e) => setVolumeDiscountPercent(parseFloat(e.target.value) || 0)}
                  placeholder="15"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                  Sconto per l'ordine in volume
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Margine minimo accettabile (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={minAcceptableMarginPercent}
                  onChange={(e) => setMinAcceptableMarginPercent(parseFloat(e.target.value) || 0)}
                  placeholder="20"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                  Sotto questa soglia non accetti
                </span>
              </div>
            </div>
          </div>

          {/* CONDIZIONI PREVENTIVO & COMMESSA (DATA, VALIDITÀ, CONSEGNA, TERMINI) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Condizioni Documento (Data, Validità, Consegna, Termini)</span>
              </span>
              <span className="text-2xs text-slate-500">
                Configura i parametri visibili sul preventivo e sulla fattura
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Data Emissione</span>
                </label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Validità Preventivo (gg)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tempi Consegna (gg lav.)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Note Interne Commessa
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note operative, finitura richiesta, priorità..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Termini & Condizioni Particolari per questo Ordine
                </label>
                <input
                  type="text"
                  value={customTerms}
                  onChange={(e) => setCustomTerms(e.target.value)}
                  placeholder="Es. Acconto 50% all'ordine; tolleranze ±0.2mm..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SELEZIONE CANALE DI VENDITA & COMMISSIONI PIATTAFORMA */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Canale di Vendita & Commissioni Piattaforma
                </span>
              </div>
              <span className="text-2xs text-slate-500">
                Incide direttamente sul margine netto finale
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { key: 'direct', label: 'Diretto', desc: '0% fees' },
                { key: 'etsy', label: 'Etsy', desc: '6.5% + €0,20' },
                { key: 'shopify', label: 'Shopify / Web', desc: '1.9% + €0,25' },
                { key: 'b2b', label: 'B2B Ingrosso', desc: '0% fees' },
                { key: 'custom', label: 'Personalizzato', desc: 'Libero' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleChannelSelect(item.key as SalesChannelType)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    salesChannel === item.key
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                  <div className={`text-3xs ${salesChannel === item.key ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>

            {salesChannel !== 'direct' && salesChannel !== 'b2b' && (
              <div className="pt-1.5 flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <span>Quota %: <strong>{channelFeePercent}%</strong></span>
                  <span>Quota fissa: <strong>€{channelFeeFixed.toFixed(2)}</strong></span>
                </div>
                <div className="font-mono font-bold text-amber-800">
                  Commissione totale trattenuta: -{formatCurrency(orderPlatformFee)}
                </div>
              </div>
            )}
          </div>

          {/* BOX COSTO PER PEZZO (DAL CATALOGO) */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              COSTO PER PEZZO (DAL CATALOGO)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-sky-50 border border-sky-200 p-2 rounded-lg">
                <span className="text-[10px] text-sky-800 block">Costo materiali / pz</span>
                <span className="font-mono font-bold text-sky-950">
                  {formatCurrency(recipeCosts.costMaterial)}
                </span>
              </div>

              <div className="bg-sky-50 border border-sky-200 p-2 rounded-lg">
                <span className="text-[10px] text-sky-800 block">Costo macchina / pz</span>
                <span className="font-mono font-bold text-sky-950">
                  {formatCurrency(recipeCosts.costMachine)}
                </span>
              </div>

              <div className="bg-sky-50 border border-sky-200 p-2 rounded-lg">
                <span className="text-[10px] text-sky-800 block">Costo manodopera / pz</span>
                <span className="font-mono font-bold text-sky-950">
                  {formatCurrency(recipeCosts.costLabor)}
                </span>
              </div>

              <div className="bg-sky-100 border-2 border-sky-300 p-2 rounded-lg">
                <span className="text-[10px] font-bold text-sky-900 block">Costo totale / pz</span>
                <span className="font-mono font-black text-sky-950">
                  {formatCurrency(recipeCosts.costTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* SEZIONE SPEDIZIONE & PESO VOLUMETRICO */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Calcolo Spedizione & Peso Volumetrico
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeShippingInCalculation}
                  onChange={(e) => {
                    setIncludeShippingInCalculation(e.target.checked);
                    if (e.target.checked && customShippingCost === 0) {
                      setCustomShippingCost(shippingInfo.suggestedCostEur);
                    }
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Includi tariffa corriere nell'ordine
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Peso Netto Materiali</span>
                <span className="font-mono font-bold text-slate-900">
                  {shippingInfo.totalMaterialWeightGrams} g
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Peso Scatola / Imballo</span>
                <span className="font-mono font-bold text-slate-900">
                  {shippingInfo.totalPackagingWeightGrams} g
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Peso Lordo Reale</span>
                <span className="font-mono font-bold text-slate-900">
                  {shippingInfo.totalGrossWeightKg} kg
                </span>
              </div>

              <div className="bg-indigo-50/80 p-2 rounded-lg border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-900 block">Fascia Corriere Suggerita</span>
                <span className="font-mono font-black text-indigo-950 text-xs">
                  {shippingInfo.suggestedCourierBracket}
                </span>
              </div>
            </div>

            {includeShippingInCalculation && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-600">
                  Tariffa corriere applicata al computo:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    (Consigliata: {formatCurrency(shippingInfo.suggestedCostEur)})
                  </span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={customShippingCost || shippingInfo.suggestedCostEur}
                    onChange={(e) => setCustomShippingCost(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right"
                  />
                </div>
              </div>
            )}
          </div>

          {/* BOX AZZURRO CALCOLO ORDINE (Fedele allo Screenshot 4) */}
          <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-900 block">
                CALCOLO ORDINE
              </span>
              {metrics.isUnderMarginAlert && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-100 border border-red-300 rounded text-red-800 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>SOTTO IL MARGINE MINIMO ({minAcceptableMarginPercent}%)</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/90 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Prezzo unitario base</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(unitBasePrice)}
                </span>
              </div>

              <div className="bg-white/90 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Prezzo dopo sconto (-{volumeDiscountPercent}%)</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(metrics.unitDiscountedPrice)}
                </span>
              </div>

              <div className="bg-white/90 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Ricavo totale ordine</span>
                <span className="font-mono font-black text-slate-950 text-sm">
                  {formatCurrency(metrics.totalRevenue)}
                </span>
              </div>

              <div className="bg-white/90 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Costo totale (prod. + sped.)</span>
                <span className="font-mono font-bold text-slate-700">
                  {formatCurrency(metrics.totalCost)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-sky-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-sky-900 uppercase block">
                  MARGINE NETTO TOTALE (€):
                </span>
                <span className="text-xl font-black font-mono text-emerald-700">
                  +{formatCurrency(metrics.totalMarginEur)}
                </span>
              </div>

              {orderPlatformFee > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">
                    COMMISSIONI PIATTAFORMA ({salesChannel.toUpperCase()}):
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-800">
                    -{formatCurrency(orderPlatformFee)}
                  </span>
                </div>
              )}

              <div className="text-right">
                <span className="text-[10px] font-bold text-sky-900 uppercase block">
                  MARGINE % REALE:
                </span>
                <span
                  className={`text-xl font-black font-mono ${
                    metrics.isUnderMarginAlert ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {formatPercent(metrics.realMarginPercent)}
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
              className="flex items-center gap-2 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salva Ordine / Preventivo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
