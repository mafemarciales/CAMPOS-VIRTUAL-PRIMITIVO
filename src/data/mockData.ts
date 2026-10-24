import { 
  User, Notice, EventItem, StudentReport, ScheduleItem, 
  AttendanceRecord, StudentObservation, Assignment, AssignmentSubmission, 
  CertificateRequest, ParentCitation, Message, LibraryResource, 
  CalendarEvent, GalleryAlbum, AuditLog, CourseGroup, SchoolConfig 
} from '../types';

export const DEFAULT_SCHOOL_CONFIG: SchoolConfig = {
  institutionName: "IE Primitivo Leal La Doctora",
  slogan: "Formamos seres humanos en el respeto a la diferencia",
  rectorName: "Dra. Elena Rostova",
  nit: "811.025.789-4",
  address: "Calle 75 Sur #33-53, Vereda La Doctora, Sabaneta, Antioquia",
  phone: "(+57) 604 288 1202",
  email: "ieprimitivoleal@gmail.com",
  currentAcademicYear: "2026",
  currentPeriod: "P2",
  primaryColor: "#1E3A8A",
  logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80"
};

export const DEFAULT_USERS: User[] = [
  {
    id: "usr-admin",
    name: "Carlos Mendoza",
    email: "admin@ieprimitivoleal.edu.co",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    documentId: "1018239401",
    phone: "+57 310 456 7890",
    address: "Calle 75 Sur, Sabaneta",
    active: true,
    bio: "Administrador general del Campus Virtual y Jefe de Sistemas Institucionales.",
    createdAt: "2025-01-10"
  },
  {
    id: "usr-rector",
    name: "Dra. Elena Rostova",
    email: "rector@ieprimitivoleal.edu.co",
    role: "rector",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    documentId: "52840192",
    phone: "+57 300 987 6543",
    address: "Sabaneta, Antioquia",
    active: true,
    bio: "Rectora Institucional. Doctora en Educación y Gestión Pedagógica.",
    createdAt: "2024-08-01"
  },
  {
    id: "usr-coordinator",
    name: "Lic. Roberto Gómez",
    email: "coordinador@ieprimitivoleal.edu.co",
    role: "coordinator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    documentId: "79401823",
    phone: "+57 315 222 3344",
    address: "Sabaneta, Antioquia",
    active: true,
    bio: "Coordinador Académico de Educación Secundaria y Media.",
    createdAt: "2024-09-15"
  },
  {
    id: "usr-teacher",
    name: "Prof. María Fernanda Torres",
    email: "docente@ieprimitivoleal.edu.co",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    documentId: "1020493012",
    phone: "+57 318 765 4321",
    address: "Sabaneta, Antioquia",
    subjects: ["Matemáticas", "Física Avanzada"],
    active: true,
    bio: "Docente de Matemáticas y Física. Directora de grupo 10°A.",
    createdAt: "2025-02-01"
  },
  {
    id: "usr-student",
    name: "Mateo Alejandro Silva",
    email: "estudiante@ieprimitivoleal.edu.co",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    documentId: "1098450192",
    gradeLevel: "10°",
    group: "10°A",
    phone: "+57 311 555 0192",
    address: "Vereda La Doctora, Sabaneta",
    active: true,
    bio: "Estudiante de Grado 10°A. Personero en candidatura y representante del club de Robótica.",
    createdAt: "2025-01-20"
  },
  {
    id: "usr-parent",
    name: "Javier Silva Rodríguez",
    email: "padre@ieprimitivoleal.edu.co",
    role: "parent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    documentId: "19402910",
    phone: "+57 310 999 8877",
    address: "Vereda La Doctora, Sabaneta",
    parentOfStudentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    active: true,
    bio: "Acudiente principal de Mateo Silva (10°A). Ingeniero Civil.",
    createdAt: "2025-01-20"
  }
];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: "not-1",
    title: "Inicio del Segundo Periodo Académico y Evaluaciones Diagnósticas",
    content: "Damos una calurosa bienvenida a toda la comunidad educativa al inicio del 2° Periodo. Durante esta primera semana se realizarán los talleres de refuerzo y pruebas diagnósticas.",
    category: "institucional",
    date: "2026-08-01",
    author: "Dra. Elena Rostova",
    authorRole: "Rectoría",
    targetRoles: ["admin", "rector", "coordinator", "teacher", "student", "parent"],
    pinned: true,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "not-2",
    title: "Primera Entrega de Boletines de Calificaciones (P1)",
    content: "Se cita a los padres de familia y acudientes a la asamblea presencial para la entrega oficial de los boletines del Primer Periodo este próximo viernes a las 7:00 AM.",
    category: "academico",
    date: "2026-08-03",
    author: "Lic. Roberto Gómez",
    authorRole: "Coordinación Académica",
    targetRoles: ["parent", "teacher", "coordinator", "rector"],
    pinned: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "not-3",
    title: "Inauguración de los Juegos Intercolegiados 2026",
    content: "Este mes inician nuestros torneos internos de fútbol, baloncesto y voleibol. Invitamos a los estudiantes a inscribirse con sus directores de grupo.",
    category: "deportes",
    date: "2026-08-04",
    author: "Departamento de Educación Física",
    authorRole: "Docente",
    targetRoles: ["student", "teacher", "parent"],
    pinned: false,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"
  }
];

