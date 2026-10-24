import React from 'react';
import { X, Printer, Award, ShieldCheck, QrCode } from 'lucide-react';
import { CertificateRequest, SchoolConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OfficialCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateRequest;
  config: SchoolConfig;
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  config
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getTitle = () => {
    switch (certificate.documentType) {
      case 'estudio':
        return 'CERTIFICADO DE ESTUDIO';
      case 'matricula':
        return 'CONSTANCIA DE MATRÍCULA';
      case 'notas':
        return 'CERTIFICADO DE CALIFICACIONES Y NOTAS';
      case 'pazysalvo':
        return 'CERTIFICADO DE PAZ Y SALVO INSTITUCIONAL';
      case 'conducta':
        return 'CERTIFICADO DE BUENA CONDUCTA Y DISCIPLINA';
      default:
        return 'CERTIFICADO OFICIAL';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none"
        >
          {/* Modal Toolbar (hidden on print) */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-sm">Documento Certificado Oficial</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Descargar PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Sheet */}
          <div className="p-10 sm:p-12 font-serif text-slate-900 leading-relaxed bg-white border-[12px] border-double border-blue-900/10 m-2">
            {/* School Header */}
            <div className="text-center border-b border-slate-300 pb-6 mb-8">
              <img
                src={config.logoUrl}
                alt={config.institutionName}
                className="w-16 h-16 object-cover mx-auto mb-2 rounded-xl border border-slate-200"
              />
              <h1 className="text-2xl font-bold font-sans text-blue-950 uppercase tracking-wide">
                {config.institutionName}
              </h1>
              <p className="text-xs font-sans text-slate-600 font-medium">{config.slogan}</p>
              <p className="text-[11px] font-sans text-slate-500 mt-1">
                Aprobación Oficial según Resolución No. 4510 del Ministerio de Educación Nacional | NIT: {config.nit}
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center my-8">
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                SECRETARÍA ACADÉMICA GENERAL
              </span>
              <h2 className="text-xl font-bold font-sans text-slate-900 underline underline-offset-8 decoration-blue-800 tracking-wider">
                {getTitle()}
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-2 font-mono">
                CÓDIGO DE VERIFICACIÓN: {certificate.trackingCode}
              </p>
            </div>

            {/* Certificate Body Text */}
            <div className="text-sm text-slate-800 space-y-6 text-justify px-4 leading-loose">
              <p className="first-letter:text-2xl first-letter:font-bold">
                La suscrita Rectora y la Secretaria Académica del <span className="font-bold">{config.institutionName}</span>, en uso de sus facultades legales e institucionales,
              </p>

              <p className="text-center font-bold text-base py-2 uppercase font-sans tracking-wide">
                CERTIFICAN QUE:
              </p>

              <p>
                El (la) estudiante <span className="font-bold text-slate-950 underline">{certificate.studentName}</span>, identificado(a) con documento de identidad No. <span className="font-bold font-mono">1.098.450.192</span>, se encuentra oficialmente matriculado(a) y cursando de manera regular el grado <span className="font-bold">DÉCIMO (10°A)</span> de Educación Media durante el año lectivo <span className="font-bold">{config.currentAcademicYear}</span>.
              </p>

              <p>
                Se expide la presente certificación a solicitud de la parte interesada para fines de: <span className="italic font-medium text-slate-900">"{certificate.purpose}"</span>.
              </p>

              <p className="text-xs text-slate-500 pt-2 font-sans">
                Dada en el Campus Principal de Bogotá D.C., a los {new Date().getDate()} días del mes de agosto del año {config.currentAcademicYear}.
              </p>
            </div>

            {/* Stamp & Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-12 mt-8 border-t border-slate-200 font-sans text-center text-xs">
              <div>
                <div className="h-16 flex items-end justify-center mb-1">
                  <span className="font-serif italic text-lg text-slate-900 border-b border-slate-400 px-8 pb-1">
                    {config.rectorName}
                  </span>
                </div>
                <p className="font-bold text-slate-900">{config.rectorName}</p>
                <p className="text-slate-500 text-[10px] uppercase">Rectora Institucional</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-1 mb-1">
                  <QrCode className="w-10 h-10 text-slate-700" />
                  <span className="text-[8px] font-mono mt-1 text-slate-500">VERIFY-OK</span>
                </div>
                <p className="font-bold text-slate-900 text-[11px]">Sello Digital de Autenticidad</p>
                <p className="text-[9px] text-slate-400 font-mono">Firmado Digitalmente con Certificado SSL</p>
              </div>
            </div>

            <div className="mt-8 text-center text-[9px] font-sans text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Documento firmado electrónicamente conforme a la ley de comercio electrónico y firma digital. Validar en {config.email}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
