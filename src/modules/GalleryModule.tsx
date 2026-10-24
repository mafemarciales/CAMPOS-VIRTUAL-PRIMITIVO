import React, { useState } from 'react';
import { GalleryAlbum } from '../types';
import { Image as ImageIcon, Search, Eye, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryModuleProps {
  albums: GalleryAlbum[];
}

export const GalleryModule: React.FC<GalleryModuleProps> = ({ albums }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Galería de Actividades e hitos</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro fotográfico de eventos deportivos, culturales, celebraciones e hitos institucionales.
          </p>
        </div>
      </div>

      {/* Album Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {albums.map((alb) => (
          <div
            key={alb.id}
            onClick={() => {
              setSelectedAlbum(alb);
              setSelectedPhotoIndex(0);
            }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={alb.coverImage}
                alt={alb.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                {alb.category}
              </span>
              <span className="absolute bottom-3 right-3 px-3 py-1 bg-blue-600/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>{alb.photosCount} Fotografías</span>
              </span>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {alb.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{alb.description}</p>
              <p className="text-[11px] text-slate-400 font-mono">Fecha: {alb.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Photo Preview */}
      <AnimatePresence>
        {selectedAlbum && selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-4xl w-full text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">{selectedAlbum.title}</h3>
                  <p className="text-xs text-slate-400">Foto {selectedPhotoIndex + 1} de {selectedAlbum.photos.length}</p>
                </div>
                <button onClick={() => setSelectedAlbum(null)} className="p-2 text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedAlbum.photos[selectedPhotoIndex]?.url || selectedAlbum.coverImage}
                  alt="Foto"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <p className="text-center text-xs text-slate-300 font-medium">
                {selectedAlbum.photos[selectedPhotoIndex]?.caption || selectedAlbum.description}
              </p>

              <div className="flex justify-center gap-2">
                {selectedAlbum.photos.map((ph, idx) => (
                  <button
                    key={ph.id}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPhotoIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={ph.url} alt="Minia" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