export const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "Feria de Ciencia e Innovación Tecnológica 2026",
    description: "Exposición de proyectos de robótica, programación e investigación desarrollados por los estudiantes de secundaria.",
    date: "2026-08-15",
    time: "08:00 AM - 02:00 PM",
    location: "Auditorio Principal & Coliseo",
    organizer: "Área de Ciencias y Tecnología",
    category: "cultural",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    targetRoles: ["student", "parent", "teacher", "coordinator", "rector", "admin"],
    responsibleName: "Prof. María Fernanda Torres"
  },
  {
    id: "evt-2",
    title: "Reunión de Consejo de Padres de Familia",
    description: "Sesión ordinaria para la aprobación de proyectos de infraestructura y comité de convivencia escolar.",
    date: "2026-08-20",
    time: "05:30 PM - 07:00 PM",
    location: "Sala de Conferencias B / Enlace Teams",
    organizer: "Rectoría",
    category: "reunion",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
    targetRoles: ["parent", "rector", "coordinator"],
    responsibleName: "Dra. Elena Rostova"
  },
  {
    id: "evt-3",
    title: "Olimpiadas Institucionales de Matemáticas",
    description: "Prueba eliminatoria presencial para seleccionar a la delegación que representará al colegio en las Nacionales.",
    date: "2026-08-28",
    time: "09:00 AM - 11:30 AM",
    location: "Aulas Bloque C",
    organizer: "Departamento de Matemáticas",
    category: "cronograma",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    targetRoles: ["student", "teacher"],
    responsibleName: "Prof. María Fernanda Torres"
  }
];

export const DEFAULT_STUDENT_REPORT: StudentReport = {
  studentId: "usr-student",
  studentName: "Mateo Alejandro Silva",
  gradeLevel: "10°",
  group: "10°A",
  academicYear: "2026",
  overallAverage: 4.6,
  conductGrade: "Excelente",
  teacherComments: "Mateo demuestra un compromiso sobresaliente con el aprendizaje. Destacado liderazgo en proyectos de física y robótica.",
  directorName: "Prof. María Fernanda Torres",
  subjects: [
    {
      subjectId: "sub-1",
      subjectName: "Matemáticas Superior",
      teacherName: "Prof. María Fernanda Torres",
      grades: { P1: 4.8, P2: 4.5, P3: null, P4: null },
      average: 4.65,
      achievements: "Resuelve ecuaciones complejas y aplicaciones trigonométricas con rigurosidad matemática.",
      comments: "Participación activa en clase."
    },
    {
      subjectId: "sub-2",
      subjectName: "Física Avanzada",
      teacherName: "Prof. María Fernanda Torres",
      grades: { P1: 5.0, P2: 4.7, P3: null, P4: null },
      average: 4.85,
      achievements: "Comprende y aplica las leyes de la mecánica clásica en experimentos de laboratorio.",
      comments: "Excelente desempeño práctico."
    },
    {
      subjectId: "sub-3",
      subjectName: "Lengua Castellana y Literatura",
      teacherName: "Lic. Gabriel García",
      grades: { P1: 4.2, P2: 4.4, P3: null, P4: null },
      average: 4.3,
      achievements: "Analiza obras hispanoamericanas con sentido crítico y buena redacción.",
      comments: "Buen avance en producción escrita."
    },
    {
      subjectId: "sub-4",
      subjectName: "Inglés B2 Advanced",
      teacherName: "Prof. Sarah Jenkins",
      grades: { P1: 4.6, P2: 4.8, P3: null, P4: null },
      average: 4.7,
      achievements: "Demuestra fluidez oral y excelente comprensión auditiva en debates académicos.",
      comments: "Nivel equivalente a B2+."
    },
    {
      subjectId: "sub-5",
      subjectName: "Historia y Ciencias Sociales",
      teacherName: "Dr. Alejandro Restrepo",
      grades: { P1: 4.3, P2: 4.2, P3: null, P4: null },
      average: 4.25,
      achievements: "Identifica procesos históricos contemporáneos y genera ensayos fundamentados.",
      comments: "Cumplido con las lecturas."
    },
    {
      subjectId: "sub-6",
      subjectName: "Química Orgánica",
      teacherName: "Dra. Lucía Fernández",
      grades: { P1: 4.5, P2: 4.6, P3: null, P4: null },
      average: 4.55,
      achievements: "Identifica estructuras moleculares e hidrocarburos mediante prácticas de laboratorio.",
      comments: "Buen trabajo colaborativo."
    }
  ]
};

