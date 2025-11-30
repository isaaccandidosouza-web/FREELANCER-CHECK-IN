import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { EventCard } from './components/EventCard';
import { EventForm } from './components/EventForm';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationsList } from './components/RegistrationsList';
import { GlobalDatabase } from './components/GlobalDatabase';
import { Event, Freelancer, Registration } from './types';

// Default example data from prompt with values
const INITIAL_EVENT: Event = {
  id: 'demo-1',
  title: 'Rock in Rio',
  location: 'Estádio Mineirão',
  date: new Date().toISOString().split('T')[0],
  startTime: '12:00',
  endTime: '00:00',
  roles: [
    { title: 'Atendente de Bar', vacancies: 100, value: 'R$ 150,00' },
    { title: 'Operador de Caixa', vacancies: 120, value: 'R$ 180,00' },
    { title: 'Garçon', vacancies: 20, value: 'R$ 160,00' },
    { title: 'Chefe de Bar', vacancies: 5, value: 'R$ 300,00' },
  ],
  description: "Faça parte da equipe do maior festival de música! Estamos buscando profissionais enérgicos para garantir uma experiência incrível."
};

function App() {
  // Load state from localStorage or use defaults
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem('events');
      return saved ? JSON.parse(saved) : [INITIAL_EVENT];
    } catch (e) {
      console.error("Failed to load events", e);
      return [INITIAL_EVENT];
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem('registrations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load registrations", e);
      return [];
    }
  });

  const [isCreating, setIsCreating] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);
  const [viewingRegistrationsEvent, setViewingRegistrationsEvent] = useState<Event | null>(null);
  const [showGlobalDatabase, setShowGlobalDatabase] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
    setIsCreating(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== id));
      // Optional: keep registrations for historical data, or delete them:
      // setRegistrations(registrations.filter(r => r.eventId !== id));
    }
  };

  const handleRegistrationSubmit = (data: Freelancer) => {
    if (registeringEvent) {
      const newRegistration: Registration = {
        ...data,
        id: crypto.randomUUID(),
        eventId: registeringEvent.id,
        timestamp: new Date().toISOString()
      };
      
      setRegistrations([...registrations, newRegistration]);
      setRegisteringEvent(null);
      alert(`Inscrição realizada com sucesso!\n\n${data.fullName} foi inscrito(a) como ${data.selectedRole}.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div 
                className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setIsCreating(false);
                  setShowGlobalDatabase(false);
                }}
              >
                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <span 
                className="font-bold text-xl tracking-tight text-white cursor-pointer"
                onClick={() => {
                  setIsCreating(false);
                  setShowGlobalDatabase(false);
                }}
              >
                Freelancer <span className="text-indigo-400">Check-in</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
               <Button 
                 variant="ghost" 
                 onClick={() => setShowGlobalDatabase(true)}
                 className="hidden sm:flex"
               >
                 <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
                 Banco de Talentos
               </Button>
               {!isCreating && (
                 <Button onClick={() => setIsCreating(true)} size="sm">
                   + Novo Anúncio
                 </Button>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        
        {isCreating ? (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <EventForm 
                onSubmit={handleCreateEvent} 
                onCancel={() => setIsCreating(false)} 
             />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Meus Anúncios</h2>
                <p className="text-slate-400 mt-1">Gerencie suas vagas e eventos.</p>
              </div>
            </div>

            {events.length === 0 ? (
               <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                 <p className="text-slate-500 mb-4">Nenhum anúncio criado ainda.</p>
                 <Button onClick={() => setIsCreating(true)} variant="outline">
                   Criar Primeiro Evento
                 </Button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={handleDeleteEvent}
                    onRegister={(evt) => setRegisteringEvent(evt)}
                    onViewRegistrations={(evt) => setViewingRegistrationsEvent(evt)}
                    registrationCount={registrations.filter(r => r.eventId === event.id).length}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Registration Modal Overlay */}
      {registeringEvent && (
        <RegistrationForm 
          event={registeringEvent} 
          onClose={() => setRegisteringEvent(null)}
          onSubmit={handleRegistrationSubmit}
        />
      )}

      {/* Database/List Modal Overlay (Per Event) */}
      {viewingRegistrationsEvent && (
        <RegistrationsList
          event={viewingRegistrationsEvent}
          registrations={registrations}
          onClose={() => setViewingRegistrationsEvent(null)}
        />
      )}

      {/* Global Database Modal Overlay */}
      {showGlobalDatabase && (
        <GlobalDatabase
          events={events}
          registrations={registrations}
          onClose={() => setShowGlobalDatabase(false)}
        />
      )}
    </div>
  );
}

export default App;