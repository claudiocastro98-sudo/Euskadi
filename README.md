# Control de Procedimientos --- Arquitectura de Producción

> **Documento maestro de arquitectura, desarrollo, seguridad, CI/CD y
> despliegue.**
>
> Este README define la transformación del prototipo actual basado en
> **HTML + JavaScript + localStorage + JSON** hacia una aplicación web
> de alto estándar, preparada para **Frontend + Backend + Base de
> Datos + API + GitHub Actions + Vercel**.

------------------------------------------------------------------------

## 1. Objetivo del proyecto

Construir una plataforma web profesional para la gestión operacional de
procedimientos de seguridad, asistencia, faltas y fichas de guardias.

La aplicación debe conservar las capacidades funcionales del prototipo
actual, pero reemplazando progresivamente:

-   `localStorage` por una base de datos centralizada.
-   JavaScript monolítico por componentes y módulos.
-   autenticación local por autenticación segura de servidor.
-   respaldos manuales por estrategia de persistencia y backup.
-   generación de documentos únicamente en navegador por servicios
    controlados.
-   datos sin esquema por modelos tipados y validados.
-   despliegue manual por CI/CD.
-   HTML único por una arquitectura mantenible y escalable.

### Resultado esperado

Una aplicación:

-   segura;
-   responsive;
-   accesible;
-   auditable;
-   mantenible;
-   escalable;
-   preparada para múltiples usuarios;
-   preparada para producción;
-   compatible con Vercel;
-   integrada con GitHub Actions;
-   con API documentada;
-   con base de datos relacional;
-   con pruebas automatizadas;
-   con observabilidad;
-   con control de roles y permisos.

------------------------------------------------------------------------

# 2. Fuente funcional del proyecto

La arquitectura prevista se deriva de dos fuentes funcionales que deben
incorporarse al repositorio:

1.  **JSON de datos iniciales**, versión `2`.
2.  **HTML funcional actual**, que contiene la interfaz y lógica del
    prototipo.

En el directorio de trabajo actual solo está disponible este README.
El JSON y el HTML todavía no se encuentran en el proyecto, por lo que no
se importarán ni se asumirán datos hasta que se compartan. La migración
deberá preservar las capacidades funcionales descritas cuando se reciban
las fuentes.

------------------------------------------------------------------------

# 3. Funcionalidades que debe soportar la versión profesional

## 3.1 Autenticación

El prototipo actual contempla:

-   usuario;
-   contraseña;
-   inicio de sesión;
-   cambio de contraseña;
-   recuperación mediante código;
-   bloqueo temporal ante múltiples intentos;
-   cierre de sesión;
-   bloqueo automático por inactividad;
-   sesión persistente mientras corresponda.

### Implementación de producción

La versión profesional debe utilizar:

-   autenticación gestionada por servidor;
-   contraseñas almacenadas mediante hash seguro;
-   sesiones seguras;
-   cookies `HttpOnly`;
-   `Secure`;
-   `SameSite`;
-   protección CSRF cuando corresponda;
-   rate limiting;
-   auditoría de accesos;
-   recuperación de contraseña mediante flujo seguro;
-   expiración de sesiones;
-   invalidación de sesiones al cerrar sesión;
-   políticas de contraseña.

**Importante:** nunca almacenar contraseñas, códigos de recuperación o
secretos en texto plano.

------------------------------------------------------------------------

# 4. Módulos funcionales

## 4.1 Dashboard

Debe ser la pantalla principal después del login.

### KPIs

-   procedimientos;
-   detenciones;
-   monto hurtado;
-   monto recuperado;
-   porcentaje de recuperación;
-   porcentaje de casos con detención;
-   turnos;
-   horas trabajadas;
-   horas extras;
-   atrasos;
-   faltas.

### Visualizaciones

-   casos por mes;
-   monto hurtado por sector;
-   casos por franja horaria;
-   productos con mayor monto;
-   detenciones por guardia;
-   asistencia por guardia;
-   faltas por período.

------------------------------------------------------------------------

# 5. Módulo Procedimientos

Debe permitir:

-   crear;
-   consultar;
-   editar;
-   eliminar;
-   filtrar;
-   ordenar;
-   paginar;
-   exportar;
-   generar informes.

## Campos provenientes del JSON

  Campo        Tipo objetivo   Descripción
  ------------ --------------- ------------------------------
  `id`         bigint/uuid     Identificador interno
  `fecha`      datetime        Fecha y hora
  `local`      varchar         Local
  `sector`     varchar         Sector
  `tipo`       varchar         Tipo de procedimiento
  `guardia`    varchar / FK    Guardia asociado
  `producto`   varchar         Producto
  `cantidad`   integer         Cantidad
  `monto`      decimal         Monto hurtado
  `recup`      decimal         Monto recuperado
  `parte`      varchar         Número de parte
  `det`        boolean         Existió detención
  `carab`      boolean         Participación de Carabineros
  `obs`        text            Observaciones
  `n`          varchar         Número de procedimiento

### Reglas de negocio

1.  `cantidad >= 1`.
2.  `monto >= 0`.
3.  `recup >= 0`.
4.  `recup <= monto`.
5.  `fecha` obligatoria.
6.  El número de procedimiento debe ser único.
7.  El número debe seguir el patrón:

``` text
PR-YYYY-NNNN
```

8.  El correlativo debe generarse en servidor y no confiar en
    `Date.now()` del navegador.
9.  Si existe guardia registrado, se recomienda almacenar relación por
    ID y no únicamente su nombre.
10. `det` y `carab` deben ser booleanos.
11. Las observaciones deben aceptar texto controlado y sanitizado.

------------------------------------------------------------------------

# 6. Módulo Asistencia

El prototipo contempla:

-   guardia;
-   fecha;
-   entrada programada;
-   entrada real;
-   salida;
-   horas base;
-   turno;
-   marcación de entrada;
-   marcación de salida;
-   horas trabajadas;
-   horas extras;
-   atrasos;
-   autorización de horas extras;
-   supervisor;
-   motivo;
-   estado.

## Campos conceptuales