export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: "sch-1", day: "Lunes", timeSlot: "07:00 - 08:30", subjectName: "Matemáticas Superior", teacherName: "Prof. María Fernanda Torres", classroom: "Aula 201", group: "10°A" },
  { id: "sch-2", day: "Lunes", timeSlot: "08:30 - 10:00", subjectName: "Física Avanzada", teacherName: "Prof. María Fernanda Torres", classroom: "Lab Física 1", group: "10°A" },
  { id: "sch-3", day: "Lunes", timeSlot: "10:30 - 12:00", subjectName: "Lengua Castellana", teacherName: "Lic. Gabriel García", classroom: "Aula 201", group: "10°A" },
  
  { id: "sch-4", day: "Martes", timeSlot: "07:00 - 08:30", subjectName: "Inglés B2 Advanced", teacherName: "Prof. Sarah Jenkins", classroom: "Lab Idiomas", group: "10°A" },
  { id: "sch-5", day: "Martes", timeSlot: "08:30 - 10:00", subjectName: "Química Orgánica", teacherName: "Dra. Lucía Fernández", classroom: "Lab Química", group: "10°A" },
  { id: "sch-6", day: "Martes", timeSlot: "10:30 - 12:00", subjectName: "Historia y Sociales", teacherName: "Dr. Alejandro Restrepo", classroom: "Aula 201", group: "10°A" },

  { id: "sch-7", day: "Miércoles", timeSlot: "07:00 - 08:30", subjectName: "Matemáticas Superior", teacherName: "Prof. María Fernanda Torres", classroom: "Aula 201", group: "10°A" },
  { id: "sch-8", day: "Miércoles", timeSlot: "08:30 - 10:00", subjectName: "Programación & Robótica", teacherName: "Ing. David Castro", classroom: "Lab Sistemas 2", group: "10°A" },
  { id: "sch-9", day: "Miércoles", timeSlot: "10:30 - 12:00", subjectName: "Educación Física", teacherName: "Prof. Carlos Ruiz", classroom: "Cancha Múltiple", group: "10°A" },

  { id: "sch-10", day: "Jueves", timeSlot: "07:00 - 08:30", subjectName: "Física Avanzada", teacherName: "Prof. María Fernanda Torres", classroom: "Lab Física 1", group: "10°A" },
  { id: "sch-11", day: "Jueves", timeSlot: "08:30 - 10:00", subjectName: "Inglés B2 Advanced", teacherName: "Prof. Sarah Jenkins", classroom: "Aula 201", group: "10°A" },
  { id: "sch-12", day: "Jueves", timeSlot: "10:30 - 12:00", subjectName: "Filosofía", teacherName: "Lic. Gabriel García", classroom: "Aula 201", group: "10°A" },

  { id: "sch-13", day: "Viernes", timeSlot: "07:00 - 08:30", subjectName: "Química Orgánica", teacherName: "Dra. Lucía Fernández", classroom: "Lab Química", group: "10°A" },
  { id: "sch-14", day: "Viernes", timeSlot: "08:30 - 10:00", subjectName: "Artes y Expresión", teacherName: "Maestra Andrea Paz", classroom: "Taller Artes", group: "10°A" },
  { id: "sch-15", day: "Viernes", timeSlot: "10:30 - 12:00", subjectName: "Dirección de Grupo", teacherName: "Prof. María Fernanda Torres", classroom: "Aula 201", group: "10°A" }
];

