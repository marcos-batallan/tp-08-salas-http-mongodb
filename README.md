# TP08 - Endpoints persistentes de reservas de salas

## 1. Descripción

Este proyecto corresponde al Trabajo Práctico 8 de la Unidad 8 del curso de Desarrollo Back-end con Node.js.

La aplicación permite gestionar reservas de salas de estudio mediante una interfaz web y una API REST que devuelve respuestas JSON. Los datos se almacenan de forma persistente en MongoDB mediante Mongoose, por lo que las reservas permanecen disponibles después de reiniciar el servidor.

El trabajo continúa el proyecto de reservas desarrollado en los trabajos prácticos anteriores e incorpora persistencia en base de datos, separación de responsabilidades, validación de entradas, manejo centralizado de errores y configuración mediante variables de entorno.

La interfaz web y la API comparten los mismos documentos de MongoDB: las reservas creadas desde el formulario pueden consultarse mediante la API, y las creadas a través de la API aparecen en el sitio web.

## 2. Tecnologías utilizadas

- **Node.js:** `>=22.13.0`.
- **Express:** `^5.2.1`.
- **MongoDB Atlas:** almacenamiento persistente.
- **Mongoose:** `^9.11.2` - modelado y acceso a MongoDB.
- **EJS:** `^6.0.1` - generación de vistas HTML.
- **express-ejs-layouts:** `^2.5.1` - utilización de un diseño compartido.
- **Morgan:** `^1.12.1` - registro de solicitudes HTTP.
- **Prettier:** `^3.9.9` - formato del código.
- **ESLint:** `^10.12.0` - análisis estático y aplicación de reglas de calidad.

El proyecto utiliza módulos CommonJS.

## 3. Estructura completa del proyecto

El siguiente árbol refleja los archivos del proyecto, excluyendo las dependencias instaladas en `node_modules/` y el contenido interno de Git.

```text
tp-08-salas-http-mongodb/
├── .env                         # Configuración local; no se publica
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos excluidos de Git
├── README.md                    # Documentación del proyecto
├── eslint.config.js             # Configuración de ESLint
├── package.json                 # Metadatos, dependencias y scripts
├── package-lock.json            # Versiones resueltas de dependencias
│
├── public/
│   ├── css/
│   │   └── estilos.css          # Estilos de la interfaz web
│   └── img/
│       ├── favicon.svg          # Icono del sitio
│       └── salas-estudio.svg    # Imagen de salas de estudio
│
├── scripts/
│   ├── comprobar-conexion.js    # Comprueba la conexión con MongoDB
│   ├── crear-reservas.js        # Script auxiliar para crear reservas
│   ├── listar-reservas.js       # Script auxiliar para listar reservas
│   └── validar-reserva.js       # Script auxiliar de validación
│
├── src/
│   ├── app.js                   # Configuración de Express y middleware
│   ├── index.js                 # Punto de entrada y arranque del servidor
│   │
│   ├── config/
│   │   ├── base-datos.js        # Conexión y desconexión de MongoDB
│   │   └── entorno.js           # Lectura y validación de configuración
│   │
│   ├── controladores/
│   │   └── reservas.js          # Coordinación entre servicio y respuestas
│   │
│   ├── middleware/
│   │   ├── errores.js           # Manejo centralizado de errores
│   │   ├── reservas.js          # Validación de datos de reservas
│   │   └── solicitudes.js       # Identificación y duración de solicitudes
│   │
│   ├── modelos/
│   │   └── reserva.js           # Esquema y modelo Mongoose
│   │
│   ├── rutas/
│   │   ├── reservas-api.js      # Rutas de la API JSON
│   │   └── reservas.js          # Rutas de la interfaz HTML
│   │
│   └── servicios/
│       ├── reservas-mongo.js    # Servicio persistente utilizado por la app
│       └── reservas.js          # Servicio de la versión anterior
│
└── views/
    ├── inicio.ejs               # Página de inicio
    ├── no-encontrado.ejs        # Página HTML de error
    │
    ├── layouts/
    │   └── main.ejs             # Diseño general compartido
    │
    ├── partials/
    │   ├── encabezado.ejs       # Fragmento compartido del encabezado
    │   └── pie.ejs              # Fragmento compartido del pie
    │
    └── reservas/
        ├── detalle.ejs          # Detalle de una reserva
        ├── lista.ejs             # Listado de reservas
        └── nueva.ejs             # Formulario de creación
```

