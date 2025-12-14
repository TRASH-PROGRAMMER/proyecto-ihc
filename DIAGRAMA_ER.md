# Diagrama Entidad-Relación - EcoRutas

## 📊 Diagrama Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA ECORUTAS                                   │
│                        Turismo Comunitario Sostenible                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│      USUARIO     │           │    LOCALIDAD     │           │      GUÍA        │
├──────────────────┤           ├──────────────────┤           ├──────────────────┤
│ PK id            │           │ PK id            │           │ PK id            │
│    nombre        │           │    nombre        │           │    nombre        │
│    email         │ ◄────────►│    pais          │◄─────────►│    telefono      │
│    password      │  crea/    │    provincia     │  gestiona │    idioma        │
│    rol           │  gestiona │    ciudad        │           │    experiencia   │
└──────────────────┘           │    tipo          │           │    notas         │
       │                       │    categoria     │           │    activo        │
       │                       │    descripcion   │           │ FK localidadId   │
       │                       │    coordenadas   │           │    createdAt     │
       │                       │    altitud       │           │    updatedAt     │
       │                       │    clima         │           └──────────────────┘
       │                       │    servicios     │
       │                       │    tarifas       │
       │                       │    idiomas[]     │
       │                       │    status        │                     │
       │                       │ FK createdBy     │                     │
       │                       │    createdAt     │                     │
       │                       │    updatedAt     │                     │
       │                       └──────────────────┘                     │
       │                              │                                 │
       │                              │                                 │
       │                              ▼                                 ▼
       │                       ┌──────────────────┐           ┌──────────────────┐
       │                       │    HISTORIAL     │           │   HORARIOS       │
       │                       ├──────────────────┤           ├──────────────────┤
       │                       │ PK ts            │           │    horarios      │
       │                       │ FK localidadId   │           │    disponibilidad│
       │                       │ FK userId        │           │ FK guiaId        │
       │                       │    action        │           └──────────────────┘
       │                       │    detail        │
       │                       └──────────────────┘
       │
       │
       └──────────────────────────┐
                                  ▼
                       ┌──────────────────┐
                       │    RESERVA       │
                       ├──────────────────┤
                       │ PK id            │
                       │ FK userId        │
                       │ FK routeId       │
                       │    date          │
                       │    participants  │
                       │    fullName      │
                       │    email         │
                       │    phone         │
                       │    comments      │
                       │    status        │
                       │    createdAt     │
                       └──────────────────┘
                              │
                              │
                              ▼
                       ┌──────────────────┐
                       │      RUTA        │
                       ├──────────────────┤
                       │ PK id            │
                       │    name          │
                       │ FK localidadId   │
                       │    community     │
                       │    descripcion   │
                       │    dificultad    │
                       │    duracion      │
                       │    precio        │
                       │    imagenes[]    │
                       └──────────────────┘
