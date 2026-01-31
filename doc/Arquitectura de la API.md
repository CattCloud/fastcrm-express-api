# Base URL

- **Desarrollo**: `http://localhost:3000`
- **Producción**: `https://fastcrm-express-api-g728.onrender.com`

### Estructura de Endpoints

```
/api/
├── authors/          # Gestión de usuarios
├── templates/        # Plantillas de mensajes
├── contacts/         # Gestión de contactos
├── companies/        # Gestión de empresas
├── contact-logs/     # Registro de comunicaciones
└── tags/            # Sistema de etiquetas

```

---

## Módulo: Authors (Usuarios)

### **POST /api/authors** - Crear Usuario

Registra un nuevo usuario en el sistema.

### Request

```json
{
  "username": "maria_sales",
  "password": "SecurePass123",
  "role": "usuario"
}

```

### Validaciones

- `username`: Requerido, único (case-insensitive)
- `password`: Requerido para roles "admin" y "usuario"
- `role`: Opcional, default "usuario", valores: ["admin", "usuario", "invitado"]

### Response Success (201)

```json
{
  "message": "Autor creado correctamente"
}

```

### Response Error (400)

```json
{
  "estado": "fail",
  "mensaje": "El nombre de usuario ya está en uso",
  "tipo": "author"
}

```

---

### **POST /api/authors/login** - Autenticación

Valida credenciales de usuario.

### Request

```json
{
  "username": "maria_sales",
  "password": "SecurePass123"
}

```

### Response Success (200)

```json
{
  "autor": {
    "_id": "65f1234567890abcdef12345",
    "username": "maria_sales",
    "usernameLower": "maria_sales",
    "role": "usuario",
    "accessCount": 3,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:22:00.000Z"
  }
}

```

### Response Error (404)

```json
{
  "estado": "fail",
  "mensaje": "Usuario no encontrado",
  "tipo": "username"
}

```

---

### **GET /api/authors/guest** - Usuario Invitado

Obtiene el usuario invitado predeterminado del sistema.

### Response Success (200)

```json
{
  "autor": {
    "_id": "65f0000000000000000000001",
    "username": "Invitado",
    "usernameLower": "invitado",
    "role": "invitado",
    "accessCount": 150,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-22T16:45:00.000Z"
  }
}

```

---

### **GET /api/authors/:id** - Obtener Usuario por ID

Recupera información de un usuario específico.

### Response Success (200)

```json
{
  "autor": {
    "_id": "65f1234567890abcdef12345",
    "username": "maria_sales",
    "usernameLower": "maria_sales",
    "role": "usuario",
    "accessCount": 3,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:22:00.000Z"
  }
}

```

---

## Módulo: Templates (Plantillas)

### **POST /api/templates** - Crear Plantilla

Crea una nueva plantilla de mensaje.

### Request

```json
{
  "type": "saludo",
  "content": "Hola {nombre}, gracias por contactarnos. ¿En qué podemos ayudarte?",
  "labels": ["bienvenida", "formal", "atencion al cliente"],
  "author": "65f1234567890abcdef12345"
}

```

### Validaciones

- `type`: Requerido, debe ser uno de los 10 tipos válidos
- `content`: Requerido, mínimo 1 caracter
- `labels`: Array de strings, sin duplicados, normalizado a lowercase
- `author`: ObjectId válido existente en la BD

### Response Success (201)

```json
{
  "_id": "65f9876543210fedcba09876",
  "type": "saludo",
  "content": "Hola {nombre}, gracias por contactarnos. ¿En qué podemos ayudarte?",
  "labels": ["bienvenida", "formal", "atencion al cliente"],
  "author": {
    "_id": "65f1234567890abcdef12345",
    "username": "maria_sales",
    "role": "usuario",
    "isActive": true
  },
  "createdAt": "2024-01-22T10:30:00.000Z",
  "updatedAt": "2024-01-22T10:30:00.000Z"
}

```

---

### **GET /api/templates** - Obtener Todas las Plantillas

Lista todas las plantillas del sistema con información del autor.

### Response Success (200)