### 3.1. Responsabilidades de los módulos

| Módulo | Responsabilidad |
|---|---|
| `src/index.js` | Lee la configuración, conecta con MongoDB, crea la aplicación, inicia el servidor y gestiona su cierre ordenado. |
| `src/app.js` | Configura Express, EJS, archivos estáticos, middleware, rutas y respuestas para rutas inexistentes. |
| `src/config/entorno.js` | Lee y valida el puerto, el formato de registro y la URI de MongoDB. |
| `src/config/base-datos.js` | Establece y cierra la conexión con MongoDB. |
| `src/modelos/reserva.js` | Define el esquema y las reglas del documento de reserva. |
| `src/servicios/reservas-mongo.js` | Ejecuta las operaciones de persistencia mediante Mongoose. |
| `src/servicios/reservas.js` | Conserva el servicio anterior como referencia; no es el servicio importado por el arranque del TP08. |
| `src/controladores/reservas.js` | Recibe las solicitudes procesadas por las rutas y coordina las operaciones del servicio. |
| `src/rutas/reservas.js` | Define las rutas de la interfaz web de reservas. |
| `src/rutas/reservas-api.js` | Define los endpoints JSON de la API REST. |
| `src/middleware/reservas.js` | Valida los datos de entrada antes de crear una reserva. |
| `src/middleware/solicitudes.js` | Asigna un identificador a cada solicitud y registra su duración. |
| `src/middleware/errores.js` | Centraliza el tratamiento de errores y genera respuestas adecuadas al tipo de solicitud. |
| `scripts/` | Contiene utilidades auxiliares para comprobar la conexión y trabajar con reservas. |
| `views/` | Contiene las plantillas EJS de la interfaz web. |
| `views/layouts/main.ejs` | Proporciona la estructura general compartida por las páginas. |
| `views/partials/` | Contiene fragmentos reutilizables del encabezado y pie de página. |
| `public/` | Contiene recursos estáticos servidos por Express. |

## 4. Instalación y configuración

### 4.1. Requisitos previos

- Node.js `>=22.13.0`.
- npm.
- Una instancia accesible de MongoDB, por ejemplo, MongoDB Atlas.
- Un usuario de base de datos con permisos adecuados.
- Acceso de red autorizado en MongoDB Atlas.

### 4.2. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
```

### 4.3. Configurar las variables de entorno

Crear el archivo `.env` a partir de `.env.example` y completar los valores necesarios.

Ejemplo de configuración:

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=TU_URI_DE_MONGODB
```

Reemplazar `TU_URI_DE_MONGODB` por la cadena de conexión real de la base de datos.

La configuración de ejemplo es ilustrativa: no constituye una credencial válida ni garantiza por sí sola el acceso a MongoDB Atlas.

**Seguridad:**

- No publicar el archivo `.env`.
- No incluir credenciales en el README, capturas de pantalla ni registros compartidos.
- Mantener `.env` excluido mediante `.gitignore`.
- Utilizar `.env.example` para documentar las variables necesarias sin exponer secretos.

### 4.4. Comprobar la conexión

Ejecutar:

```bash
node --env-file=.env scripts/comprobar-conexion.js
```

Cuando la configuración y el acceso son correctos, el script informa que la conexión con MongoDB se estableció correctamente.

### 4.5. Iniciar la aplicación

Ejecutar:

```bash
npm run start:local
```

Con `PORT=3000`, la aplicación queda disponible en:

`http://localhost:3000`

El arranque espera a que se establezca la conexión con MongoDB antes de iniciar el servidor HTTP. Si falta `MONGODB_URI` o no se puede establecer la conexión, la aplicación no debe iniciar normalmente.

## 5. Modelo de datos

Las reservas se almacenan en MongoDB mediante un modelo Mongoose.

La aplicación trabaja con una colección de reservas y utiliza el identificador de MongoDB como identificador del recurso expuesto por la API.

| Campo | Tipo o regla | Descripción |
|---|---|---|
| `id` | Identificador textual en la respuesta | Representación del identificador del documento MongoDB. |
| `estudiante` | Texto obligatorio | Nombre del estudiante, con espacios externos eliminados. |
| `email` | Texto obligatorio | Debe contener `@`. |
| `sala` | Enumeración | `Sala Norte`, `Sala Sur` o `Sala Multimedia`. |
| `fecha` | Texto obligatorio | Fecha indicada para la reserva. |
| `turno` | Enumeración | `Mañana`, `Tarde` o `Noche`. |
| `personas` | Número entero entre 1 y 6 | Cantidad de personas de la reserva. |
| `estado` | Enumeración | `pendiente` o `confirmada`. |