``` text
id
guardia_id
fecha
entrada_programada
entrada_real
salida
horas_base
minutos_trabajados
minutos_extras
minutos_atraso
tipo_turno
estado
extra_autorizada
supervisor_id
motivo
created_at
updated_at
```

## Reglas

-   validar formato `HH:MM`;
-   validar fechas;
-   soportar turnos que atraviesan medianoche;
-   calcular minutos en servidor;
-   no confiar en cálculos enviados por el cliente;
-   separar horas trabajadas de horas extras;
-   registrar autorización de extras;
-   mantener historial de cambios.

------------------------------------------------------------------------

# 7. Ciclo 4x4

El prototipo contempla lógica de ciclo 4x4.

La ficha del guardia contiene:

``` text
ciclo
tur
```

El sistema utiliza la fecha de inicio del ciclo para determinar si
corresponde día de trabajo o descanso.

### Arquitectura recomendada

Crear un servicio independiente:

``` text
src/domain/attendance/services/shift-cycle.service.ts
```

Responsabilidades:

-   determinar si un día corresponde a trabajo;
-   determinar si corresponde descanso;
-   calcular horas adicionales;
-   entregar explicación al usuario;
-   evitar duplicar esta lógica en componentes UI.

### Regla

No implementar la lógica 4x4 directamente dentro de React/HTML.

------------------------------------------------------------------------

# 8. Módulo Faltas

Debe permitir:

-   registrar falta;
-   editar;
-   eliminar;
-   filtrar por mes;
-   asociar guardia;
-   asociar fecha;
-   registrar motivo;
-   registrar observaciones.

## Motivos actuales

-   Injustificada;
-   Licencia médica;
-   Permiso con goce;
-   Permiso sin goce;
-   otros motivos definidos posteriormente.

### Reglas

-   no permitir dos faltas para el mismo guardia y fecha salvo que una
    regla de negocio futura lo autorice;
-   validar fecha;
-   guardar quién creó/modificó el registro;
-   auditar modificaciones.

------------------------------------------------------------------------

# 9. Módulo Guardias

El JSON actual contiene:

``` text
id
nom
rut
nac
tel
car
loc
ing
os
est
en
et
dom
com
ciclo
tur
```

## Modelo profesional

  Campo JSON   Campo recomendado
  ------------ --------------------------------
  `id`         `id`
  `nom`        `nombre_completo`
  `rut`        `rut`
  `nac`        `fecha_nacimiento`
  `tel`        `telefono`
  `car`        `cargo`
  `loc`        `local`
  `ing`        `fecha_ingreso`
  `os`         `fecha_vencimiento_os`
  `est`        `estado`
  `en`         `contacto_emergencia_nombre`
  `et`         `contacto_emergencia_telefono`
  `dom`        `domicilio`
  `com`        `comuna`
  `ciclo`      `fecha_inicio_ciclo`
  `tur`        `turno`

### Funciones

-   crear guardia;
-   editar;
-   eliminar/desactivar;
-   buscar;
-   filtrar;
-   validar RUT;
-   controlar vencimiento;
-   controlar estado;
-   exportar;
-   visualizar ficha.

------------------------------------------------------------------------

# 10. Validación de RUT

El prototipo ya contempla validación mediante módulo 11.

La implementación profesional debe centralizarla:

``` text
src/domain/guards/validators/rut.validator.ts
```

Debe soportar:

``` text
10.511.084-7
10511084-7
105110847
```

y normalizar internamente.

### Regla

El RUT normalizado debe ser único.

------------------------------------------------------------------------

# 11. Escaneo QR

El prototipo utiliza cámara y `jsQR` para detectar un RUT.

Debe conservarse como funcionalidad opcional del módulo Guardias.

## Arquitectura

``` text
components/guards/QrScanner.tsx
services/qr/qr-reader.service.ts
```

Flujo:

``` text
Cámara
  ↓
QR
  ↓
Lectura
  ↓
Extracción RUT
  ↓
Validación módulo 11
  ↓
Normalización
  ↓
Formulario guardia
```

### Seguridad

El QR no debe ser considerado una fuente confiable de identidad.

Debe validarse siempre en servidor.

------------------------------------------------------------------------

# 12. Respaldos

El prototipo permite:

-   CSV;
-   JSON;
-   importación JSON;
-   PDF;
-   respaldo completo;
-   importación acumulativa;
-   eliminación de datos.

## Versión profesional

La aplicación debe distinguir:

### Exportación

``` text
CSV
JSON
PDF
```

### Backup real

El backup de producción no debe depender del navegador.

Debe existir:

``` text
Base de datos
   ↓
Backup automático
   ↓
Almacenamiento externo
```

El botón de respaldo del frontend debe ser considerado una exportación,
no el mecanismo principal de recuperación ante desastre.

------------------------------------------------------------------------

# 13. Informes PDF

El prototipo contempla:

-   informe diario;
-   listado de procedimientos;
-   estadísticas;
-   asistencia;
-   horas extras.

### Arquitectura recomendada

Separar:

``` text
src/server/reports/
src/server/reports/templates/
src/server/reports/pdf/
```

Los datos deben obtenerse desde backend.

El navegador nunca debe ser la fuente de verdad del informe.

------------------------------------------------------------------------

# 14. Exportaciones CSV

Exportaciones mínimas:

### Procedimientos

``` text
fecha
local
sector
tipo
guardia
producto
cantidad
monto
recup
parte
det
carab
obs
```

### Asistencia

``` text
guardia
fecha
entrada
salida
minutos_trabajados
minutos_extras
minutos_atraso
autorizacion
supervisor
```

### Guardias

Exportar todos los campos no sensibles necesarios para operación.

------------------------------------------------------------------------

# 15. Arquitectura tecnológica propuesta

## Frontend

``` text
Next.js
React
TypeScript
```

## Backend

``` text
Next.js App Router
Route Handlers
Server Actions donde corresponda
Servicios de dominio
```

## Base de datos

``` text
PostgreSQL
```

## ORM

``` text
Prisma
```

## Validación

``` text
Zod
```

## UI

Recomendación:

``` text
Tailwind CSS
shadcn/ui
Lucide Icons
```

## Gráficos

``` text
Recharts
```

