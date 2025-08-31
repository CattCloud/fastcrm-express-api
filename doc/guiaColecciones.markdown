## Coleccion `Autor`

| Campo         | Tipo         | Propósito                                                                 |
|---------------|--------------|---------------------------------------------------------------------------|
| `_id`         | `ObjectId`   | Identificador único generado por MongoDB                                 |
| `username`    | `String`     | Nombre de usuario visible en el sistema                                  |
| `usernameLower` | `String`   | Versión normalizada para búsquedas (`lowercase`)                         |
| `password`    | `String`     | Contraseña encriptada (usa bcrypt)                                       |
| `accessCount` | `Number`     | Número de accesos al sistema (útil para métricas o gamificación)         |
| `role`        | `String`     | `"admin"`, `"invitado"` `"usuario"`— para control de permisos,por defecto `"invitado"`            |
| `isActive`    | `Boolean`    | Control de estado del usuario (desactivado, suspendido, etc.)            |
| `createdAt`   | `Date`       | Fecha de creación (activado con `timestamps: true`)                      |
| `updatedAt`   | `Date`       | Fecha de última modificación                                             |

---


## Coleccion `SuggestedTags` (o `EtiquetaSugerida`)
| Campo             | Qué representa                                                                 |
|---------------------|-----------------------------------------------------------------------------------|
| `_id`               | Identificador único generado por MongoDB para esta etiqueta.                     |
| `tag`               | El texto de la etiqueta sugerida, por ejemplo `"urgente"`.                       |
| `visible`           | Si debe mostrarse en el autocompletado del frontend (`true`) o no (`false`).     |
| `fechaCreacion`     | Fecha en que se registró esta etiqueta en el sistema.                            |
| `uso`               | Cuántas veces ha sido usada en plantillas (métrica para curación).               |
| `bloqueada`         | Limitar su uso sin eliminar, si está prohibida para uso futuro (`true`) o sigue disponible (`false`).         |

--- 

## Coleccion `UnlistedTags` (o `EtiquetasNoSugeridas`)

| Campo              | Propósito editorial |
|--------------------|---------------------|
| `tag`              | Etiqueta original usada por el autor |
| `fechaDeteccion`   | Cuándo fue detectada por el sistema |
| `vecesDetectada`   | Cuántas veces ha aparecido en plantillas |
| `normalizada`      | Versión estandarizada (`lowercase`, sin espacios) |
| `promovida`        | Si ya fue revisada y agregada a `SuggestedTags` |