El estado inicial se establece mediante el valor predeterminado `pendiente`.

La API no permite que el cliente imponga el estado inicial ni el identificador MongoDB al crear una reserva.

La validación de fecha de este trabajo práctico verifica que el campo sea obligatorio; no implica una validación completa del calendario, de fechas futuras, de disponibilidad horaria ni de solapamientos entre reservas.

## 6. Interfaz web

La aplicación dispone de las siguientes páginas:

| Ruta | Función |
|---|---|
| `/` | Página de inicio. |
| `/reservas` | Lista las reservas almacenadas. |
| `/reservas/nueva` | Muestra el formulario para crear una reserva. |
| `/reservas/:id` | Muestra el detalle de una reserva. |
| `/estado` | Devuelve el estado del servicio y la cantidad de reservas. |

El formulario HTML valida los datos antes de crear una reserva.

Cuando la creación es correcta, el usuario es redirigido al listado. Si hay errores de validación, se vuelve a mostrar el formulario con los mensajes correspondientes y se conservan los valores ingresados.

Las vistas HTML y la API utilizan el mismo servicio de persistencia, por lo que acceden a los mismos documentos.

## 7. API REST

Los endpoints JSON utilizan el prefijo `/api/reservas`.

### 7.1. Endpoints disponibles

| Método | Endpoint | Descripción | Respuesta esperada |
|---|---|---|---|
| `GET` | `/api/reservas` | Lista todas las reservas. | `200 OK` y un arreglo JSON. |
| `GET` | `/api/reservas?sala=Sala%20Norte` | Filtra por coincidencia exacta de sala. | `200 OK` y un arreglo JSON. |
| `GET` | `/api/reservas/:id` | Busca una reserva por identificador. | `200 OK`, `400` o `404`. |
| `POST` | `/api/reservas` | Crea una reserva validada. | `201 Created`, recurso JSON y cabecera `Location`. |

La ruta `/estado` devuelve información del servicio y no forma parte del prefijo de la API de reservas.

No se implementan endpoints `PUT`, `PATCH` ni `DELETE` en este trabajo práctico.

### 7.2. Consultar todas las reservas

Solicitud:

```http
GET /api/reservas
```

Respuesta esperada: `200 OK` y un arreglo JSON con las reservas almacenadas. Si no hay documentos, devuelve `[]`.

### 7.3. Filtrar por sala

Solicitud:

```http
GET /api/reservas?sala=Sala%20Norte
```

El filtro busca coincidencias exactas. Si no existen reservas para la sala solicitada, devuelve `200 OK` con un arreglo vacío.

El parámetro `sala` debe aparecer una sola vez. Si se repite, la API responde `400 Bad Request`.

El criterio de búsqueda se construye explícitamente y no se utiliza el objeto completo `req.query` como filtro de MongoDB.

### 7.4. Consultar una reserva por ID

Solicitud:

```http
GET /api/reservas/ID_DE_LA_RESERVA
```

El marcador debe reemplazarse por un identificador real.

- Si el ID está bien formado y existe, la respuesta es `200 OK`.
- Si el ID está mal formado, la respuesta es `400 Bad Request`.
- Si el ID tiene un formato válido pero no existe, la respuesta es `404 Not Found`.

### 7.5. Crear una reserva

Solicitud:

```http
POST /api/reservas
Content-Type: application/json
```

Cuerpo de ejemplo:

```json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-25",
  "turno": "Mañana",
  "personas": 2
}
```

La solicitud debe contener los seis campos de entrada. No se deben enviar `estado` ni `_id` para determinar los valores protegidos.

Cuando la solicitud es válida, la API:

1. Valida los datos.
2. Persiste el documento en MongoDB.
3. Asigna el estado inicial `pendiente`.
4. Devuelve `201 Created`.
5. Incluye el recurso creado en el cuerpo JSON.
6. Incluye una cabecera `Location` con la dirección del recurso creado.

La dirección recibida en `Location` puede utilizarse para consultar la reserva mediante `GET`.

## 8. Validaciones y manejo de errores

