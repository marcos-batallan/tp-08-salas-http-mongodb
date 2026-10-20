# TP07 - Persistencia inicial de reservas de salas

## Descripción

Este proyecto corresponde al Trabajo Práctico 7 de la Unidad 7 del curso de Desarrollo Back-end con Node.js.

Se parte de la aplicación funcional del Trabajo Práctico 6, dedicada a la reserva de salas de estudio, y se incorpora un laboratorio de persistencia con MongoDB Atlas y Mongoose.

El objetivo es crear y recuperar reservas desde MongoDB mediante programas (scripts) de Node.js ejecutados desde la terminal.

**Importante:** la aplicación web continúa trabajando con reservas en memoria. La persistencia en MongoDB se realiza de manera independiente mediante los scripts de consola. En esta etapa no se migran las rutas HTTP ni el servicio web a MongoDB.

## Tecnologías utilizadas

- Node.js: `v25.7.0`
- Express `v5.2.1`
- EJS: `v6.0.1`
- Mongoose `v9.11.2`
- MongoDB Atlas Free.
- Prettier `v3.9.9`
- ESLint `v10.12.0`

## Requisitos previos

- Node.js y npm instalados.
- Una cuenta de MongoDB Atlas (uso opcional de MongoDB Compass).
- Un clúster gratuito Atlas Free (M0).
- Un usuario de base de datos con permisos de lectura y escritura.
- La dirección IP desde la que se ejecutará el proyecto agregada a la lista de acceso de Atlas.

## Instalación

Clonar el repositorio y entrar en la carpeta del proyecto:

```bash
git clone https://github.com/marcos-batallan/tp-07-salas-mongodb.git
cd tp-07-salas-mongodb
```

Instalar las dependencias:

```bash
npm install
```

El archivo `package-lock.json` permite instalar las dependencias registradas para el proyecto.

## Configuración de MongoDB Atlas

1. Crear o utilizar un clúster gratuito Atlas Free (M0).
2. Crear un usuario de base de datos con permisos de lectura y escritura.
3. Agregar la IP correspondiente en la lista de acceso de Atlas.
4. Obtener la URI de conexión desde la opción de conexión para aplicaciones.
5. Crear el archivo `.env` a partir de `.env.example`.
6. Reemplazar los marcadores de la URI por los datos reales de conexión, conservando las opciones proporcionadas por Atlas.

La base de datos utilizada es `reservas_salas_u7` y la colección es `reservas`.

El archivo `.env.example` contiene la plantilla de configuración:

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u7?retryWrites=true&w=majority
```

La URI mostrada es un ejemplo. Debe reemplazarse por la URI real del clúster.

El archivo `.env` contiene la configuración privada y está excluido de Git. No se deben publicar credenciales ni compartir la URI real.

## Estructura del proyecto

```text
tp-07-salas-mongodb/
├── public/
│   ├── css
│   │   └── estilos.css
│   ├── img
│   │   ├── favicon.svg
│   │   └── salas-estudio.svg
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reservas.js
│   ├── listar-reservas.js
│   └── validar-reserva.js
├── src/
│   ├── config/
│   │   ├── base-datos.js
│   │   └── entorno.js
│   ├── controladores/
│   │   └── reservas.js
│   ├── middleware/
│   │   ├── reservas.js
│   │   └── solicitudes.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── rutas/
│   │   └── reservas.js
│   ├── servicios/
│   │   └── reservas.js
│   ├── app.js
│   └── index.js
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidades principales

- `src/config/entorno.js`: configuración del entorno y lectura de variables.
- `src/config/base-datos.js`: configuración y conexión con MongoDB.
- `src/modelos/reserva.js`: esquema y modelo Mongoose de las reservas.
- `scripts/comprobar-conexion.js`: comprueba la conexión a la base de datos sin crear reservas.
- `scripts/crear-reservas.js`: crea una reserva en la base de datos y muestra el `_id` devuelto tras guardarla.
- `scripts/listar-reservas.js`: consulta las reservas almacenadas y muestra la cantidad recuperada.
- `scripts/validar-reserva.js`: ejecuta pruebas de las validaciones del modelo.
- `src/app.js`, `src/index.js`, rutas, controladores, servicios y middleware: mantienen la aplicación web del Trabajo Práctico 6.

## Modelo de reserva

El modelo `Reserva` se asocia explícitamente con la colección `reservas`.

| Campo | Tipo | Reglas |
|---|---|---|
| `estudiante` | String | Obligatorio y sin espacios en los extremos |
| `email` | String | Obligatorio, sin espacios en los extremos y debe contener `@` |
| `sala` | String | Obligatorio; opciones permitidas: Sala Norte, Sala Sur y Sala Multimedia |
| `fecha` | String | Obligatorio y no vacío después de eliminar espacios extremos |
| `turno` | String | Obligatorio; opciones permitidas: Mañana, Tarde y Noche |
| `personas` | Number | Obligatorio, entero entre 1 y 6 |

MongoDB genera un identificador `_id` de tipo ObjectId para cada documento guardado. La confirmación de una escritura se muestra después de que Mongoose completa correctamente la operación de guardado.

Las validaciones implementadas corresponden al alcance inicial del curso. No se valida exhaustivamente el formato del email, la existencia real de una fecha, los solapamientos, los cupos compartidos ni las reservas duplicadas.

## Ejecución de los scripts

Los siguientes comandos se ejecutan desde la raíz del proyecto. Se utiliza `--env-file=.env` para cargar la configuración privada.

### Comprobar la conexión

```bash
node --env-file=.env scripts/comprobar-conexion.js
```

El programa espera el resultado de la conexión, informa si se estableció correctamente y termina con un código de error cuando falla. No crea reservas.

