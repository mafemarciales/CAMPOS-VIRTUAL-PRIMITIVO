import React, { useState } from 'react';
import { Search, X, FileText, Calendar, BookOpen, User as UserIcon, ArrowRight, Award } from 'lucide-react';
import { Notice, EventItem, Assignment, LibraryResource, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
  events: EventItem[];
  assignments: Assignment[];
  library: LibraryResource[];
  users: User[];
  onNavigateModule: (moduleName: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  notices,
  events,
  assignments,
  library,
  users,
  onNavigateModule
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredNotices = query.trim()
    ? notices.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredEvents = query.trim()
    ? events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredAssignments = query.trim()
    ? assignments.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.subjectName.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredLibrary = query.trim()
    ? library.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) || l.author.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredUsers = query.trim()
    ? users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
    : [];

  const totalResults =
    filteredNotices.length +
    filteredEvents.length +
    filteredAssignments.length +
    filteredLibrary.length +
    filteredUsers.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar noticias, eventos, tareas, libros, usuarios... (Escribe para buscar)"
              className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!query.trim() && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Buscador Inteligente del Campus</p>
                <p className="text-xs mt-1">Escribe una palabra clave como "Física", "Certificado", "Feria" o "Boletín"</p>
              </div>
            )}

            {query.trim() && totalResults === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm font-medium">No se encontraron resultados para "{query}"</p>
                <p className="text-xs mt-1">Intenta con otros términos o nombres de asignaturas.</p>
              </div>
            )}

            {/* Assignments */}
            {filteredAssignments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tareas y Actividades ({filteredAssignments.length})</span>
                </h4>
                <div className="space-y-1">
                  {filteredAssignments.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        onNavigateModule('academico');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Materia: {a.subjectName} | Vence: {a.dueDate}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notices */}
            {filteredNotices.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Noticias y Avisos ({filteredNotices.length})</span>
                </h4>
                <div className="space-y-1">
                  {filteredNotices.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigateModule('dashboard');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {n.content}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {filteredEvents.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Eventos ({filteredEvents.length})</span>
                </h4>
                <div className="space-y-1">
                  {filteredEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        onNavigateModule('eventos');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {e.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Fecha: {e.date} | {e.location}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Library */}
            {filteredLibrary.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  <span>Biblioteca Digital ({filteredLibrary.length})</span>
                </h4>
                <div className="space-y-1">
                  {filteredLibrary.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        onNavigateModule('biblioteca');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {b.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Autor: {b.author} | Categoria: {b.category}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {filteredUsers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Comunidad / Usuarios ({filteredUsers.length})</span>
                </h4>
                <div className="space-y-1">
                  {filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        onNavigateModule('administracion');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                            Rol: {u.role} | {u.email}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
