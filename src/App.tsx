/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ClientInfo,
  FixedCostsConfig,
  MachineItem,
  MaterialItem,
  OrderItem,
  ProductRecipe,
  WorkshopSettings,
} from './types/calculator';
import {
  deleteStoredClient,
  deleteStoredMachine,
  deleteStoredMaterial,
  deleteStoredOrder,
  deleteStoredRecipe,
  deductStockForOrder,
  getStoredClients,
  getStoredFixedCosts,
  getStoredMachines,
  getStoredMaterials,
  getStoredOrders,
  getStoredRecipes,
  getWorkshopSettings,
  replenishMaterialStock,
  saveStoredClient,
  saveStoredFixedCosts,
  saveStoredMachine,
  saveStoredMaterial,
  saveStoredOrder,
  saveStoredRecipe,
  saveWorkshopSettings,
} from './utils/storage';
import { calculateRecipeCosts } from './utils/calculatorEngine';
import { Header, NavTab } from './components/Header';
import { MaterialsArchiveView } from './components/MaterialsArchiveView';
import { RecipesCatalogView } from './components/RecipesCatalogView';
import { MachinesView } from './components/MachinesView';
import { OrdersListView } from './components/OrdersListView';
import { FixedCostsView } from './components/FixedCostsView';
import { ClientsDirectory } from './components/ClientsDirectory';
import { MaterialModal } from './components/MaterialModal';
import { RecipeModal } from './components/RecipeModal';
import { MachineModal } from './components/MachineModal';
import { FixedCostsModal } from './components/FixedCostsModal';
import { OrderModal } from './components/OrderModal';
import { JobSheetModal } from './components/JobSheetModal';
import { MarketplaceSimulatorModal } from './components/MarketplaceSimulatorModal';
import { PrintableQuoteModal } from './components/PrintableQuoteModal';
import { MonthlyProfitAnalytics } from './components/MonthlyProfitAnalytics';
import { SettingsView, SettingsSubTab } from './components/SettingsView';
import { Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('recipes');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('tariffe');

  // Dati persistenti
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [recipes, setRecipes] = useState<ProductRecipe[]>([]);
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [fixedCosts, setFixedCosts] = useState<FixedCostsConfig>(getStoredFixedCosts());
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [settings, setSettings] = useState<WorkshopSettings>(getWorkshopSettings());

  // Stato Modali Pop-Up
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<ProductRecipe | null>(null);

  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<MachineItem | null>(null);

  const [isFixedCostsModalOpen, setIsFixedCostsModalOpen] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);

  const [isJobSheetModalOpen, setIsJobSheetModalOpen] = useState(false);
  const [orderForJobSheet, setOrderForJobSheet] = useState<OrderItem | null>(null);

  const [isMarketplaceModalOpen, setIsMarketplaceModalOpen] = useState(false);
  const [recipeForMarketplace, setRecipeForMarketplace] = useState<ProductRecipe | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [orderForPrint, setOrderForPrint] = useState<OrderItem | null>(null);

  // Toast di notifica
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    setMaterials(getStoredMaterials());
    setRecipes(getStoredRecipes());
    setMachines(getStoredMachines());
    setOrders(getStoredOrders());
    setFixedCosts(getStoredFixedCosts());
    setClients(getStoredClients());
    setSettings(getWorkshopSettings());
  }, []);

  // --- HANDLER MATERIALI & MAGAZZINO ---
  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setIsMaterialModalOpen(true);
  };

  const handleEditMaterial = (mat: MaterialItem) => {
    setEditingMaterial(mat);
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = (mat: MaterialItem) => {
    const updated = saveStoredMaterial(mat);
    setMaterials(updated);
    showToast(`Materiale "${mat.name}" salvato nel Magazzino.`);
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Rimuovere questo materiale dal magazzino?')) {
      const updated = deleteStoredMaterial(id);
      setMaterials(updated);
      showToast('Materiale eliminato.');
    }
  };

  const handleReplenishMaterialStock = (id: string, amount: number) => {
    const updated = replenishMaterialStock(id, amount);
    setMaterials(updated);
    showToast(`Giacenza rifornita con successo.`);
  };

  // --- HANDLER PARCO MACCHINE ---
  const handleOpenAddMachine = () => {
    setEditingMachine(null);
    setIsMachineModalOpen(true);
  };

  const handleEditMachine = (machine: MachineItem) => {
    setEditingMachine(machine);
    setIsMachineModalOpen(true);
  };

  const handleSaveMachine = (machine: MachineItem) => {
    const updated = saveStoredMachine(machine);
    setMachines(updated);
    showToast(`Macchinario "${machine.name}" salvato.`);
  };

  const handleDeleteMachine = (id: string) => {
    if (window.confirm('Eliminare questo macchinario dal parco macchine?')) {
      const updated = deleteStoredMachine(id);
      setMachines(updated);
      showToast('Macchinario eliminato.');
    }
  };

  // --- HANDLER RICETTE / LAVORAZIONI ---
  const handleOpenAddRecipe = () => {
    setEditingRecipe(null);
    setIsRecipeModalOpen(true);
  };

  const handleEditRecipe = (recipe: ProductRecipe) => {
    setEditingRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleSaveRecipe = (recipe: ProductRecipe) => {
    const updated = saveStoredRecipe(recipe);
    setRecipes(updated);
    showToast(`Ricetta "${recipe.name}" salvata nel Catalogo.`);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('Eliminare questa lavorazione dal catalogo?')) {
      const updated = deleteStoredRecipe(id);
      setRecipes(updated);
      showToast('Lavorazione eliminata.');
    }
  };

  const handleCreateOrderFromRecipe = (recipe: ProductRecipe) => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleOpenMarketplaceSimulator = (recipe: ProductRecipe) => {
    setRecipeForMarketplace(recipe);
    setIsMarketplaceModalOpen(true);
  };

  // --- HANDLER ORDINI & PREVENTIVI ---
  const handleOpenAddOrder = () => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleEditOrder = (order: OrderItem) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (order: OrderItem) => {
    const updated = saveStoredOrder(order);
    setOrders(updated);
    showToast(`Ordine "${order.code}" salvato.`);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Eliminare questo ordine?')) {
      const updated = deleteStoredOrder(id);
      setOrders(updated);
      showToast('Ordine eliminato.');
    }
  };

  const handleUpdateOrderStatus = (id: string, status: OrderItem['status']) => {
    const target = orders.find((o) => o.id === id);
    if (target) {
      const updated = saveStoredOrder({ ...target, status });
      setOrders(updated);
      showToast(`Stato aggiornato a ${status.toUpperCase()}`);
    }
  };

  const handlePrintOrder = (order: OrderItem) => {
    setOrderForPrint(order);
    setIsPrintModalOpen(true);
  };

  const handleOpenJobSheet = (order: OrderItem) => {
    setOrderForJobSheet(order);
    setIsJobSheetModalOpen(true);
  };

  const handleDeductStock = (order: OrderItem) => {
    const rec = recipes.find((r) => r.id === order.recipeId);
    if (!rec) {
      showToast('Ricetta associata non trovata.');
      return;
    }
    const result = deductStockForOrder(rec.materialsUsed || [], order.quantity);
    setMaterials(result.updatedMaterials);
    const updatedOrder: OrderItem = {
      ...order,
      materialsDeducted: true,
      stockShortageWarning: undefined,
    };
    const updatedOrders = saveStoredOrder(updatedOrder);
    setOrders(updatedOrders);
    showToast(`Materiali per ${order.quantity} pz scaricati da magazzino.`);
  };

  // --- HANDLER COSTI FISSI ---
  const handleSaveFixedCosts = (config: FixedCostsConfig) => {
    const updated = saveStoredFixedCosts(config);
    setFixedCosts(updated);
    showToast('Costi fissi orari aggiornati su tutti i calcoli.');
  };

  const handleSaveSettings = (newSettings: WorkshopSettings) => {
    const updated = saveWorkshopSettings(newSettings);
    setSettings(updated);
    showToast('Anagrafica ditta e logo salvati con successo per le fatture.');
  };

  // --- HANDLER CLIENTI ---
  const handleSaveClient = (client: ClientInfo) => {
    const updated = saveStoredClient(client);
    setClients(updated);
    showToast(`Cliente "${client.name}" registrato.`);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Eliminare questo cliente dalla rubrica?')) {
      const updated = deleteStoredClient(id);
      setClients(updated);
      showToast('Cliente rimosso.');
    }
  };

  const handleSelectClientForOrder = (client: ClientInfo) => {
    setIsOrderModalOpen(true);
    showToast(`Cliente "${client.name}" selezionato.`);
  };

  // Calcola costo e ricetta per il simulatore marketplace
  const marketplaceCosts = recipeForMarketplace
    ? calculateRecipeCosts(recipeForMarketplace, materials, fixedCosts)
    : { costTotal: 0 };

  // Trova ricetta per la scheda officina corrente
  const currentJobRecipe = orderForJobSheet
    ? recipes.find((r) => r.id === orderForJobSheet.recipeId)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 text-sm md:text-base">
      {/* Header Principale con Icone Colorate */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRecipe={handleOpenAddRecipe}
        onOpenNewMaterial={handleOpenAddMaterial}
        onOpenNewOrder={handleOpenAddOrder}
        onOpenNewMachine={handleOpenAddMachine}
        materialsCount={materials.length}
        recipesCount={recipes.length}
        ordersCount={orders.length}
        machinesCount={machines.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'recipes' && (
          <RecipesCatalogView
            recipes={recipes}
            materials={materials}
            fixedConfig={fixedCosts}
            onOpenAddModal={handleOpenAddRecipe}
            onOpenFixedCostsModal={() => setIsFixedCostsModalOpen(true)}
            onOpenMarketplaceSimulator={handleOpenMarketplaceSimulator}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            onCreateOrderFromRecipe={handleCreateOrderFromRecipe}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsArchiveView
            materials={materials}
            onOpenAddModal={handleOpenAddMaterial}
            onEditMaterial={handleEditMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onReplenishMaterialStock={handleReplenishMaterialStock}
          />
        )}

        {activeTab === 'machines' && (
          <MachinesView
            machines={machines}
            electricityKwhCost={fixedCosts.electricityKwhCost}
            onOpenAddModal={handleOpenAddMachine}
            onEditMachine={handleEditMachine}
            onDeleteMachine={handleDeleteMachine}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersListView
            orders={orders}
            onOpenAddModal={handleOpenAddOrder}
            onEditOrder={handleEditOrder}
            onPrintOrder={handlePrintOrder}
            onOpenJobSheet={handleOpenJobSheet}
            onDeductStock={handleDeductStock}
            onDeleteOrder={handleDeleteOrder}
            onUpdateStatus={handleUpdateOrderStatus}
            onNavigateToAnalytics={() => {
              setActiveTab('settings');
              setSettingsSubTab('grafici');
            }}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsDirectory
            clients={clients}
            onSaveClient={handleSaveClient}
            onDeleteClient={handleDeleteClient}
            onSelectClientForCalculator={handleSelectClientForOrder}
          />
        )}

        {(activeTab === 'settings' || activeTab === 'fixedCosts' || activeTab === 'analytics') && (
          <SettingsView
            settings={settings}
            fixedCosts={fixedCosts}
            orders={orders}
            activeSubTab={
              activeTab === 'fixedCosts'
                ? 'tariffe'
                : activeTab === 'analytics'
                ? 'grafici'
                : settingsSubTab
            }
            onSubTabChange={(tab) => {
              setSettingsSubTab(tab);
              if (activeTab !== 'settings') {
                setActiveTab('settings');
              }
            }}
            onSaveSettings={handleSaveSettings}
            onOpenFixedCostsModal={() => setIsFixedCostsModalOpen(true)}
            onNavigateToMachines={() => setActiveTab('machines')}
            onNavigateToOrders={() => setActiveTab('orders')}
            onOpenNewOrder={handleOpenAddOrder}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Artigiani Digitali</span>
            <span className="text-slate-300">·</span>
            <span>Calcolatore Prezzi, Archivio Materiali e Gestione Ordini</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Stampa 3D · Incisione e Taglio Laser · Fresatura CNC · Artigianato
          </div>
        </div>
      </footer>

      {/* POP-UP MODALS */}
      <MaterialModal
        material={editingMaterial}
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSave={handleSaveMaterial}
      />

      <RecipeModal
        recipe={editingRecipe}
        materials={materials}
        machines={machines}
        fixedConfig={fixedCosts}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onSave={handleSaveRecipe}
        onOpenMaterialModal={() => {
          setIsRecipeModalOpen(false);
          setIsMaterialModalOpen(true);
        }}
      />

      <MachineModal
        machine={editingMachine}
        electricityKwhCost={fixedCosts.electricityKwhCost}
        isOpen={isMachineModalOpen}
        onClose={() => setIsMachineModalOpen(false)}
        onSave={handleSaveMachine}
      />

      <FixedCostsModal
        config={fixedCosts}
        isOpen={isFixedCostsModalOpen}
        onClose={() => setIsFixedCostsModalOpen(false)}
        onSave={handleSaveFixedCosts}
      />

      <OrderModal
        order={editingOrder}
        recipes={recipes}
        materials={materials}
        fixedConfig={fixedCosts}
        clients={clients}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
      />

      {isJobSheetModalOpen && orderForJobSheet && (
        <JobSheetModal
          order={orderForJobSheet}
          recipe={currentJobRecipe}
          materials={materials}
          machines={machines}
          settings={settings}
          isOpen={isJobSheetModalOpen}
          onClose={() => setIsJobSheetModalOpen(false)}
        />
      )}

      {isMarketplaceModalOpen && recipeForMarketplace && (
        <MarketplaceSimulatorModal
          productTitle={recipeForMarketplace.name}
          initialSellingPrice={recipeForMarketplace.sellingPrice}
          initialCostTotal={marketplaceCosts.costTotal}
          isOpen={isMarketplaceModalOpen}
          onClose={() => setIsMarketplaceModalOpen(false)}
        />
      )}

      {isPrintModalOpen && orderForPrint && (
        <PrintableQuoteModal
          order={orderForPrint}
          settings={settings}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 no-print">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