### Crear una reserva

```bash
node --env-file=.env scripts/crear-reservas.js
```

El programa guarda una reserva en la base de datos y muestra el `_id` confirmado por MongoDB. Cada ejecución puede crear un documento nuevo.

### Listar las reservas

```bash
node --env-file=.env scripts/listar-reservas.js
```

Consulta los documentos existentes y muestra sus identificadores, campos principales y cantidad total recuperada. No crea ni elimina documentos.

### Probar las validaciones

```bash
node --env-file=.env scripts/validar-reserva.js
```

Este script permite comprobar el rechazo de datos que incumplen las reglas del modelo. Las pruebas de validación no deben modificar la cantidad de documentos persistidos.

## Diagnóstico de conexión

La conexión se centraliza en `src/config/base-datos.js`. La configuración DNS utilizada para resolver la conexión SRV de Atlas se mantiene en ese módulo, sin duplicarla en los scripts ni incorporarla al modelo.

Si la conexión falla, comprobar:

- Que `MONGODB_URI` esté definida y tenga el formato correcto.
- Que el clúster esté disponible.
- Que el usuario y la contraseña sean correctos.
- Que la IP de origen esté permitida en Atlas.
- Que la red permita resolver los registros DNS necesarios.

Durante las pruebas se verificaron una conexión válida, un fallo de autenticación y un error de resolución DNS (`ENOTFOUND`, operación `querySrv`). También se comprobó que una URI vacía provoca el fallo del programa y un código de salida distinto de cero.
* Conexión y configuración (node --env-file=.env scripts/comprobar-conexion.js):  
    - Conexión válida a Atlas y finalización del proceso  
    `Conexión con MongoDB establecida`  
    - MONGODB_URI vacía: error y código de salida distinto de cero  
    `No se pudo completar la conexión: Error - Revisar MONGODB_URI, servidor, red y permisos`  
    - Contraseña incorrecta temporalmente: fallo de autenticación, sin creación de documentos  
    `No se pudo completar la conexión: MongoServerError - Revisar MONGODB_URI, servidor, red y permisos`  
    - Si hubo un error DNS, registrar su código y operación de resolución, sin exponer la URI  
    $env:MONGODB_URI = "mongodb+srv://usuario:clave@cluster-que-no-existe-xyz123.mongodb.net/reservas_salas_u7"  
    `No se pudo completar la conexión: Error - Código DNS/Red: ENOTFOUND - Consulta DNS: querySrv - Revisar MONGODB_URI, servidor, red y permisos`


No se deben publicar la URI privada ni mensajes de error que contengan credenciales.

## Evidencia de persistencia

La persistencia se verificó mediante ejecuciones separadas:

1. Se consultó la colección y se registró la cantidad inicial.
2. Se creó una reserva y se obtuvo su `_id`.
3. Se terminó el proceso de creación.
4. Se inició otro proceso para consultar las reservas.
5. Se recuperó el mismo `_id` y se verificó que el documento permanecía almacenado.
6. Se repitió la consulta y se comprobó que no se agregaban documentos adicionales.

En MongoDB Atlas Data Explorer se verificó la base `reservas_salas_u7`, la colección `reservas` y el documento creado.

## Pruebas realizadas

| Prueba | Resultado observado |
|---|---|
| Conexión válida | Aprobada |
| Contraseña incorrecta temporal | Conexión rechazada |
| Error de DNS | Se identificó `ENOTFOUND` y `querySrv` |
| URI vacía | Fallo y código de salida `1` en Git Bash |
| Creación de reserva válida | Aprobada; se obtuvo `_id` |
| Consulta desde otro proceso | Se recuperó el mismo documento |
| Consulta repetida | La cantidad permaneció estable |
| Estudiante vacío | Rechazado |
| Email sin `@` | Rechazado |
| Sala no permitida | Rechazada |
| Turno no permitido | Rechazado |
| Fecha vacía | Rechazada |
| Personas igual a `0` o `7` | Rechazadas |
| Personas igual a `2.5` | Rechazadas |
| Personas con texto no numérico | Rechazadas por conversión |
| Aplicación web | Inicio, rutas y formularios comprobados |
| Prettier y ESLint | Controles aprobados |

Las pruebas inválidas se realizaron comprobando que no se incrementara la cantidad de documentos almacenados.

## Aplicación web y calidad

Para iniciar la aplicación web:

```bash
npm start
```

La aplicación conserva el funcionamiento del Trabajo Práctico 6 y mantiene las reservas web en memoria. La conexión a MongoDB NO es un requisito para iniciar el sitio.

También está disponible:

```bash
npm run start:local
```

Este comando inicia la aplicación cargando las variables del archivo `.env`.

Para aplicar el formato:

```bash
npm run format
```

Para comprobar el formato sin modificar archivos:

```bash
npm run format:check
```

Para ejecutar ESLint:

```bash
npm run lint
```

Para ejecutar ambas comprobaciones:

```bash
npm run check
```

Los controles de formato y lint se aplican a las carpetas `src` y `scripts`.

## Continuidad del proyecto

La aplicación web continúa utilizando datos en memoria, mientras que el laboratorio de MongoDB permite crear y consultar documentos persistentes mediante scripts independientes.

La integración de MongoDB en el servicio HTTP y la migración de las rutas y controladores quedan fuera del alcance de esta etapa y podrán abordarse en la siguiente unidad.

## Seguridad y entrega

- No se versiona el archivo `.env`.
- Se incluye `.env.example` sin credenciales reales.
- Se excluye `node_modules/`.
- Se incluye `package-lock.json`.
- Los datos utilizados en las pruebas son ficticios.
- No se deben publicar credenciales, URI privadas ni datos personales.