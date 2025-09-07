# FastCRM Express API

Un sistema de gestión de relaciones con clientes (CRM) completo desarrollado con Node.js, Express, MongoDB y PostgreSQL. FastCRM permite gestionar plantillas de mensajes, contactos, empresas y registros de comunicación de manera eficiente.

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL (MongoDB Atlas)
- **PostgreSQL** - Base de datos relacional (Neon)
- **Mongoose** - ODM para MongoDB
- **Prisma** - ORM moderno para PostgreSQL
- **bcrypt** - Hashing de contraseñas
- **Zod** - Validación de esquemas
- **CORS** - Manejo de recursos de origen cruzado

### Bases de Datos
- **MongoDB Atlas**: Almacena plantillas de mensajes, autores y sistema de etiquetas
- **Neon (PostgreSQL)**: Gestiona contactos, empresas y logs de contacto

## Arquitectura del Proyecto

```
fastcrm-express-api/
├── controllers/          # Controladores (lógica de endpoints)
├── models/              # Modelos de MongoDB (Mongoose)
├── services/            # Lógica de negocio
├── routes/              # Definición de rutas
├── middlewares/         # Middlewares personalizados
├── utils/               # Utilidades y validaciones
├── config/              # Configuración de bases de datos
├── prisma/              # Esquema de PostgreSQL
└── index.js             # Punto de entrada
```

## 🛠Instalación Local

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Cuenta en MongoDB Atlas
- Cuenta en Neon (PostgreSQL)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd fastcrm-express-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` con:
```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/fastcrm

# PostgreSQL (Neon)
DATABASE_URL=postgresql://usuario:password@host/database

# Servidor
PORT=3000
```

4. **Configurar base de datos PostgreSQL**
```bash
npx prisma generate
npx prisma db push
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🎯 Funcionalidades Principales

### 1. Sistema de Autores/Usuarios
- **Registro y autenticación** de usuarios
- **Roles**: admin, usuario, invitado
- **Sistema de invitados** para pruebas sin registro
- **Hashing seguro** de contraseñas con bcrypt

### 2. Gestión de Plantillas (MongoDB)
- **CRUD completo** de plantillas de mensajes
- **10 tipos predefinidos**: bienvenida, recordatorio, seguimiento, etc.
- **Sistema de etiquetas inteligente** con sugerencias
- **Búsqueda avanzada** por contenido y filtros
- **Validación de etiquetas** bloqueadas/permitidas

### 3. Gestión de Contactos (PostgreSQL)
- **CRUD de contactos** con validación de duplicados
- **Asociación con empresas** (relación 1:N)
- **Validación de números** WhatsApp
- **Filtrado por autor**

### 4. Gestión de Empresas (PostgreSQL)
- **Registro de empresas** con RUC único
- **Relación 1:N** con contactos
- **Consultas anidadas** con Prisma

### 5. Registro de Comunicaciones
- **ContactLog**: historial de mensajes enviados
- **Trazabilidad completa** de comunicaciones
- **Enriquecimiento de datos** con información de plantillas

## Funcionalidades Extra Implementadas

### Sistema de Etiquetas Avanzado
- **Colección SuggestedTags**: etiquetas predefinidas con control editorial
- **Colección UnlistedTags**: registro automático de etiquetas no sugeridas
- **Validación en tiempo real** de etiquetas bloqueadas
- **Normalización automática** (lowercase, sin duplicados)

### Búsquedas Optimizadas
- **Índices en MongoDB** para campos de búsqueda frecuente
- **Búsqueda por palabra clave** con RegEx
- **Filtros combinados**: por autor, rol, tipo y contenido
- **Paginación preparada** para grandes volúmenes

### Manejo de Errores Robusto
- **Middleware de transformación** de errores Mongoose
- **Clase AppError personalizada** con tipos específicos
- **Validación Zod** para PostgreSQL
- **Respuestas HTTP consistentes**

### Enriquecimiento de Datos
- **Populate automático** de relaciones MongoDB
- **Agregación de datos** entre MongoDB y PostgreSQL
- **Información contextual** en respuestas (nombres de autor, empresa)

## Decisiones Técnicas Clave

### Arquitectura Híbrida
**MongoDB + PostgreSQL**: Combinación estratégica donde MongoDB maneja datos flexibles (plantillas, etiquetas) y PostgreSQL gestiona datos relacionales estructurados (contactos, empresas).

### Patrón MVC Estricto
- **Controladores**: Solo manejan req/res
- **Servicios**: Contienen toda la lógica de negocio
- **Modelos**: Definición de esquemas y validaciones

### Validación en Capas
- **Mongoose**: Validación de esquemas NoSQL
- **Zod**: Validación tipada para PostgreSQL
- **Validaciones personalizadas**: Lógica de negocio específica

### Sistema de Etiquetas Inteligente
Implementación de un sistema editorial que:
- Sugiere etiquetas consistentes
- Registra automáticamente etiquetas nuevas
- Permite control granular (bloqueo/promoción)

### Manejo de Errores Centralizado
Transformación automática de errores de base de datos a respuestas HTTP semánticamente correctas.

## API Endpoints

### Autores
```
POST   /api/authors          # Crear autor
POST   /api/authors/login    # Login
GET    /api/authors/guest    # Obtener usuario invitado
GET    /api/authors/:id      # Obtener autor por ID
```

### Plantillas
```
POST   /api/templates                    # Crear plantilla
GET    /api/templates                    # Obtener todas
GET    /api/templates/rol/:role          # Por rol
GET    /api/templates/author/:id         # Por autor
GET    /api/templates/search             # Búsqueda avanzada
PUT    /api/templates/:id               # Actualizar
DELETE /api/templates/:id               # Eliminar
```

### Contactos
```
POST   /api/contacts             # Crear contacto
GET    /api/contacts             # Obtener todos
GET    /api/contacts/author/:id  # Por autor
DELETE /api/contacts/:id         # Eliminar
```

### Empresas
```
POST   /api/companies             # Crear empresa
GET    /api/companies             # Obtener todas
GET    /api/companies/author/:id  # Por autor
DELETE /api/companies/:id         # Eliminar
```

### Contact Logs
```
POST   /api/contact-logs             # Crear log
GET    /api/contact-logs             # Obtener todos
GET    /api/contact-logs/author/:id  # Por autor
```

## Deploy

### Backend API
- **Plataforma**: [Render]
- **URL**: [[Incluir URL del deploy](https://fastcrm-express-api-g728.onrender.com/)]
- **Base de datos MongoDB**: MongoDB Atlas
- **Base de datos PostgreSQL**: Neon

### Variables de Entorno en Producción
Asegúrate de configurar todas las variables de entorno en tu plataforma de deploy.

## Métricas y Rendimiento

### Optimizaciones Implementadas
- **Índices MongoDB**: En campos `content` y `type`
- **Consultas eficientes**: Uso de populate() selectivo
- **Validación temprana**: Errores detectados antes del procesamiento
- **Conexiones optimizadas**: Pool de conexiones para ambas BD
