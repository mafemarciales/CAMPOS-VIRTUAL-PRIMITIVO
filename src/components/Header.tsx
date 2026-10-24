import React, { useState } from 'react';
import { User, UserRole, SchoolConfig } from '../types';
import { 
  Search, Bell, Sun, Moon, Shield, GraduationCap, 
  ChevronDown, LogOut, Settings, User as UserIcon, Sparkles 
} from 'lucide-react';

interface HeaderProps {
  user: User;
  allUsers?: User[];
  config: SchoolConfig;
  activeRole?: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  darkMode?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode: () => void;
  unreadNotificationsCount?: number;
  unreadCount?: number;
}

const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string }> = {
  admin: { label: 'Administrador', badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200' },
  rector: { label: 'Rectoría', badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200' },
  coordinator: { label: 'Coordinación', badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200' },
  teacher: { label: 'Docente', badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200' },
  student: { label: 'Estudiante', badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200' },
  parent: { label: 'Padre / Acudiente', badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200' }
};

export const Header: React.FC<HeaderProps> = ({
  user,
  allUsers,
  config,
  activeRole,
  onSwitchRole,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  onLogout,
  darkMode,
  isDarkMode,
  onToggleDarkMode,
  unreadNotificationsCount,
  unreadCount
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentRole = activeRole || user?.role || 'student';
  const roleData = ROLE_LABELS[currentRole] || ROLE_LABELS.student;
  const userRoleData = ROLE_LABELS[user?.role] || ROLE_LABELS.student;
  const isDark = darkMode ?? isDarkMode ?? false;
  const unread = unreadNotificationsCount ?? unreadCount ?? 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand & Institution Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src={config.logoUrl}
            alt={config.institutionName}
            className="w-9 h-9 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
          />
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {config.institutionName}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Campus Virtual Institucional
            </p>
          </div>
        </div>

        {/* Quick Role Switcher Pill - Essential for Testing all 6 requested roles! */}
        <div className="relative ml-2 hidden lg:block">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${roleData.badgeColor}`}
            title="Cambiar vista de rol para evaluación"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Rol Activo: {roleData.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showRoleMenu && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                Cambiar Rol de Demostración
              </div>
              {(['admin', 'rector', 'coordinator', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onSwitchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    currentRole === r ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{ROLE_LABELS[r]?.label || r}</span>
                  {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Global Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full py-1.5 px-3.5 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Buscar en el campus...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Search icon mobile */}
        <button
          onClick={onOpenSearch}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Avatar Menu */}
        <div className="relative pl-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium capitalize">
                {userRoleData.label}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user.email}</p>
              </div>

              {/* Mobile Role Switcher */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 lg:hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rol de Prueba</p>
                <select
                  value={currentRole}
                  onChange={(e) => {
                    onSwitchRole(e.target.value as UserRole);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-xs p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="admin">Administrador</option>
                  <option value="rector">Rectoría</option>
                  <option value="coordinator">Coordinación</option>
                  <option value="teacher">Docente</option>
                  <option value="student">Estudiante</option>
                  <option value="parent">Padre de Familia</option>
                </select>
              </div>

              <button
                onClick={() => {
                  onOpenProfile();
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Mi Perfil & Ajustes</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-slate-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