```json
[
  {
    "_id": "65f9876543210fedcba09876",
    "type": "saludo",
    "content": "Hola {nombre}, gracias por contactarnos...",
    "labels": ["bienvenida", "formal"],
    "author": {
      "_id": "65f1234567890abcdef12345",
      "username": "maria_sales",
      "role": "usuario"
    },
    "createdAt": "2024-01-22T10:30:00.000Z",
    "updatedAt": "2024-01-22T10:30:00.000Z"
  }
]

```

---

### **GET /api/templates/rol/:role** - Plantillas por Rol

Obtiene plantillas filtradas por el rol del autor.

### Parámetros

- `role`: String - "admin", "usuario", o "invitado"

### Response Success (200)

```json
[
  {
    "_id": "65f9876543210fedcba09876",
    "type": "promocion",
    "content": "¡Oferta especial solo para ti! 50% de descuento...",
    "labels": ["promocion", "descuento", "marketing"],
    "author": {
      "_id": "65f1111111111111111111111",
      "username": "admin_marketing",
      "role": "admin"
    },
    "createdAt": "2024-01-20T15:00:00.000Z"
  }
]

```

---

### **GET /api/templates/author/:id** - Plantillas por Autor

Obtiene todas las plantillas de un autor específico.

### Response Success (200)

```json
[
  {
    "_id": "65f9876543210fedcba09876",
    "type": "seguimiento",
    "content": "Hola {nombre}, quería hacer seguimiento a nuestra conversación...",
    "labels": ["seguimiento", "personal"],
    "author": {
      "_id": "65f1234567890abcdef12345",
      "username": "maria_sales",
      "role": "usuario"
    },
    "createdAt": "2024-01-22T10:30:00.000Z"
  }
]

```

---

### **GET /api/templates/search** - Búsqueda Avanzada

Busca plantillas por palabra clave con filtros opcionales.

### Query Parameters

- `q`: String (requerido) - Palabra clave de búsqueda (mín. 2 caracteres)
- `id`: String (requerido) - ID del autor
- `type`: String (opcional) - Tipo de plantilla para filtrar

### Ejemplo Request

```
GET /api/templates/search?q=saludo&id=65f1234567890abcdef12345&type=bienvenida

```

### Response Success (200)

```json
[
  {
    "_id": "65f9876543210fedcba09876",
    "type": "saludo",
    "content": "Saludo cordial para nuevos clientes...",
    "labels": ["bienvenida", "formal"],
    "author": {
      "_id": "65f1234567890abcdef12345",
      "username": "maria_sales",
      "role": "usuario"
    }
  }
]

```

---

### **GET /api/templates/search/role** - Búsqueda por Rol

Busca plantillas por palabra clave filtradas por rol del autor.

### Query Parameters

- `q`: String (requerido) - Palabra clave
- `role`: String (requerido) - Rol del autor
- `type`: String (opcional) - Tipo de plantilla

---

### **GET /api/templates/search/admin** - Búsqueda Global Admin

Búsqueda global sin restricciones de autor (solo admins).

### Query Parameters

- `q`: String (requerido) - Palabra clave
- `type`: String (opcional) - Tipo de plantilla

---

### **PUT /api/templates/:id** - Actualizar Plantilla

Modifica una plantilla existente.

### Request

```json
{
  "type": "confirmación",
  "content": "Contenido actualizado de la plantilla...",
  "labels": ["confirmacion", "actualizada"]
}

```

### Response Success (200)

```json
{
  "mensaje": "Plantilla actualizada correctamente",
  "template": {
    "_id": "65f9876543210fedcba09876",
    "type": "confirmación",
    "content": "Contenido actualizado de la plantilla...",
    "labels": ["confirmacion", "actualizada"],
    "author": {
      "_id": "65f1234567890abcdef12345",
      "username": "maria_sales"
    },
    "updatedAt": "2024-01-22T16:45:00.000Z"
  }
}

```

---

### **DELETE /api/templates/:id** - Eliminar Plantilla

Elimina una plantilla del sistema.

### Response Success (200)

```json
{
  "mensaje": "Plantilla eliminada correctamente"
}

```

---

## Módulo: Contacts (Contactos)

### **POST /api/contacts** - Crear Contacto

Registra un nuevo contacto en el sistema.

### Request

