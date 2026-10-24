/**
 * Types and Interfaces for Campus Virtual Institucional
 */

export type UserRole = 
  | 'admin' 
  | 'rector' 
  | 'coordinator' 
  | 'teacher' 
  | 'student' 
  | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  documentId: string;
  phone?: string;
  address?: string;
  gradeLevel?: string; // For students e.g. "10°"
  group?: string; // For students e.g. "10°A"
  subjects?: string[]; // For teachers e.g. ["Matemáticas", "Física"]
  parentOfStudentId?: string; // For parents e.g. "student-1"
  studentName?: string; // For parents reference
  active: boolean;
  bio?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'institucional' | 'academico' | 'urgente' | 'deportes' | 'cultural';
  date: string;
  author: string;
  authorRole: string;
  targetRoles: UserRole[];
  pinned: boolean;
  image?: string;
  readBy?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: 'institucional' | 'deportivo' | 'cultural' | 'reunion' | 'cronograma';
  status: 'scheduled' | 'ongoing' | 'completed';
  image: string;
  targetRoles: UserRole[];
  responsibleName: string;
}

export type GradePeriod = 'P1' | 'P2' | 'P3' | 'P4';

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  grades: Record<GradePeriod, number | null>;
  average: number;
  achievements: string;
  comments?: string;
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  gradeLevel: string;
  group: string;
  academicYear: string;
  subjects: SubjectGrade[];
  overallAverage: number;
  conductGrade: string; // e.g. "Excelente", "Bueno"
  teacherComments: string;
  directorName: string;
}

export interface ScheduleItem {
  id: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  timeSlot: string; // e.g. "07:00 - 08:30"
  subjectName: string;
  teacherName: string;
  classroom: string;
  group: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  subjectName: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  notes?: string;
}

export interface StudentObservation {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: 'academic' | 'disciplinary' | 'positive';
  title: string;
  detail: string;
  teacherName: string;
  status: 'open' | 'resolved';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  group: string;
  creationDate: string;
  dueDate: string;
  dueTime: string;
  maxScore: number;
  attachments?: { name: string; url: string; size?: string }[];
  status: 'active' | 'closed';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  content: string;
  fileName?: string;
  fileSize?: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export type DocumentType = 
  | 'estudio' 
  | 'matricula' 
  | 'notas' 
  | 'pazysalvo' 
  | 'conducta';

export interface CertificateRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  studentId: string;
  studentName: string;
  documentType: DocumentType;
  requestDate: string;
  purpose: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  trackingCode: string;
  reviewerNotes?: string;
  generatedDocumentUrl?: string;
  issuedDate?: string;
}

export interface ParentCitation {
  id: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  locationType: 'virtual' | 'presencial';
  locationDetails: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'reschedule_requested' | 'completed' | 'cancelled';
  parentComment?: string;
  meetingNotes?: string;
  attachedDocs?: { name: string; url: string }[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId: string; // 'all' or user.id
  receiverName: string;
  receiverRole?: UserRole;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  category?: 'general' | 'academico' | 'citacion' | 'institucional';
  attachments?: { name: string; url: string }[];
}

export interface LibraryResource {
  id: string;
  title: string;
  category: 'libros' | 'guias' | 'manuales' | 'reglamentos' | 'documentos' | 'recursos';
  author: string;
  subject?: string;
  gradeLevel?: string;
  format: 'pdf' | 'epub' | 'interactive';
  description: string;
  coverImage: string;
  fileUrl: string;
  publicationYear: number;
  downloadsCount: number;
  pages?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  type: 'exam' | 'grades_delivery' | 'meeting' | 'event' | 'holiday' | 'vacation';
  description: string;
  targetGroups?: string[];
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'deportes' | 'cultural' | 'academico' | 'institucional' | 'graduaciones';
  coverImage: string;
  photosCount: number;
  photos: { id: string; url: string; caption: string }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
}

export interface CourseGroup {
  id: string;
  name: string; // e.g. "10°A"
  gradeLevel: string; // "10°"
  directorName: string;
  studentCount: number;
  classroom: string;
  subjects: string[];
}

export interface SchoolConfig {
  institutionName: string;
  slogan: string;
  rectorName: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  currentAcademicYear: string;
  currentPeriod: GradePeriod;
  primaryColor: string;
  logoUrl: string;
}
