import React, { useState } from 'react';
import { CertificateRequest, DocumentType, User, SchoolConfig } from '../types';
import { Award, FileText, CheckCircle2, Clock, AlertCircle, Eye, Plus, Search, ShieldCheck } from 'lucide-react';
import { OfficialCertificateModal } from '../components/OfficialCertificateModal';
import { motion, AnimatePresence } from 'motion/react';

interface CertificatesModuleProps {
  user: User;
  certificates: CertificateRequest[];
  onRequestCertificate: (cert: CertificateRequest) => void;
  onUpdateCertificateStatus: (certId: string, status: 'approved' | 'rejected' | 'in_review', notes?: string) => void;
  config: SchoolConfig;
}

const DOC_TYPES: { id: DocumentType; label: string; desc: string }[] = [
  { id: 'estudio', label: 'Certificado de Estudio', desc: 'Acredita matrícula activa y grado cursado en el año lectivo.' },
  { id: 'matricula', label: 'Constancia de Matrícula', desc: 'Documento legal de vinculación al establecimiento escolar.' },
  { id: 'notas', label: 'Certificado de Notas', desc: 'Desglose oficial de calificaciones acumuladas por asignatura.' },
  { id: 'pazysalvo', label: 'Paz y Salvo Institucional', desc: 'Certifica ausencia de deudas financieras o de biblioteca.' },
  { id: 'conducta', label: 'Certificado de Buena Conducta', desc: 'Anotación de comportamiento y disciplina en el colegio.' }
];

export const CertificatesModule: React.FC<CertificatesModuleProps> = ({
  user,
  certificates,
  onRequestCertificate,
  onUpdateCertificateStatus,
  config
}) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('estudio');
  const [purpose, setPurpose] = useState('');
  
  const [viewingCert, setViewingCert] = useState<CertificateRequest | null>(null);

  const isReviewer = user.role === 'admin' || user.role === 'rector' || user.role === 'coordinator';

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: CertificateRequest = {
      id: `cert-${Date.now()}`,
      requesterId: user.id,
      requesterName: user.name,
      requesterRole: user.role,
      studentId: user.role === 'parent' ? 'usr-student' : user.id,
      studentName: user.role === 'parent' ? (user.studentName || 'Mateo Alejandro Silva') : user.name,
      documentType: selectedDocType,
      requestDate: new Date().toISOString().split('T')[0],
      purpose: purpose || 'Trámite personal / institucional',
      status: 'pending',
      trackingCode: `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onRequestCertificate(newReq);
    setShowRequestModal(false);
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Solicitud de Certificados en Línea</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Diligencia formularios para expedición de certificados oficiales con firma digital y código QR de validación.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Solicitud de Certificado</span>
        </button>
      </div>

      {/* Grid of Available Documents */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Documentos Institucionales Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOC_TYPES.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDocType(doc.id);
                setShowRequestModal(true);
              }}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer shadow-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                  Formato Digital
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {doc.label}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requests Pipeline & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Seguimiento de Solicitudes Registradas</h3>
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white uppercase text-xs">
                    {cert.documentType === 'estudio' ? 'Certificado de Estudio' : cert.documentType === 'notas' ? 'Certificado de Notas' : cert.documentType === 'matricula' ? 'Constancia de Matrícula' : 'Paz y Salvo'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">({cert.trackingCode})</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Estudiante: <strong>{cert.studentName}</strong> | Solicitado: {cert.requestDate}</p>
                <p className="text-[11px] text-slate-500 italic">Propósito: "{cert.purpose}"</p>
                {cert.reviewerNotes && (
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Nota Secretaría: {cert.reviewerNotes}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase flex items-center gap-1 ${
                  cert.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  cert.status === 'in_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {cert.status === 'approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{cert.status === 'approved' ? 'Listo para Descargar' : cert.status === 'in_review' ? 'En Revisión' : 'Solicitado'}</span>
                </span>

                {cert.status === 'approved' && (
                  <button
                    onClick={() => setViewingCert(cert)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver / Imprimir PDF</span>
                  </button>
                )}

                {isReviewer && cert.status !== 'approved' && (
                  <button
                    onClick={() => onUpdateCertificateStatus(cert.id, 'approved', 'Certificado expedido y firmado.')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-[11px]"
                  >
                    Aprobar & Firmar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Certificate Viewing Modal */}
      {viewingCert && (
        <OfficialCertificateModal
          isOpen={!!viewingCert}
          onClose={() => setViewingCert(null)}
          certificate={viewingCert}
          config={config}
        />
      )}

      {/* New Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Solicitar Documento Certificado</h3>
              <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Documento</label>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value as DocumentType)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="estudio">Certificado de Estudio</option>
                    <option value="matricula">Constancia de Matrícula</option>
                    <option value="notas">Certificado de Notas</option>
                    <option value="pazysalvo">Paz y Salvo Institucional</option>
                    <option value="conducta">Certificado de Buena Conducta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Estudiante</label>
                  <input
                    type="text"
                    disabled
                    value={user.role === 'parent' ? (user.studentName || 'Mateo Alejandro Silva') : user.name}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800/50 border rounded-xl text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Motivo / Destino de la Solicitud</label>
                  <textarea
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    placeholder="Ej. Trámite de pasaporte, beca escolar o entidad bancaria"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Radicar Solicitud</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
