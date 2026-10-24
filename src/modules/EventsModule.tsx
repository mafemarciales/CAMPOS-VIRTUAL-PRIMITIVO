import React, { useState } from 'react';
import { EventItem, User } from '../types';
import { Calendar, Clock, MapPin, User as UserIcon, Plus, Search, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventsModuleProps {
  user: User;
  events: EventItem[];
  onAddEvent: (event: EventItem) => void;
}

export const EventsModule: React.FC<EventsModuleProps> = ({
  user,
  events,
  onAddEvent
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-08-25');
  const [time, setTime] = useState('09:00 AM - 12:00 PM');
  const [location, setLocation] = useState('Auditorio Principal');
  const [organizer, setOrganizer] = useState('Coordinación Cultural');
  const [category, setCategory] = useState<'institucional' | 'deportivo' | 'cultural' | 'reunion' | 'cronograma'>('cultural');
  const [responsibleName, setResponsibleName] = useState(user.name);

  const isManager = user.role === 'admin' || user.role === 'rector' || user.role === 'coordinator' || user.role === 'teacher';

  const filteredEvents = events.filter(evt => {
    const matchesCategory = activeCategory === 'all' || evt.category === activeCategory;
    const matchesQuery = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt: EventItem = {
      id: `evt-${Date.now()}`,
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      status: 'scheduled',
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
      targetRoles: ['admin', 'rector', 'coordinator', 'teacher', 'student', 'parent'],
      responsibleName
    };
    onAddEvent(newEvt);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Módulo de Eventos e Iniciativas</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Agenda institucional de eventos académicos, torneos deportivos, festivales culturales y reuniones de padres.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Nuevo Evento</span>
          </button>
        )}
      </div>

      {/* Category Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold pb-1">
          {[
            { id: 'all', label: 'Todos los Eventos' },
            { id: 'institucional', label: 'Institucionales' },
            { id: 'deportivo', label: 'Deportes' },
            { id: 'cultural', label: 'Culturales' },
            { id: 'reunion', label: 'Reuniones' },
            { id: 'cronograma', label: 'Cronograma' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o lugar..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  {evt.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg">
                  Programado
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {evt.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{evt.date} | {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Organiza: {evt.organizer} (Resp: {evt.responsibleName})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Dirigido a la comunidad</span>
              <button
                onClick={() => alert(`Te has registrado para asistir al evento: ${evt.title}`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-2xs transition-all"
              >
                Confirmar Asistencia
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Publicar Nuevo Evento Institucional</h3>
              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Evento</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                    <option value="institucional">Institucional</option>
                    <option value="deportivo">Deportivo</option>
                    <option value="cultural">Cultural</option>
                    <option value="reunion">Reunión de Padres</option>
                    <option value="cronograma">Cronograma Escolar</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Hora</label>
                    <input type="text" value={time} onChange={e => setTime(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lugar / Ubicación</label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción del Evento</label>
                  <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">Publicar Evento</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