## Formularios

``` text
React Hook Form
Zod
```

## Testing

``` text
Vitest
Playwright
Testing Library
```

## CI/CD

``` text
GitHub Actions
```

## Hosting

``` text
Vercel
```

------------------------------------------------------------------------

# 16. Arquitectura lógica

``` text
┌─────────────────────────────────────────────┐
│                  Usuario                    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                Next.js UI                   │
│ React + TypeScript + Tailwind + shadcn/ui  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             API / Server Layer              │
│ Route Handlers / Server Actions / Auth      │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              Domain Services                │
│ Procedures / Attendance / Guards / Reports  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                   Prisma                    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                PostgreSQL                   │
└─────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 17. Estructura de carpetas propuesta

``` text
control-procedimientos/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── preview.yml
│       └── production.yml
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── recuperar/
│   │   │   └── page.tsx
│   │   └── cambiar-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── procedimientos/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── estadisticas/
│   │   │   └── page.tsx
│   │   ├── asistencia/
│   │   │   └── page.tsx
│   │   ├── faltas/
│   │   │   └── page.tsx
│   │   ├── guardias/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/
│   │   │   └── [id]/
│   │   ├── reportes/
│   │   │   └── page.tsx
│   │   └── respaldos/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── procedimientos/
│   │   ├── asistencia/
│   │   ├── faltas/
│   │   ├── guardias/
│   │   ├── reportes/
│   │   ├── exportaciones/
│   │   └── health/
│   │
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── procedures/
│   ├── attendance/
│   ├── absences/
│   ├── guards/
│   ├── reports/
│   └── exports/
│
├── domain/
│   ├── procedures/
│   │   ├── procedure.types.ts
│   │   ├── procedure.schema.ts
│   │   ├── procedure.service.ts
│   │   └── procedure.rules.ts
│   │
│   ├── attendance/
│   │   ├── attendance.types.ts
│   │   ├── attendance.schema.ts
│   │   ├── attendance.service.ts
│   │   └── shift-cycle.service.ts
│   │
│   ├── absences/
│   │   ├── absence.types.ts
│   │   ├── absence.schema.ts
│   │   └── absence.service.ts
│   │
│   ├── guards/
│   │   ├── guard.types.ts
│   │   ├── guard.schema.ts
│   │   ├── guard.service.ts
│   │   └── rut.validator.ts
│   │
│   ├── reports/
│   │   ├── report.service.ts
│   │   └── report.types.ts
│   │
│   └── auth/
│       ├── auth.service.ts
│       ├── password.service.ts
│       └── permissions.ts
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── logger.ts
│   ├── rate-limit.ts
│   ├── security.ts
│   └── env.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
│   ├── logo/
│   ├── icons/
│   └── manifest/
│
├── scripts/
│   ├── import-json.ts
│   ├── export-data.ts
│   └── validate-data.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── security.md
│   ├── database.md
│   └── deployment.md
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── prettier.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

------------------------------------------------------------------------

# 18. Modelo de datos

## Entidades principales

``` text
User
Role
Session
Guard
Procedure
Attendance
Absence
Supervisor
AuditLog
RecoveryToken
```

------------------------------------------------------------------------

# 19. Relaciones

``` text
User
 ├── Role
 └── AuditLog

Guard
 ├── Procedure
 ├── Attendance
 └── Absence

Supervisor
 └── Attendance

Procedure
 └── Guard

Attendance
 ├── Guard
 └── Supervisor
```

------------------------------------------------------------------------

# 20. Prisma --- modelo conceptual

El `schema.prisma` deberá contemplar como mínimo:

``` text
User
Role
Guard
Procedure
Attendance
Absence
AuditLog
RecoveryToken
```

### Reglas de base de datos

-   PK en todas las entidades.
-   índices para fechas.
-   índices para RUT.
-   índices para guardia.
-   índices para local.
-   índices para sector.
-   timestamps.
-   constraints.
-   relaciones FK.
-   valores monetarios como `Decimal`.
-   booleanos reales.
-   unicidad para RUT.
-   unicidad para número de procedimiento.

------------------------------------------------------------------------

# 21. Migración del JSON actual

El JSON recibido debe considerarse un **dataset inicial / fixture**, no
una base de datos de producción.

## Archivo

``` text
data/seed/procedimientos.v2.json
```

## Proceso

``` text
JSON
 ↓
Schema Zod
 ↓
Normalización
 ↓
Validación
 ↓
Mapeo de entidades
 ↓
Prisma
 ↓
PostgreSQL
```

### Validaciones mínimas

-   JSON válido;
-   versión compatible;
-   arrays existentes;
-   IDs válidos;
-   fechas válidas;
-   montos válidos;
-   RUT válido;
-   estados permitidos;
-   referencias de guardia resolubles.

------------------------------------------------------------------------

# 22. Contrato JSON

El contrato actual es:

``` json
{
  "version": 2,
  "generado": "2026-09-30T16:08",
  "procedimientos": [],
  "turnos": [],
  "faltas": [],
  "guardias": []
}
```

Debe crearse un esquema:

``` text
domain/import/json-backup.schema.ts
```

usando Zod.

### Versionado

En futuras versiones:

``` text
version: 3
version: 4
```

debe existir migración explícita.

Nunca modificar silenciosamente el significado de una versión antigua.

------------------------------------------------------------------------

# 23. API

La API debe seguir una convención REST consistente.

## Procedimientos

``` http
GET    /api/procedimientos
POST   /api/procedimientos
GET    /api/procedimientos/:id
PATCH  /api/procedimientos/:id
DELETE /api/procedimientos/:id
```

## Guardias

``` http
GET    /api/guardias
POST   /api/guardias
GET    /api/guardias/:id
PATCH  /api/guardias/:id
DELETE /api/guardias/:id
```

## Asistencia

``` http
GET    /api/asistencia
POST   /api/asistencia
GET    /api/asistencia/:id
PATCH  /api/asistencia/:id
DELETE /api/asistencia/:id
```

## Faltas

``` http
GET    /api/faltas
POST   /api/faltas
GET    /api/faltas/:id
PATCH  /api/faltas/:id
DELETE /api/faltas/:id
```

