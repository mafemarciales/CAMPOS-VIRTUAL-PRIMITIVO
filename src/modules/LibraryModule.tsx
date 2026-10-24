import React, { useState } from 'react';
import { LibraryResource } from '../types';
import { BookOpen, Search, Download, Eye, X, BookMarked, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryModuleProps {
  library: LibraryResource[];
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({ library }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<LibraryResource | null>(null);

  const filteredBooks = library.filter(b => {
    const matchesCat = activeCategory === 'all' || b.category === activeCategory;
    const matchesQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Biblioteca Digital e Institucional</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consulta de libros digitales, guías pedagógicas, manual de convivencia, reglamentos y recursos multimediales.
          </p>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold pb-1">
          {[
            { id: 'all', label: 'Todos los Recursos' },
            { id: 'manuales', label: 'Manual de Convivencia' },
            { id: 'libros', label: 'Libros Digitales' },
            { id: 'guias', label: 'Guías de Estudio' },
            { id: 'reglamentos', label: 'Reglamentos' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar libro o autor..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Grid of Digital Books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                  {book.format}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  {book.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Por: {book.author}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{book.description}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono">{book.downloadsCount} lecturas</span>
              <button
                onClick={() => setSelectedBook(book)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-2xs transition-all flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Leer Documento</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Reader Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="font-bold text-sm line-clamp-1">{selectedBook.title}</h3>
                    <p className="text-[10px] text-slate-300 font-mono">Autor: {selectedBook.author} | {selectedBook.pages || 120} páginas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Descargando copia digital de ${selectedBook.title}...`)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </button>
                  <button onClick={() => setSelectedBook(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Reader Container */}
              <div className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 font-serif text-slate-900 dark:text-slate-100 space-y-6 leading-relaxed">
                <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h1 className="text-xl font-bold">{selectedBook.title}</h1>
                  <p className="text-xs text-slate-500 font-sans mt-1">Versión Digital Oficial — Campus Virtual 2026</p>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <p className="first-letter:text-xl font-semibold">
                    {selectedBook.description}
                  </p>
                  <p>
                    Capítulo I: Disposiciones Generales y Principios Institucionales. La presente publicación sirve como guía rectora para la comunidad de la IE Primitivo Leal La Doctora, promoviendo el respeto, la excelencia académica y la convivencia armónica.
                  </p>
                  <p>
                    Capítulo II: Derechos, Deberes y Estímulos. Se reconoce a cada estudiante como sujeto activo de su propio proceso formativo, garantizando sus derechos constitucionales e institucionales.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-sans text-purple-900 dark:text-purple-300 text-center">
                  Fin de la vista previa interactiva del documento. Utiliza el botón superior para obtener el archivo completo en formato PDF.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
