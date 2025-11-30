
import React from 'react';
import { Event, Registration } from '../types';
import { Button } from './Button';

interface RegistrationsListProps {
  event: Event;
  registrations: Registration[];
  onClose: () => void;
}

export const RegistrationsList: React.FC<RegistrationsListProps> = ({ event, registrations, onClose }) => {
  // Filter registrations for this specific event
  const eventRegistrations = registrations.filter(r => r.eventId === event.id);

  // Group by Role
  const groupedRegistrations = event.roles.reduce((acc, role) => {
    acc[role.title] = eventRegistrations.filter(r => r.selectedRole === role.title);
    // Sort alphabetically by full name
    acc[role.title].sort((a, b) => a.fullName.localeCompare(b.fullName));
    return acc;
  }, {} as Record<string, Registration[]>);

  // Prevent click on modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const totalRegistered = eventRegistrations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Lista de Inscritos
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full border border-indigo-500/30">
                Total: {totalRegistered}
              </span>
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">{event.title} • {event.date}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {event.roles.map((role) => {
            const roleRegistrations = groupedRegistrations[role.title] || [];
            const isFull = roleRegistrations.length >= role.vacancies;

            return (
              <div key={role.title} className="space-y-3">
                <div className="flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur py-2 border-b border-slate-800 z-10">
                  <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                    {role.title}
                    <span className="text-slate-500 text-sm font-normal">
                      ({roleRegistrations.length}/{role.vacancies} preenchidas)
                    </span>
                  </h3>
                  {isFull && <span className="text-xs font-bold text-red-400 uppercase tracking-wider bg-red-400/10 px-2 py-1 rounded">Lotado</span>}
                </div>

                {roleRegistrations.length === 0 ? (
                  <div className="text-slate-600 italic text-sm py-2 px-4 border border-dashed border-slate-800 rounded-lg">
                    Nenhum inscrito para esta vaga ainda.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider text-xs">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Nome Completo</th>
                          <th className="px-4 py-3 font-semibold">CPF</th>
                          <th className="px-4 py-3 font-semibold">Telefone</th>
                          <th className="px-4 py-3 font-semibold">Endereço</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                        {roleRegistrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-white">{reg.fullName}</td>
                            <td className="px-4 py-3 font-mono">{reg.cpf}</td>
                            <td className="px-4 py-3">{reg.phone}</td>
                            <td className="px-4 py-3 truncate max-w-xs" title={reg.address}>{reg.address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Fechar Lista
          </Button>
        </div>
      </div>
    </div>
  );
};
