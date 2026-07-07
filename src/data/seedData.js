import { addDays, subDays, addHours, subHours, format } from 'date-fns';

const now = new Date();
const d = (offset, h = 23, m = 59) => {
  const date = addDays(now, offset);
  date.setHours(h, m, 0, 0);
  return date.toISOString();
};
const sd = (offset) => subDays(now, offset).toISOString();

// ─── USERS ────────────────────────────────────────────────────────────────────
export const USERS = [
  {
    id: 'admin-1',
    role: 'admin',
    email: 'admin@unilearn.ac.cr',
    password: 'admin123',
    name: 'María Fernández',
    title: 'Vicerrectoría Académica',
    avatar: null,
    department: 'Rectoría',
  },
  {
    id: 'prof-1',
    role: 'professor',
    email: 'alvaro.cordero@unilearn.ac.cr',
    password: 'prof123',
    name: 'Álvaro Cordero',
    title: 'Ing. Álvaro Cordero Peña',
    degree: 'Magíster en Ingeniería del Software',
    department: 'Ingeniería del Software',
    avatar: null,
    bio: 'Docente universitario con 12 años de experiencia en desarrollo de software y arquitectura de sistemas. Especialista en Java, patrones de diseño y metodologías ágiles.',
    officeHours: 'Lunes y Miércoles, 2:00pm - 4:00pm',
    phone: '+506 8888-1111',
  },
  {
    id: 'prof-2',
    role: 'professor',
    email: 'laura.mora@unilearn.ac.cr',
    password: 'prof123',
    name: 'Laura Mora',
    title: 'Dra. Laura Mora Esquivel',
    degree: 'Doctora en Matemáticas Aplicadas',
    department: 'Ciencias Básicas',
    avatar: null,
    bio: 'Investigadora y docente en el área de matemáticas aplicadas. Autora de dos libros de texto universitario.',
    officeHours: 'Martes y Jueves, 1:00pm - 3:00pm',
    phone: '+506 8888-2222',
  },
  {
    id: 'prof-3',
    role: 'professor',
    email: 'carlos.vega@unilearn.ac.cr',
    password: 'prof123',
    name: 'Carlos Vega',
    title: 'Lic. Carlos Vega Salas',
    degree: 'Licenciado en Administración de Empresas',
    department: 'Negocios',
    avatar: null,
    bio: 'Consultor empresarial y docente. Ha asesorado a más de 30 empresas en Costa Rica en planificación estratégica.',
    officeHours: 'Viernes, 9:00am - 12:00pm',
    phone: '+506 8888-3333',
  },
  {
    id: 'est-1',
    role: 'student',
    email: 'estudiante1@unilearn.ac.cr',
    password: 'est123',
    name: 'Ana Rodríguez',
    career: 'Ingeniería del Software',
    studentId: '2023-0001',
    entryPeriod: '2023-I',
    credits: { earned: 48, required: 120 },
    avatar: null,
    phone: '+506 7777-0001',
  },
  {
    id: 'est-2',
    role: 'student',
    email: 'estudiante2@unilearn.ac.cr',
    password: 'est123',
    name: 'José Méndez',
    career: 'Ingeniería del Software',
    studentId: '2023-0002',
    entryPeriod: '2023-I',
    credits: { earned: 45, required: 120 },
    avatar: null,
    phone: '+506 7777-0002',
  },
  {
    id: 'est-3',
    role: 'student',
    email: 'estudiante3@unilearn.ac.cr',
    password: 'est123',
    name: 'Valeria Castro',
    career: 'Ingeniería del Software',
    studentId: '2023-0003',
    entryPeriod: '2023-I',
    credits: { earned: 51, required: 120 },
    avatar: null,
  },
  {
    id: 'est-4',
    role: 'student',
    email: 'estudiante4@unilearn.ac.cr',
    password: 'est123',
    name: 'Diego Solís',
    career: 'Ingeniería del Software',
    studentId: '2023-0004',
    entryPeriod: '2023-II',
    credits: { earned: 30, required: 120 },
    avatar: null,
  },
  {
    id: 'est-5',
    role: 'student',
    email: 'estudiante5@unilearn.ac.cr',
    password: 'est123',
    name: 'Sofía Jiménez',
    career: 'Ingeniería del Software',
    studentId: '2023-0005',
    entryPeriod: '2023-II',
    credits: { earned: 36, required: 120 },
    avatar: null,
  },
  {
    id: 'est-6',
    role: 'student',
    email: 'estudiante6@unilearn.ac.cr',
    password: 'est123',
    name: 'Mateo Vargas',
    career: 'Ingeniería del Software',
    studentId: '2024-0001',
    entryPeriod: '2024-I',
    credits: { earned: 18, required: 120 },
    avatar: null,
  },
  {
    id: 'est-7',
    role: 'student',
    email: 'estudiante7@unilearn.ac.cr',
    password: 'est123',
    name: 'Isabella Rojas',
    career: 'Administración de Empresas',
    studentId: '2023-0010',
    entryPeriod: '2023-I',
    credits: { earned: 54, required: 120 },
    avatar: null,
  },
  {
    id: 'est-8',
    role: 'student',
    email: 'estudiante8@unilearn.ac.cr',
    password: 'est123',
    name: 'Lucas Pérez',
    career: 'Administración de Empresas',
    studentId: '2023-0011',
    entryPeriod: '2023-II',
    credits: { earned: 42, required: 120 },
    avatar: null,
  },
];

