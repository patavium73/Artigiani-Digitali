/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClientInfo } from '../types/calculator';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Edit2,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';

interface ClientsDirectoryProps {
  clients: ClientInfo[];
  onSaveClient: (client: ClientInfo) => void;
  onDeleteClient: (id: string) => void;
  onSelectClientForCalculator: (client: ClientInfo) => void;
}

export const ClientsDirectory: React.FC<ClientsDirectoryProps> = ({
  clients,
  onSaveClient,
  onDeleteClient,
  onSelectClientForCalculator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientInfo>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: '',
    notes: '',
  });

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentClient({
      id: undefined,
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
      notes: '',
    });
    setIsEditing(true);
  };

  const handleEdit = (client: ClientInfo) => {
    setCurrentClient(client);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient.name.trim()) return;
    onSaveClient(currentClient);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Intestazione Rubrica & Ricerca */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Rubrica Clienti & Partner ({clients.length})
              </h2>
              <p className="text-xs text-slate-500">
                Gestisci i contatti frequenti per l'intestazione rapida dei preventivi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cerca cliente..."
                className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuovo Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modale / Scheda Aggiunta / Modifica */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {currentClient.id ? 'Modifica Scheda Cliente' : 'Crea Nuovo Contatto Cliente'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Annulla
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Nome e Cognome Referente *
              </label>
              <input
                type="text"
                required
                value={currentClient.name}
                onChange={(e) =>
                  setCurrentClient((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="es. Mario Rossi"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Ragione Sociale / Azienda
              </label>
              <input
                type="text"
                value={currentClient.company || ''}
                onChange={(e) =>
                  setCurrentClient((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="es. Studio Design Srl"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={currentClient.email}
                onChange={(e) =>
                  setCurrentClient((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="mario.rossi@email.it"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Telefono</label>
              <input
                type="text"
                value={currentClient.phone || ''}
                onChange={(e) =>
                  setCurrentClient((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+39 333 1234567"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                P.IVA o Codice Fiscale
              </label>
              <input
                type="text"
                value={currentClient.taxNumber || ''}
                onChange={(e) =>
                  setCurrentClient((prev) => ({ ...prev, taxNumber: e.target.value }))
                }
                placeholder="IT 12345678901"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Indirizzo Fatturazione / Sede
              </label>
              <input
                type="text"
                value={currentClient.address || ''}
                onChange={(e) =>
                  setCurrentClient((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Via Roma 10, Milano (MI)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1 text-xs">
              Note & Preferenze di Lavorazione
            </label>
            <input
              type="text"
              value={currentClient.notes || ''}
              onChange={(e) =>
                setCurrentClient((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="es. Spedizione con corriere espresso, richiede sempre fattura elettronica con codice SDI"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salva Cliente</span>
            </button>
          </div>
        </form>
      )}

      {/* Elenco Tessere Clienti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div
            key={client.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{client.name}</h3>
                  {client.company && (
                    <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.company}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(client)}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer"
                    title="Modifica"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {client.id && (
                    <button
                      type="button"
                      onClick={() => onDeleteClient(client.id!)}
                      className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 cursor-pointer"
                      title="Elimina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                {client.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:underline text-slate-700 truncate"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.taxNumber && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    P.IVA/CF: {client.taxNumber}
                  </div>
                )}
                {client.notes && (
                  <p className="text-[11px] text-slate-500 pt-1 line-clamp-2">
                    {client.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectClientForCalculator(client)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                <span>Usa nel Calcolatore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