```

---

## 📋 Entidades Detalladas

### 1️⃣ **USUARIO** (User)
**Tabla**: `ecorutas-users` (localStorage)

| Atributo    | Tipo                              | Descripción                    | Restricción      |
|-------------|-----------------------------------|--------------------------------|------------------|
| id          | string                            | Identificador único            | PK, AUTO         |
| nombre      | string                            | Nombre completo del usuario    | NOT NULL         |
| email       | string                            | Correo electrónico             | NOT NULL, UNIQUE |
| password    | string                            | Contraseña (encriptada)        | NOT NULL         |
| rol         | "administrador"\|"guia"\|"turista"| Tipo de usuario                | NOT NULL         |

**Relaciones**:
- Un usuario puede crear/gestionar **múltiples localidades** (1:N)
- Un usuario puede realizar **múltiples reservas** (1:N)
- Un usuario con rol "administrador" puede gestionar **múltiples guías** (1:N)

---

### 2️⃣ **LOCALIDAD** (LocalidadData)
**Tabla**: `ecorutas_localidades` (localStorage)

| Atributo            | Tipo                              | Descripción                           |
|---------------------|-----------------------------------|---------------------------------------|
| id                  | string                            | Identificador único (PK)              |
| nombre              | string                            | Nombre de la localidad                |
| pais                | string                            | País                                  |
| provincia           | string                            | Provincia/Estado                      |
| ciudad              | string                            | Ciudad                                |
| tipo                | string                            | Tipo de localidad                     |
| categoria           | string                            | Categoría turística                   |
| descripcion         | string                            | Descripción completa                  |
| descripcionCorta    | string                            | Resumen breve                         |
| accesibilidad       | string                            | Información de accesibilidad          |
| ubicacion           | string                            | Ubicación detallada                   |
| coordenadas         | string                            | Coordenadas GPS                       |
| altitud             | string                            | Altitud sobre nivel del mar           |
| clima               | string                            | Información climática                 |
| infraestructura     | string                            | Infraestructura disponible            |
| serviciosBasicos    | string                            | Servicios básicos                     |
| serviciosTuristicos | string                            | Servicios turísticos                  |
| capacidadMaxima     | string                            | Capacidad máxima de visitantes        |
| temporadaAlta       | string                            | Temporada alta                        |
| temporadaBaja       | string                            | Temporada baja                        |
| seguridad           | string                            | Medidas de seguridad                  |
| medicinaEmergencia  | string                            | Medicina y emergencias                |
| comunicaciones      | string                            | Sistemas de comunicación              |
| reportes            | string                            | Reportes y estadísticas               |
| certificaciones     | string                            | Certificaciones obtenidas             |
| tarifas             | string                            | Estructura de tarifas                 |
| idiomas             | string[]                          | Idiomas disponibles                   |
| contactoEmergencia  | string                            | Contacto de emergencia                |
| sitioWeb            | string                            | Sitio web oficial                     |
| redesSociales       | string                            | Redes sociales                        |
| **createdAt**       | string (ISO Date)                 | Fecha de creación                     |
| **updatedAt**       | string (ISO Date)                 | Fecha de última actualización         |
| **createdBy**       | string (FK → Usuario.id)          | Usuario creador                       |
| **status**          | "draft"\|"published"\|"archived"  | Estado de publicación                 |

**Relaciones**:
- Una localidad pertenece a **un usuario administrador** (N:1)
- Una localidad tiene **múltiples guías** (1:N)
- Una localidad tiene **múltiples entradas de historial** (1:N)
- Una localidad tiene **múltiples rutas** (1:N)

---

### 3️⃣ **GUÍA** (Guia)
**Tabla**: `localidad:{localidadId}:guias` (localStorage)

| Atributo     | Tipo              | Descripción                    |
|--------------|-------------------|--------------------------------|
| id           | string            | Identificador único (PK)       |
| nombre       | string            | Nombre del guía                |
| telefono     | string (opcional) | Número de teléfono             |
| idioma       | string (opcional) | Idiomas que habla              |
| experiencia  | number (opcional) | Años de experiencia            |
| notas        | string (opcional) | Notas adicionales              |
| activo       | boolean           | Estado activo/inactivo         |
| createdAt    | string            | Fecha de creación              |
| updatedAt    | string            | Fecha de actualización         |
| **FK localidadId** | string      | Localidad asociada             |

**Relaciones**:
- Un guía pertenece a **una localidad** (N:1)
- Un guía puede tener **múltiples horarios** (1:N)

---

### 4️⃣ **HISTORIAL** (HistEntry)
**Tabla**: `localidad:{localidadId}:history` (localStorage)

| Atributo  | Tipo                | Descripción                        |
|-----------|---------------------|------------------------------------|
| ts        | string (ISO Date)   | Timestamp del cambio (PK)          |
| user      | {id, name}          | Usuario que realizó el cambio      |
| action    | string              | Acción realizada                   |
| detail    | string (opcional)   | Detalles adicionales               |
| **FK localidadId** | string     | Localidad afectada                 |

**Relaciones**:
- Una entrada de historial pertenece a **una localidad** (N:1)
- Una entrada de historial es creada por **un usuario** (N:1)

---

### 5️⃣ **RESERVA** (Reservation)
**Tabla**: `reservations` (localStorage - implementación futura)

| Atributo     | Tipo           | Descripción                     |
|--------------|----------------|---------------------------------|
| id           | string         | Identificador único (PK)        |
| userId       | string (FK)    | Usuario que reserva             |
| routeId      | string (FK)    | Ruta reservada                  |
| date         | Date           | Fecha de la reserva             |
| participants | number         | Número de participantes (1-20)  |
| fullName     | string         | Nombre completo                 |
| email        | string         | Email de contacto               |
| phone        | string         | Teléfono de contacto            |
| comments     | string         | Comentarios adicionales         |
| status       | string         | Estado: pending/confirmed/...   |
| createdAt    | string         | Fecha de creación               |

**Relaciones**:
- Una reserva pertenece a **un usuario** (N:1)
- Una reserva es para **una ruta** (N:1)

---

### 6️⃣ **RUTA** (Route)
**Tabla**: `routes` (datos estáticos por ahora)

| Atributo     | Tipo        | Descripción                      |
|--------------|-------------|----------------------------------|
| id           | string      | Identificador único (PK)         |
| name         | string      | Nombre de la ruta                |
| localidadId  | string (FK) | Localidad asociada               |
| community    | string      | Comunidad                        |
| descripcion  | string      | Descripción de la ruta           |
| dificultad   | string      | Fácil/Moderado/Difícil           |
| duracion     | string      | Duración estimada                |
| precio       | number      | Precio por persona               |
| imagenes     | string[]    | URLs de imágenes                 |

**Relaciones**:
- Una ruta pertenece a **una localidad** (N:1)
- Una ruta puede tener **múltiples reservas** (1:N)

---

### 7️⃣ **HORARIOS** (Schedule)
**Tabla**: Integrado en Guía

| Atributo        | Tipo     | Descripción                    |
|-----------------|----------|--------------------------------|
| guiaId          | string   | Guía asociado (FK)             |
| horarios        | string   | Horarios de disponibilidad     |
| disponibilidad  | string   | Disponibilidad semanal         |

---

## 🔗 Relaciones del Sistema

### Cardinalidades:

1. **USUARIO ↔ LOCALIDAD**
   - `1:N` - Un administrador puede crear múltiples localidades
   - Una localidad es creada por un único administrador

2. **LOCALIDAD ↔ GUÍA**
   - `1:N` - Una localidad tiene múltiples guías
   - Un guía pertenece a una sola localidad

3. **LOCALIDAD ↔ HISTORIAL**
   - `1:N` - Una localidad tiene múltiples entradas de historial
   - Una entrada pertenece a una sola localidad

4. **USUARIO ↔ HISTORIAL**
   - `1:N` - Un usuario puede crear múltiples entradas de historial
   - Una entrada es creada por un único usuario

5. **USUARIO ↔ RESERVA**
   - `1:N` - Un usuario puede hacer múltiples reservas
   - Una reserva pertenece a un único usuario

6. **RUTA ↔ RESERVA**
   - `1:N` - Una ruta puede tener múltiples reservas
   - Una reserva es para una única ruta

7. **LOCALIDAD ↔ RUTA**
   - `1:N` - Una localidad ofrece múltiples rutas
   - Una ruta pertenece a una localidad

8. **GUÍA ↔ HORARIOS**
   - `1:N` - Un guía tiene múltiples horarios
   - Un horario pertenece a un guía

---

## 🎯 Roles y Permisos

### 👤 Roles del Sistema:

| Rol            | Descripción                          | Permisos                                    |
|----------------|--------------------------------------|---------------------------------------------|
| **Administrador** | Gestiona localidades              | CRUD Localidades, Guías, Historial          |
| **Guía**       | Guía turístico local                 | Ver asignaciones, actualizar disponibilidad |
| **Turista**    | Usuario final visitante              | Ver rutas, hacer reservas, ver perfil       |

---

## 💾 Almacenamiento

### LocalStorage Keys:

```javascript
// Usuarios y autenticación
'ecorutas-users'              // Array<User>
'ecorutas-current-user'       // User | null

