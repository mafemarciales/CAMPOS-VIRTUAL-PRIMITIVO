import React, { useState } from 'react';
import { User, SchoolConfig, Notice } from '../types';
import { Shield, Users, Settings, Bell, Plus, Lock, CheckCircle2, Search, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminModuleProps {
  currentUser: User;
  users: User[];
  onAddUser: (u: User) => void;
  config: SchoolConfig;
  onUpdateConfig: (cfg: SchoolConfig) => void;
  onAddNotice: (n: Notice) => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  currentUser,
  users,
  onAddUser,
  config,
  onUpdateConfig,
  onAddNotice
}) => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'configuracion' | 'comunicados'>('usuarios');

  // User Management state
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<User['role']>('student');
  const [newUserDoc, setNewUserDoc] = useState('');

  // Config State
  const [schoolName, setSchoolName] = useState(config.institutionName);
  const [schoolSlogan, setSchoolSlogan] = useState(config.slogan);
  const [rectorName, setRectorName] = useState(config.rectorName);
  const [year, setYear] = useState(config.currentAcademicYear);
  const [saveConfigSuccess, setSaveConfigSuccess] = useState(false);

  React.useEffect(() => {
    setSchoolName(config.institutionName);
    setSchoolSlogan(config.slogan);
    setRectorName(config.rectorName);
    setYear(config.currentAcademicYear);
  }, [config]);

  // Broadcast Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'urgente' | 'importante' | 'general' | 'academico'>('importante');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      documentId: newUserDoc || '1020304050',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onAddUser(newUser);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      institutionName: schoolName,
      slogan: schoolSlogan,
      rectorName,
      currentAcademicYear: year
    });
    setSaveConfigSuccess(true);
    setTimeout(() => setSaveConfigSuccess(false), 3000);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: `ntc-${Date.now()}`,
      title: noticeTitle,
      content: noticeBody,
      category: noticeCategory === 'urgente' ? 'urgente' : noticeCategory === 'academico' ? 'academico' : 'institucional',
      author: currentUser.name,
      authorRole: currentUser.role,
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      targetRoles: ['admin', 'rector', 'coordinator', 'teacher', 'student', 'parent']
    };
    onAddNotice(newNotice);
    setNoticeTitle('');
    setNoticeBody('');
    alert('¡Comunicado oficial publicado en la plataforma para toda la comunidad!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Panel de Administración e Institucional</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión centralizada de usuarios, roles, parámetros institucionales y publicaciones generales.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'usuarios'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio de Usuarios ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('configuracion')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'configuracion'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Parámetros del Colegio</span>
        </button>

        <button
          onClick={() => setActiveTab('comunicados')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'comunicados'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Emitir Comunicado General</span>
        </button>
      </div>

      {/* TAB 1: USUARIOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Buscar por nombre, correo o rol..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Usuario</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 uppercase text-[10px] font-bold text-slate-500">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-3 text-center">Rol Asignado</th>
                  <th className="py-3 px-3 text-center">Documento</th>
                  <th className="py-3 px-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{u.email}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase rounded-md">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{u.documentId}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">Activo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIGURACIÓN */}
      {activeTab === 'configuracion' && (
        <form onSubmit={handleSaveConfig} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Datos de la Institución Educativa</h3>

          {saveConfigSuccess && (
            <p className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
              ¡Parámetros institucionales actualizados correctamente!
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Oficial del Colegio</label>
              <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)} required className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lema o Eslogan</label>
              <input type="text" value={schoolSlogan} onChange={e => setSchoolSlogan(e.target.value)} required className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Rector(a)</label>
              <input type="text" value={rectorName} onChange={e => setRectorName(e.target.value)} required className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Año Lectivo Activo</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} required className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs">
              Guardar Cambios Institucionales
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: EMITIR COMUNICADOS */}
      {activeTab === 'comunicados' && (
        <form onSubmit={handlePublishNotice} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Publicar Anuncio en la Plataforma Principal</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Título del Anuncio</label>
              <input type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} required placeholder="Ej. Inicio de inscripciones para actividades extracurriculares..." className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
              <select value={noticeCategory} onChange={e => setNoticeCategory(e.target.value as any)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                <option value="importante">Importante</option>
                <option value="urgente">Urgente</option>
                <option value="general">General</option>
                <option value="academico">Académico</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Mensaje Completo</label>
              <textarea rows={4} value={noticeBody} onChange={e => setNoticeBody(e.target.value)} required className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs">
              Publicar Comunicado
            </button>
          </div>
        </form>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Registrar Nuevo Usuario</h3>
              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                  <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico Institucional</label>
                  <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Rol en el Campus</label>
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                    <option value="student">Estudiante</option>
                    <option value="parent">Padre de Familia / Acudiente</option>
                    <option value="teacher">Docente</option>
                    <option value="coordinator">Coordinador Académico</option>
                    <option value="rector">Rector(a)</option>
                    <option value="admin">Administrador del Sistema</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Documento de Identidad</label>
                  <input type="text" value={newUserDoc} onChange={e => setNewUserDoc(e.target.value)} placeholder="Ej. 1020304050" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddUserModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Crear Usuario</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
