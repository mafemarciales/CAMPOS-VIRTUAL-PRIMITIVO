import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, GraduationCap, Calendar, Award, UserCheck, 
  MessageSquare, BookOpen, CalendarDays, Image, ShieldAlert,
  ChevronRight, Sparkles, FileText
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  role?: UserRole;
  userRole?: UserRole;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  rolesAllowed?: UserRole[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
  { id: 'academico', label: 'Módulo Académico', icon: GraduationCap },
  { id: 'actividades', label: 'Tareas y Actividades', icon: FileText },
  { id: 'eventos', label: 'Eventos Institucionales', icon: Calendar },
  { id: 'certificados', label: 'Certificados en Línea', icon: Award },
  { id: 'citaciones', label: 'Citaciones a Padres', icon: UserCheck },
  { id: 'comunicaciones', label: 'Comunicaciones', icon: MessageSquare },
  { id: 'biblioteca', label: 'Biblioteca Digital', icon: BookOpen },
  { id: 'calendario', label: 'Calendario Escolar', icon: CalendarDays },
  { id: 'galeria', label: 'Galería Institucional', icon: Image },
  { id: 'administracion', label: 'Panel Administrativo', icon: ShieldAlert, rolesAllowed: ['admin', 'rector', 'coordinator'] }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  role,
  userRole
}) => {
  const currentRole = role || userRole || 'student';
  const visibleItems = NAV_ITEMS.filter(item => {
    if (!item.rolesAllowed) return true;
    return item.rolesAllowed.includes(currentRole);
  });

  const isItemActive = (itemId: string) => {
    if (activeModule === itemId) return true;
    if (itemId === 'academico' && (activeModule === 'academic' || activeModule === 'notas' || activeModule === 'horario' || activeModule === 'asistencia' || activeModule === 'observador' || activeModule === 'planilla')) return true;
    if (itemId === 'actividades' && (activeModule === 'tareas' || activeModule === 'actividades' || activeModule === 'assignments')) return true;
    if (itemId === 'eventos' && (activeModule === 'events')) return true;
    if (itemId === 'certificados' && (activeModule === 'certificates')) return true;
    if (itemId === 'citaciones' && (activeModule === 'citations')) return true;
    if (itemId === 'comunicaciones' && (activeModule === 'communications' || activeModule === 'mensajes')) return true;
    if (itemId === 'biblioteca' && (activeModule === 'library')) return true;
    if (itemId === 'calendario' && (activeModule === 'calendar')) return true;
    if (itemId === 'galeria' && (activeModule === 'gallery')) return true;
    if (itemId === 'administracion' && (activeModule === 'admin')) return true;
    return false;
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hidden md:flex transition-colors">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Módulos del Campus
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white border border-blue-900/50 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold truncate">IE Primitivo Leal</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          Campus Virtual La Doctora. Período 2 - Año 2026.
        </p>
      </div>
    </aside>
  );
};