// Localidades
'ecorutas_localidades'        // Array<LocalidadData>
'localidad_draft_{id}'        // LocalidadData (borrador)

// Guías (por localidad)
'localidad:{localidadId}:guias'    // Array<Guia>

// Historial (por localidad)
'localidad:{localidadId}:history'  // Array<HistEntry>

// Preferencias de usuario
'eco-language'                // 'es' | 'en'
'eco-font-size'               // FontSizeType
'eco-dark-mode'               // 'true' | 'false'
'eco-speech-enabled'          // 'true' | 'false'
'eco-color-blindness'         // ColorBlindnessType
```

---

## 📊 Diagrama de Flujo de Datos

```
┌─────────────┐
│   USUARIO   │
└──────┬──────┘
       │
       ├──► Registro/Login ──► AuthContext ──► localStorage
       │
       ├──► Crear Localidad ──► localidadStorage ──► localStorage
       │                               │
       │                               ├──► Gestionar Guías
       │                               ├──► Ver Historial
       │                               └──► Modificar Datos
       │
       ├──► Ver Rutas ──► Seleccionar ──► Hacer Reserva
       │
       └──► Configuración Accesibilidad ──► AccessibilityContext
```

---

## 🔄 Estados y Flujos

### Estado de Localidad:
- **draft** → En construcción, no visible públicamente
- **published** → Publicada y visible para turistas
- **archived** → Archivada, no activa

### Estado de Reserva:
- **pending** → Pendiente de confirmación
- **confirmed** → Confirmada por guía/admin
- **completed** → Visita completada
- **cancelled** → Cancelada

---

## 🛠️ Tecnologías de Persistencia

- **LocalStorage**: Almacenamiento principal (navegador)
- **React Context**: Estado global de la aplicación
- **React Hooks**: Gestión de estado local

---

## 📝 Notas de Implementación

1. **Escalabilidad**: El sistema actualmente usa localStorage, pero está diseñado para migrar fácilmente a una base de datos real (MongoDB, PostgreSQL, etc.)

2. **Relaciones**: Las relaciones se mantienen mediante IDs (Foreign Keys simuladas)

3. **Integridad**: Validaciones en el frontend aseguran la integridad de los datos

4. **Auditoría**: El historial registra todos los cambios importantes con timestamp y usuario

5. **Futura Migración**: La estructura está preparada para SQL o NoSQL:
   ```sql
   -- Ejemplo SQL
   CREATE TABLE usuarios (
     id VARCHAR(255) PRIMARY KEY,
     nombre VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     rol ENUM('administrador', 'guia', 'turista') NOT NULL
   );
   ```

---

**Versión**: 1.0  
**Fecha**: Diciembre 14, 2025  
**Proyecto**: EcoRutas - Sistema de Turismo Comunitario Sostenible
