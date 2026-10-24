Gestion de Compras
==================

Proceso `compras.solicitud` (jBPM 7.74.1):

1. El solicitante registra producto, cantidad, correo y motivo.
2. Una tarea REST consulta el producto (precio y stock) en el catalogo externo.
3. La tarea de reglas **Evaluar compra** (grupo `evaluar-compra`) valida los datos y decide la ruta.
4. **Liberar memoria** (grupo `liberar-memoria`) retira la solicitud de la sesion de reglas.
5. El gateway envia la solicitud a: rechazo, Compras (hasta S/ 500) o aprobacion del jefe (mas de S/ 500).
6. El jefe aprueba o rechaza; Compras registra la orden.
7. Se envia el resultado por Gmail.

Artefactos de reglas (Cap. 7)
-----------------------------

Todos estan en `src/main/resources/com/evaluacionfinal/gestioncompras/`.

| Artefacto | Archivo | Reglas |
|-----------|---------|--------|
| Objeto de datos | `src/main/java/.../Solicitud.java` | Hecho que evaluan todas las reglas |
| Regla guiada | `ProductoInexistente.rdrl` | Rechaza si el producto no existe (prioridad 90) |
| Regla guiada | `LiberarMemoria.rdrl` | Retira la solicitud de memoria (grupo `liberar-memoria`) |
| DSL | `ReglasCompra.dsl` | Frases en lenguaje natural para las validaciones |
| Regla con DSL | `ValidacionesCompra.dslr` | Datos invalidos (100) y stock insuficiente (80) |
| Tabla de decisiones | `RutaPorImporte.xlsx` | Hasta S/ 500 -> DIRECTA (70); mas de S/ 500 -> APROBACION (60) |
| Escenarios de prueba | `src/test/resources/.../EvaluarCompra.scesim` | 8 casos para el grupo `evaluar-compra` |

La tabla de decisiones es una hoja de calculo. En Business Central se puede abrir
y convertir en tabla de decisiones guiada con el boton **Convert**.

Los escenarios se ejecutan desde el editor de Test Scenario o con `mvn test`.

Configuracion de Gmail (Cap. 8)
-------------------------------

El handler `Email` (en `META-INF/kie-deployment-descriptor.xml`) lee las credenciales
de variables de entorno del servidor jBPM. No guardes la clave en el proyecto.

| Variable             | Valor                                                        |
|----------------------|--------------------------------------------------------------|
| `GMAIL_USER`         | Cuenta de Gmail que envia (tambien se usa como remitente)    |
| `GMAIL_APP_PASSWORD` | Contrasena de aplicacion de Google (16 caracteres)           |

La contrasena de aplicacion se genera en https://myaccount.google.com/apppasswords
(requiere verificacion en dos pasos). Define las variables antes de iniciar el
servidor (por ejemplo en `bin/standalone.conf.bat`) y reinicialo.

Usuarios
--------

Las tareas humanas usan los grupos `solicitantes`, `jefes` y `compras`; deben existir
en los roles de los usuarios del servidor (`application-roles.properties`).