## Reportes

``` http
GET /api/reportes/procedimientos
GET /api/reportes/asistencia
GET /api/reportes/estadisticas
GET /api/reportes/diario
```

## Exportaciones

``` http
GET /api/exportaciones/procedimientos.csv
GET /api/exportaciones/asistencia.csv
GET /api/exportaciones/guardias.csv
GET /api/exportaciones/respaldo.json
```

------------------------------------------------------------------------

# 24. Respuestas API

Formato recomendado:

### Éxito

``` json
{
  "success": true,
  "data": {}
}
```

### Error

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": []
  }
}
```

Nunca devolver stack traces al navegador.

------------------------------------------------------------------------

# 25. Autorización

Crear permisos explícitos.

Ejemplo:

``` text
dashboard.read
procedures.read
procedures.create
procedures.update
procedures.delete
attendance.read
attendance.create
attendance.update
attendance.delete
absences.read
absences.create
absences.update
absences.delete
guards.read
guards.create
guards.update
guards.delete
reports.read
exports.read
backup.manage
users.manage
audit.read
```

## Roles sugeridos

``` text
ADMIN
SUPERVISOR
OPERADOR
CONSULTA
```

Los roles son una propuesta arquitectónica y deben confirmarse antes de
implementar restricciones definitivas.

------------------------------------------------------------------------

# 26. Seguridad

## Requisitos obligatorios

-   HTTPS.
-   secretos únicamente mediante variables de entorno.
-   nunca subir `.env`.
-   hash seguro de contraseñas.
-   cookies seguras.
-   validación server-side.
-   sanitización.
-   protección XSS.
-   protección SQL Injection mediante ORM.
-   rate limiting.
-   control de sesión.
-   expiración.
-   auditoría.
-   autorización por endpoint.
-   control de permisos.
-   logs sin datos sensibles.
-   headers de seguridad.
-   CSP cuando sea viable.
-   protección contra enumeración de usuarios.
-   validación de archivos importados.
-   límites de tamaño para uploads.

------------------------------------------------------------------------

# 27. Protección de datos

La ficha de guardia contiene información personal.

Por lo tanto, el sistema debe aplicar:

-   mínimo privilegio;
-   acceso por rol;
-   no exponer RUT innecesariamente;
-   no exponer domicilio a usuarios sin permiso;
-   no incluir información personal sensible en logs;
-   control de exportaciones;
-   auditoría de acceso;
-   política de retención;
-   backups protegidos.

------------------------------------------------------------------------

# 28. Auditoría

Crear `AuditLog`.

Campos mínimos:

``` text
id
user_id
action
entity
entity_id
metadata
ip
user_agent
created_at
```

Eventos mínimos:

``` text
LOGIN_SUCCESS
LOGIN_FAILED
LOGOUT
PASSWORD_CHANGED
PASSWORD_RESET
PROCEDURE_CREATED
PROCEDURE_UPDATED
PROCEDURE_DELETED
GUARD_CREATED
GUARD_UPDATED
GUARD_DELETED
ATTENDANCE_CREATED
ATTENDANCE_UPDATED
ABSENCE_CREATED
ABSENCE_UPDATED
EXPORT_CREATED
BACKUP_IMPORTED
```

------------------------------------------------------------------------

# 29. UI / UX

La interfaz debe conservar la filosofía visual actual:

-   fondo claro;
-   tarjetas;
-   azul corporativo;
-   navegación superior;
-   responsive;
-   modo oscuro;
-   formularios compactos;
-   tablas;
-   KPIs;
-   indicadores de estado.

El prototipo actual ya contempla variables de tema, responsive, modo
oscuro y tarjetas. Esa identidad debe migrarse a un sistema de diseño
formal.

## Design System

Crear:

``` text
components/ui/
```

con:

-   Button;
-   Input;
-   Select;
-   Textarea;
-   Card;
-   Badge;
-   Table;
-   Modal;
-   Dialog;
-   Alert;
-   Toast;
-   DatePicker;
-   DataTable;
-   KPI Card;
-   Chart Card;
-   Empty State;
-   Loading State;
-   Error State.

------------------------------------------------------------------------

# 30. Responsive

Debe funcionar correctamente en:

``` text
Desktop
Laptop
Tablet
Mobile
```

Especialmente:

-   registrar procedimiento desde móvil;
-   marcar entrada;
-   escanear QR;
-   consultar guardia;
-   visualizar dashboard.

------------------------------------------------------------------------

# 31. Accesibilidad

Objetivo:

``` text
WCAG 2.2 AA
```

Mínimos:

-   navegación teclado;
-   foco visible;
-   labels;
-   contraste;
-   mensajes de error asociados a campos;
-   `aria-label` cuando sea necesario;
-   botones con nombres claros;
-   no depender únicamente del color.

------------------------------------------------------------------------

# 32. Estado frontend

Evitar un estado global innecesario.

Regla:

-   server state → React Query/SWR o estrategia equivalente;
-   estado de formularios → React Hook Form;
-   estado visual → React local state;
-   autenticación → sesión de servidor.

No duplicar datos de base de datos en múltiples estados globales.

------------------------------------------------------------------------

# 33. Validación

Validar en dos niveles:

``` text
Frontend
   ↓
UX inmediata

Backend
   ↓
Seguridad y regla definitiva
```

Nunca considerar válida una operación únicamente porque el frontend la
validó.

------------------------------------------------------------------------

# 34. Manejo de errores

Debe existir:

``` text
Error Boundary
404
403
401
500
Loading
Empty State
```

Mensajes de usuario:

``` text
No pudimos guardar el procedimiento.
Intenta nuevamente.
```

Logs técnicos:

``` text
request_id
user_id
endpoint
error_code
stack
timestamp
```

Los logs técnicos no deben exponerse al usuario.

------------------------------------------------------------------------

# 35. Observabilidad

Crear:

``` text
lib/logger.ts
```

Debe permitir:

-   errores;
-   warnings;
-   eventos importantes;
-   request ID;
-   tiempo de respuesta;
-   errores de base de datos;
-   errores de autenticación.

------------------------------------------------------------------------

# 36. Variables de entorno

Crear:

``` text
.env.example
```

Ejemplo:

``` env
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=