export const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-1", studentId: "usr-student", studentName: "Mateo Alejandro Silva", date: "2026-08-01", subjectName: "Matemáticas Superior", status: "present" },
  { id: "att-2", studentId: "usr-student", studentName: "Mateo Alejandro Silva", date: "2026-08-02", subjectName: "Física Avanzada", status: "present" },
  { id: "att-3", studentId: "usr-student", studentName: "Mateo Alejandro Silva", date: "2026-08-03", subjectName: "Química Orgánica", status: "tardy", notes: "Llegada 10 minutos tarde con justificación del acudiente" },
  { id: "att-4", studentId: "usr-student", studentName: "Mateo Alejandro Silva", date: "2026-08-04", subjectName: "Inglés B2 Advanced", status: "present" },
  { id: "att-5", studentId: "usr-student", studentName: "Mateo Alejandro Silva", date: "2026-08-05", subjectName: "Programación & Robótica", status: "present" }
];

export const DEFAULT_OBSERVATIONS: StudentObservation[] = [
  {
    id: "obs-1",
    studentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    date: "2026-07-28",
    type: "positive",
    title: "Reconocimiento por Liderazgo en Feria de Ciencias",
    detail: "El estudiante demostró alto grado de responsabilidad y compañerismo coordinando el equipo de robótica.",
    teacherName: "Prof. María Fernanda Torres",
    status: "resolved"
  },
  {
    id: "obs-2",
    studentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    date: "2026-08-03",
    type: "academic",
    title: "Aviso de entrega pendiente en Guía de Química",
    detail: "Se hace la recomendación de revisar la entrega complementaria del informe de laboratorio 3.",
    teacherName: "Dra. Lucía Fernández",
    status: "open"
  }
];

export const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    title: "Taller de Cálculo Diferencial e Integrales",
    description: "Resolver los ejercicios 1 a 15 de la guía adjunta. Incluir procedimiento detallado, gráficas y justificación matemática.",
    subjectName: "Matemáticas Superior",
    teacherId: "usr-teacher",
    teacherName: "Prof. María Fernanda Torres",
    group: "10°A",
    creationDate: "2026-08-01",
    dueDate: "2026-08-08",
    dueTime: "11:59 PM",
    maxScore: 5.0,
    attachments: [
      { name: "Guia_Calculo_Diferencial_10A.pdf", url: "#", size: "2.4 MB" }
    ],
    status: "active"
  },
  {
    id: "asg-2",
    title: "Informe de Laboratorio: Movimiento Parabólico",
    description: "Redactar informe según la plantilla IEEE con datos experimentales recolectados en el simulador digital de física.",
    subjectName: "Física Avanzada",
    teacherId: "usr-teacher",
    teacherName: "Prof. María Fernanda Torres",
    group: "10°A",
    creationDate: "2026-08-02",
    dueDate: "2026-08-10",
    dueTime: "06:00 PM",
    maxScore: 5.0,
    attachments: [
      { name: "Plantilla_Informe_Fisica.docx", url: "#", size: "850 KB" }
    ],
    status: "active"
  },
  {
    id: "asg-3",
    title: "Ensayo sobre 'Cien Años de Soledad' y el Realismo Mágico",
    description: "Ensayo argumentativo de 1200 palabras analizando el simbolismo del tiempo en la obra.",
    subjectName: "Lengua Castellana",
    teacherId: "usr-teacher-2",
    teacherName: "Lic. Gabriel García",
    group: "10°A",
    creationDate: "2026-07-25",
    dueDate: "2026-08-03",
    dueTime: "11:59 PM",
    maxScore: 5.0,
    status: "active"
  }
];

export const DEFAULT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "subm-1",
    assignmentId: "asg-3",
    assignmentTitle: "Ensayo sobre 'Cien Años de Soledad' y el Realismo Mágico",
    studentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    submissionDate: "2026-08-02 04:15 PM",
    content: "Adjunto el ensayo final corregido en formato PDF. Incluye referencias bibliográficas y citas de autor.",
    fileName: "Ensayo_MateoSilva_10A.pdf",
    fileSize: "1.2 MB",
    score: 4.8,
    feedback: "Excelente análisis crítico de las metáforas de Macondo. Muy buena estructura ensayística.",
    status: "graded"
  }
];

