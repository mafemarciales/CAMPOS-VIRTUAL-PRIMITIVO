import React, { useState } from 'react';
import { ParentCitation, User } from '../types';
import { UserCheck, Calendar, Clock, MapPin, Video, CheckCircle2, RefreshCw, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CitationsModuleProps {
  user: User;
  citations: ParentCitation[];
  onAddCitation: (citation: ParentCitation) => void;
  onUpdateCitationStatus: (citationId: string, status: ParentCitation['status'], parentComment?: string) => void;
}

export const CitationsModule: React.FC<CitationsModuleProps> = ({
  user,
  citations,
  onAddCitation,
  onUpdateCitationStatus
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [studentName, setStudentName] = useState('Mateo Alejandro Silva');
  const [parentName, setParentName] = useState('Javier Silva Rodríguez');
  const [date, setDate] = useState('2026-08-18');
  const [time, setTime] = useState('10:00 AM');
  const [modality, setModality] = useState<'virtual' | 'presencial'>('virtual');
  const [locationDetails, setLocationDetails] = useState('Enlace de Videollamada Teams / Meet: https://meet.google.com/citacion-ieprimitivoleal');
  const [reason, setReason] = useState('');

  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [rescheduleComment, setRescheduleComment] = useState('');

  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin' || user.role === 'coordinator';

  const handleScheduleCitation = (e: React.FormEvent) => {
    e.preventDefault();
    const newCit: ParentCitation = {
      id: `cit-${Date.now()}`,
      teacherId: user.id,
      teacherName: user.name,
      parentId: 'usr-parent',
      parentName,
      studentId: 'usr-student',
      studentName,
      date,
      time,
      locationType: modality,
      locationDetails,
      reason,
      status: 'pending'
    };
    onAddCitation(newCit);
    setShowScheduleModal(false);
    setReason('');
  };

  const handleRequestReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalId) return;
    onUpdateCitationStatus(rescheduleModalId, 'reschedule_requested', rescheduleComment);
    setRescheduleModalId(null);
    setRescheduleComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Citación a Padres de Familia</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Programación de citas docentes-padres, confirmación de asistencia, reprogramaciones y seguimiento de compromisos.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Citación</span>
          </button>
        )}
      </div>

      {/* List of Citations */}
      <div className="space-y-4">
        {citations.map((cit) => (
          <div
            key={cit.id}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                  cit.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  cit.status === 'reschedule_requested' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {cit.status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{cit.status === 'confirmed' ? 'Asistencia Confirmada' : cit.status === 'reschedule_requested' ? 'Reprogramación Solicitada' : 'Pendiente Confirmación'}</span>
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Estudiante: {cit.studentName}
                </span>
              </div>

              <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{cit.date} a las {cit.time}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <p className="text-slate-500">Docente Citar: <strong className="text-slate-800 dark:text-slate-200">{cit.teacherName}</strong></p>
                <p className="text-slate-500">Acudiente Citado: <strong className="text-slate-800 dark:text-slate-200">{cit.parentName}</strong></p>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                  {cit.locationType === 'virtual' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  <span>{cit.locationDetails}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase">Motivo de la Citación:</p>
                <p className="text-slate-600 dark:text-slate-400 italic">{cit.reason}</p>
                {cit.parentComment && (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                    Comentario de Acudiente: "{cit.parentComment}"
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons for Parent */}
            <div className="pt-2 flex items-center justify-end gap-2">
              {cit.status !== 'confirmed' && (
                <button
                  onClick={() => onUpdateCitationStatus(cit.id, 'confirmed', 'Confirmado por el acudiente.')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Asistencia</span>
                </button>
              )}

              {cit.status !== 'reschedule_requested' && (
                <button
                  onClick={() => setRescheduleModalId(cit.id)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Solicitar Cambio de Fecha</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Programar Citación a Padres</h3>
              <form onSubmit={handleScheduleCitation} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Estudiante</label>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Acudiente</label>
                  <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
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
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Modalidad de Atención</label>
                  <select value={modality} onChange={e => setModality(e.target.value as any)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                    <option value="virtual">Virtual (Videollamada Teams / Meet)</option>
                    <option value="presencial">Presencial (Sede La Doctora)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lugar o Enlace de la Reunión</label>
                  <input type="text" value={locationDetails} onChange={e => setLocationDetails(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Motivo de la Citación</label>
                  <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl">Enviar Citación</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Solicitar Reprogramación de Citación</h3>
              <form onSubmit={handleRequestReschedule} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Indica tus horarios o fechas de disponibilidad</label>
                  <textarea rows={3} value={rescheduleComment} onChange={e => setRescheduleComment(e.target.value)} required placeholder="Ej. Solicito reprogramar para el día viernes en la tarde debido a motivos laborales..." className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setRescheduleModalId(null)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl">Enviar Solicitud</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
