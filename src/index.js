const { crearServicioReservasMongo } = require("./servicios/reservas-mongo");
const { 
  conectarBaseDatos,
  desconectarBaseDatos
} = require("./config/base-datos");
const { crearApp } = require("./app");
const { leerConfiguracion } = require("../src/config/entorno");

// Valores permitidos del dominio. Los comparten el middleware de validación
// (para verificar) y el controlador (para dibujar los <select> del formulario).
const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

async function main() {
  const { puerto, formatoRegistro } = leerConfiguracion();

  await conectarBaseDatos();

  const servicioReservas = crearServicioReservasMongo({
    salasPermitidas,
    turnosPermitidos,
  });

  const app = crearApp({ servicioReservas, formatoRegistro });

  app.listen(puerto, () => {
    console.log(`Aplicación escuchando en http://localhost:${puerto}`);
  });

  let cerrando = false;
  function cerrar () {
    if (cerrando) return;
    cerrando = true;
    servidor.close(async () => {
      try {
        await desconectarBaseDatos();
      } catch (error) {
        console.error("Error al cerrar:", error.name, "-", error.message);
        process.exitCode = 1;
      }
    });
  }
  process.once ("SIGINT", cerrar);
  process.once ("SIGTERM", cerrar);
  servidor.on("error", (error) => {
    console.error("No se pudo escuchar el puerto:", error.code, "-", error.message);
    process.exitCode = 1;
    desconectarBaseDatos().catch((fallo) => {
      console.error("Error al cerrar:", fallo.name, "-", fallo.message);
    });
  });
}

main().catch(async (error) => {
  console.error("No se pudo iniciar la aplicación:", error.name, "-", error.message);
  console.error("Revisar entorno, DNS, red, acceso de Atlas y puerto.");
  process.exitCode = 1;
  try {
    await desconectarBaseDatos();
  } catch (fallo) {
    console.error("Error al cerrar:", fallo.name, "-", fallo.message);
  }
});