```json
{
  "name": "Carlos Mendoza",
  "whatsapp": "+51987654321",
  "authorId": "65f1234567890abcdef12345",
  "companyId": 1
}

```

### Validaciones

- `name`: String, 1-100 caracteres
- `whatsapp`: Formato internacional válido
- `authorId`: ObjectId de 24 caracteres (MongoDB)
- `companyId`: Número opcional, debe existir en BD

### Response Success (201)

```json
{
  "message": "Contacto creado correctamente",
  "contact": {
    "id": 5,
    "name": "Carlos Mendoza",
    "whatsapp": "+51987654321",
    "authorId": "65f1234567890abcdef12345",
    "companyId": 1,
    "createdAt": "2024-01-22T16:30:00.000Z",
    "updatedAt": "2024-01-22T16:30:00.000Z"
  }
}

```

### Response Error (400)

```json
{
  "estado": "fail",
  "mensaje": "Ya tiene un contacto registrado con este número de WhatsApp",
  "tipo": "validation"
}

```

---

### **GET /api/contacts** - Obtener Todos los Contactos

Lista todos los contactos con información enriquecida.

### Response Success (200)

```json
{
  "contacts": [
    {
      "id": 5,
      "name": "Carlos Mendoza",
      "whatsapp": "+51987654321",
      "authorId": "65f1234567890abcdef12345",
      "companyId": 1,
      "authorName": "maria_sales",
      "companyName": "Tech Solutions SAC",
      "createdAt": "2024-01-22T16:30:00.000Z",
      "updatedAt": "2024-01-22T16:30:00.000Z"
    }
  ],
  "total": 1
}

```

---

### **GET /api/contacts/author/:id** - Contactos por Autor

Obtiene todos los contactos de un autor específico.

### Response Success (200)

```json
{
  "contacts": [
    {
      "id": 5,
      "name": "Carlos Mendoza",
      "whatsapp": "+51987654321",
      "authorId": "65f1234567890abcdef12345",
      "companyId": 1,
      "authorName": "maria_sales",
      "companyName": "Tech Solutions SAC",
      "createdAt": "2024-01-22T16:30:00.000Z"
    }
  ],
  "total": 1
}

```

---

### **DELETE /api/contacts/:id** - Eliminar Contacto

Elimina un contacto del sistema.

### Response Success (200)

```json
{
  "message": "Contacto eliminado correctamente"
}

```

---

## Módulo: Companies (Empresas)

### **POST /api/companies** - Crear Empresa

Registra una nueva empresa en el sistema.

### Request

```json
{
  "name": "Innovate Corp SAC",
  "ruc": "20567890123",
  "authorId": "65f1234567890abcdef12345"
}

```

### Validaciones

- `name`: 2-100 caracteres
- `ruc`: Exactamente 11 dígitos, único en el sistema
- `authorId`: ObjectId de 24 caracteres válido

### Response Success (201)

```json
{
  "message": "Empresa creada correctamente",
  "company": {
    "id": 3,
    "name": "Innovate Corp SAC",
    "ruc": "20567890123",
    "authorId": "65f1234567890abcdef12345",
    "createdAt": "2024-01-22T17:00:00.000Z"
  }
}

```

---

### **GET /api/companies** - Obtener Todas las Empresas

Lista todas las empresas con sus contactos asociados.

### Response Success (200)

```json
{
  "companies": [
    {
      "id": 3,
      "name": "Innovate Corp SAC",
      "ruc": "20567890123",
      "authorId": "65f1234567890abcdef12345",
      "createdAt": "2024-01-22T17:00:00.000Z",
      "contacts": [
        {
          "id": 6,
          "name": "Ana Pérez",
          "whatsapp": "+51912345678",
          "authorId": "65f1234567890abcdef12345"
        }
      ]
    }
  ],
  "total": 1
}

```

---

### **GET /api/companies/author/:id** - Empresas por Autor

Obtiene empresas donde el autor tiene al menos un contacto.

### Response Success (200)

```json
{
  "companies": [
    {
      "id": 3,
      "name": "Innovate Corp SAC",
      "ruc": "20567890123",
      "authorId": "65f1234567890abcdef12345",
      "contacts": [
        {
          "id": 6,
          "name": "Ana Pérez",
          "whatsapp": "+51912345678",
          "authorId": "65f1234567890abcdef12345"
        }
      ]
    }
  ],
  "total": 1
}

```

