import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileBarChart,
  FileClock,
  LayoutDashboard,
  Shield,
  UsersRound,
} from "lucide-react";

const navigation = [
  { label: "Panel principal", icon: LayoutDashboard, active: true },
  { label: "Procedimientos", icon: ClipboardList },
  { label: "Guardias", icon: UsersRound },
  { label: "Asistencia", icon: Clock3 },
  { label: "Faltas", icon: CalendarDays },
  { label: "Estadísticas", icon: FileBarChart },
];

const metrics = [
  {
    label: "Procedimientos",
    value: "—",
    detail: "Conecta la base de datos para ver registros",
    icon: ClipboardList,
    tone: "blue",
  },
  {
    label: "Guardias activos",
    value: "—",
    detail: "Tu equipo, siempre al día",
    icon: UsersRound,
    tone: "green",
  },
  {
    label: "Asistencia de hoy",
    value: "—",
    detail: "Turnos y marcaciones",
    icon: Clock3,
    tone: "violet",
  },
  {
    label: "Faltas del mes",
    value: "—",
    detail: "Seguimiento del período actual",
    icon: CalendarDays,
    tone: "amber",
  },
];

const modules = [
  {
    title: "Procedimientos",
    description: "Registro, seguimiento y consulta de casos operacionales.",
    icon: ClipboardList,
    tag: "Módulo principal",
  },
  {
    title: "Guardias",
    description: "Fichas, datos de contacto y estado del personal.",
    icon: UsersRound,
    tag: "Equipo",
  },
  {
    title: "Asistencia",
    description: "Turnos, horas trabajadas, atrasos y horas extra.",
    icon: FileClock,
    tag: "Operaciones",
  },
  {
    title: "Informes",
    description: "Indicadores y reportes de la operación.",
    icon: FileBarChart,
    tag: "Análisis",
  },
];

function currentDate() {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Home() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="Procedimientos Euskadi Seguridad, inicio">
          <span className="brand-mark">
            <Shield size={22} strokeWidth={2.2} />
          </span>
          <span className="brand-copy">
            <strong>Euskadi</strong>
            <span>SEGURIDAD</span>
          </span>
        </a>

        <div className="workspace-label">GESTIÓN OPERACIONAL</div>
        <nav className="side-nav" aria-label="Navegación principal">
          {navigation.map(({ label, icon: Icon, active }) => (
            <a
              className={`nav-link${active ? " active" : ""}`}
              href={active ? "#inicio" : "#modulos"}
              key={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {!active && <span className="nav-soon">Próximamente</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><Activity size={17} /></span>
            <strong>Tu operación, bajo control</strong>
            <p>Una plataforma clara para el trabajo de cada turno.</p>
          </div>
          <div className="sidebar-foot">
            <span className="status-dot" />
            Entorno de configuración
          </div>
        </div>
      </aside>

      <div className="main-column" id="inicio">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Inicio</span>
            <span className="crumb-separator">/</span>
            <strong>Panel principal</strong>
          </div>
          <div className="topbar-actions">
            <span className="today">{currentDate()}</span>
            <button className="icon-button" type="button" aria-label="Notificaciones">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="profile" aria-label="Sesión no iniciada">
              <span className="profile-avatar">ES</span>
              <span className="profile-copy">
                <strong>Espacio de trabajo</strong>
                <span>Acceso pendiente</span>
              </span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span /> CENTRO DE OPERACIONES</div>
              <h1>Panel principal</h1>
              <p className="welcome-subtitle">
                Una vista clara de tus procedimientos y de la operación diaria.
              </p>
            </div>
            <button className="primary-button" type="button" disabled title="Disponible cuando se configure el acceso seguro">
              <ClipboardList size={17} />
              Nuevo procedimiento
              <ArrowRight size={16} />
            </button>
          </section>

          <section className="setup-banner" aria-label="Estado de configuración">
            <div className="setup-icon"><Shield size={20} /></div>
            <div className="setup-copy">
              <strong>Tu espacio de trabajo se está preparando</strong>
              <p>
                Los datos aparecerán aquí cuando conectemos PostgreSQL y habilitemos el acceso seguro.
                No se muestran registros ficticios ni datos personales de ejemplo.
              </p>
            </div>
            <span className="setup-pill">Configuración inicial</span>
          </section>

          <section className="metric-grid" aria-label="Indicadores operacionales">
            {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
              <article className="metric-card" key={label}>
                <div className="metric-top">
                  <span className={`metric-icon ${tone}`}><Icon size={19} /></span>
                  <span className="metric-period">Sin datos</span>
                </div>
                <div className="metric-value">{value}</div>
                <div className="metric-label">{label}</div>
                <p className="metric-detail">{detail}</p>
              </article>
            ))}
          </section>

          <section className="content-grid">
            <article className="panel-card recent-card">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">ACTIVIDAD</span>
                  <h2>Procedimientos recientes</h2>
                </div>
                <a className="text-link disabled-link" href="#modulos" aria-disabled="true">
                  Ver todos <ArrowRight size={15} />
                </a>
              </div>
              <div className="empty-state">
                <span className="empty-icon"><ClipboardList size={23} /></span>
                <strong>Tu actividad aparecerá aquí</strong>
                <p>Conecta la base de datos y registra tu primer procedimiento.</p>
              </div>
              <div className="table-footer">
                <span>Sin registros disponibles</span>
                <span className="table-page">—</span>
              </div>
            </article>

            <article className="panel-card summary-card">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">RESUMEN</span>
                  <h2>Estado de la plataforma</h2>
                </div>
                <span className="summary-icon"><Activity size={17} /></span>
              </div>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-dot blue-dot" />
                  <span>Base de datos</span>
                  <strong className="pending-state">Pendiente</strong>
                </div>
                <div className="summary-item">
                  <span className="summary-dot violet-dot" />
                  <span>Acceso seguro</span>
                  <strong className="pending-state">Pendiente</strong>
                </div>
                <div className="summary-item">
                  <span className="summary-dot green-dot" />
                  <span>Despliegue</span>
                  <strong className="pending-state">Pendiente</strong>
                </div>
              </div>
              <div className="summary-note">
                <span className="note-icon"><ArrowUpRight size={15} /></span>
                La aplicación no expone registros hasta habilitar autenticación.
              </div>
            </article>
          </section>

          <section className="modules-section" id="modulos">
            <div className="section-heading">
              <div>
                <span className="section-kicker">TU PLATAFORMA</span>
                <h2>Módulos de gestión</h2>
              </div>
              <span className="module-count"><ArrowDownRight size={14} /> En preparación</span>
            </div>
            <div className="module-grid">
              {modules.map(({ title, description, icon: Icon, tag }) => (
                <article className="module-card" key={title}>
                  <div className="module-card-top">
                    <span className="module-icon"><Icon size={19} /></span>
                    <span className="module-tag">{tag}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="module-link">Disponible al completar la configuración</span>
                </article>
              ))}
            </div>
          </section>

          <footer className="page-footer">
            <span>Procedimientos Euskadi Seguridad</span>
            <span>Construido para una operación segura y auditable</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
