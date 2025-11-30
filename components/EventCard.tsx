
import React from 'react';
import { Event, Role } from '../types';
import { Button } from './Button';

interface EventCardProps {
  event: Event;
  onDelete?: (id: string) => void;
  onRegister?: (event: Event) => void;
  onViewRegistrations?: (event: Event) => void;
  registrationCount?: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onDelete, onRegister, onViewRegistrations, registrationCount = 0 }) => {
  // Format date for better readability if it is in yyyy-mm-dd format
  const formattedDate = event.date ? new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Data não informada';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col h-full group relative">
      {onDelete && (
        <button 
          onClick={() => onDelete(event.id)}
          className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-2 z-10 bg-slate-900/50 rounded-full"
          title="Delete Event"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Header with decorative gradient */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>
        
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="flex items-center text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Data</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Local</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>

          <div className="flex items-center text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Horário</p>
              <p className="font-medium">
                {event.startTime} - {event.endTime}
              </p>
            </div>
          </div>
        </div>
        
        {event.description && (
          <div className="mb-6 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
            <p className="text-slate-400 text-sm leading-relaxed italic">
              "{event.description}"
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Vagas Disponíveis</span>
            <span className="h-px flex-1 bg-slate-800"></span>
          </h4>
          
          <div className="grid gap-2">
            {event.roles.map((role, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-800/40 p-3 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-200">{role.title}</span>
                  {role.value && <span className="text-xs text-slate-400 font-medium">{role.value}</span>}
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {role.vacancies} vagas
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800 flex gap-2">
            {onViewRegistrations && (
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={() => onViewRegistrations(event)}
              >
                Inscritos ({registrationCount})
              </Button>
            )}
            <Button 
              className="flex-[2] justify-center" 
              onClick={() => onRegister && onRegister(event)}
            >
                Inscrever-se
            </Button>
        </div>
      </div>
    </div>
  );
};