export const DEFAULT_CERTIFICATES: CertificateRequest[] = [
  {
    id: "cert-101",
    requesterId: "usr-student",
    requesterName: "Mateo Alejandro Silva",
    requesterRole: "student",
    studentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    documentType: "estudio",
    requestDate: "2026-08-02",
    purpose: "Trámite de visa de intercambio estudiantil a Canadá",
    status: "approved",
    trackingCode: "CERT-2026-8841",
    reviewerNotes: "Certificado generado y firmado digitalmente por Secretaría General.",
    issuedDate: "2026-08-03",
    generatedDocumentUrl: "certified"
  },
  {
    id: "cert-102",
    requesterId: "usr-parent",
    requesterName: "Javier Silva Rodríguez",
    requesterRole: "parent",
    studentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    documentType: "notas",
    requestDate: "2026-08-04",
    purpose: "Solicitud de beca de honor en entidad bancaria",
    status: "in_review",
    trackingCode: "CERT-2026-9012",
    reviewerNotes: "En verificación de promedios académicos del periodo P1."
  }
];

export const DEFAULT_CITATIONS: ParentCitation[] = [
  {
    id: "cit-1",
    teacherId: "usr-teacher",
    teacherName: "Prof. María Fernanda Torres",
    parentId: "usr-parent",
    parentName: "Javier Silva Rodríguez",
    studentId: "usr-student",
    studentName: "Mateo Alejandro Silva",
    date: "2026-08-12",
    time: "10:30 AM",
    locationType: "virtual",
    locationDetails: "Enlace Teams / Meet: https://meet.google.com/citacion-ieprimitivoleal",
    reason: "Coordinación para la participación de Mateo en las Olimpiadas Nacionales de Física y propuesta de horario especial de repasos.",
    status: "confirmed",
    parentComment: "Confirmado. Estaré presente puntualmente a través de la videollamada.",
    attachedDocs: [
      { name: "Cronograma_Olimpiadas_2026.pdf", url: "#" }
    ]
  }
];

export const DEFAULT_MESSAGES: Message[] = [
  {
    id: "msg-1",
    senderId: "usr-teacher",
    senderName: "Prof. María Fernanda Torres",
    senderRole: "teacher",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    receiverId: "usr-student",
    receiverName: "Mateo Alejandro Silva",
    receiverRole: "student",
    subject: "Material complementario de Física Avanzada",
    body: "Hola Mateo, te comparto los enlaces con los simuladores interactivos de vectores para preparar el laboratorio de esta semana. ¡Muchos éxitos!",
    timestamp: "2026-08-04 02:30 PM",
    isRead: false,
    category: "academico"
  },
  {
    id: "msg-2",
    senderId: "usr-rector",
    senderName: "Dra. Elena Rostova",
    senderRole: "rector",
    senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    receiverId: "all",
    receiverName: "Toda la Comunidad Educativa",
    subject: "Comunicado Oficial: Modificación del Horario de Salida Viernes 14",
    body: "Estimados miembros de la comunidad, con motivo de la jornada institucional de desarrollo docente, el viernes 14 la jornada académica finalizará a las 12:30 PM.",
    timestamp: "2026-08-03 09:00 AM",
    isRead: true,
    category: "institucional"
  }
];

export const DEFAULT_LIBRARY: LibraryResource[] = [
  {
    id: "lib-1",
    title: "Manual de Convivencia y Reglamento Estudiantil 2026",
    category: "manuales",
    author: "Consejo Directivo",
    subject: "Institucional",
    format: "pdf",
    description: "Normativa integral de derechos, deberes, estímulos y protocolos de convivencia escolar institucional.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    fileUrl: "#",
    publicationYear: 2026,
    downloadsCount: 1420,
    pages: 84
  },
  {
    id: "lib-2",
    title: "Física Universitaria con Física Moderna (Volumen 1)",
    category: "libros",
    author: "Sears & Zemansky",
    subject: "Física",
    gradeLevel: "10° - 11°",
    format: "pdf",
    description: "Texto guía de referencia con ejercicios resueltos de cinemática, dinámica, energía y termodinámica.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=80",
    fileUrl: "#",
    publicationYear: 2024,
    downloadsCount: 890,
    pages: 720
  },
  {
    id: "lib-3",
    title: "Guía Pedagógica de Cálculo y Funciones Trigonométricas",
    category: "guias",
    author: "Prof. María Fernanda Torres",
    subject: "Matemáticas",
    gradeLevel: "10°",
    format: "pdf",
    description: "Guía práctica de estudio con 100 problemas resueltos y aplicaciones en ingeniería.",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80",
    fileUrl: "#",
    publicationYear: 2026,
    downloadsCount: 650,
    pages: 45
  },
  {
    id: "lib-4",
    title: "Cien Años de Soledad - Gabriel García Márquez",
    category: "libros",
    author: "Gabriel García Márquez",
    subject: "Literatura",
    gradeLevel: "9° - 11°",
    format: "epub",
    description: "Edición escolar comentada con mapa genealógico de la familia Buendía y notas de análisis literario.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80",
    fileUrl: "#",
    publicationYear: 2022,
    downloadsCount: 2100,
    pages: 480
  }
];

