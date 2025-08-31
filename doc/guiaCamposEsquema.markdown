# Coleccion Template
## 1. Campo `type`

### Propósito
Define la **categoría funcional** de la plantilla (ej. bienvenida, recordatorio, despedida). Permite filtrar, clasificar y aplicar lógica condicional en el sistema.

### Tipo de dato
`String`

### Restricciones
- `required: true`
- `enum`: conjunto predefinido de valores válidos
- `default`: opcional, puede ser `"bienvenida"` u otro valor común

### Lista de valores permitidos
[
  "bienvenida",
  "recordatorio",
  "seguimiento",
  "despedida",
  "felicitación",
  "agradecimiento",
  "promoción",
  "urgente",
  "confirmación",
  "reprogramación"
]

---

## 2. Campo `content`

### Propósito
Contiene el **texto principal** de la plantilla. Puede incluir variables, emojis, HTML o instrucciones para el sistema.

### Tipo de dato
`String`

### Restricciones
- `required: true`
- Sin límite de caracteres por ahora

### Importante
Permite variables (ej. `{{nombre}}`), considera validaciones para evitar errores de sintaxis. También puedes agregar sanitización si se permite HTML.

---

## 3. Campo `labels`

### Propósito
Clasifica la plantilla con **etiquetas temáticas o funcionales**. Mejora la búsqueda, organización y sugerencias.

### Tipo de dato
`Array de String`

### Restricciones
- `default: []`
- Validación de array para evitar duplicados
- Sugerencias desde conjunto predefinido (`etiquetasSugeridas`)
- `required`

### Importante
Permite etiquetas libres pero guía con sugerencias. 
Normaliza mayúsculas/minúsculas y evita duplicados. 
Puedes marcar etiquetas no sugeridas si deseas control progresivo.

**Ejemplo**
```js
const etiquetasSugeridas = ['bienvenida', 'recordatorio', 'urgente', 'despedida', 'felicitación'];
```
Ahora, en el frontend:
- El usuario empieza a escribir: "bienve..." → el sistema sugiere "bienvenida".
- Escribe "urgente" → se acepta sin problema.
- Escribe "felicitacion" (sin tilde) → el sistema sugiere "felicitación".
- Escribe "promo" → el sistema lo permite, pero marca como etiqueta no sugerida.



### Historia de Usuario — Etiquetas libres con sugerencias

> **HU: Etiquetado inteligente de plantillas**

> Como usuario del CRM, quiero poder agregar etiquetas libres a mis plantillas, pero con sugerencias inteligentes que me ayuden a mantener consistencia.  
> Quiero que el sistema normalice mayúsculas/minúsculas, evite duplicados y me indique si una etiqueta no es parte del conjunto sugerido, para decidir si la uso o no.

*Criterios de aceptación*:
- Autocompletado basado en `etiquetasSugeridas`
- Detección de duplicados en tiempo real
- Normalización automática (`"Urgente"` → `"urgente"`)

### Como guardar las etiquetas sugeridas
Uso de la coleccion `SuggestedTags` (o `EtiquetaSugerida`)
Cada documento representa una etiqueta sugerida, con metadatos útiles para control editorial:

```js
{
  _id: ObjectId("..."),
  tag: "urgente",
  visible: true,
  creadaPor: ObjectId("userId"),
  uso: 42, // veces usada en plantillas
  bloqueada: false // si se quiere evitar su uso futuro
}
```

| Campo             | Qué representa                                                                 |
|---------------------|-----------------------------------------------------------------------------------|
| `_id`               | Identificador único generado por MongoDB para esta etiqueta.                     |
| `tag`               | El texto de la etiqueta sugerida, por ejemplo `"urgente"`.                       |
| `visible`           | Si debe mostrarse en el autocompletado del frontend (`true`) o no (`false`).     |
| `fechaCreacion`     | Fecha en que se registró esta etiqueta en el sistema.                            |
| `uso`               | Cuántas veces ha sido usada en plantillas (métrica para curación).               |
| `bloqueada`         | Limitar su uso sin eliminar, si está prohibida para uso futuro (`true`) o sigue disponible (`false`).         |

### Propuesta: Colección `UnlistedTags` (o `EtiquetasNoSugeridas`)
Registrar automáticamente las etiquetas que los autores usan en sus plantillas pero que **no están en el conjunto sugerido**, para facilitar su revisión editorial.
```js
{
  _id: ObjectId("..."),
  tag: "urgentez",
  fechaDeteccion: ISODate("2025-08-28T12:51:00Z"),
  vecesDetectada: 1,
  normalizada: "urgentez",
  promovida: false
}
```

| Campo              | Propósito editorial |
|--------------------|---------------------|
| `tag`              | Etiqueta original usada por el autor |
| `fechaDeteccion`   | Cuándo fue detectada por el sistema |
| `vecesDetectada`   | Cuántas veces ha aparecido en plantillas |
| `normalizada`      | Versión estandarizada (`lowercase`, sin espacios) |
| `promovida`        | Si ya fue revisada y agregada a `SuggestedTags` |

1. **Al crear una plantilla**, el backend revisa cada `label`.
2. Si la etiqueta **no existe en `SuggestedTags`**, se busca en `UnlistedTags`.
   - Si existe, se incrementa `vecesDetectada`.
   - Si no existe, se crea un nuevo documento.
3. Un admin puede revisar esta colección periódicamente y decidir si alguna etiqueta debe ser promovida.

---

## 4. Campo `author`

### Propósito
Identifica al **usuario que creó la plantilla**. Aporta trazabilidad, control de edición y seguridad en operaciones sensibles.

### Tipo de dato
`ObjectId` (referencia a colección `User`)

### Restricciones
- `required: true`
- Validación de existencia en `User`
- Protege contra acciones no autorizadas

### Recomendación editorial
Implementa login básico para obtener el autor. Guarda el `ObjectId` y usa `populate()` para mostrar nombre. Si el autor se elimina, decide si conservar la plantilla o marcarla como huérfana.

### Historia de Usuario — Autor con login básico
- Por defecto un usuario ingreso como anonimo(invitado) pero tiene la opcion de login.

> **HU: Identidad editorial del autor**

> Como usuario del CRM, quiero poder iniciar sesión con un nombre y contraseña para que las plantillas que cree estén asociadas a mi identidad.

> Quiero que el sistema solo permita editar o eliminar plantillas si soy el autor o tengo permisos especiales, y que mi nombre aparezca en cada plantilla que creo.

🎯 *Criterios de aceptación*:
- Formulario de login básico
- Asociación del `author` como `ObjectId` a la colección `User`
- Validación de permisos antes de editar/eliminar
- Visualización del nombre del autor en la interfaz


---

## 5. Campo `createdAt` y `updatedAt`

### Propósito
Registra la **fecha de creación y modificación**. Útil para auditoría, orden cronológico y control de versiones.

### Tipo de dato
`Date` (generado automáticamente)

### Restricciones
- Activado con `timestamps: true`
- No requiere configuración adicional

### Uso
Puedes usar `createdAt` para ordenar plantillas, mostrar historial o aplicar filtros. Si escalas el sistema, considera agregar `deletedAt` o `isActive` para control de estado.

