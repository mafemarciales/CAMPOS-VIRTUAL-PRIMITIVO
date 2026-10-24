import React, { useState, useEffect } from 'react';
import { 
  User, SchoolConfig, Notice, StudentReport, ScheduleItem, AttendanceRecord, 
  StudentObservation, Assignment, AssignmentSubmission, EventItem, 
  CertificateRequest, ParentCitation, Message, LibraryResource, 
  CalendarEvent, GalleryAlbum 
} from './types';
import { 
  DEFAULT_USERS, DEFAULT_SCHOOL_CONFIG, DEFAULT_NOTICES, DEFAULT_STUDENT_REPORT, 
  DEFAULT_SCHEDULE, DEFAULT_ATTENDANCE, DEFAULT_OBSERVATIONS, DEFAULT_ASSIGNMENTS, 
  DEFAULT_SUBMISSIONS, DEFAULT_EVENTS, DEFAULT_CERTIFICATES, DEFAULT_CITATIONS, 
  DEFAULT_MESSAGES, DEFAULT_LIBRARY, DEFAULT_CALENDAR_EVENTS, DEFAULT_GALLERY 
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { ProfileModal } from './components/ProfileModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { DashboardModule } from './modules/DashboardModule';
import { AcademicModule } from './modules/AcademicModule';
import { EventsModule } from './modules/EventsModule';
import { CertificatesModule } from './modules/CertificatesModule';
import { CitationsModule } from './modules/CitationsModule';
import { CommunicationsModule } from './modules/CommunicationsModule';
import { LibraryModule } from './modules/LibraryModule';
import { CalendarModule } from './modules/CalendarModule';
import { GalleryModule } from './modules/GalleryModule';
import { AdminModule } from './modules/AdminModule';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Authentication & Current User
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campus_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = DEFAULT_USERS.find(u => u.id === parsed.id || u.role === parsed.role);
        return match || parsed;
      } catch {
        return DEFAULT_USERS[4];
      }
    }
    return DEFAULT_USERS[4]; // Default to Student Mateo Silva
  });

  // Active View Module
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Dark Mode Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('campus_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campus_theme', 'light');
    }
  }, [isDarkMode]);

  // Persistent State Collections
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [config, setConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem('campus_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.institutionName === 'Colegio Campestre Siglo XXI' || !parsed.institutionName) {
          parsed.institutionName = 'IE Primitivo Leal La Doctora';
          parsed.slogan = 'Formamos seres humanos en el respeto a la diferencia';
          parsed.address = 'Calle 75 Sur #33-53, Vereda La Doctora, Sabaneta, Antioquia';
          parsed.email = 'ieprimitivoleal@gmail.com';
          parsed.phone = '(+57) 604 288 1202';
        }
        return parsed;
      } catch {
        return DEFAULT_SCHOOL_CONFIG;
      }
    }
    return DEFAULT_SCHOOL_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('campus_config', JSON.stringify(config));
    document.title = `${config.institutionName} - Campus Virtual`;
  }, [config]);
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [report, setReport] = useState<StudentReport>(DEFAULT_STUDENT_REPORT);
  const [schedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(DEFAULT_ATTENDANCE);
  const [observations, setObservations] = useState<StudentObservation[]>(DEFAULT_OBSERVATIONS);
  const [assignments, setAssignments] = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(DEFAULT_SUBMISSIONS);
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [certificates, setCertificates] = useState<CertificateRequest[]>(DEFAULT_CERTIFICATES);
  const [citations, setCitations] = useState<ParentCitation[]>(DEFAULT_CITATIONS);
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [library] = useState<LibraryResource[]>(DEFAULT_LIBRARY);
  const [calendarEvents] = useState<CalendarEvent[]>(DEFAULT_CALENDAR_EVENTS);
  const [gallery] = useState<GalleryAlbum[]>(DEFAULT_GALLERY);

  // Modals & Drawers state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Unread Count
  const unreadCount = messages.filter(m => !m.isRead).length + notices.length;

  // Handlers
  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('campus_user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('campus_user');
  };

  const handleSwitchRole = (newRole: User['role']) => {
    const targetUser = users.find(u => u.role === newRole) || {
      ...user!,
      role: newRole
    };
    setUser(targetUser);
    localStorage.setItem('campus_user', JSON.stringify(targetUser));
  };

  // State Updates
  const handleUpdateReport = (updatedReport: StudentReport) => {
    setReport(updatedReport);
  };

  const handleAddAttendance = (records: AttendanceRecord[]) => {
    setAttendance(prev => [...records, ...prev]);
  };

  const handleAddObservation = (obs: StudentObservation) => {
    setObservations(prev => [obs, ...prev]);
  };

  const handleAddAssignment = (asg: Assignment) => {
    setAssignments(prev => [asg, ...prev]);
  };

  const handleSubmitAssignment = (subm: AssignmentSubmission) => {
    setSubmissions(prev => [subm, ...prev]);
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          score,
          feedback,
          status: 'graded'
        };
      }
      return s;
    }));
  };

  const handleAddEvent = (evt: EventItem) => {
    setEvents(prev => [evt, ...prev]);
  };

  const handleRequestCertificate = (cert: CertificateRequest) => {
    setCertificates(prev => [cert, ...prev]);
  };

  const handleUpdateCertificateStatus = (certId: string, status: 'approved' | 'rejected' | 'in_review', notes?: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status,
          reviewerNotes: notes || c.reviewerNotes,
          issuedDate: status === 'approved' ? new Date().toISOString().split('T')[0] : c.issuedDate
        };
      }
      return c;
    }));
  };

  const handleAddCitation = (cit: ParentCitation) => {
    setCitations(prev => [cit, ...prev]);
  };

  const handleUpdateCitationStatus = (citationId: string, status: ParentCitation['status'], comment?: string) => {
    setCitations(prev => prev.map(c => {
      if (c.id === citationId) {
        return {
          ...c,
          status,
          parentComment: comment || c.parentComment
        };
      }
      return c;
    }));
  };

  const handleSendMessage = (msg: Message) => {
    setMessages(prev => [msg, ...prev]);
  };

  const handleMarkMessageRead = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isRead: true } : m));
  };

  const handleAddUser = (u: User) => {
    setUsers(prev => [...prev, u]);
  };

  const handleUpdateConfig = (cfg: SchoolConfig) => {
    setConfig(cfg);
  };

  const handleAddNotice = (n: Notice) => {
    setNotices(prev => [n, ...prev]);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} config={config} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        user={user}
        allUsers={users}
        config={config}
        activeRole={user.role}
        onSwitchRole={handleSwitchRole}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          userRole={user.role}
        />

        {/* Dynamic View Module Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeModule === 'dashboard' && (
                <DashboardModule
                  user={user}
                  config={config}
                  notices={notices}
                  report={report}
                  assignments={assignments}
                  events={events}
                  certificates={certificates}
                  citations={citations}
                  onSelectModule={setActiveModule}
                />
              )}

              {activeModule === 'academic' && (
                <AcademicModule
                  user={user}
                  report={report}
                  onUpdateReport={handleUpdateReport}
                  schedule={schedule}
                  attendance={attendance}
                  onAddAttendance={handleAddAttendance}
                  observations={observations}
                  onAddObservation={handleAddObservation}
                  assignments={assignments}
                  onAddAssignment={handleAddAssignment}
                  submissions={submissions}
                  onSubmitAssignment={handleSubmitAssignment}
                  onGradeSubmission={handleGradeSubmission}
                  config={config}
                />
              )}

              {activeModule === 'events' && (
                <EventsModule
                  user={user}
                  events={events}
                  onAddEvent={handleAddEvent}
                />
              )}

              {activeModule === 'certificates' && (
                <CertificatesModule
                  user={user}
                  certificates={certificates}
                  onRequestCertificate={handleRequestCertificate}
                  onUpdateCertificateStatus={handleUpdateCertificateStatus}
                  config={config}
                />
              )}

              {activeModule === 'citations' && (
                <CitationsModule
                  user={user}
                  citations={citations}
                  onAddCitation={handleAddCitation}
                  onUpdateCitationStatus={handleUpdateCitationStatus}
                />
              )}

              {activeModule === 'communications' && (
                <CommunicationsModule
                  user={user}
                  allUsers={users}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onMarkRead={handleMarkMessageRead}
                />
              )}

              {activeModule === 'library' && (
                <LibraryModule library={library} />
              )}

              {activeModule === 'calendar' && (
                <CalendarModule events={calendarEvents} />
              )}

              {activeModule === 'gallery' && (
                <GalleryModule albums={gallery} />
              )}

              {activeModule === 'admin' && (
                <AdminModule
                  currentUser={user}
                  users={users}
                  onAddUser={handleAddUser}
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onAddNotice={handleAddNotice}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        config={config}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(mod) => {
          setActiveModule(mod);
          setIsSearchOpen(false);
        }}
        assignments={assignments}
        events={events}
        library={library}
        notices={notices}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notices={notices}
        messages={messages}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setIsNotificationsOpen(false);
        }}
      />
    </div>
  );
}