export const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "cal-1", title: "Pruebas Saber 10° Diagnósticas", date: "2026-08-10", type: "exam", description: "Evaluación estandarizada presencial en todas las áreas." },
  { id: "cal-2", title: "Feria de Ciencia e Innovación", date: "2026-08-15", type: "event", description: "Exposición anual en el auditorio." },
  { id: "cal-3", title: "Reunión de Consejo de Padres", date: "2026-08-20", type: "meeting", description: "Sesión informativa presencial/virtual." },
  { id: "cal-4", title: "Día Festivo Institucional - Asunción", date: "2026-08-17", type: "holiday", description: "Sin actividades académicas." },
  { id: "cal-5", title: "Cierre de Corte de Notas Parciales (P2)", date: "2026-08-25", type: "grades_delivery", description: "Fecha límite para registro de evaluaciones parciales por parte de docentes." }
];

export const DEFAULT_GALLERY: GalleryAlbum[] = [
  {
    id: "alb-1",
    title: "Torneo Intercolegiado de Baloncesto y Fútbol 2026",
    description: "Galería de imágenes de la jornada deportiva institucional y premiación de equipos campeones.",
    date: "2026-07-20",
    category: "deportes",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80",
    photosCount: 12,
    photos: [
      { id: "ph-1", url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80", caption: "Partido final masculino Grado 10A vs 11B" },
      { id: "ph-2", url: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=800&auto=format&fit=crop&q=80", caption: "Premiación de trofeos con el departamento de Deportes" },
      { id: "ph-3", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80", caption: "Equipo de voleibol femenino en entrenamiento" }
    ]
  },
  {
    id: "alb-2",
    title: "Festival Artístico y Musical de Primavera",
    description: "Presentaciones de la banda sinfónica, coro institucional y obras teatrales de los estudiantes.",
    date: "2026-06-15",
    category: "cultural",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    photosCount: 8,
    photos: [
      { id: "ph-4", url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80", caption: "Concierto de la Banda Sinfónica Escolar" },
      { id: "ph-5", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80", caption: "Obra de teatro representativa 'Macondo en Luces'" }
    ]
  }
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-08-05 10:14:22",
    userId: "usr-teacher",
    userName: "Prof. María Fernanda Torres",
    role: "teacher",
    action: "UPDATE_GRADES",
    module: "Académico",
    ipAddress: "192.168.1.45",
    details: "Actualización de notas Periodo 2 para el grupo 10°A en Matemáticas Superior"
  },
  {
    id: "log-2",
    timestamp: "2026-08-05 09:30:10",
    userId: "usr-admin",
    userName: "Carlos Mendoza",
    role: "admin",
    action: "CREATE_USER",
    module: "Administrativo",
    ipAddress: "192.168.1.10",
    details: "Creación de usuario de nuevo docente Lic. Andrés Parra"
  },
  {
    id: "log-3",
    timestamp: "2026-08-04 16:45:00",
    userId: "usr-student",
    userName: "Mateo Alejandro Silva",
    role: "student",
    action: "SUBMIT_ASSIGNMENT",
    module: "Académico",
    ipAddress: "186.102.44.12",
    details: "Entrega de actividad 'Ensayo sobre Cien Años de Soledad'"
  }
];

export const DEFAULT_GROUPS: CourseGroup[] = [
  { id: "grp-1", name: "10°A", gradeLevel: "10°", directorName: "Prof. María Fernanda Torres", studentCount: 28, classroom: "Aula 201", subjects: ["Matemáticas", "Física", "Lengua Castellana", "Inglés", "Química"] },
  { id: "grp-2", name: "10°B", gradeLevel: "10°", directorName: "Lic. Gabriel García", studentCount: 26, classroom: "Aula 202", subjects: ["Matemáticas", "Física", "Lengua Castellana", "Inglés", "Química"] },
  { id: "grp-3", name: "11°A", gradeLevel: "11°", directorName: "Dr. Alejandro Restrepo", studentCount: 30, classroom: "Aula 301", subjects: ["Cálculo", "Física", "Filosofía", "Economía", "Biología"] }
];

// Helper functions for Persistence in LocalStorage
const STORAGE_PREFIX = "CAMPUS_VIRTUAL_";

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error(`Error loading key ${key} from storage:`, err);
  }
  return defaultValue;
}

export function saveData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}