// ─── COURSES ──────────────────────────────────────────────────────────────────
export const COURSES = [
  {
    id: 'course-1',
    code: 'SOFT-04',
    name: 'Programación Orientada a Objetos',
    professorId: 'prof-1',
    career: 'Ingeniería del Software',
    credits: 4,
    color: '#2563EB',
    period: '2025-C3',
    studentIds: ['est-1', 'est-2', 'est-3', 'est-4', 'est-5', 'est-6'],
    description: 'Curso fundamental de programación usando el paradigma orientado a objetos. Cubre clases, herencia, polimorfismo, encapsulamiento, interfaces y patrones de diseño básicos.',
    totalWeeks: 14,
    gradeCategories: [
      { name: 'Tareas', weight: 30 },
      { name: 'Quizzes', weight: 20 },
      { name: 'Proyectos', weight: 30 },
      { name: 'Participación', weight: 10 },
      { name: 'Examen Final', weight: 10 },
    ],
    passingGrade: 70,
  },
  {
    id: 'course-2',
    code: 'MAT-02',
    name: 'Cálculo Diferencial',
    professorId: 'prof-2',
    career: 'Ingeniería del Software',
    credits: 4,
    color: '#7C3AED',
    period: '2025-C3',
    studentIds: ['est-1', 'est-2', 'est-3', 'est-4', 'est-5'],
    description: 'Introducción al cálculo diferencial: límites, continuidad, derivadas y sus aplicaciones. Base matemática indispensable para el análisis computacional.',
    totalWeeks: 14,
    gradeCategories: [
      { name: 'Tareas', weight: 25 },
      { name: 'Quizzes', weight: 25 },
      { name: 'Examen Parcial', weight: 25 },
      { name: 'Examen Final', weight: 25 },
    ],
    passingGrade: 70,
  },
  {
    id: 'course-3',
    code: 'ADM-01',
    name: 'Fundamentos de Administración',
    professorId: 'prof-3',
    career: 'Administración de Empresas',
    credits: 3,
    color: '#10B981',
    period: '2025-C3',
    studentIds: ['est-1', 'est-3', 'est-5', 'est-7', 'est-8', 'est-2', 'est-4'],
    description: 'Principios fundamentales de la administración moderna: planificación, organización, dirección y control. Introducción a la gestión empresarial contemporánea.',
    totalWeeks: 14,
    gradeCategories: [
      { name: 'Tareas', weight: 30 },
      { name: 'Casos de Estudio', weight: 30 },
      { name: 'Participación', weight: 15 },
      { name: 'Examen Final', weight: 25 },
    ],
    passingGrade: 70,
  },
];

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
export const ACTIVITIES = [
  // ── COURSE 1: SOFT-04 ────────────────────────────────────────────────────
  // Week 1
  {
    id: 'act-1-1', courseId: 'course-1', week: 1, order: 1, type: 'material',
    title: 'Introducción a la POO — Conceptos Fundamentales',
    description: 'Presentación de los paradigmas de programación y la filosofía detrás de la Programación Orientada a Objetos.',
    fileUrl: '#', fileName: 'Semana1_Intro_POO.pdf', fileSize: '2.4 MB',
    visible: true, createdAt: sd(42),
  },
  {
    id: 'act-1-2', courseId: 'course-1', week: 1, order: 2, type: 'video',
    title: 'Grabación Semana 1 — Bienvenida y Paradigmas de Programación',
    description: 'Clase grabada de la primera sesión sincrónica. Se cubren los paradigmas imperativo, funcional y orientado a objetos.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '1h 18min', durationSeconds: 4680,
    visible: true, createdAt: sd(41),
  },
  {
    id: 'act-1-3', courseId: 'course-1', week: 1, order: 3, type: 'sync',
    title: 'Sesión Sincrónica — Semana 1',
    platform: 'Google Meet', meetUrl: '#',
    scheduledAt: sd(42),
    duration: 90, status: 'finished',
    visible: true,
  },
  // Week 2
  {
    id: 'act-2-1', courseId: 'course-1', week: 2, order: 1, type: 'material',
    title: 'Clases y Objetos en Java — Guía Práctica',
    description: 'Material teórico y ejemplos de código sobre la definición de clases, instanciación de objetos, constructores y métodos.',
    fileUrl: '#', fileName: 'Semana2_Clases_Objetos.pdf', fileSize: '3.1 MB',
    visible: true, createdAt: sd(35),
  },
  {
    id: 'act-2-2', courseId: 'course-1', week: 2, order: 2, type: 'video',
    title: 'Grabación Semana 2 — Clases, Objetos y Constructores',
    description: 'Demostración en vivo de la creación de clases Java con atributos, constructores sobrecargados y métodos de acceso.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '1h 25min', durationSeconds: 5100,
    visible: true, createdAt: sd(34),
  },
  {
    id: 'act-2-3', courseId: 'course-1', week: 2, order: 3, type: 'task',
    title: 'Tarea 1 — Modelado Básico de Clases',
    description: 'Diseña e implementa un sistema de clases para modelar una biblioteca universitaria.',
    instructions: `## Descripción del Problema

Diseña e implementa en Java un sistema de clases que modele una **biblioteca universitaria**. El sistema debe permitir gestionar libros, autores, usuarios y préstamos.

## Requisitos Técnicos

**Clases obligatorias:**
- \`Libro\` — con atributos: ISBN, título, año, disponible
- \`Autor\` — con atributos: nombre, nacionalidad, años de experiencia
- \`Usuario\` — con atributos: ID, nombre, carrera, libros prestados (máximo 3)
- \`Prestamo\` — con atributos: libro, usuario, fecha de préstamo, fecha de devolución esperada

**Requisitos de implementación:**
1. Cada clase debe tener constructores parametrizados
2. Implementar getters y setters para todos los atributos
3. Sobrescribir el método \`toString()\` en cada clase
4. La clase \`Usuario\` debe validar que no exceda 3 préstamos simultáneos
5. Incluir un método \`estaDisponible()\` en \`Libro\`

## Entregables
- Archivo ZIP con el proyecto Java (estructura Maven o Gradle)
- Diagrama de clases UML (puede ser imagen del draw.io)
- Breve informe (1-2 páginas) justificando las decisiones de diseño

## Criterios de Evaluación
Ver rúbrica adjunta.`,
    rubric: [
      { criterion: 'Definición correcta de clases', levels: [
        { label: 'Excelente', points: 25, desc: 'Todas las clases correctamente definidas con atributos y tipos apropiados' },
        { label: 'Bueno', points: 18, desc: 'La mayoría de clases correctas, algún atributo faltante o incorrecto' },
        { label: 'Regular', points: 12, desc: 'Clases incompletas o con errores significativos' },
        { label: 'Deficiente', points: 5, desc: 'No implementa las clases solicitadas o no compila' },
      ]},
      { criterion: 'Constructores y encapsulamiento', levels: [
        { label: 'Excelente', points: 25, desc: 'Constructores completos, getters/setters bien implementados, validaciones incluidas' },
        { label: 'Bueno', points: 18, desc: 'Constructores presentes, getters/setters básicos sin validaciones' },
        { label: 'Regular', points: 12, desc: 'Faltan constructores o getters/setters' },
        { label: 'Deficiente', points: 5, desc: 'No hay encapsulamiento, atributos todos públicos' },
      ]},
      { criterion: 'Calidad del UML', levels: [
        { label: 'Excelente', points: 25, desc: 'Diagrama completo con relaciones, multiplicidades y notación correcta' },
        { label: 'Bueno', points: 18, desc: 'Diagrama presenta las clases pero con notación incompleta' },
        { label: 'Regular', points: 12, desc: 'Diagrama básico sin relaciones o multiplicidades' },
        { label: 'Deficiente', points: 5, desc: 'Sin diagrama o irreconocible' },
      ]},
      { criterion: 'Informe y documentación', levels: [
        { label: 'Excelente', points: 25, desc: 'Informe claro, justifica decisiones de diseño con criterio técnico' },
        { label: 'Bueno', points: 18, desc: 'Informe presente pero superficial' },
        { label: 'Regular', points: 12, desc: 'Informe muy breve o sin justificaciones' },
        { label: 'Deficiente', points: 5, desc: 'Sin informe' },
      ]},
    ],
    openAt: sd(35),
    dueAt: sd(7),
    allowLate: true,
    latePenalty: 10,
    points: 100,
    category: 'Tareas',
    visible: true, createdAt: sd(35),
  },
  // Week 3
  {
    id: 'act-3-1', courseId: 'course-1', week: 3, order: 1, type: 'material',
    title: 'Herencia y Polimorfismo — Teoría y Práctica',
    description: 'Conceptos de herencia simple, jerarquías de clases, polimorfismo estático y dinámico, y el principio de sustitución de Liskov.',
    fileUrl: '#', fileName: 'Semana3_Herencia_Polimorfismo.pdf', fileSize: '4.2 MB',
    visible: true, createdAt: sd(28),
  },
  {
    id: 'act-3-2', courseId: 'course-1', week: 3, order: 2, type: 'video',
    title: 'Grabación Semana 3 — Herencia y Polimorfismo',
    description: 'Demostración práctica de herencia en Java, uso de super(), override y polimorfismo con ejemplos del mundo real.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '1h 32min', durationSeconds: 5520,
    visible: true, createdAt: sd(27),
  },
  {
    id: 'act-3-3', courseId: 'course-1', week: 3, order: 3, type: 'quiz',
    title: 'Quiz 1 — Conceptos Fundamentales de POO',
    instructions: 'Este quiz evalúa tu comprensión de los conceptos básicos de Programación Orientada a Objetos. Tienes 30 minutos para completarlo. No se permite usar notas.',
    timeLimit: 30,
    attempts: 2,
    showResultImmediately: true,
    openAt: sd(21),
    closeAt: sd(14),
    points: 100,
    category: 'Quizzes',
    questions: [
      {
        id: 'q1', type: 'multiple',
        text: '¿Cuál de los siguientes conceptos describe mejor el "encapsulamiento" en POO?',
        options: [
          { id: 'a', text: 'La capacidad de una clase de heredar de otra' },
          { id: 'b', text: 'Ocultar los detalles internos de implementación y exponer solo una interfaz pública' },
          { id: 'c', text: 'La capacidad de un objeto de tomar múltiples formas' },
          { id: 'd', text: 'Crear múltiples instancias de una misma clase' },
        ],
        correct: 'b', points: 20,
      },
      {
        id: 'q2', type: 'truefalse',
        text: 'En Java, una clase puede heredar de múltiples clases simultáneamente usando la palabra clave "extends".',
        correct: false, points: 20,
      },
      {
        id: 'q3', type: 'multiple',
        text: '¿Qué anotación se usa en Java para indicar que un método sobrescribe el de la clase padre?',
        options: [
          { id: 'a', text: '@Override' },
          { id: 'b', text: '@Extends' },
          { id: 'c', text: '@Inherit' },
          { id: 'd', text: '@Super' },
        ],
        correct: 'a', points: 20,
      },
      {
        id: 'q4', type: 'multiple',
        text: 'Si la clase Perro extiende Animal, y Animal tiene un método hablar(), ¿qué tipo de polimorfismo ocurre cuando se llama perro.hablar()?',
        options: [
          { id: 'a', text: 'Polimorfismo estático' },
          { id: 'b', text: 'Polimorfismo dinámico (en tiempo de ejecución)' },
          { id: 'c', text: 'Polimorfismo paramétrico' },
          { id: 'd', text: 'No es polimorfismo' },
        ],
        correct: 'b', points: 20,
      },
      {
        id: 'q5', type: 'truefalse',
        text: 'El constructor de la clase padre siempre se llama automáticamente antes del constructor hijo en Java.',
        correct: true, points: 20,
      },
    ],
    visible: true, createdAt: sd(28),
  },
  // Week 4
  {
    id: 'act-4-1', courseId: 'course-1', week: 4, order: 1, type: 'material',
    title: 'Interfaces y Clases Abstractas',
    description: 'Cuándo usar interfaces vs clases abstractas, contratos de comportamiento, implementación de múltiples interfaces y principios SOLID.',
    fileUrl: '#', fileName: 'Semana4_Interfaces_Abstractas.pdf', fileSize: '3.8 MB',
    visible: true, createdAt: sd(21),
  },
  {
    id: 'act-4-2', courseId: 'course-1', week: 4, order: 2, type: 'video',
    title: 'Grabación Semana 4 — Interfaces y Clases Abstractas',
    description: 'Diferencias prácticas entre interfaces y clases abstractas. Ejercicios con el patrón Strategy usando interfaces.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '1h 44min', durationSeconds: 6240,
    visible: true, createdAt: sd(20),
  },
  {
    id: 'act-4-3', courseId: 'course-1', week: 4, order: 3, type: 'task',
    title: 'Tarea 2 — Sistema con Herencia e Interfaces',
    description: 'Extiende el sistema de biblioteca creando una jerarquía de herencia y aplicando interfaces.',
    instructions: `## Objetivo
Extender el sistema de biblioteca de la Tarea 1 aplicando herencia, clases abstractas e interfaces.

## Requisitos

### Jerarquía de Herencia
Crea una jerarquía para los tipos de material de la biblioteca:
- Clase abstracta \`MaterialBiblioteca\` (base)
- \`Libro extends MaterialBiblioteca\`
- \`Revista extends MaterialBiblioteca\`
- \`TesisDoctoral extends MaterialBiblioteca\`

### Interfaces a implementar
- \`Prestable\` — métodos: \`prestar(usuario)\`, \`devolver()\`, \`estaDisponible()\`
- \`Digitalizable\` — métodos: \`obtenerVersionDigital()\`, \`tieneAccesoDigital()\`

### Polimorfismo
- Crea un método que reciba una lista de \`MaterialBiblioteca\` y aplique polimorfismo para imprimir la info de cada uno.

## Entregables
- Código Java funcional
- Diagrama UML actualizado
- Demostración de polimorfismo en el Main`,
    rubric: [
      { criterion: 'Jerarquía de herencia correcta', levels: [
        { label: 'Excelente', points: 30, desc: 'Jerarquía bien estructurada, uso correcto de abstract y extends' },
        { label: 'Bueno', points: 22, desc: 'Jerarquía presente con errores menores' },
        { label: 'Regular', points: 14, desc: 'Intento de jerarquía con errores significativos' },
        { label: 'Deficiente', points: 5, desc: 'Sin jerarquía de herencia' },
      ]},
      { criterion: 'Implementación de interfaces', levels: [
        { label: 'Excelente', points: 30, desc: 'Ambas interfaces implementadas correctamente en las clases apropiadas' },
        { label: 'Bueno', points: 22, desc: 'Una interface bien implementada, la otra parcial' },
        { label: 'Regular', points: 14, desc: 'Interfaces definidas pero no bien implementadas' },
        { label: 'Deficiente', points: 5, desc: 'Sin interfaces' },
      ]},
      { criterion: 'Demostración de polimorfismo', levels: [
        { label: 'Excelente', points: 25, desc: 'Polimorfismo demostrado claramente con lista de tipos base' },
        { label: 'Bueno', points: 18, desc: 'Polimorfismo presente pero limitado' },
        { label: 'Regular', points: 10, desc: 'Intento de polimorfismo sin éxito real' },
        { label: 'Deficiente', points: 3, desc: 'Sin polimorfismo' },
      ]},
      { criterion: 'Calidad del código', levels: [
        { label: 'Excelente', points: 15, desc: 'Código limpio, bien nombrado, sin código muerto' },
        { label: 'Bueno', points: 10, desc: 'Código funcional con algunas malas prácticas' },
        { label: 'Regular', points: 6, desc: 'Código funcional pero de baja calidad' },
        { label: 'Deficiente', points: 2, desc: 'No compila o muy pobre calidad' },
      ]},
    ],
    openAt: sd(21),
    dueAt: sd(2),
    allowLate: false,
    points: 100,
    category: 'Tareas',
    visible: true, createdAt: sd(21),
  },
  // Week 5
  {
    id: 'act-5-1', courseId: 'course-1', week: 5, order: 1, type: 'material',
    title: 'Colecciones y Genéricos en Java',
    description: 'Uso del Java Collections Framework: List, Set, Map, Queue. Tipos genéricos para colecciones type-safe.',
    fileUrl: '#', fileName: 'Semana5_Colecciones_Genericos.pdf', fileSize: '5.1 MB',
    visible: true, createdAt: sd(14),
  },
  {
    id: 'act-5-2', courseId: 'course-1', week: 5, order: 2, type: 'video',
    title: 'Grabación Semana 5 — Colecciones y Genéricos',
    description: 'Uso práctico de ArrayList, HashMap y HashSet. Iteradores, streams básicos y genéricos.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '1h 51min', durationSeconds: 6660,
    visible: true, createdAt: sd(13),
  },
  {
    id: 'act-5-3', courseId: 'course-1', week: 5, order: 3, type: 'task',
    title: 'Tarea 3 — Colecciones en el Sistema de Biblioteca',
    description: 'Refactoriza el sistema usando colecciones genéricas y añade funcionalidades de búsqueda y filtrado.',
    instructions: `## Objetivo
Incorporar el Java Collections Framework al sistema de biblioteca para gestionar colecciones de materiales, usuarios y préstamos de forma eficiente.

## Requisitos

### Gestión con Colecciones
- \`Catalogo\` — clase que usa \`ArrayList<MaterialBiblioteca>\` para gestionar todos los materiales
- \`GestorUsuarios\` — usa \`HashMap<String, Usuario>\` para búsqueda por ID en O(1)
- \`RegistroPrestamos\` — usa \`LinkedList<Prestamo>\` para gestionar la cola de devoluciones

### Funcionalidades de búsqueda
- Buscar material por ISBN, título (búsqueda parcial) o autor
- Filtrar materiales disponibles
- Ordenar por título o año usando Comparator

### Uso de Genéricos
- Crea un método genérico \`<T extends MaterialBiblioteca> List<T> filtrarPorTipo(Class<T> tipo)\`

## Entregables
- Código Java con las clases de gestión
- Demostración de búsquedas en el Main
- Análisis breve de complejidad de tus estructuras de datos`,
    rubric: [
      { criterion: 'Uso correcto de colecciones', levels: [
        { label: 'Excelente', points: 35, desc: 'Colecciones bien elegidas según el caso de uso, correctamente inicializadas y usadas' },
        { label: 'Bueno', points: 26, desc: 'Colecciones presentes pero no siempre la opción más adecuada' },
        { label: 'Regular', points: 16, desc: 'Uso básico de colecciones con errores' },
        { label: 'Deficiente', points: 5, desc: 'No usa colecciones del framework' },
      ]},
      { criterion: 'Funcionalidades de búsqueda y filtrado', levels: [
        { label: 'Excelente', points: 35, desc: 'Todas las búsquedas implementadas y funcionando correctamente' },
        { label: 'Bueno', points: 26, desc: 'Búsquedas básicas funcionan, faltan algunas' },
        { label: 'Regular', points: 16, desc: 'Búsqueda simple sin filtros' },
        { label: 'Deficiente', points: 5, desc: 'Sin funcionalidades de búsqueda' },
      ]},
      { criterion: 'Método genérico', levels: [
        { label: 'Excelente', points: 20, desc: 'Genérico bien implementado con bounded type parameter' },
        { label: 'Bueno', points: 14, desc: 'Genérico implementado con errores menores' },
        { label: 'Regular', points: 8, desc: 'Intento de genérico sin éxito' },
        { label: 'Deficiente', points: 2, desc: 'Sin método genérico' },
      ]},
      { criterion: 'Análisis de complejidad', levels: [
        { label: 'Excelente', points: 10, desc: 'Análisis correcto con justificación de las elecciones' },
        { label: 'Bueno', points: 7, desc: 'Análisis presente pero superficial' },
        { label: 'Regular', points: 4, desc: 'Mención de complejidad sin análisis real' },
        { label: 'Deficiente', points: 1, desc: 'Sin análisis' },
      ]},
    ],
    openAt: sd(14),
    dueAt: d(5),
    allowLate: true,
    latePenalty: 15,
    points: 100,
    category: 'Tareas',
    visible: true, createdAt: sd(14),
  },
  // Week 6
  {
    id: 'act-6-1', courseId: 'course-1', week: 6, order: 1, type: 'material',
    title: 'Patrones de Diseño — Introducción y Patrones Creacionales',
    description: 'Introducción a los patrones de diseño GoF. Patrones creacionales: Singleton, Factory Method, Abstract Factory y Builder.',
    fileUrl: '#', fileName: 'Semana6_Patrones_Disenho.pdf', fileSize: '6.3 MB',
    visible: true, createdAt: sd(7),
  },
  {
    id: 'act-6-2', courseId: 'course-1', week: 6, order: 2, type: 'video',
    title: 'Grabación Semana 6 — Patrones Creacionales',
    description: 'Implementación paso a paso de Singleton thread-safe, Factory Method y Builder con casos de uso reales.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '2h 03min', durationSeconds: 7380,
    visible: true, createdAt: sd(6),
  },
  {
    id: 'act-6-3', courseId: 'course-1', week: 6, order: 3, type: 'forum',
    title: 'Foro Semana 6 — Casos de uso de Patrones de Diseño',
    description: 'Comparte un ejemplo real (de una app que uses o conozcas) donde identifies un patrón de diseño. Explica cuál es, cómo se implementa y por qué fue una buena decisión de diseño.',
    isGraded: true,
    points: 10,
    category: 'Participación',
    requiresParticipationToView: false,
    visible: true, createdAt: sd(7),
  },
  // Weeks 7-14 (structure only)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `act-${7 + i}-placeholder`,
    courseId: 'course-1',
    week: 7 + i,
    order: 1,
    type: 'material',
    title: `Semana ${7 + i} — Contenido pendiente de publicación`,
    description: 'El profesor publicará el material de esta semana próximamente.',
    fileUrl: null,
    visible: false,
    createdAt: sd(0),
  })),

  // ── COURSE 2: MAT-02 ─────────────────────────────────────────────────────
  {
    id: 'mat-1-1', courseId: 'course-2', week: 1, order: 1, type: 'material',
    title: 'Límites y Continuidad — Fundamentos',
    description: 'Definición formal de límite, técnicas de evaluación, límites laterales y continuidad de funciones.',
    fileUrl: '#', fileName: 'Semana1_Limites.pdf', fileSize: '3.2 MB',
    visible: true, createdAt: sd(42),
  },
  {
    id: 'mat-1-2', courseId: 'course-2', week: 1, order: 2, type: 'task',
    title: 'Tarea 1 — Evaluación de Límites',
    description: 'Ejercicios de evaluación de límites por sustitución, factorización y racionalización.',
    instructions: `## Instrucciones
Resuelve los siguientes 20 ejercicios de límites. Muestra todos los pasos de desarrollo.

Incluye:
- Límites por sustitución directa
- Límites que requieren factorización (indeterminación 0/0)
- Límites al infinito
- Uso del teorema del emparedado en al menos 2 ejercicios`,
    rubric: [
      { criterion: 'Exactitud de resultados', levels: [
        { label: 'Excelente', points: 50, desc: '18-20 ejercicios correctos' },
        { label: 'Bueno', points: 37, desc: '14-17 ejercicios correctos' },
        { label: 'Regular', points: 25, desc: '10-13 ejercicios correctos' },
        { label: 'Deficiente', points: 10, desc: 'Menos de 10 correctos' },
      ]},
      { criterion: 'Procedimiento y desarrollo', levels: [
        { label: 'Excelente', points: 50, desc: 'Todos los pasos claramente mostrados y justificados' },
        { label: 'Bueno', points: 37, desc: 'Mayoría de pasos presentes' },
        { label: 'Regular', points: 25, desc: 'Solo resultados sin procedimiento' },
        { label: 'Deficiente', points: 10, desc: 'Procedimiento incomprensible' },
      ]},
    ],
    openAt: sd(42), dueAt: sd(14), allowLate: false,
    points: 100, category: 'Tareas',
    visible: true, createdAt: sd(42),
  },
  {
    id: 'mat-2-1', courseId: 'course-2', week: 2, order: 1, type: 'task',
    title: 'Tarea 2 — Reglas de Derivación',
    description: 'Aplicación de reglas de derivación: potencia, producto, cociente y cadena.',
    instructions: `## Instrucciones
Deriva las siguientes funciones aplicando las reglas correspondientes. Muestra cuál regla aplicas en cada paso.

Incluye:
- 5 funciones polinomiales (regla de la potencia)
- 5 productos de funciones (regla del producto)
- 5 cocientes (regla del cociente)
- 5 composiciones (regla de la cadena)`,
    rubric: [
      { criterion: 'Aplicación correcta de reglas', levels: [
        { label: 'Excelente', points: 60, desc: 'Reglas aplicadas correctamente en todos los casos' },
        { label: 'Bueno', points: 45, desc: 'Mayoría de reglas correctas' },
        { label: 'Regular', points: 30, desc: 'Algunas reglas correctas' },
        { label: 'Deficiente', points: 10, desc: 'Reglas incorrectas o no identificadas' },
      ]},
      { criterion: 'Procedimiento', levels: [
        { label: 'Excelente', points: 40, desc: 'Pasos claros e identificados' },
        { label: 'Bueno', points: 30, desc: 'Pasos presentes con algunas omisiones' },
        { label: 'Regular', points: 20, desc: 'Pasos incompletos' },
        { label: 'Deficiente', points: 5, desc: 'Sin procedimiento' },
      ]},
    ],
    openAt: sd(35), dueAt: sd(7), allowLate: true, latePenalty: 10,
    points: 100, category: 'Tareas',
    visible: true, createdAt: sd(35),
  },
  {
    id: 'mat-3-1', courseId: 'course-2', week: 3, order: 1, type: 'task',
    title: 'Tarea 3 — Aplicaciones de la Derivada',
    description: 'Optimización, razones de cambio y análisis de funciones usando derivadas.',
    instructions: `## Instrucciones
Resuelve los siguientes problemas de aplicación. Cada problema debe incluir: modelado, derivación, análisis de puntos críticos e interpretación del resultado en contexto.`,
    rubric: [
      { criterion: 'Modelado del problema', levels: [
        { label: 'Excelente', points: 30, desc: 'Función objetiva y restricciones correctamente identificadas' },
        { label: 'Bueno', points: 22, desc: 'Modelado correcto con alguna imprecisión' },
        { label: 'Regular', points: 14, desc: 'Modelado parcial' },
        { label: 'Deficiente', points: 5, desc: 'Sin modelado' },
      ]},
      { criterion: 'Derivación y solución', levels: [
        { label: 'Excelente', points: 40, desc: 'Derivadas correctas, puntos críticos bien identificados' },
        { label: 'Bueno', points: 30, desc: 'Mayoría de derivadas correctas' },
        { label: 'Regular', points: 20, desc: 'Derivadas con errores' },
        { label: 'Deficiente', points: 5, desc: 'No resuelve correctamente' },
      ]},
      { criterion: 'Interpretación contextual', levels: [
        { label: 'Excelente', points: 30, desc: 'Resultado interpretado en el contexto del problema original' },
        { label: 'Bueno', points: 22, desc: 'Interpretación parcial' },
        { label: 'Regular', points: 14, desc: 'Sin interpretación, solo resultado numérico' },
        { label: 'Deficiente', points: 5, desc: 'Sin conclusión' },
      ]},
    ],
    openAt: sd(14), dueAt: d(3), allowLate: true, latePenalty: 10,
    points: 100, category: 'Tareas',
    visible: true, createdAt: sd(14),
  },

  // ── COURSE 3: ADM-01 ─────────────────────────────────────────────────────
  {
    id: 'adm-1-1', courseId: 'course-3', week: 1, order: 1, type: 'material',
    title: 'Introducción a la Administración Moderna',
    description: 'Historia del pensamiento administrativo, escuelas clásica, humanista y contemporánea.',
    fileUrl: '#', fileName: 'Semana1_Intro_Admin.pdf', fileSize: '2.8 MB',
    visible: true, createdAt: sd(42),
  },
  {
    id: 'adm-1-2', courseId: 'course-3', week: 1, order: 2, type: 'task',
    title: 'Caso 1 — Análisis de Empresa Costarricense',
    description: 'Selecciona una empresa costarricense y analiza su estructura administrativa.',
    instructions: `## Instrucciones
Selecciona una empresa costarricense (puede ser pública o privada) y realiza un análisis de su estructura administrativa considerando los 4 elementos del proceso administrativo: Planificación, Organización, Dirección y Control.

## Entregables
- Informe de 3-5 páginas en formato Word o PDF
- Fuentes citadas en formato APA`,
    rubric: [
      { criterion: 'Selección y descripción de la empresa', levels: [
        { label: 'Excelente', points: 20, desc: 'Empresa bien descrita con datos reales verificables' },
        { label: 'Bueno', points: 15, desc: 'Descripción adecuada con algunos datos' },
        { label: 'Regular', points: 10, desc: 'Descripción superficial' },
        { label: 'Deficiente', points: 3, desc: 'Descripción mínima o incorrecta' },
      ]},
      { criterion: 'Análisis del proceso administrativo', levels: [
        { label: 'Excelente', points: 50, desc: 'Los 4 elementos analizados con profundidad y ejemplos específicos' },
        { label: 'Bueno', points: 38, desc: '3 elementos bien analizados' },
        { label: 'Regular', points: 25, desc: 'Análisis superficial de todos o profundo de 1-2' },
        { label: 'Deficiente', points: 8, desc: 'Análisis ausente o irrelevante' },
      ]},
      { criterion: 'Presentación y formato', levels: [
        { label: 'Excelente', points: 30, desc: 'Bien estructurado, sin errores, citas correctas' },
        { label: 'Bueno', points: 22, desc: 'Estructura adecuada, pocos errores' },
        { label: 'Regular', points: 14, desc: 'Errores de formato o redacción' },
        { label: 'Deficiente', points: 4, desc: 'Sin estructura clara' },
      ]},
    ],
    openAt: sd(42), dueAt: sd(7), allowLate: true, latePenalty: 5,
    points: 100, category: 'Casos de Estudio',
    visible: true, createdAt: sd(42),
  },
  {
    id: 'adm-2-1', courseId: 'course-3', week: 2, order: 1, type: 'task',
    title: 'Caso 2 — Planificación Estratégica',
    description: 'Desarrolla un plan estratégico básico aplicando herramientas como FODA y OKRs.',
    instructions: `## Instrucciones
Usando la misma empresa del Caso 1, o una diferente de tu elección, desarrolla un plan estratégico básico para el próximo año.

Incluye:
1. Análisis FODA completo
2. Misión y Visión (propuesta o existente)
3. 3 objetivos estratégicos con sus KPIs
4. Plan de acción para el objetivo más prioritario`,
    rubric: [
      { criterion: 'Análisis FODA', levels: [
        { label: 'Excelente', points: 35, desc: 'FODA completo con elementos reales y relevantes' },
        { label: 'Bueno', points: 26, desc: 'FODA completo con algunos elementos genéricos' },
        { label: 'Regular', points: 17, desc: 'FODA incompleto' },
        { label: 'Deficiente', points: 5, desc: 'FODA ausente o irrelevante' },
      ]},
      { criterion: 'Objetivos estratégicos y KPIs', levels: [
        { label: 'Excelente', points: 35, desc: 'Objetivos SMART con KPIs medibles' },
        { label: 'Bueno', points: 26, desc: 'Objetivos adecuados, KPIs básicos' },
        { label: 'Regular', points: 17, desc: 'Objetivos vagos, sin KPIs claros' },
        { label: 'Deficiente', points: 5, desc: 'Sin objetivos claros' },
      ]},
      { criterion: 'Plan de acción', levels: [
        { label: 'Excelente', points: 30, desc: 'Plan detallado con responsables, fechas y recursos' },
        { label: 'Bueno', points: 22, desc: 'Plan básico con algunos elementos' },
        { label: 'Regular', points: 14, desc: 'Plan superficial' },
        { label: 'Deficiente', points: 4, desc: 'Sin plan de acción' },
      ]},
    ],
    openAt: sd(14), dueAt: d(7), allowLate: true, latePenalty: 5,
    points: 100, category: 'Casos de Estudio',
    visible: true, createdAt: sd(14),
  },
];

