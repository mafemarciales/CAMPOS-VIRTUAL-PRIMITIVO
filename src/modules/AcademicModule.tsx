import React, { useState } from 'react';
import { 
  User, StudentReport, ScheduleItem, AttendanceRecord, StudentObservation, 
  Assignment, AssignmentSubmission, SchoolConfig, GradePeriod 
} from '../types';
import { 
  GraduationCap, Calendar, Clock, FileText, CheckCircle2, AlertCircle, 
  Upload, Download, Plus, Save, Award, Search, Check, Eye, UserCheck, ShieldAlert
} from 'lucide-react';
import { OfficialReportCardModal } from '../components/OfficialReportCardModal';
import { motion, AnimatePresence } from 'motion/react';

interface AcademicModuleProps {
  user: User;
  report: StudentReport;
  onUpdateReport: (report: StudentReport) => void;
  schedule: ScheduleItem[];
  attendance: AttendanceRecord[];
  onAddAttendance: (records: AttendanceRecord[]) => void;
  observations: StudentObservation[];
  onAddObservation: (obs: StudentObservation) => void;
  assignments: Assignment[];
  onAddAssignment: (asg: Assignment) => void;
  submissions: AssignmentSubmission[];
  onSubmitAssignment: (subm: AssignmentSubmission) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  config: SchoolConfig;
  initialTab?: 'notas' | 'horario' | 'asistencia' | 'observador' | 'tareas' | 'planilla' | 'calificar';
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({
  user,
  report,
  onUpdateReport,
  schedule,
  attendance,
  onAddAttendance,
  observations,
  onAddObservation,
  assignments,
  onAddAssignment,
  submissions,
  onSubmitAssignment,
  onGradeSubmission,
  config,
  initialTab
}) => {
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin' || user.role === 'coordinator' || user.role === 'rector';

  const [activeTab, setActiveTab] = useState<'notas' | 'horario' | 'asistencia' | 'observador' | 'tareas' | 'planilla' | 'calificar'>(
    initialTab || (isTeacherOrAdmin ? 'planilla' : 'notas')
  );

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [showReportModal, setShowReportModal] = useState(false);

  // Filter state for assignments / activities
  const [asgFilter, setAsgFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [asgSubjectFilter, setAsgSubjectFilter] = useState<string>('all');
  const [selectedAsgForDetail, setSelectedAsgForDetail] = useState<Assignment | null>(null);

  // Grade Edit State for Teachers
  const [editingReport, setEditingReport] = useState<StudentReport>(report);
  const [saveGradeSuccess, setSaveGradeSuccess] = useState(false);

  // New Assignment Modal state
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState('Matemáticas Superior');
  const [asgGroup, setAsgGroup] = useState('10°A');
  const [asgDueDate, setAsgDueDate] = useState('2026-08-18');
  const [asgDueTime, setAsgDueTime] = useState('11:59 PM');
  const [asgDesc, setAsgDesc] = useState('');

  // Submit Homework Modal state
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<Assignment | null>(null);
  const [submitText, setSubmitText] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');

  // Grade Homework Modal state
  const [selectedSubmForGrade, setSelectedSubmForGrade] = useState<AssignmentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(4.5);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // New Observation Modal
  const [showObsModal, setShowObsModal] = useState(false);
  const [obsType, setObsType] = useState<'academic' | 'disciplinary' | 'positive'>('academic');
  const [obsTitle, setObsTitle] = useState('');
  const [obsDetail, setObsDetail] = useState('');

  // Attendance Register for Teachers
  const [attDate, setAttDate] = useState('2026-08-05');
  const [attStatus, setAttStatus] = useState<'present' | 'absent' | 'tardy' | 'excused'>('present');
  const [attNotes, setAttNotes] = useState('');
  const [attSuccess, setAttSuccess] = useState(false);

  // Grade Matrix Helper
  const handleGradeChange = (subjectId: string, period: GradePeriod, value: string) => {
    const num = parseFloat(value);
    const validNum = isNaN(num) ? null : Math.min(5.0, Math.max(0, num));

    const updatedSubjects = editingReport.subjects.map(s => {
      if (s.subjectId === subjectId) {
        const updatedGrades = { ...s.grades, [period]: validNum };
        // Recalculate average
        const validGrades = Object.values(updatedGrades).filter((g): g is number => g !== null);
        const avg = validGrades.length > 0 ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length : 0;
        return {
          ...s,
          grades: updatedGrades,
          average: avg
        };
      }
      return s;
    });

    const totalAvg = updatedSubjects.reduce((acc, s) => acc + s.average, 0) / updatedSubjects.length;

    setEditingReport({
      ...editingReport,
      subjects: updatedSubjects,
      overallAverage: totalAvg
    });
  };

  const handleSaveGrades = () => {
    onUpdateReport(editingReport);
    setSaveGradeSuccess(true);
    setTimeout(() => setSaveGradeSuccess(false), 3000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: asgTitle,
      description: asgDesc,
      subjectName: asgSubject,
      teacherId: user.id,
      teacherName: user.name,
      group: asgGroup,
      creationDate: new Date().toISOString().split('T')[0],
      dueDate: asgDueDate,
      dueTime: asgDueTime,
      maxScore: 5.0,
      status: 'active'
    };
    onAddAssignment(newAsg);
    setShowNewAsgModal(false);
    setAsgTitle('');
    setAsgDesc('');
  };

  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgForSubmit) return;

    const newSubmission: AssignmentSubmission = {
      id: `subm-${Date.now()}`,
      assignmentId: selectedAsgForSubmit.id,
      assignmentTitle: selectedAsgForSubmit.title,
      studentId: user.id,
      studentName: user.name,
      submissionDate: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      content: submitText,
      fileName: submitFileName || 'Actividad_MateoSilva.pdf',
      fileSize: '1.4 MB',
      status: 'submitted'
    };

    onSubmitAssignment(newSubmission);
    setSelectedAsgForSubmit(null);
    setSubmitText('');
    setSubmitFileName('');
  };

