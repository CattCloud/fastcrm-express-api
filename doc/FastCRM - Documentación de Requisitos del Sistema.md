## 1. Problema y Objetivo del Proyecto

### Problema que Resuelve

FastCRM resuelve la **gestión desorganizada de comunicaciones con clientes** en empresas que manejan:

- Múltiples plantillas de mensajes dispersas
- Contactos sin categorizar ni historial
- Comunicaciones sin trazabilidad
- Falta de control editorial en mensajes corporativos

### Objetivo Principal (MVP)

Crear un **sistema centralizado de gestión de relaciones con clientes (CRM)** que permita:

- Gestionar plantillas de mensajes con sistema de etiquetas
- Administrar contactos y empresas de forma estructurada
- Registrar y rastrear todas las comunicaciones
- Controlar roles y permisos de usuarios

### Resultado Esperado

- **Comunicaciones consistentes** mediante plantillas validadas
- **Trazabilidad completa** de interacciones con contactos
- **Gestión eficiente** de bases de contactos empresariales
- **Control editorial** con sistema de etiquetas sugeridas/bloqueadas

---

## 2. Usuarios y Roles

### Tipos de Usuarios Identificados

### **Administrador**

- **Quién**: Gerentes, supervisores de marketing/ventas
- **Permisos**: Acceso completo al sistema
- **Tareas principales**:
    - Gestionar todos los usuarios del sistema
    - Crear/editar/eliminar cualquier plantilla
    - Acceder a reportes globales
    - Controlar etiquetas sugeridas y bloqueadas
    - Supervisar todas las comunicaciones

### **Usuario**

- **Quién**: Ejecutivos de ventas, representantes comerciales
- **Permisos**: Gestión limitada a sus propios datos
- **Tareas principales**:
    - Crear y gestionar sus propias plantillas
    - Administrar sus contactos y empresas
    - Registrar comunicaciones
    - Ver solo sus propios registros

### **Invitado**

- **Quién**: Usuarios de prueba, demos, evaluaciones
- **Permisos**: Solo lectura y funcionalidades limitadas
- **Tareas principales**:
    - Explorar plantillas públicas
    - Probar funcionalidades básicas
    - No puede crear/modificar datos permanentes

---

## 3. Historias de Usuario

### **Para Administradores**

**HU-01**: Como administrador, quiero registrar nuevos usuarios en el sistema para controlar el acceso y asignar roles específicos.

**HU-02**: Como administrador, quiero crear plantillas de mensajes con etiquetas para estandarizar las comunicaciones corporativas.

**HU-03**: Como administrador, quiero buscar plantillas por contenido y filtros para localizar rápidamente mensajes específicos.

**HU-04**: Como administrador, quiero gestionar etiquetas sugeridas y bloqueadas para mantener consistencia editorial.

**HU-05**: Como administrador, quiero ver todas las comunicaciones del sistema para supervisar la actividad comercial.

### **Para Usuarios**

**HU-06**: Como usuario, quiero crear plantillas personalizadas con etiquetas para agilizar mis comunicaciones frecuentes.

**HU-07**: Como usuario, quiero registrar contactos asociados a empresas para organizar mi cartera de clientes.

**HU-08**: Como usuario, quiero enviar mensajes usando plantillas y registrar la comunicación para llevar historial de interacciones.

**HU-09**: Como usuario, quiero buscar mis plantillas por palabra clave para encontrar rápidamente el mensaje que necesito.

**HU-10**: Como usuario, quiero ver solo mis contactos y comunicaciones para mantener privacidad de mis clientes.

### **Para Invitados**

**HU-11**: Como invitado, quiero explorar plantillas de ejemplo para evaluar si el sistema me conviene.

---

## 4. Definición de Módulos / Funcionalidades

### **Módulos Implementados**

### **Módulo de Autenticación**

- **Funcionalidades**:
    - Registro de usuarios con validación
    - Login con encriptación bcrypt
    - Sistema de roles (admin, usuario, invitado)
    - Usuario invitado automático para demos

### **Módulo de Plantillas**

- **Funcionalidades**:
    - CRUD completo de plantillas
    - 10 tipos predefinidos (saludo, recordatorio, seguimiento, etc.)
    - Sistema de etiquetas inteligente
    - Búsqueda avanzada con filtros
    - Validación de etiquetas bloqueadas
- **Prioridad**:

### **Módulo de Contactos**

- **Funcionalidades**:
    - CRUD de contactos con validación
    - Validación de números WhatsApp
    - Prevención de duplicados por autor
    - Asociación opcional con empresas

### **Módulo de Empresas**

- **Funcionalidades**:
    - Registro de empresas con RUC único
    - Relación 1:N con contactos
    - Filtrado por autor

### **Módulo de Registro de Comunicaciones**