// ─── SUBMISSIONS ──────────────────────────────────────────────────────────────
export const SUBMISSIONS = [
  // Task 1 (act-2-3) — Tarea 1 POO — all graded
  { id: 'sub-1', activityId: 'act-2-3', studentId: 'est-1', courseId: 'course-1',
    submittedAt: sd(9), fileName: 'Ana_Tarea1_Biblioteca.zip', fileSize: '1.2 MB',
    comment: 'Adjunto el proyecto Maven con el diagrama UML en la carpeta /docs.',
    grade: 92, gradedAt: sd(7), feedback: 'Excelente trabajo Ana. El diagrama UML está muy bien elaborado y el código es limpio. La validación de préstamos máximos funciona perfectamente. Detalle menor: faltó implementar toString() en la clase Prestamo. ¡Sigue así!',
    rubricGrades: [3, 3, 3, 3],
  },
  { id: 'sub-2', activityId: 'act-2-3', studentId: 'est-2', courseId: 'course-1',
    submittedAt: sd(8), fileName: 'JoseMendez_Tarea1.zip', fileSize: '0.9 MB',
    comment: 'Trabajé bastante en el UML, espero que esté bien.',
    grade: 78, gradedAt: sd(6), feedback: 'Buen trabajo José. El código compila y funciona bien. El UML muestra las clases pero falta incluir las multiplicidades en las relaciones. El informe es un poco corto, hubiera esperado más justificación de las decisiones de diseño.',
    rubricGrades: [2, 3, 1, 2],
  },
  { id: 'sub-3', activityId: 'act-2-3', studentId: 'est-3', courseId: 'course-1',
    submittedAt: sd(7), fileName: 'Valeria_Castro_T1.zip', fileSize: '1.5 MB',
    comment: 'Incluí un README con instrucciones para compilar.',
    grade: 95, gradedAt: sd(5), feedback: '¡Magnífico trabajo Valeria! El sistema es robusto, el UML es profesional y el informe está muy bien redactado. Me gustó especialmente la atención al detalle en las validaciones. Pequeña sugerencia: podrías usar un enum para el estado del libro.',
    rubricGrades: [3, 3, 3, 3],
  },
  { id: 'sub-4', activityId: 'act-2-3', studentId: 'est-4', courseId: 'course-1',
    submittedAt: sd(6), fileName: 'Diego_Tarea1_POO.zip', fileSize: '0.7 MB',
    comment: '',
    grade: 65, gradedAt: sd(4), feedback: 'Diego, el código tiene problemas de compilación en la clase Prestamo. El UML está incompleto — faltan las clases Autor y Préstamo. Recomiendo revisar los conceptos de encapsulamiento. Estoy disponible en horario de consulta.',
    rubricGrades: [1, 2, 1, 2],
  },
  { id: 'sub-5', activityId: 'act-2-3', studentId: 'est-5', courseId: 'course-1',
    submittedAt: sd(7), fileName: 'Sofia_Jimenez_Biblioteca.zip', fileSize: '1.1 MB',
    comment: 'Primera vez que trabajo con Maven, espero haberlo configurado bien.',
    grade: 83, gradedAt: sd(5), feedback: 'Bien hecho Sofía. El proyecto compila correctamente y la lógica de préstamos es correcta. Sugiero mejorar la documentación del código (JavaDoc) para las próximas entregas.',
    rubricGrades: [2, 3, 2, 2],
  },
  { id: 'sub-6', activityId: 'act-2-3', studentId: 'est-6', courseId: 'course-1',
    submittedAt: sd(5), fileName: 'MateoVargas_T1.zip', fileSize: '0.5 MB',
    comment: 'Tuve problemas con Maven así que lo hice como proyecto simple.',
    grade: 58, gradedAt: sd(3), feedback: 'Mateo, el proyecto tiene lo básico pero le falta profundidad. Los getters y setters están, pero no hay validaciones. El UML es muy básico y el informe es de menos de media página. Por favor revisa los recursos de la Semana 2 y escríbeme si tienes dudas.',
    rubricGrades: [1, 1, 1, 1],
  },

  // Task 2 (act-4-3) — Tarea 2 POO — some graded, some not
  { id: 'sub-7', activityId: 'act-4-3', studentId: 'est-1', courseId: 'course-1',
    submittedAt: sd(3), fileName: 'Ana_Tarea2_Herencia.zip', fileSize: '1.4 MB',
    comment: 'Agregué una interfaz extra Catalogable que no estaba en los requisitos pero me pareció útil.',
    grade: null, gradedAt: null, feedback: null, rubricGrades: null,
  },
  { id: 'sub-8', activityId: 'act-4-3', studentId: 'est-2', courseId: 'course-1',
    submittedAt: sd(2), fileName: 'Jose_T2_POO.zip', fileSize: '0.8 MB',
    comment: 'Tuve dificultad con el método genérico, lo intenté varias veces.',
    grade: null, gradedAt: null, feedback: null, rubricGrades: null,
  },
  { id: 'sub-9', activityId: 'act-4-3', studentId: 'est-3', courseId: 'course-1',
    submittedAt: sd(4), fileName: 'Valeria_Tarea2_Final.zip', fileSize: '1.8 MB',
    comment: 'Diagrama UML en formato PNG y también en el archivo draw.io por si quiere editarlo.',
    grade: 98, gradedAt: sd(1), feedback: '¡Valeria, este es uno de los mejores trabajos que he recibido! La interfaz Digitalizable es perfecta y el polimorfismo está demostrado con claridad. El código es extraordinariamente limpio.',
    rubricGrades: [3, 3, 3, 3],
  },
  { id: 'sub-10', activityId: 'act-4-3', studentId: 'est-5', courseId: 'course-1',
    submittedAt: sd(1), fileName: 'Sofia_Herencia_Interfaces.zip', fileSize: '1.0 MB',
    comment: '',
    grade: null, gradedAt: null, feedback: null, rubricGrades: null,
  },

  // Quiz 1 (act-3-3)
  { id: 'sub-q1', activityId: 'act-3-3', studentId: 'est-1', courseId: 'course-1',
    submittedAt: sd(15), answers: { q1: 'b', q2: false, q3: 'a', q4: 'b', q5: true },
    grade: 100, gradedAt: sd(15),
  },
  { id: 'sub-q2', activityId: 'act-3-3', studentId: 'est-2', courseId: 'course-1',
    submittedAt: sd(15), answers: { q1: 'b', q2: true, q3: 'a', q4: 'a', q5: true },
    grade: 60, gradedAt: sd(15),
  },
  { id: 'sub-q3', activityId: 'act-3-3', studentId: 'est-3', courseId: 'course-1',
    submittedAt: sd(14), answers: { q1: 'b', q2: false, q3: 'a', q4: 'b', q5: true },
    grade: 100, gradedAt: sd(14),
  },
  { id: 'sub-q4', activityId: 'act-3-3', studentId: 'est-4', courseId: 'course-1',
    submittedAt: sd(14), answers: { q1: 'c', q2: false, q3: 'b', q4: 'a', q5: false },
    grade: 20, gradedAt: sd(14),
  },
  { id: 'sub-q5', activityId: 'act-3-3', studentId: 'est-5', courseId: 'course-1',
    submittedAt: sd(14), answers: { q1: 'b', q2: false, q3: 'a', q4: 'b', q5: false },
    grade: 80, gradedAt: sd(14),
  },
  { id: 'sub-q6', activityId: 'act-3-3', studentId: 'est-6', courseId: 'course-1',
    submittedAt: sd(13), answers: { q1: 'a', q2: true, q3: 'a', q4: 'a', q5: true },
    grade: 40, gradedAt: sd(13),
  },

  // MAT-02 submissions
  { id: 'sub-m1', activityId: 'mat-1-2', studentId: 'est-1', courseId: 'course-2',
    submittedAt: sd(16), fileName: 'Ana_Tarea1_Limites.pdf', fileSize: '0.8 MB',
    comment: 'Resolví todos los ejercicios a mano y los escaneé.',
    grade: 88, gradedAt: sd(13), feedback: 'Muy buen trabajo. Excelente dominio de límites por factorización. Revisa el ejercicio 14, el resultado debería ser +∞ no -∞.',
    rubricGrades: [3, 3],
  },
  { id: 'sub-m2', activityId: 'mat-1-2', studentId: 'est-2', courseId: 'course-2',
    submittedAt: sd(15), fileName: 'Jose_Limites_T1.pdf', fileSize: '0.6 MB',
    comment: '',
    grade: 72, gradedAt: sd(12), feedback: 'Buen intento. Los límites simples están bien pero hay errores en 4 de los límites al infinito.',
    rubricGrades: [2, 2],
  },
  { id: 'sub-m3', activityId: 'mat-2-1', studentId: 'est-1', courseId: 'course-2',
    submittedAt: sd(9), fileName: 'Ana_Derivacion.pdf', fileSize: '1.1 MB',
    comment: 'Usé cálculo simbólico para verificar mis respuestas.',
    grade: 95, gradedAt: sd(6), feedback: '¡Excelente! Dominas perfectamente las reglas de derivación. Aplicación impecable de la regla de la cadena.',
    rubricGrades: [3, 3],
  },
  { id: 'sub-m4', activityId: 'mat-2-1', studentId: 'est-2', courseId: 'course-2',
    submittedAt: sd(8), fileName: 'Jose_Derivadas.pdf', fileSize: '0.7 MB',
    comment: '',
    grade: 68, gradedAt: sd(5), feedback: 'Necesitas reforzar la regla del cociente. Hay errores sistemáticos en ese tipo de ejercicios.',
    rubricGrades: [2, 2],
  },

  // ADM-01 submissions
  { id: 'sub-a1', activityId: 'adm-1-2', studentId: 'est-1', courseId: 'course-3',
    submittedAt: sd(9), fileName: 'Ana_Caso1_ICE.pdf', fileSize: '0.9 MB',
    comment: 'Analicé el ICE como empresa estatal.',
    grade: 90, gradedAt: sd(6), feedback: 'Excelente elección de empresa y análisis muy completo.',
    rubricGrades: [3, 3, 3],
  },
  { id: 'sub-a2', activityId: 'adm-1-2', studentId: 'est-7', courseId: 'course-3',
    submittedAt: sd(8), fileName: 'Isabella_Caso1.pdf', fileSize: '1.2 MB',
    comment: 'Analicé Walmart Costa Rica.',
    grade: 85, gradedAt: sd(5), feedback: 'Buen análisis. El FODA no estaba en los requisitos del Caso 1 pero bienvenido.',
    rubricGrades: [3, 2, 3],
  },
];

