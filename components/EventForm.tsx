
import React, { useState } from 'react';
import { Event, Role } from '../types';
import { Button } from './Button';
import { generateEventDescription } from '../services/geminiService';

interface EventFormProps {
  onSubmit: (event: Event) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRoleTitle, setCurrentRoleTitle] = useState('');
  const [currentRoleCount, setCurrentRoleCount] = useState<number | ''>('');
  const [currentRoleValue, setCurrentRoleValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddRole = () => {
    if (currentRoleTitle && currentRoleCount && currentRoleValue) {
      setRoles([...roles, { 
        title: currentRoleTitle, 
        vacancies: Number(currentRoleCount),
        value: currentRoleValue 
      }]);
      setCurrentRoleTitle('');
      setCurrentRoleCount('');
      setCurrentRoleValue('');
    }
  };

  const removeRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location || !startTime || !endTime || roles.length === 0) return;

    setIsGenerating(true);
    
    // Attempt to generate a description using AI
    let description = '';
    try {
        description = await generateEventDescription({
            title,
            date,
            location,
            startTime,
            endTime,
            roles
        });
    } catch (err) {
        console.error("AI generation failed", err);
    }

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title,
      location,
      date, 
      startTime,
      endTime,
      roles,
      description
    };

    onSubmit(newEvent);
    setIsGenerating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-4 mb-4">
        <h2 className="text-xl font-bold text-white">Criar Anúncio de Vaga</h2>
        <p className="text-slate-400 text-sm">Preencha os dados do evento e as vagas disponíveis.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Evento</label>
          <input
            type="text"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ex: Rock in Rio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Local</label>
            <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Estádio Mineirão"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
            <input
                type="date"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Horário Chegada</label>
            <input
              type="time"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Horário Saída</label>
            <input
              type="time"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
          <label className="block text-sm font-bold text-slate-200 mb-3 uppercase tracking-wide">
            Adicionar Vagas
          </label>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Cargo (ex: Garçon)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
              value={currentRoleTitle}
              onChange={(e) => setCurrentRoleTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Qtd"
                className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                value={currentRoleCount}
                onChange={(e) => setCurrentRoleCount(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <input
                type="text"
                placeholder="R$ 150,00"
                className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                value={currentRoleValue}
                onChange={(e) => setCurrentRoleValue(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddRole}
                disabled={!currentRoleTitle || !currentRoleCount || !currentRoleValue}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {roles.map((role, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-800 p-2 px-3 rounded text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-slate-200 font-medium">{role.title}</span>
                  <span className="text-slate-400 text-xs sm:text-sm">({role.value})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-slate-700 px-2 py-0.5 rounded text-indigo-300">{role.vacancies}</span>
                  <button type="button" onClick={() => removeRole(idx)} className="text-slate-500 hover:text-red-400">
                    ×
                  </button>
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-2">
                Nenhuma vaga adicionada ainda.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} className="flex-1" type="button">
          Cancelar
        </Button>
        <Button 
            className="flex-1" 
            type="submit"
            isLoading={isGenerating}
            disabled={roles.length === 0}
        >
          {isGenerating ? 'Criando...' : 'Publicar Anúncio'}
        </Button>
      </div>
    </form>
  );
};
