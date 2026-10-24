import React from 'react';
import { X, Printer, Download, Award, CheckCircle2 } from 'lucide-react';
import { StudentReport, SchoolConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OfficialReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StudentReport;
  config: SchoolConfig;
}

export const OfficialReportCardModal: React.FC<OfficialReportCardModalProps> = ({
  isOpen,
  onClose,
  report,
  config
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none"
        >
          {/* Modal Toolbar (hidden on print) */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-sm">Boletín Oficial de Calificaciones</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Content - Clean Printable Layout */}
          <div className="p-8 sm:p-10 font-sans text-slate-900 leading-relaxed bg-white">
            {/* Header / Institutional Branding */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={config.logoUrl}
                  alt={config.institutionName}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                />
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    {config.institutionName}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">{config.slogan}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    NIT: {config.nit} | Res. Educativa No. 4510 de 2020 | {config.address}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider block mb-1">
                  BOLETÍN PERIÓDICO
                </span>
                <p className="text-xs font-bold text-slate-700">AÑO LECTIVO {config.currentAcademicYear}</p>
                <p className="text-xs text-slate-500">CORTE: PERIODOS 1 Y 2</p>
              </div>
            </div>

            {/* Student Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-6">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Estudiante</span>
                <span className="font-bold text-slate-900 text-sm">{report.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Grado y Grupo</span>
                <span className="font-semibold text-slate-800">{report.gradeLevel} ({report.group})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Promedio General</span>
                <span className="font-black text-blue-700 text-base">{report.overallAverage.toFixed(2)} / 5.0</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Comportamiento</span>
                <span className="font-bold text-emerald-700">{report.conductGrade}</span>
              </div>
            </div>

            {/* Subject Grade Table */}
            <div className="overflow-hidden border border-slate-200 rounded-xl mb-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800 text-white uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Asignatura / Área</th>
                    <th className="py-3 px-3 text-center">P1</th>
                    <th className="py-3 px-3 text-center">P2</th>
                    <th className="py-3 px-3 text-center">P3</th>
                    <th className="py-3 px-3 text-center">P4</th>
                    <th className="py-3 px-3 text-center font-bold">PROM</th>
                    <th className="py-3 px-4">Desempeño y Logros Alcanzados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.subjects.map((sub, idx) => (
                    <tr key={sub.subjectId} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {sub.subjectName}
                        <span className="block text-[10px] font-normal text-slate-500">{sub.teacherName}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium">{sub.grades.P1 ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono font-medium">{sub.grades.P2 ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{sub.grades.P3 ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{sub.grades.P4 ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-blue-800 bg-blue-50/50">
                        {sub.average.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600">
                        {sub.achievements}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Observations & Director Comments */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-8">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1 text-[10px]">
                Observaciones del Director de Grupo
              </h4>
              <p className="text-slate-700 italic">"{report.teacherComments}"</p>
            </div>

            {/* Signatures Footer */}
            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 text-center text-xs">
              <div>
                <div className="h-12 flex items-end justify-center mb-1">
                  <span className="font-serif italic text-lg text-slate-800 border-b border-slate-400 px-8 pb-1">
                    {config.rectorName}
                  </span>
                </div>
                <p className="font-bold text-slate-800">{config.rectorName}</p>
                <p className="text-slate-500 text-[10px] uppercase">Rectoría Institucional</p>
              </div>

              <div>
                <div className="h-12 flex items-end justify-center mb-1">
                  <span className="font-serif italic text-lg text-slate-800 border-b border-slate-400 px-8 pb-1">
                    {report.directorName}
                  </span>
                </div>
                <p className="font-bold text-slate-800">{report.directorName}</p>
                <p className="text-slate-500 text-[10px] uppercase">Director de Grupo (10°A)</p>
              </div>
            </div>

            {/* Security stamp */}
            <div className="mt-8 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Documento Oficial Generado Digitalmente por el Campus Virtual. Código de Validación HASH: 88F9-2026-CAMPUS-OK</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