// ─── FORUM POSTS ──────────────────────────────────────────────────────────────
export const FORUM_POSTS = [
  {
    id: 'fp-1', activityId: 'act-6-3', courseId: 'course-1',
    studentId: 'est-3', studentName: 'Valeria Castro',
    content: 'Identifiqué el patrón **Singleton** en la librería de conexiones de base de datos que usamos en el proyecto del semestre pasado (Hibernate SessionFactory). Solo se crea una instancia del pool de conexiones para toda la aplicación, lo que evita crear miles de conexiones innecesarias. Fue una buena decisión porque las conexiones son costosas de crear y el pool las reutiliza eficientemente.',
    postedAt: sd(5),
    replies: [
      { id: 'fp-1r1', studentId: 'prof-1', studentName: 'Prof. Álvaro Cordero',
        content: 'Excelente ejemplo Valeria. El Singleton en Hibernate es clásico. ¿Notaste si lo implementaron con "double-checked locking" para ser thread-safe?',
        postedAt: sd(4), },
    ],
  },
  {
    id: 'fp-2', activityId: 'act-6-3', courseId: 'course-1',
    studentId: 'est-1', studentName: 'Ana Rodríguez',
    content: 'En la app de música que uso (Spotify), identifiqué el patrón **Observer**. Cuando una canción cambia de estado (play/pause/next), todos los componentes que muestran el estado actual (la barra de reproductor, el widget del sistema, la notificación) se actualizan automáticamente. El reproductor central es el Subject y los componentes UI son los Observers.',
    postedAt: sd(4),
    replies: [],
  },
  {
    id: 'fp-3', activityId: 'act-6-3', courseId: 'course-1',
    studentId: 'est-2', studentName: 'José Méndez',
    content: 'Encontré el patrón **Factory Method** en el framework de testing JUnit. Cuando creamos un TestSuite, JUnit usa una factory para instanciar los test runners apropiados según el tipo de test (paramétrico, normal, etc.) sin que el código del test conozca los detalles de implementación.',
    postedAt: sd(3),
    replies: [],
  },
];

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
export const ANNOUNCEMENTS = [
  {
    id: 'ann-1', courseId: 'course-1', professorId: 'prof-1',
    title: '📌 Recordatorio: Tarea 3 vence este viernes',
    content: 'Estimados estudiantes, les recuerdo que la Tarea 3 sobre Colecciones en Java vence el próximo viernes a las 11:59pm. Ya revisé las entregas de la Tarea 2 y las notas están disponibles en el apartado de Calificaciones. Cualquier consulta, escríbanme.',
    postedAt: sd(2), isRead: false,
  },
  {
    id: 'ann-2', courseId: 'course-1', professorId: 'prof-1',
    title: '🎥 Material Semana 6 disponible',
    content: 'Ya publiqué la grabación de la Semana 6 sobre Patrones de Diseño y el PDF de la presentación. Esta semana entraremos a los patrones estructurales. Por favor lean el material antes de la próxima sesión sincrónica.',
    postedAt: sd(5), isRead: true,
  },
  {
    id: 'ann-3', courseId: 'course-2', professorId: 'prof-2',
    title: 'Sesión de repaso — Viernes 3pm',
    content: 'Organizaré una sesión opcional de repaso de derivadas este viernes a las 3pm por Google Meet. No es obligatoria pero sería muy buena preparación para el quiz de la próxima semana.',
    postedAt: sd(3), isRead: false,
  },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const generateNotifications = (userId, role) => {
  const base = [
    { id: `n-${userId}-1`, userId, type: 'announcement', isRead: false,
      title: 'Nuevo anuncio en Programación OO',
      message: 'Prof. Álvaro publicó: "Recordatorio: Tarea 3 vence este viernes"',
      link: '/courses/course-1', createdAt: sd(2), },
    { id: `n-${userId}-2`, userId, type: 'grade', isRead: false,
      title: 'Tarea 2 calificada',
      message: 'Tu Tarea 2 de Programación OO ha sido calificada.',
      link: '/courses/course-1/grades', createdAt: sd(1), },
    { id: `n-${userId}-3`, userId, type: 'deadline', isRead: true,
      title: 'Entrega próxima',
      message: 'Tarea 3 de POO vence en 5 días.',
      link: '/courses/course-1', createdAt: sd(3), },
  ];
  if (role === 'professor') {
    return [
      { id: `n-${userId}-p1`, userId, type: 'submission', isRead: false,
        title: 'Nueva entrega — Ana Rodríguez',
        message: 'Ana entregó la Tarea 3: "Colecciones en el Sistema de Biblioteca"',
        link: '/courses/course-1/grades', createdAt: addHours(now, -2).toISOString(), },
      { id: `n-${userId}-p2`, userId, type: 'submission', isRead: false,
        title: 'Tareas sin calificar',
        message: '3 entregas de la Tarea 2 llevan más de 2 días sin calificar.',
        link: '/courses/course-1/grades', createdAt: sd(1), },
    ];
  }
  return base;
};

// ─── VIDEO PROGRESS ───────────────────────────────────────────────────────────
export const VIDEO_PROGRESS = [
  { userId: 'est-1', activityId: 'act-1-2', watched: 4680, total: 4680 },
  { userId: 'est-1', activityId: 'act-2-2', watched: 5100, total: 5100 },
  { userId: 'est-1', activityId: 'act-3-2', watched: 3200, total: 5520 },
  { userId: 'est-1', activityId: 'act-4-2', watched: 0, total: 6240 },
  { userId: 'est-2', activityId: 'act-1-2', watched: 4680, total: 4680 },
  { userId: 'est-2', activityId: 'act-2-2', watched: 2400, total: 5100 },
];

// ─── MATERIAL VIEWS ───────────────────────────────────────────────────────────
export const MATERIAL_VIEWS = [
  { userId: 'est-1', activityId: 'act-1-1' },
  { userId: 'est-1', activityId: 'act-2-1' },
  { userId: 'est-1', activityId: 'act-3-1' },
  { userId: 'est-1', activityId: 'act-5-1' },
  { userId: 'est-2', activityId: 'act-1-1' },
  { userId: 'est-2', activityId: 'act-2-1' },
  { userId: 'est-3', activityId: 'act-1-1' },
  { userId: 'est-3', activityId: 'act-2-1' },
  { userId: 'est-3', activityId: 'act-3-1' },
  { userId: 'est-3', activityId: 'act-4-1' },
  { userId: 'est-3', activityId: 'act-5-1' },
  { userId: 'est-3', activityId: 'act-6-1' },
];

// ─── BADGES ───────────────────────────────────────────────────────────────────
export const BADGES = [
  { id: 'badge-1', studentId: 'est-1', name: 'Primera Entrega', description: 'Entregaste tu primera tarea a tiempo', icon: '🎯', earnedAt: sd(35) },
  { id: 'badge-2', studentId: 'est-1', name: 'Sin Tardanzas', description: 'Todas las entregas del mes a tiempo', icon: '⚡', earnedAt: sd(21) },
  { id: 'badge-3', studentId: 'est-3', name: 'Estudiante Destacada', description: 'Mejor promedio de la semana', icon: '🏆', earnedAt: sd(14) },
  { id: 'badge-4', studentId: 'est-3', name: 'Participativa', description: '5 participaciones en foros', icon: '💬', earnedAt: sd(5) },
];

// ─── DIRECT MESSAGES ─────────────────────────────────────────────────────────
export const DIRECT_MESSAGES = [
  { id: 'dm-1', from: 'est-4', to: 'prof-1', courseId: 'course-1',
    messages: [
      { id: 'msg-1', senderId: 'est-4', text: 'Profesor, tengo una duda sobre la Tarea 2. No entiendo cómo implementar el método genérico. ¿Podría darme una pista?', sentAt: sd(3) },
      { id: 'msg-2', senderId: 'prof-1', text: 'Hola Diego, con gusto. El tipo genérico con bounded parameter se define así: <T extends MaterialBiblioteca>. Esto garantiza que T sea siempre un subtipo de la clase base. ¿Puedo ver tu intento actual?', sentAt: sd(3) },
      { id: 'msg-3', senderId: 'est-4', text: 'Muchas gracias, ya lo entendí. El error era que no había importado la clase base correctamente.', sentAt: sd(2) },
    ],
  },
];

export const PERIODS = [
  { id: 'period-1', name: '2025-C3', label: 'III Cuatrimestre 2025', startDate: sd(60), endDate: d(30), isActive: true },
  { id: 'period-2', name: '2025-C2', label: 'II Cuatrimestre 2025', startDate: sd(120), endDate: sd(65), isActive: false },
];