  const handleSaveGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmForGrade) return;
    onGradeSubmission(selectedSubmForGrade.id, gradeScore, gradeFeedback);
    setSelectedSubmForGrade(null);
  };

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newObs: StudentObservation = {
      id: `obs-${Date.now()}`,
      studentId: report.studentId,
      studentName: report.studentName,
      date: new Date().toISOString().split('T')[0],
      type: obsType,
      title: obsTitle,
      detail: obsDetail,
      teacherName: user.name,
      status: 'open'
    };
    onAddObservation(newObs);
    setShowObsModal(false);
    setObsTitle('');
    setObsDetail('');
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: report.studentId,
      studentName: report.studentName,
      date: attDate,
      subjectName: 'Matemáticas Superior',
      status: attStatus,
      notes: attNotes
    };
    onAddAttendance([record]);
    setAttSuccess(true);
    setTimeout(() => setAttSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Módulo Académico</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión de notas, boletines periódicos, horarios de clase, control de asistencia, observador estudiantil y tareas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Boletín Oficial (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold gap-1">
        <button
          onClick={() => setActiveTab('notas')}
          className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'notas'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Notas y Boletín</span>
        </button>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setActiveTab('planilla')}
            className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'planilla'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Planilla de Notas (Docentes)</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('tareas')}
          className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tareas'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tareas y Actividades ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('horario')}
          className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'horario'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Horario de Clases</span>
        </button>

        <button
          onClick={() => setActiveTab('asistencia')}
          className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'asistencia'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Control de Asistencia</span>
        </button>

        <button
          onClick={() => setActiveTab('observador')}
          className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'observador'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Observador ({observations.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: NOTAS Y BOLETÍN (Student/Parent/All View) */}
      {activeTab === 'notas' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Estudiante Consultatario</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{report.studentName} — Grado {report.gradeLevel} ({report.group})</h3>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Promedio Acumulado</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">{report.overallAverage.toFixed(2)} / 5.0</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Conducta y Convivencia</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{report.conductGrade}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Asignatura</th>
                    <th className="py-3.5 px-4">Docente</th>
                    <th className="py-3.5 px-3 text-center">Periodo 1</th>
                    <th className="py-3.5 px-3 text-center">Periodo 2</th>
                    <th className="py-3.5 px-3 text-center">Periodo 3</th>
                    <th className="py-3.5 px-3 text-center">Periodo 4</th>
                    <th className="py-3.5 px-3 text-center font-bold">Promedio</th>
                    <th className="py-3.5 px-4">Logro y Evaluación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {report.subjects.map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{sub.subjectName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{sub.teacherName}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">{sub.grades.P1 ?? '-'}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">{sub.grades.P2 ?? '-'}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">{sub.grades.P3 ?? '-'}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">{sub.grades.P4 ?? '-'}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-700 dark:text-blue-400">
                        {sub.average.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-600 dark:text-slate-400 max-w-xs">
                        {sub.achievements}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PLANILLA DE NOTAS (Teacher Gradebook Matrix) */}
      {activeTab === 'planilla' && isTeacherOrAdmin && (
        <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Planilla de Registro y Modificación de Calificaciones</h3>
              <p className="text-xs text-slate-500">Ingresa o corrige las notas de los periodos. El promedio se recalcula automáticamente.</p>
            </div>
            <button
              onClick={handleSaveGrades}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Planilla</span>
            </button>
          </div>

          {saveGradeSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Planilla de notas guardada correctamente en el sistema.</span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-white uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-3 text-center">Periodo 1</th>
                  <th className="py-3 px-3 text-center">Periodo 2 (Actual)</th>
                  <th className="py-3 px-3 text-center">Periodo 3</th>
                  <th className="py-3 px-3 text-center">Periodo 4</th>
                  <th className="py-3 px-3 text-center">Promedio Auto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {editingReport.subjects.map((sub) => (
                  <tr key={sub.subjectId}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{sub.subjectName}</td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5.0"
                        value={sub.grades.P1 ?? ''}
                        onChange={(e) => handleGradeChange(sub.subjectId, 'P1', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5.0"
                        value={sub.grades.P2 ?? ''}
                        onChange={(e) => handleGradeChange(sub.subjectId, 'P2', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono bg-blue-50 dark:bg-blue-900/30 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5.0"
                        value={sub.grades.P3 ?? ''}
                        onChange={(e) => handleGradeChange(sub.subjectId, 'P3', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs text-slate-400"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5.0"
                        value={sub.grades.P4 ?? ''}
                        onChange={(e) => handleGradeChange(sub.subjectId, 'P4', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs text-slate-400"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {sub.average.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: TAREAS Y ACTIVIDADES */}
      {activeTab === 'tareas' && (
        <div className="space-y-6">
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Tareas, Talleres y Actividades Académicas</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Consulta los trabajos asignados, fecha límite de entrega, archivos adjuntos y calificaciones de docentes.
              </p>
            </div>
            {isTeacherOrAdmin && (
              <button
                onClick={() => setShowNewAsgModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Nueva Actividad</span>
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold pb-1">
              {[
                { id: 'all', label: `Todas (${assignments.length})` },
                { id: 'pending', label: 'Pendientes' },
                { id: 'submitted', label: 'Entregadas' },
                { id: 'graded', label: 'Calificadas' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAsgFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    asgFilter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={asgSubjectFilter}
                onChange={(e) => setAsgSubjectFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">Todas las Asignaturas</option>
                {Array.from(new Set(assignments.map(a => a.subjectName))).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignments Grid */}
          {assignments.filter(asg => {
            const submission = submissions.find(s => s.assignmentId === asg.id);
            const matchesSubject = asgSubjectFilter === 'all' || asg.subjectName === asgSubjectFilter;
            let matchesStatus = true;
            if (asgFilter === 'pending') matchesStatus = !submission;
            if (asgFilter === 'submitted') matchesStatus = !!submission && submission.status !== 'graded';
            if (asgFilter === 'graded') matchesStatus = !!submission && submission.status === 'graded';
            return matchesSubject && matchesStatus;
          }).length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-400 opacity-40" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay actividades en este filtro</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No se encontraron actividades pendientes o registradas que coincidan con la búsqueda actual.
              </p>
              <button
                onClick={() => { setAsgFilter('all'); setAsgSubjectFilter('all'); }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments
                .filter(asg => {
                  const submission = submissions.find(s => s.assignmentId === asg.id);
                  const matchesSubject = asgSubjectFilter === 'all' || asg.subjectName === asgSubjectFilter;
                  let matchesStatus = true;
                  if (asgFilter === 'pending') matchesStatus = !submission;
                  if (asgFilter === 'submitted') matchesStatus = !!submission && submission.status !== 'graded';
                  if (asgFilter === 'graded') matchesStatus = !!submission && submission.status === 'graded';
                  return matchesSubject && matchesStatus;
                })
                .map((asg) => {
                  const submission = submissions.find(s => s.assignmentId === asg.id);
                  return (
                    <div
                      key={asg.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md uppercase">
                            {asg.subjectName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-slate-400" /> {asg.dueDate} ({asg.dueTime})
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {asg.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {asg.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span>Docente: <strong className="text-slate-700 dark:text-slate-300">{asg.teacherName}</strong></span>
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Grupo: {asg.group}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        {submission ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                              submission.status === 'graded' 
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            }`}>
                              {submission.status === 'graded' ? `Nota: ${submission.score}/5.0` : 'Entregado'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold text-[11px] flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Pendiente
                          </span>
                        )}

                        <div className="flex items-center gap-1.5">
                          {/* View details button for all roles */}
                          <button
                            onClick={() => setSelectedAsgForDetail(asg)}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                            title="Ver detalles e instrucciones"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalle</span>
                          </button>

                          {/* Student submit button */}
                          {user.role === 'student' && (
                            <button
                              onClick={() => setSelectedAsgForSubmit(asg)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{submission ? 'Reentregar' : 'Entregar'}</span>
                            </button>
                          )}

                          {/* Teacher/Admin grade button */}
                          {isTeacherOrAdmin && (
                            <button
                              onClick={() => {
                                const sub = submissions.find(s => s.assignmentId === asg.id);
                                if (sub) {
                                  setSelectedSubmForGrade(sub);
                                } else {
                                  // Open grading with dummy submission for instant review
                                  setSelectedSubmForGrade({
                                    id: `sub-${Date.now()}`,
                                    assignmentId: asg.id,
                                    studentId: report.studentId,
                                    studentName: report.studentName,
                                    submittedDate: new Date().toISOString().split('T')[0],
                                    content: 'Entrega enviada por el estudiante con el informe en PDF.',
                                    fileName: `${asg.title.replace(/\s+/g, '_')}_Entrega.pdf`,
                                    status: 'submitted'
                                  });
                                }
                              }}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Calificar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: HORARIO DE CLASES */}
      {activeTab === 'horario' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Horario Semanal de Clases — Grado 10°A</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
              const dayClasses = schedule.filter(s => s.day === day);
              return (
                <div key={day} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-center text-blue-600 dark:text-blue-400 uppercase text-[11px] pb-1 border-b border-slate-200 dark:border-slate-700">
                    {day}
                  </h4>
                  {dayClasses.map((item) => (
                    <div key={item.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-2xs space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">{item.subjectName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{item.timeSlot}</p>
                      <p className="text-[10px] text-slate-400">{item.classroom} | {item.teacherName}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: CONTROL DE ASISTENCIA */}
      {activeTab === 'asistencia' && (
        <div className="space-y-6">
          {isTeacherOrAdmin && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Toma de Asistencia Rápida por Fecha</h3>
              {attSuccess && (
                <p className="text-xs text-emerald-600 font-bold">¡Registro de asistencia guardado exitosamente!</p>
              )}
              <form onSubmit={handleSaveAttendance} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Novedad de Asistencia</label>
                  <select
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="present">Presente</option>
                    <option value="absent">Ausente</option>
                    <option value="tardy">Retardo / Tarde</option>
                    <option value="excused">Excusa Médica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Observación</label>
                  <input
                    type="text"
                    value={attNotes}
                    onChange={(e) => setAttNotes(e.target.value)}
                    placeholder="E.g. Excusa enviada por el acudiente"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs">
                    Registrar Asistencia
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Historial de Asistencia del Estudiante</h3>
            <div className="space-y-2 text-xs">
              {attendance.map((att) => (
                <div key={att.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{att.subjectName}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">{att.date}</span>
                    {att.notes && <p className="text-[11px] text-slate-500 mt-0.5">{att.notes}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    att.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    att.status === 'tardy' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}>
                    {att.status === 'present' ? 'Presente' : att.status === 'tardy' ? 'Retardo' : 'Ausente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: OBSERVADOR ESTUDIANTIL */}
      {activeTab === 'observador' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Anotaciones del Observador Estudiantil</h3>
            {isTeacherOrAdmin && (
              <button
                onClick={() => setShowObsModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Anotación</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {observations.map((obs) => (
              <div key={obs.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                    obs.type === 'positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' :
                    obs.type === 'academic' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40' : 'bg-red-100 text-red-700 dark:bg-red-900/40'
                  }`}>
                    {obs.type === 'positive' ? 'Reconocimiento / Positiva' : obs.type === 'academic' ? 'Aviso Académico' : 'Disciplinaria'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{obs.date}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{obs.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{obs.detail}</p>
                <p className="text-[11px] text-slate-400 font-medium">Registrado por: {obs.teacherName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Printable Report Card Modal */}
      <OfficialReportCardModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        report={report}
        config={config}
      />

      {/* Modal New Assignment */}
      <AnimatePresence>
        {showNewAsgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Crear y Publicar Nueva Tarea</h3>
              <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Título de la Actividad</label>
                  <input type="text" value={asgTitle} onChange={e => setAsgTitle(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Asignatura</label>
                    <input type="text" value={asgSubject} onChange={e => setAsgSubject(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Grupo</label>
                    <input type="text" value={asgGroup} onChange={e => setAsgGroup(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha de Vencimiento</label>
                    <input type="date" value={asgDueDate} onChange={e => setAsgDueDate(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Hora Límite</label>
                    <input type="text" value={asgDueTime} onChange={e => setAsgDueTime(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Instrucciones y Detalle</label>
                  <textarea rows={3} value={asgDesc} onChange={e => setAsgDesc(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowNewAsgModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Publicar Tarea</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Submit Assignment */}
      <AnimatePresence>
        {selectedAsgForSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Entregar Actividad: {selectedAsgForSubmit.title}</h3>
              <form onSubmit={handleSubmitHomework} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Comentario o Respuesta para el Docente</label>
                  <textarea rows={3} value={submitText} onChange={e => setSubmitText(e.target.value)} required placeholder="Describa su entrega..." className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Adjuntar Archivo (PDF, DOCX)</label>
                  <input type="text" value={submitFileName} onChange={e => setSubmitFileName(e.target.value)} placeholder="Ej. Taller_Calculo_MateoSilva.pdf" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setSelectedAsgForSubmit(null)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">Enviar Entrega</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Grade Homework */}
      <AnimatePresence>
        {selectedSubmForGrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Calificar Entrega: {selectedSubmForGrade.studentName}</h3>
              <p className="text-xs text-slate-500">Contenido entregado: "{selectedSubmForGrade.content}"</p>
              <form onSubmit={handleSaveGradeSubmission} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nota (0.0 - 5.0)</label>
                  <input type="number" step="0.1" min="0" max="5.0" value={gradeScore} onChange={e => setGradeScore(parseFloat(e.target.value))} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-base font-bold" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Retroalimentación / Comentarios</label>
                  <textarea rows={3} value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} placeholder="Excelente trabajo..." className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setSelectedSubmForGrade(null)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold">Guardar Calificación</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal New Observation */}
      <AnimatePresence>
        {showObsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Registrar Anotación en Observador</h3>
              <form onSubmit={handleCreateObservation} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Anotación</label>
                  <select value={obsType} onChange={e => setObsType(e.target.value as any)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                    <option value="academic">Aviso Académico</option>
                    <option value="disciplinary">Aviso Disciplinario</option>
                    <option value="positive">Reconocimiento Positivo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Título de la Anotación</label>
                  <input type="text" value={obsTitle} onChange={e => setObsTitle(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Detalle y Compromiso</label>
                  <textarea rows={3} value={obsDetail} onChange={e => setObsDetail(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowObsModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Guardar Anotación</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Activity / Assignment Full Details */}
      <AnimatePresence>
        {selectedAsgForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md uppercase">
                    {selectedAsgForDetail.subjectName}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">
                    {selectedAsgForDetail.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAsgForDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Docente:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedAsgForDetail.teacherName}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Grupo asignado:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedAsgForDetail.group}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Fecha de Entrega:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-mono">
                    {selectedAsgForDetail.dueDate} ({selectedAsgForDetail.dueTime})
                  </strong>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white">Instrucciones y Guía:</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedAsgForDetail.description}
                </p>
              </div>

              {/* Status of student submission for this task */}
              {(() => {
                const sub = submissions.find(s => s.assignmentId === selectedAsgForDetail.id);
                return (
                  <div className="p-3.5 rounded-2xl border text-xs space-y-1.5 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Estado de Entrega:</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        sub?.status === 'graded' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                          : sub ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {sub?.status === 'graded' ? `Calificado: ${sub.score} / 5.0` : sub ? 'Entregado' : 'Pendiente de entrega'}
                      </span>
                    </div>
                    {sub && (
                      <div className="text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700 text-[11px]">
                        <p><strong>Fecha entregada:</strong> {sub.submittedDate}</p>
                        {sub.fileName && <p><strong>Archivo adjunto:</strong> 📄 {sub.fileName}</p>}
                        {sub.feedback && (
                          <p className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg mt-1">
                            <strong>Comentario del docente:</strong> {sub.feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsgForDetail(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cerrar
                </button>
                {user.role === 'student' && (
                  <button
                    onClick={() => {
                      const asg = selectedAsgForDetail;
                      setSelectedAsgForDetail(null);
                      setSelectedAsgForSubmit(asg);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Entregar esta Actividad
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
