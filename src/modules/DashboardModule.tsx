import React, { useState } from 'react';
import { User, Notice, EventItem, Assignment, StudentReport, SchoolConfig } from '../types';
import { 
  Award, Calendar, FileText, Bell, Sparkles, ArrowRight, CheckCircle2, 
  Clock, AlertTriangle, ChevronRight, Pin, BookOpen, Users, ShieldAlert, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardModuleProps {
  user: User;
  notices: Notice[];
  events: EventItem[];
  assignments: Assignment[];
  report: StudentReport;
  config: SchoolConfig;
  onNavigateModule: (moduleName: string, subTab?: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  user,
  notices,
  events,
  assignments,
  report,
  config,
  onNavigateModule
}) => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Filter notices for current role
  const roleNotices = notices.filter(n => n.targetRoles.includes(user.role));
  const pinnedNotices = roleNotices.filter(n => n.pinned);
  const otherNotices = roleNotices.filter(n => !n.pinned);

  // Filter upcoming events
  const upcomingEvents = events.filter(e => e.targetRoles.includes(user.role)).slice(0, 3);

  // Pending assignments for students
  const pendingAssignments = assignments.filter(a => a.group === (user.group || '10°A'));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-blue-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-blue-200 border border-white/10">
                AÑO LECTIVO {config.currentAcademicYear} — PERÍODO {config.currentPeriod}
              </span>
              <span className="text-xs text-blue-300 font-mono">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¡Hola, {user.name}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
              Bienvenido a tu panel principal del Campus Virtual. Revisa los avisos institucionales, tareas pendientes y próximos eventos.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateModule('academico')}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-blue-50 font-semibold rounded-2xl text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <span>Ver Calificaciones</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onNavigateModule('certificados')}
              className="px-4 py-2.5 bg-blue-600/60 hover:bg-blue-600 text-white font-semibold rounded-2xl text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Solicitar Certificado</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid according to Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {user.role === 'student' && (
          <>
            <div 
              onClick={() => onNavigateModule('academico', 'notas')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Promedio General (P1-P2)</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{report.overallAverage.toFixed(2)} / 5.0</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Ver notas y boletín →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('actividades', 'tareas')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tareas y Actividades</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{pendingAssignments.length} Actividades</p>
                <span className="text-[10px] text-amber-600 font-semibold">Ver y entregar tareas →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('academico', 'asistencia')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Asistencia Registrada</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">98% Asistencia</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Ver récord de asistencia →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('academico', 'horario')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Grupo Académico</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{report.group}</p>
                <span className="text-[10px] text-purple-600 font-semibold">Ver horario semanal →</span>
              </div>
            </div>
          </>
        )}

        {user.role === 'teacher' && (
          <>
            <div 
              onClick={() => onNavigateModule('academico', 'planilla')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Grupos Asignados</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">3 Cursos (10°A, 10°B, 11°A)</p>
                <span className="text-[10px] text-blue-600 font-semibold">Ir a planilla de notas →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('actividades', 'tareas')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Entregas y Actividades</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{assignments.length} Tareas</p>
                <span className="text-[10px] text-indigo-600 font-semibold">Revisar y calificar →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('citaciones')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Citaciones Programadas</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">1 Citación</p>
                <span className="text-[10px] text-amber-600 font-semibold">Gestionar citaciones →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('academico', 'notas')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Promedio de Grupo 10°A</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">4.42 / 5.0</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Ver estadísticas →</span>
              </div>
            </div>
          </>
        )}

        {(user.role === 'admin' || user.role === 'rector' || user.role === 'coordinator' || user.role === 'parent') && (
          <>
            <div 
              onClick={() => onNavigateModule(user.role === 'parent' ? 'comunicacion' : 'administracion')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Comunidad Escolar</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">1,250 Usuarios</p>
                <span className="text-[10px] text-purple-600 font-semibold">Activos en el Campus →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('certificados')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Certificados y Trámites</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">2 Solicitudes</p>
                <span className="text-[10px] text-amber-600 font-semibold">Gestionar certificados →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('eventos')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Eventos Institucionales</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">3 Programados</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Ver agenda completa →</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigateModule('actividades', 'tareas')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tareas y Actividades</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{assignments.length} Asignadas</p>
                <span className="text-[10px] text-blue-600 font-semibold">Consultar actividades →</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Two Column Section: Noticias Destacadas & Próximos Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Noticias y Comunicados Institucionales */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Noticias y Avisos Institucionales</span>
            </h3>
            <span className="text-xs text-slate-500">{roleNotices.length} Publicaciones</span>
          </div>

          <div className="space-y-3">
            {roleNotices.map((not) => (
              <div
                key={not.id}
                onClick={() => setSelectedNotice(not)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 ${
                  not.pinned ? 'border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/20' : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {not.pinned && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Pin className="w-3 h-3" /> Fija
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md uppercase">
                        {not.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{not.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {not.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {not.content}
                    </p>

                    <p className="text-[11px] text-slate-400 font-medium">
                      Por: {not.author} ({not.authorRole})
                    </p>
                  </div>

                  {not.image && (
                    <img
                      src={not.image}
                      alt={not.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Eventos y accesos rápidos */}
        <div className="space-y-6">
          {/* Próximos Eventos */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Próximos Eventos</span>
              </h3>
              <button
                onClick={() => onNavigateModule('eventos')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onNavigateModule('eventos')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer space-y-1.5"
                >
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {evt.category}
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{evt.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{evt.date} | {evt.time}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Access Shortcuts */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl text-white space-y-3 shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Accesos Rápidos</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateModule('academico')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all font-medium flex items-center justify-between"
              >
                <span>Boletín Notas</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
              <button
                onClick={() => onNavigateModule('certificados')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all font-medium flex items-center justify-between"
              >
                <span>Certificados</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
              <button
                onClick={() => onNavigateModule('citaciones')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all font-medium flex items-center justify-between"
              >
                <span>Citaciones</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
              <button
                onClick={() => onNavigateModule('biblioteca')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all font-medium flex items-center justify-between"
              >
                <span>Biblioteca</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              {selectedNotice.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={selectedNotice.image} alt={selectedNotice.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="absolute top-3 right-3 p-1.5 bg-slate-900/60 text-white rounded-full hover:bg-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-md uppercase">
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedNotice.date}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedNotice.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedNotice.content}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Publicado por: <strong className="text-slate-800 dark:text-slate-200">{selectedNotice.author}</strong> ({selectedNotice.authorRole})</span>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
