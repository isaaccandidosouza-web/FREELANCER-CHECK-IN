
import React, { useState } from 'react';
import { Event, Freelancer } from '../types';
import { Button } from './Button';

interface RegistrationFormProps {
  event: Event;
  onClose: () => void;
  onSubmit: (data: Freelancer) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Freelancer>({
    fullName: '',
    cpf: '',
    rg: '',
    phone: '',
    address: '',
    selectedRole: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Prevent click on modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={handleContentClick}
      >
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Inscrição</h2>
            <p className="text-indigo-400 text-sm font-medium">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  required
                  placeholder="000.000.000-00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.cpf}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">RG</label>
                <input
                  type="text"
                  name="rg"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.rg}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Telefone / WhatsApp</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="(00) 00000-0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Endereço Completo</label>
              <input
                type="text"
                name="address"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-indigo-300 mb-2">Selecione a Vaga Pretendida</label>
              <select
                name="selectedRole"
                required
                className="w-full bg-slate-800 border border-indigo-500/30 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.selectedRole}
                onChange={handleChange}
              >
                <option value="" disabled>Selecione uma vaga...</option>
                {event.roles.map((role, idx) => (
                  <option key={idx} value={role.title}>
                    {role.title} ({role.vacancies} vagas) - {role.value || 'Valor a combinar'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-[2]">
              Confirmar Inscrição
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