---

### **DELETE /api/companies/:id** - Eliminar Empresa

Elimina una empresa del sistema.

### Response Success (200)

```json
{
  "message": "Empresa eliminada correctamente"
}

```

---

## Módulo: Contact Logs (Registro de Comunicaciones)

### **POST /api/contact-logs** - Crear Registro de Comunicación

Registra una nueva comunicación enviada.

### Request

```json
{
  "contactId": 5,
  "templateId": "65f9876543210fedcba09876"
}

```

### Validaciones

- `contactId`: Número entero, debe existir en PostgreSQL
- `templateId`: String opcional, si se envía debe existir en MongoDB

### Response Success (201)

```json
{
  "mensaje": "Log de contacto creado correctamente",
  "log": {
    "id": 10,
    "contactId": 5,
    "templateId": "65f9876543210fedcba09876",
    "createdAt": "2024-01-22T18:00:00.000Z",
    "contact": {
      "id": 5,
      "name": "Carlos Mendoza",
      "whatsapp": "+51987654321",
      "authorId": "65f1234567890abcdef12345"
    },
    "template": {
      "id": "65f9876543210fedcba09876",
      "type": "saludo",
      "content": "Hola {nombre}, gracias por contactarnos...",
      "labels": ["bienvenida", "formal"],
      "createdAt": "2024-01-22T10:30:00.000Z",
      "updatedAt": "2024-01-22T10:30:00.000Z"
    }
  }
}

```

---

### **GET /api/contact-logs** - Obtener Todos los Registros

Lista todos los registros de comunicaciones con datos enriquecidos.

### Response Success (200)

```json
[
  {
    "id": 10,
    "contactId": 5,
    "templateId": "65f9876543210fedcba09876",
    "createdAt": "2024-01-22T18:00:00.000Z",
    "contact": {
      "id": 5,
      "name": "Carlos Mendoza",
      "whatsapp": "+51987654321",
      "authorId": "65f1234567890abcdef12345"
    },
    "template": {
      "id": "65f9876543210fedcba09876",
      "type": "saludo",
      "content": "Hola {nombre}, gracias por contactarnos...",
      "labels": ["bienvenida", "formal"]
    }
  }
]

```

---

### **GET /api/contact-logs/author/:id** - Registros por Autor

Obtiene todas las comunicaciones realizadas por un autor específico.

### Response Success (200)

```json
[
  {
    "id": 10,
    "contactId": 5,
    "templateId": "65f9876543210fedcba09876",
    "createdAt": "2024-01-22T18:00:00.000Z",
    "contact": {
      "id": 5,
      "name": "Carlos Mendoza",
      "whatsapp": "+51987654321",
      "authorId": "65f1234567890abcdef12345"
    },
    "template": {
      "id": "65f9876543210fedcba09876",
      "type": "saludo",
      "content": "Hola {nombre}, gracias por contactarnos...",
      "labels": ["bienvenida", "formal"]
    }
  }
]

```

---

## Módulo: Tags (Etiquetas)

### **POST /api/tags/suggested** - Crear Etiqueta Sugerida

Crea una nueva etiqueta en el sistema de sugerencias (solo admins).

### Request

```json
{
  "tag": "nuevo-producto",
  "bloqueada": false
}

```

### Response Success (201)

```json
{
  "message": "Etiqueta sugerida creada"
}

```

---

### **POST /api/tags/unlisted** - Registrar Etiqueta No Listada

Registra una etiqueta detectada automáticamente que no está en sugeridas.

### Request

```json
{
  "tag": "Categoria-Especial"
}

```

### Response Success (201)

```json
{
  "message": "Etiqueta no listada registrada"
}

```

---

## Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "estado": "fail|error",
  "mensaje": "Descripción del error",
  "tipo": "categoria_del_error"
}

```

### Tipos de Error Implementados

- `validation`: Errores de validación de datos
- `author`: Errores relacionados con usuarios
- `template`: Errores de plantillas
- `contact`: Errores de contactos
- `company`: Errores de empresas
- `duplicado`: Conflictos de unicidad
- `conexion`: Problemas de base de datos