La aplicación utiliza middleware de validación y un manejador centralizado de errores.

| Situación | Respuesta |
|---|---|
| Solicitud válida de listado | `200 OK`. |
| Creación válida mediante API | `201 Created`. |
| Datos de reserva inválidos | `400 Bad Request`. |
| Identificador mal formado | `400 Bad Request`. |
| JSON inválido | `400 Bad Request`. |
| Parámetro `sala` repetido | `400 Bad Request`. |
| Reserva inexistente | `404 Not Found`. |
| Ruta de API inexistente | `404 Not Found` en JSON. |
| Ruta HTML inexistente | `404 Not Found` con una página HTML. |
| Error inesperado durante una operación | `500 Internal Server Error`. |

Las respuestas de error de la API utilizan JSON. Ante errores inesperados, el cliente recibe un mensaje genérico sin trazas, credenciales ni detalles internos del servidor.

Las validaciones de entrada contemplan, entre otras condiciones:

- Estudiante obligatorio.
- Email obligatorio y con presencia de `@`.
- Sala permitida.
- Fecha obligatoria.
- Turno permitido.
- Cantidad de personas entera, entre 1 y 6.
- Rechazo de cuerpos JSON mal formados.

## 9. Registro de solicitudes y cierre del servidor

Morgan registra las solicitudes HTTP. El middleware propio asigna un identificador como `BIB-0001` a cada solicitud y mide su duración.

El servidor también contempla el cierre ordenado ante las señales `SIGINT` y `SIGTERM`, cerrando el servidor HTTP y desconectando MongoDB.

La configuración de conexión incluye la corrección DNS utilizada en el entorno de desarrollo para resolver el acceso a MongoDB Atlas.

## 10. Pruebas realizadas

Las siguientes pruebas se ejecutaron durante el desarrollo con Postman, la terminal y la interfaz web.

| Prueba | Resultado observado |
|---|---|
| Conexión con MongoDB | Correcta. |
| Listado de reservas | `200 OK`, con los documentos persistidos. |
| Consulta por ID existente | `200 OK`. |
| Identificador mal formado | `400 Bad Request`. |
| Identificador válido inexistente | `404 Not Found`. |
| Creación válida mediante API | `201 Created`. |
| Cabecera `Location` en la creación | Verificada. |
| Email inválido y cantidad fuera de rango | `400 Bad Request`. |
| Campos obligatorios y valores de entrada inválidos | Rechazados por la validación. |
| JSON mal formado | `400 Bad Request`. |
| Parámetro `sala` repetido | `400 Bad Request`. |
| Filtro sin coincidencias | `200 OK` con `[]`. |
| Ruta de API inexistente | `404` en JSON. |
| Ruta HTML inexistente | Página HTML de error `404`. |
| Error interno de prueba | `500` con mensaje genérico y sin detalles internos. |
| Persistencia después de reiniciar el servidor | Confirmada. |
| Creación desde el formulario HTML | Correcta; la reserva aparece en el listado y en el detalle. |
| Envío de `estado` y `_id` desde el cliente | El estado permaneció `pendiente` y se generó un identificador nuevo. |
| Inicio sin `MONGODB_URI` | El servidor no inició. |
| Comprobación de formato y análisis estático | `npm run check` finalizó sin errores después de aplicar Prettier. |

Las pruebas de error 500 se realizaron de forma temporal durante el desarrollo. La instrucción de prueba se retiró después y se verificó que el listado volviera a responder correctamente.

## 11. Comandos de calidad

Comprobar formato y ejecutar ESLint:

```bash
npm run check
```

Aplicar el formato automáticamente:

```bash
npm run format
```

Comprobar solamente el formato:

```bash
npm run format:check
```

Ejecutar solamente ESLint:

```bash
npm run lint
```

## 12. Consideraciones finales

El proyecto utiliza MongoDB como fuente de persistencia y organiza la aplicación en módulos de configuración, arranque, modelo, servicio, controladores, rutas y middleware.

La interfaz web y la API comparten la misma información persistida. Las variables de entorno permiten separar la configuración local del código fuente, y el arranque depende de una conexión correcta con MongoDB.

El servicio en memoria de la versión anterior se conserva como referencia, pero el arranque del TP08 utiliza el servicio persistente `reservas-mongo.js`.

Este trabajo práctico consolida el uso de Express, Mongoose, validaciones y manejo de errores en una aplicación modular con persistencia real.