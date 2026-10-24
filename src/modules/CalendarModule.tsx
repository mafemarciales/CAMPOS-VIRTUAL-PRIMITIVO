import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { CalendarDays, Filter, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CalendarModuleProps {
  events: CalendarEvent[];
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({ events }) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredEvents = events.filter(e => selectedType === 'all' || e.type === selectedType);

  const getTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200';
      case 'grades_delivery':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
      case 'meeting':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200';
      case 'holiday':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200';
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
    }
  };

  const getTypeName = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'Evaluación / Examen';
      case 'grades_delivery': return 'Cierre de Notas';
      case 'meeting': return 'Reunión de Padres';
      case 'holiday': return 'Festivo';
      case 'vacation': return 'Vacaciones';
      default: return 'Evento Escolar';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Calendario Académico Institucional</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cronograma unificado de exámenes, cierres de periodo, reuniones, recesos escolares y días festivos.
          </p>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold pb-1">
        {[
          { id: 'all', label: 'Todos los Eventos' },
          { id: 'exam', label: 'Exámenes y Pruebas' },
          { id: 'grades_delivery', label: 'Entrega de Notas' },
          { id: 'meeting', label: 'Reuniones' },
          { id: 'holiday', label: 'Festivos y Vacaciones' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedType(item.id)}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedType === item.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Events Timeline / List View */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center shrink-0 font-mono">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">AGOSTO</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{evt.date.split('-')[2]}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getTypeBadge(evt.type)}`}>
                    {getTypeName(evt.type)}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{evt.date}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{evt.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{evt.description}</p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              Confirmado en Cronograma
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
