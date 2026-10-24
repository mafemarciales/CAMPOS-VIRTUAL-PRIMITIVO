import React, { useState } from 'react';
import { Message, User } from '../types';
import { MessageSquare, Send, Search, Paperclip, Plus, CheckCheck, User as UserIcon, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunicationsModuleProps {
  user: User;
  allUsers: User[];
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  onMarkRead: (msgId: string) => void;
}

export const CommunicationsModule: React.FC<CommunicationsModuleProps> = ({
  user,
  allUsers,
  messages,
  onSendMessage,
  onMarkRead
}) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(messages[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);

  const [receiverId, setReceiverId] = useState(allUsers[0]?.id || 'usr-teacher');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter(m =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = allUsers.find(u => u.id === receiverId);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      senderAvatar: user.avatar,
      receiverId,
      receiverName: targetUser ? targetUser.name : 'Toda la Comunidad',
      subject,
      body,
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isRead: false,
      category: 'general'
    };

    onSendMessage(newMsg);
    setSelectedMessage(newMsg);
    setShowComposeModal(false);
    setSubject('');
    setBody('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    const replyMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      senderAvatar: user.avatar,
      receiverId: selectedMessage.senderId,
      receiverName: selectedMessage.senderName,
      subject: `RE: ${selectedMessage.subject}`,
      body: replyText,
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isRead: false,
      category: 'general'
    };

    onSendMessage(replyMsg);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Comunicaciones e Inox Interno</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sistema de mensajería privada e institucional entre docentes, estudiantes, acudientes y directivos.
          </p>
        </div>

        <button
          onClick={() => setShowComposeModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Redactar Nuevo Mensaje</span>
        </button>
      </div>

      {/* Messaging Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs min-h-[500px]">
        {/* Left Col: Message List */}
        <div className="border-r border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por asunto o remitente..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) onMarkRead(msg.id);
                }}
                className={`p-4 cursor-pointer transition-colors space-y-1 ${
                  selectedMessage?.id === msg.id
                    ? 'bg-blue-50/60 dark:bg-blue-950/30 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{msg.senderName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp.split(' ')[0]}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{msg.subject}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{msg.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Message Content & Reply */}
        <div className="md:col-span-2 flex flex-col justify-between p-6">
          {selectedMessage ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <img src={selectedMessage.senderAvatar} alt={selectedMessage.senderName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMessage.subject}</h3>
                      <p className="text-xs text-slate-500">De: <strong>{selectedMessage.senderName}</strong> ({selectedMessage.senderRole}) Para: {selectedMessage.receiverName}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{selectedMessage.timestamp}</span>
                </div>

                <div className="py-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedMessage.body}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe una respuesta rápida..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="absolute bottom-3 right-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Responder</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <Mail className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Selecciona un mensaje del listado para leerlo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showComposeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Redactar Mensaje Interno</h3>
              <form onSubmit={handleComposeSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Destinatario</label>
                  <select
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role}) - {u.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Asunto</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Cuerpo del Mensaje</label>
                  <textarea rows={4} value={body} onChange={e => setBody(e.target.value)} required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowComposeModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Enviar Mensaje</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
