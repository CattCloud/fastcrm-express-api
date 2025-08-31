### IDEA 1
1 documento admin
1 documento invitado -> al acceder no es necesario loguearse para el uso ,estara como invitado,  pero no tendra la opcion de eliminar template de otros usuarios solo los invitados,tampoco editar nombre y contraseña,etc
multiples documento usuarios(los logueados)

| Rol       | ¿Puede crear plantilla? | ¿Puede editar plantilla ajena? | ¿Puede eliminar plantilla ajena? | ¿Puede editar su perfil? |
|-----------|--------------------------|-------------------------------|----------------------------------|---------------------------|
| `admin`   | ✅ Sí                    | ✅ Sí                         | ✅ Sí                            | ✅ Sí                     |
| `usuario` | ✅ Sí                    | ❌ Solo propias               | ❌ Solo propias                  | ✅ Sí                     |
| `invitado`| ✅ Sí                    | ❌ No                         | ❌ No                            | ❌ No                     |

- Al crear una plantilla, valida que el author exista y esté isActive: true.
- Si el usuario es invitado, permite crear pero restringe edición/eliminación.
- Usa usernameLower para búsquedas insensibles a mayúsculas.
- Incrementa accessCount en cada login exitoso (gamificación, métricas).
- Encripta password en el servicio antes de guardar (bcrypt.hash(...)).
