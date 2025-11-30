import React, { useState, useMemo } from 'react';
import { Event, Registration } from '../types';
import { Button } from './Button';

interface GlobalDatabaseProps {
  events: Event[];
  registrations: Registration[];
  onClose: () => void;
}

export const GlobalDatabase: React.FC<GlobalDatabaseProps> = ({ events, registrations, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Create a map of event IDs to titles for easy lookup
  const eventMap = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.id] = event.title;
      return acc;
    }, {} as Record<string, string>);
  }, [events]);

  // Filter and sort registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter(reg => 
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.cpf.includes(searchTerm) ||
        reg.selectedRole.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Alphabetical order
  }, [registrations, searchTerm]);

  // Prevent click on modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Banco de Talentos
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-500/30">
                Total: {registrations.length}
              </span>
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Base geral de todos os freelancers cadastrados</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-950 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Buscar por nome, CPF ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0">
            {filteredRegistrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>Nenhum registro encontrado.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider text-xs sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nome Completo</th>
                    <th className="px-6 py-4 font-semibold">Cargo</th>
                    <th className="px-6 py-4 font-semibold">Evento</th>
                    <th className="px-6 py-4 font-semibold">CPF</th>
                    <th className="px-6 py-4 font-semibold">Contato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/60 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {reg.fullName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {reg.selectedRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {eventMap[reg.eventId] || 'Evento Removido'}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">{reg.cpf}</td>
                      <td className="px-6 py-4">{reg.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0 flex justify-between items-center">
           <div className="text-xs text-slate-500">
              Mostrando {filteredRegistrations.length} de {registrations.length} registros
           </div>
          <Button onClick={onClose} variant="secondary">
            Fechar Base
          </Button>
        </div>
      </div>
    </div>
  );
};