APP_URL=

NEXT_PUBLIC_APP_NAME="Control de Procedimientos"

LOG_LEVEL="info"

RATE_LIMIT_ENABLED="true"
```

Nunca guardar secretos reales en GitHub.

------------------------------------------------------------------------

# 37. Git

## Ramas

Recomendación:

``` text
main
develop
feature/*
fix/*
hotfix/*
```

### Flujo

``` text
feature
   ↓
Pull Request
   ↓
CI
   ↓
Code Review
   ↓
develop
   ↓
staging/preview
   ↓
main
   ↓
production
```

------------------------------------------------------------------------

# 38. Conventional Commits

Usar:

``` text
feat:
fix:
docs:
refactor:
test:
chore:
perf:
security:
```

Ejemplos:

``` text
feat: add procedure registration
fix: validate recovered amount
security: harden session cookie
test: add attendance calculation tests
```

------------------------------------------------------------------------

# 39. GitHub Actions

Crear:

``` text
.github/workflows/ci.yml
```

Pipeline mínimo:

``` text
Checkout
 ↓
Install dependencies
 ↓
Lint
 ↓
Typecheck
 ↓
Unit tests
 ↓
Build
```

------------------------------------------------------------------------

# 40. CI recomendado

``` yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run db:validate
      - run: npm run test
      - run: npm run build
```

Node.js 22 es la versión fijada para el proyecto. El workflow usa
`npm ci` y la caché de `package-lock.json` versionado para instalar las
dependencias de forma repetible.

------------------------------------------------------------------------

# 41. CI/CD completo

GitHub Actions valida lint, tipos, pruebas y build. Para las URLs de
Preview y el despliegue de Production, se recomienda conectar el
repositorio a Vercel: Vercel publicará automáticamente cada Pull Request
y la rama de producción, sin guardar un token de despliegue en el código.
No habilitar Production hasta completar autenticación y revisar la
protección de datos.

## Pull Request

``` text
PR
 ↓
Lint
 ↓
Typecheck
 ↓
Unit Tests
 ↓
Build
 ↓
E2E
```

## Preview

Cada PR debe tener:

``` text
GitHub
   ↓
Vercel Preview
```

## Producción

``` text
main
 ├─ GitHub Actions → lint + typecheck + tests + build
 └─ Vercel GitHub integration → build + deployment
 ↓
Production
```

------------------------------------------------------------------------

# 42. Vercel

La aplicación debe configurarse para:

-   Production;
-   Preview;
-   Development.

Conectar el proyecto de Vercel al repositorio GitHub después de que la
aplicación tenga autenticación y sus variables de entorno configuradas.
El workflow de GitHub Actions valida el código; Vercel gestiona los
despliegues Preview y Production desde las ramas configuradas.

### Variables

Configurar las variables correspondientes en:

``` text
Vercel Project Settings
→ Environment Variables
```

Separar:

``` text
Development
Preview
Production
```

Nunca copiar secretos manualmente dentro del código.

------------------------------------------------------------------------

# 43. Base de datos para Vercel

La arquitectura requiere PostgreSQL accesible desde el entorno
serverless.

Opciones posibles:

``` text
Neon
Supabase
PostgreSQL administrado
```

La selección final debe hacerse antes de producción considerando:

-   región;
-   costo;
-   backups;
-   conexiones;
-   latencia;
-   soporte;
-   crecimiento.

------------------------------------------------------------------------

# 44. Prisma en entorno serverless

Debe utilizarse un patrón de cliente reutilizable.

Ejemplo conceptual:

``` text
lib/db.ts
```

evitando crear conexiones ilimitadas por request.

------------------------------------------------------------------------

# 45. Migraciones

Nunca modificar producción manualmente.

Flujo:

``` text
schema.prisma
 ↓
prisma migrate dev
 ↓
commit migration
 ↓
CI
 ↓
deployment
 ↓
prisma migrate deploy
```

Las migraciones deben formar parte del control de versiones.

------------------------------------------------------------------------

# 46. Seed

Crear:

``` text
prisma/seed.ts
```

Debe permitir:

-   crear roles;
-   crear usuario administrador inicial;
-   cargar guardias;
-   cargar procedimientos;
-   cargar turnos;
-   cargar faltas.

No debe cargar datos demo accidentalmente en producción.

------------------------------------------------------------------------

# 47. Importador del JSON actual

Crear:

``` text
scripts/import-json.ts
```

Debe:

1.  leer archivo;
2.  validar versión;
3.  validar esquema;
4.  normalizar RUT;
5.  resolver guardias;
6.  importar guardias;
7.  importar procedimientos;
8.  importar turnos;
9.  importar faltas;
10. generar resumen;
11. registrar errores;
12. permitir modo `dry-run`.

Ejemplo:

``` bash
npm run import:json -- --file=data/seed/procedimientos.v2.json --dry-run
```

------------------------------------------------------------------------

# 48. Idempotencia

El importador debe ser idempotente.

Si se ejecuta dos veces:

``` text
Primera ejecución → inserta
Segunda ejecución → no duplica
```

Para ello utilizar identificadores externos o claves de importación.

------------------------------------------------------------------------

# 49. Migración del localStorage

Los datos existentes del prototipo no deben perderse.

Crear una herramienta:

``` text
scripts/migrate-localstorage-export.ts
```

Flujo:

``` text
Exportación JSON del prototipo
        ↓
Validador
        ↓
Transformador
        ↓
Preview de cambios
        ↓
Importación
        ↓
Reporte
```

------------------------------------------------------------------------

# 50. Compatibilidad con JSON actual

El respaldo completo actual tiene:

``` text
version
generado
procedimientos
turnos
faltas
guardias
```

La nueva aplicación debe poder importar esa estructura.

No se debe modificar el JSON original antes de conservar una copia.

------------------------------------------------------------------------

# 51. Datos iniciales entregados

El dataset recibido contiene actualmente:

-   procedimientos;
-   turnos;
-   faltas;
-   guardias.

Debe tratarse como datos reales de prueba/migración y protegerse de
exposición pública.

**No subir el JSON con datos personales a un repositorio público.**

------------------------------------------------------------------------

# 52. Testing

## Unit tests

Probar:

-   RUT;
-   correlativo PR;
-   monto recuperado;
-   cálculo de recuperación;
-   ciclo 4x4;
-   horas;
-   extras;
-   atrasos;
-   faltas;
-   normalización JSON.

## Integration tests

Probar:

-   API;
-   Prisma;
-   autenticación;
-   permisos;
-   creación de procedimiento;
-   creación de guardia;
-   asistencia.

## E2E

Playwright:

``` text
Login
 ↓
Dashboard
 ↓
Nuevo procedimiento
 ↓
Guardar
 ↓
Ver procedimiento
 ↓
Editar
 ↓
Exportar
```

Otro flujo:

``` text
Login
 ↓
Guardias
 ↓
Nuevo guardia
 ↓
Validar RUT
 ↓
Guardar
 ↓
Asistencia
 ↓
Registrar turno
```

------------------------------------------------------------------------

# 53. Quality Gates

Ningún PR debe entrar a `main` si falla:

``` text
Lint
Typecheck
Unit tests
Build
E2E crítico
```

Opcionalmente:

``` text
Coverage
Security audit
Dependency scan
```

------------------------------------------------------------------------

# 54. Performance

Objetivos:

-   cargar dashboard sin descargar toda la base;
-   paginar tablas;
-   filtrar en servidor cuando corresponda;
-   evitar N+1 queries;
-   índices adecuados;
-   componentes dinámicos;
-   lazy loading;
-   optimización de imágenes;
-   cache cuando corresponda.

No realizar:

``` text
SELECT *
```

sin necesidad.

------------------------------------------------------------------------

# 55. Seguridad de archivos

Para importación JSON:

-   validar extensión;
-   validar MIME;
-   limitar tamaño;
-   parsear;
-   validar esquema;
-   rechazar contenido malformado;
-   no ejecutar contenido;
-   no confiar en nombre del archivo.

------------------------------------------------------------------------

# 56. Backup y recuperación

Debe existir estrategia:

``` text
Backup diario
Backup periódico
Retención
Prueba de restauración
```

Un backup no se considera válido hasta comprobar que puede restaurarse.

------------------------------------------------------------------------

# 57. Estados del sistema

Crear estados consistentes.

## Guardia

``` text
ACTIVO
INACTIVO
```

## Procedimiento

``` text
REGISTRADO
CERRADO
```

Si el negocio requiere otros estados, documentarlos antes de agregarlos.

------------------------------------------------------------------------

# 58. Fechas y zona horaria

La aplicación está orientada a Chile.

Debe definirse una política única:

``` text
Persistencia → UTC
Presentación → America/Santiago
```

No utilizar `new Date()` indiscriminadamente en reglas de negocio.

Crear:

``` text
lib/date.ts
```

para normalización y presentación.

------------------------------------------------------------------------

# 59. Moneda

La información monetaria está expresada en pesos chilenos.

Regla:

``` text
Persistencia → Decimal
Presentación → CLP
```

Ejemplo:

``` text
155000
↓
$155.000
```

Nunca usar `float` para dinero.

------------------------------------------------------------------------

# 60. Catálogos

No hardcodear indefinidamente:

``` text
sector
tipo de procedimiento
motivos de falta
estados
turnos
roles
```

Crear catálogos administrables cuando el negocio lo requiera.

------------------------------------------------------------------------

# 61. API Health Check

Crear:

``` http
GET /api/health
```

Respuesta:

``` json
{
  "status": "ok",
  "database": "ok",
  "version": "1.0.0"
}
```

No revelar información sensible.

------------------------------------------------------------------------

# 62. Documentación

Crear:

``` text
docs/
├── architecture.md
├── database.md
├── api.md
├── security.md
├── deployment.md
├── backup.md
└── operations.md
```

------------------------------------------------------------------------

# 63. Definition of Done

Una funcionalidad estará terminada cuando:

-   [ ] tiene modelo;
-   [ ] tiene validación;
-   [ ] tiene servicio;
-   [ ] tiene endpoint;
-   [ ] tiene UI;
-   [ ] tiene manejo de errores;
-   [ ] tiene autorización;
-   [ ] tiene auditoría cuando corresponde;
-   [ ] tiene pruebas unitarias;
-   [ ] tiene pruebas de integración cuando corresponde;
-   [ ] tiene E2E para flujo crítico;
-   [ ] está documentada;
-   [ ] pasa CI;
-   [ ] funciona en Preview;
-   [ ] funciona en producción.

------------------------------------------------------------------------

# 64. Roadmap de desarrollo

## Fase 0 --- Arquitectura

-   [ ] crear repositorio;
-   [ ] definir nombre definitivo;
-   [ ] crear README;
-   [ ] definir stack;
-   [ ] definir variables;
-   [ ] definir base de datos;
-   [ ] definir roles;
-   [ ] definir permisos.

## Fase 1 --- Foundation

-   [ ] Next.js;
-   [ ] TypeScript;
-   [ ] ESLint;
-   [ ] Prettier;
-   [ ] Tailwind;
-   [ ] shadcn/ui;
-   [ ] Prisma;
-   [ ] PostgreSQL;
-   [ ] Zod;
-   [ ] estructura de carpetas.

## Fase 2 --- Database

-   [ ] schema;
-   [ ] migrations;
-   [ ] seed;
-   [ ] índices;
-   [ ] constraints.

## Fase 3 --- Authentication

-   [ ] login;
-   [ ] sesión;
-   [ ] logout;
-   [ ] cambio de contraseña;
-   [ ] recuperación;
-   [ ] rate limit;
-   [ ] permisos.

## Fase 4 --- Guardias

-   [ ] CRUD;
-   [ ] RUT;
-   [ ] QR;
-   [ ] vencimientos;
-   [ ] estados.

## Fase 5 --- Procedimientos

-   [ ] CRUD;
-   [ ] correlativo;
-   [ ] validaciones;
-   [ ] filtros;
-   [ ] búsqueda;
-   [ ] paginación.

## Fase 6 --- Asistencia

-   [ ] turnos;
-   [ ] entrada;
-   [ ] salida;
-   [ ] horas;
-   [ ] extras;
-   [ ] atrasos;
-   [ ] ciclo 4x4.

## Fase 7 --- Faltas

-   [ ] CRUD;
-   [ ] motivos;
-   [ ] filtros;
-   [ ] integración con asistencia.

## Fase 8 --- Dashboard

-   [ ] KPIs;
-   [ ] gráficos;
-   [ ] filtros;
-   [ ] rendimiento.

## Fase 9 --- Reportes

-   [ ] PDF diario;
-   [ ] PDF procedimientos;
-   [ ] PDF estadísticas;
-   [ ] PDF asistencia;
-   [ ] CSV;
-   [ ] JSON.

## Fase 10 --- Migración

-   [ ] importar JSON v2;
-   [ ] validar datos;
-   [ ] importar localStorage;
-   [ ] comprobar integridad;
-   [ ] generar reporte de migración.

## Fase 11 --- CI/CD

-   [ ] GitHub Actions;
-   [ ] lint;
-   [ ] typecheck;
-   [ ] tests;
-   [ ] build;
-   [ ] Playwright;
-   [ ] Vercel Preview;
-   [ ] Production.

## Fase 12 --- Hardening

-   [ ] seguridad;
-   [ ] rate limiting;
-   [ ] headers;
-   [ ] auditoría;
-   [ ] backups;
-   [ ] observabilidad;
-   [ ] performance;
-   [ ] recuperación ante desastre.

------------------------------------------------------------------------

# 65. Checklist antes de producción

## Código

-   [ ] TypeScript sin errores.
-   [ ] ESLint sin errores.
-   [ ] Tests OK.
-   [ ] Build OK.
-   [ ] E2E OK.
-   [ ] Dependencias actualizadas.

## Base de datos

-   [ ] Migraciones verificadas.
-   [ ] Índices.
-   [ ] Constraints.
-   [ ] Backup.
-   [ ] Restore probado.

## Seguridad

-   [ ] Secretos fuera de Git.
-   [ ] HTTPS.
-   [ ] Cookies seguras.
-   [ ] Auth segura.
-   [ ] Rate limit.
-   [ ] RBAC.
-   [ ] Auditoría.

## Vercel

-   [ ] Production env.
-   [ ] Preview env.
-   [ ] Development env.
-   [ ] dominio;
-   [ ] variables;
-   [ ] logs.

## GitHub

-   [ ] Branch protection.
-   [ ] PR obligatorio.
-   [ ] CI obligatorio.
-   [ ] revisión de código.

------------------------------------------------------------------------

# 66. Principios de arquitectura

## 1. El frontend no es la fuente de verdad

La base de datos y backend son la fuente de verdad.

## 2. El cliente no calcula reglas críticas

Dinero, horas, permisos y correlativos deben validarse en servidor.

## 3. Todo dato importante debe ser auditable

Crear, modificar y eliminar información operacional debe poder
rastrearse.

## 4. El sistema debe poder crecer

No construir pensando solamente en los datos actuales.

## 5. Seguridad desde el diseño

No agregar seguridad al final.

## 6. Separación de responsabilidades

UI ≠ API ≠ dominio ≠ persistencia.

------------------------------------------------------------------------

# 67. Arquitectura final objetivo

``` text
                         ┌──────────────────────┐
                         │       Usuario        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                     ┌───────────────────────────┐
                     │        Vercel             │
                     │ Next.js + React + TS      │
                     └─────────────┬─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
             ┌──────────────┐             ┌──────────────┐
             │ UI / Pages   │             │ API / Server  │
             └──────────────┘             └──────┬───────┘
                                                  │
                                                  ▼
                                      ┌────────────────────┐
                                      │ Domain Services    │
                                      │                    │
                                      │ Procedures         │
                                      │ Attendance         │
                                      │ Guards             │
                                      │ Absences           │
                                      │ Reports            │
                                      │ Auth               │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                      ┌────────────────────┐
                                      │ Prisma ORM         │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                      ┌────────────────────┐
                                      │ PostgreSQL         │
                                      └────────────────────┘

       GitHub
          │
          ▼
   GitHub Actions
          │
    ┌─────┴─────┐
    ▼           ▼
   CI        Security
    │
    ▼
 Vercel Preview / Production
```

------------------------------------------------------------------------

# 68. Archivos mínimos que deben existir

``` text
README.md

.env.example
.gitignore

package.json
tsconfig.json
next.config.ts

eslint.config.mjs
prettier.config.mjs

prisma/schema.prisma
prisma/seed.ts

app/layout.tsx
app/globals.css

app/(auth)/login/page.tsx
app/(auth)/recuperar/page.tsx
app/(auth)/cambiar-password/page.tsx

app/(dashboard)/layout.tsx
app/(dashboard)/page.tsx

app/(dashboard)/procedimientos/page.tsx
app/(dashboard)/asistencia/page.tsx
app/(dashboard)/faltas/page.tsx
app/(dashboard)/guardias/page.tsx
app/(dashboard)/estadisticas/page.tsx
app/(dashboard)/respaldos/page.tsx

components/ui/*
components/dashboard/*
components/procedures/*
components/attendance/*
components/absences/*
components/guards/*
components/reports/*

domain/procedures/*
domain/attendance/*
domain/absences/*
domain/guards/*
domain/reports/*
domain/auth/*

lib/db.ts
lib/auth.ts
lib/env.ts
lib/logger.ts
lib/security.ts
lib/rate-limit.ts
lib/date.ts

app/api/auth/*
app/api/procedimientos/*
app/api/asistencia/*
app/api/faltas/*
app/api/guardias/*
app/api/reportes/*
app/api/exportaciones/*
app/api/health/*

scripts/import-json.ts
scripts/export-data.ts
scripts/validate-data.ts

tests/unit/*
tests/integration/*
tests/e2e/*

docs/architecture.md
docs/database.md
docs/api.md
docs/security.md
docs/deployment.md
docs/backup.md
docs/operations.md

.github/workflows/ci.yml
.github/workflows/preview.yml
.github/workflows/production.yml
```

------------------------------------------------------------------------

# 69. Primer comando de creación

Una vez aprobado este diseño:

``` bash
npx create-next-app@latest control-procedimientos
```

Seleccionar:

``` text
TypeScript       → Yes
ESLint           → Yes
Tailwind         → Yes
src/ directory   → Según convención definitiva
App Router       → Yes
Turbopack        → Yes
Import alias     → @/*
```

Luego:

``` bash
npm install prisma @prisma/client zod
npm install react-hook-form @hookform/resolvers
npm install recharts
npm install lucide-react
npm install jsqr
```

Testing:

``` bash
npm install -D vitest
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D playwright
```

Las versiones exactas se fijarán mediante `package-lock.json` y CI.

------------------------------------------------------------------------

# 70. Estrategia de migración del prototipo

No se debe eliminar el HTML actual.

Se conservará como referencia funcional:

``` text
/prototype
```

El proceso será:

``` text
HTML + JS + JSON
       │
       ▼
Especificación funcional
       │
       ▼
Domain
       │
       ▼
Database
       │
       ▼
API
       │
       ▼
React UI
       │
       ▼
Tests
       │
       ▼
CI/CD
       │
       ▼
Vercel
```

El prototipo se utilizará como **fuente funcional de referencia**, no
como arquitectura final.

------------------------------------------------------------------------

# 71. Criterio de éxito

El proyecto se considerará correctamente migrado cuando:

1.  Todos los datos del JSON puedan ser importados.
2.  Los procedimientos puedan gestionarse desde la nueva UI.
3.  Los guardias puedan gestionarse desde la nueva UI.
4.  La asistencia pueda gestionarse desde la nueva UI.
5.  Las faltas puedan gestionarse desde la nueva UI.
6.  Las estadísticas reproduzcan las métricas del prototipo.
7.  Los reportes puedan generarse.
8.  Los respaldos puedan exportarse.
9.  La autenticación sea server-side.
10. Los permisos estén implementados.
11. Las operaciones críticas estén auditadas.
12. Los tests críticos estén automatizados.
13. GitHub Actions valide cada cambio.
14. Vercel tenga Preview y Production.
15. La aplicación pueda recuperarse ante pérdida de datos.

------------------------------------------------------------------------

# 72. Decisión arquitectónica clave

La migración **no debe consistir en convertir el archivo HTML
directamente a JSX**.

La estrategia correcta es:

``` text
                         PROTOTIPO
                            │
                ┌───────────┴───────────┐
                │                       │
              JSON                    HTML
                │                       │
                ▼                       ▼
           DATA MODEL             UX / FEATURES
                │                       │
                └───────────┬───────────┘
                            ▼
                       DOMAIN MODEL
                            │
                            ▼
                         DATABASE
                            │
                            ▼
                           API
                            │
                            ▼
                         FRONTEND
                            │
                            ▼
                          TESTS
                            │
                            ▼
                       CI/CD + VERCEL
```

Esto permite construir un producto profesional sin quedar atrapados en
las limitaciones del prototipo original.

------------------------------------------------------------------------

# 73. Estado del proyecto

``` text
Arquitectura: DEFINIDA
Fuente JSON: PENDIENTE DE INCORPORAR
Fuente HTML: PENDIENTE DE INCORPORAR
Modelo de dominio: DISEÑADO
Base de datos: ESQUEMA INICIAL CREADO; CONEXIÓN PENDIENTE
Frontend: SHELL INICIAL CREADO
Backend/API: PENDIENTE DE AUTENTICACIÓN
Autenticación: PENDIENTE
Tests: VALIDACIÓN DE RUT INCLUIDA
CI/CD: WORKFLOW DE CALIDAD CREADO; EJECUCIÓN PENDIENTE
Vercel: PENDIENTE
Migración: PENDIENTE
Producción: PENDIENTE
```

La primera versión de interfaz no presenta datos ficticios. Los módulos
operacionales se habilitarán cuando estén configuradas la base de datos
y la autenticación; no se deben publicar datos de guardias sin control
de acceso.

------------------------------------------------------------------------

## 74. Próximo paso de implementación

La etapa inicial ya cuenta con estructura Next.js, interfaz base, schema
Prisma, prueba del validador de RUT y workflow de CI. El siguiente paso es
incorporar las fuentes funcionales si están disponibles y configurar el
acceso seguro y la conexión a PostgreSQL. Antes de ejecutar Actions y
crear despliegues Vercel, se deberá conectar el repositorio remoto:

``` text
ETAPA 1
│
├── Estructura Next.js + TypeScript + Tailwind: INICIAL
├── Schema Prisma: CREADO; conexión PostgreSQL: PENDIENTE
├── Acceso seguro: PENDIENTE
├── Módulos operacionales y migración JSON v2: PENDIENTES
├── Workflow CI: CREADO; validar cuando Node/npm estén disponibles
└── Conexión GitHub + primera Preview Vercel: PENDIENTES
```

Después:

``` text
ETAPA 2 → Autenticación + usuarios + roles
ETAPA 3 → Guardias
ETAPA 4 → Procedimientos
ETAPA 5 → Asistencia
ETAPA 6 → Faltas
ETAPA 7 → Dashboard + estadísticas
ETAPA 8 → Reportes + exportaciones
ETAPA 9 → Migración completa
ETAPA 10 → Seguridad + auditoría + observabilidad
ETAPA 11 → QA + E2E
ETAPA 12 → Producción
```

------------------------------------------------------------------------

# 75. Nota de arquitectura

Este documento separa deliberadamente:

-   lo que **ya existe en el prototipo**;
-   lo que debe **mantenerse funcionalmente**;
-   lo que debe **rediseñarse técnicamente**;
-   lo que se propone como **arquitectura de producción**.

Las decisiones de infraestructura que dependan de proveedor, costos,
región, volumen de datos o requisitos legales deberán confirmarse antes
de cerrar producción.

**Principio rector:**

> **El prototipo demuestra la funcionalidad. La nueva arquitectura debe
> convertir esa funcionalidad en un producto seguro, mantenible,
> escalable y operable en producción.**