- **Funcionalidades**:
    - ContactLog: historial de mensajes enviados
    - Trazabilidad completa con enriquecimiento de datos
    - Asociación plantilla + contacto + timestamp

### **Módulo de Etiquetas Inteligentes**

- **Funcionalidades**:
    - SuggestedTags: etiquetas predefinidas con control editorial
    - UnlistedTags: registro automático de nuevas etiquetas
    - Sistema de promoción y bloqueo

### **Funcionalidades Futuras (Post-MVP)**

- **Módulo de Reportes**: Estadísticas de uso, plantillas más utilizadas
- **Módulo de Notificaciones**: Alertas automáticas por WhatsApp/Email
- **Módulo de Plantillas Colaborativas**: Compartir plantillas entre usuarios
- **Integración API WhatsApp**: Envío directo desde la plataforma

---

## 5. Reglas de Negocio

### **Reglas de Usuarios y Autenticación**

- **RN-01**: Solo puede existir un usuario con el mismo username (case-insensitive)
- **RN-02**: Las contraseñas deben estar encriptadas con bcrypt (saltRounds: 10)
- **RN-03**: Los usuarios invitados no requieren contraseña
- **RN-04**: Solo usuarios activos pueden crear contenido

### **Reglas de Plantillas**

- **RN-05**: Cada plantilla debe tener al menos un tipo válido de los 10 predefinidos
- **RN-06**: Las etiquetas no pueden estar duplicadas (normalización lowercase)
- **RN-07**: No se permiten etiquetas marcadas como "bloqueadas"
- **RN-08**: Las etiquetas no sugeridas se registran automáticamente en UnlistedTags
- **RN-09**: Solo el autor o un admin pueden modificar/eliminar plantillas

### **Reglas de Contactos y Empresas**

- **RN-10**: No pueden existir contactos duplicados por WhatsApp dentro del mismo autor
- **RN-11**: No pueden existir contactos duplicados por nombre dentro del mismo autor
- **RN-12**: Cada empresa debe tener un RUC único en el sistema
- **RN-13**: Los números WhatsApp deben seguir formato internacional válido
- **RN-14**: Los contactos pueden existir sin empresa asociada

### **Reglas de Comunicaciones**

- **RN-15**: Solo se pueden registrar comunicaciones con contactos existentes
- **RN-16**: Las plantillas asociadas a comunicaciones deben existir en MongoDB
- **RN-17**: Los logs de comunicación son inmutables (no se pueden editar)

---

## 6. Datos y Base de Datos (Nivel Conceptual)7

[FastCRM - Modelado de Datos ](https://www.notion.so/FastCRM-Modelado-de-Datos-26c58a8978c780bb92daf3ec5ce69862?pvs=21)

### **Entidades Principales**

### **Entidad: Autor/Usuario**

- **Atributos obligatorios**: nombre, role , estado
- **Atributos opcionales**: contraseña(requerido si no es invitado)
- **Relaciones**: 1:N con Template

### **Entidad: Template**

- **Atributos obligatorios**: tipo, contenido , etiquetas , autor
- **Atributos automáticos**: fecha de creacion , fecha de actualizacion
- **Relaciones**: N:1 con Autor

### **Entidad: Contact**

- **Atributos obligatorios**: nombre, telefono, autor
- **Atributos opcionales**: compañia
- **Relaciones**: N:1 con Company, 1:N con ContactLog
- **Restricción única**: autor + telefono

### **Entidad: Company**

- **Atributos obligatorios**: nombre, ruc, autor
- **Restricción única**: ruc
- **Relaciones**: 1:N con Contact

### **Entidad: ContactLog**

- **Atributos obligatorios**: contacto, fecha de contacto
- **Atributos opcionales**: plantillaUsada
- **Relaciones**: N:1 con Contact

### **Entidades: SuggestedTag y UnlistedTag**

- **SuggestedTag**: tag, visible, uso, bloqueada
- **UnlistedTag**: tag, normalizada, vecesDetectada, promovida

---

## 7. Requisitos No Funcionales

### **Rendimiento**

- **RNF-01**: La API debe responder en menos de 2 segundos para consultas simples
- **RNF-02**: Búsquedas con RegEx deben estar optimizadas con índices
- **RNF-03**: Soporte para hasta 1000 usuarios concurrentes

### **Seguridad**

- **RNF-07**: Contraseñas encriptadas con bcrypt (salt rounds: 10)
- **RNF-08**: Validación estricta de datos con Mongoose y Zod
- **RNF-09**: Separación de datos sensibles entre MongoDB y PostgreSQL

### **Disponibilidad**

- **RNF-10**: Sistema desplegado en Render con 99% uptime
- **RNF-11**: MongoDB Atlas y Neon PostgreSQL como servicios cloud
- **RNF-12**: Manejo de errores robusto con respuestas HTTP semánticamente correctas
