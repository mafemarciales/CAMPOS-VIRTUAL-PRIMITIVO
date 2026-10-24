import React, { useState } from 'react';
import { X, Bell, CheckCheck, Calendar, FileText, MessageSquare, Award, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notice, Message, Assignment, ParentCitation } from '../types';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'notice' | 'assignment' | 'citation' | 'message' | 'certificate';
  isRead: boolean;
  linkModule?: string;
  subTab?: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  notices?: Notice[];
  messages?: Message[];
  assignments?: Assignment[];
  citations?: ParentCitation[];
  onMarkAllRead?: () => void;
  onSelectNotification?: (notification: AppNotification) => void;
  onSelectModule?: (mod: string, subTab?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications: customNotifications,
  notices = [],
  messages = [],
  assignments = [],
  citations = [],
  onMarkAllRead,
  onSelectNotification,
  onSelectModule
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Build aggregated notifications if custom array not supplied
  const aggregatedNotifications: AppNotification[] = customNotifications || [
    ...notices.map(n => ({
      id: `not-${n.id}`,
      title: n.title,
      message: n.content,
      timestamp: n.publishDate,
      type: 'notice' as const,
      isRead: readIds.has(`not-${n.id}`),
      linkModule: 'dashboard'
    })),
    ...assignments.map(a => ({
      id: `asg-${a.id}`,
      title: `Nueva Actividad: ${a.title}`,
      message: `${a.subjectName} (${a.group}) - Vence el ${a.dueDate}`,
      timestamp: a.dueDate,
      type: 'assignment' as const,
      isRead: readIds.has(`asg-${a.id}`),
      linkModule: 'academico',
      subTab: 'tareas'
    })),
    ...citations.map(c => ({
      id: `cit-${c.id}`,
      title: `Citación a Padres: ${c.reason}`,
      message: `Fecha: ${c.date} a las ${c.time} (${c.locationType})`,
      timestamp: c.date,
      type: 'citation' as const,
      isRead: readIds.has(`cit-${c.id}`),
      linkModule: 'citaciones'
    })),
    ...messages.map(m => ({
      id: `msg-${m.id}`,
      title: `Mensaje de ${m.senderName}`,
      message: m.subject,
      timestamp: m.timestamp,
      type: 'message' as const,
      isRead: m.isRead || readIds.has(`msg-${m.id}`),
      linkModule: 'comunicaciones'
    }))
  ];

  const unreadCount = aggregatedNotifications.filter(n => !n.isRead).length;

  const filteredNotifications = aggregatedNotifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleMarkAll = () => {
    const allIds = new Set(aggregatedNotifications.map(n => n.id));
    setReadIds(allIds);
    if (onMarkAllRead) onMarkAllRead();
  };

  const handleItemClick = (n: AppNotification) => {
    setReadIds(prev => new Set([...prev, n.id]));
    if (onSelectNotification) {
      onSelectNotification(n);
    }
    if (onSelectModule && n.linkModule) {
      onSelectModule(n.linkModule, n.subTab);
    }
    onClose();
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'assignment':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'citation':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-100 dark:border-slate-800 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Centro de Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="px-2 py-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-xs flex items-center gap-1 font-semibold transition-colors"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Leer todo</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] font-semibold bg-white dark:bg-slate-900">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'assignment', label: 'Actividades / Tareas' },
              { id: 'notice', label: 'Circulares' },
              { id: 'citation', label: 'Citaciones' },
              { id: 'message', label: 'Mensajes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  filterType === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No hay notificaciones en esta categoría.</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative hover:scale-[1.01] ${
                    n.isRead
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/80 opacity-75'
                      : 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-bold line-clamp-1 ${n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {n.timestamp}
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                          Abrir módulo →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
