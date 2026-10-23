function crearControladorReservas(servicioReservas) {
  async function listarReservas(req, res) {
    const reservas = await servicioReservas.listar();

    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas,
    });
  }

  function mostrarNuevaReserva(req, res) {
    const { salasPermitidas, turnosPermitidos } =
      servicioReservas.obtenerOpciones();

    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      salasPermitidas,
      turnosPermitidos,
      errores: null,
      valores: {},
    });
  }

  async function mostrarDetalleReserva(req, res) {
    const id = req.params.id;
    const reserva = await servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador",
      });
    }
    res.render("reservas/detalle", {
      titulo: "Detalle de reserva",
      reserva,
    });
  }

  async function crearReserva(req, res) {
    await servicioReservas.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  async function mostrarEstado(req, res) {
    const cantidadReservas = await servicioReservas.contar();

    res.json({
      servicio: "activo",
      reservas: cantidadReservas,
      solicitudId: res.locals.solicitudId,
    });
  }

  // *** CONTROLADORES API ***

  async function listarApi(req, res) {
    // Esta línea es para forzar el error controlado de prueba 500 Internal Server Error.
    //throw new Error("Error interno de prueba");

    const sala = req.query.sala;

    // Si "sala" aparece repetido en la URL, Express puede
    // representarlo como un arreglo. No aceptamos ese formato.
    if (Array.isArray(sala)) {
      return res.status(400).json({
        error: "El parámetro 'sala' debe aparecer una sóla vez.",
      });
    }

    const reservas = await servicioReservas.listar(sala);
    return res.json(reservas);
  }

  async function obtenerApi(req, res) {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        error: "Reserva no encontrada.",
      });
    }
    return res.json(reserva);
  }

  async function crearApi(req, res) {
    const reserva = await servicioReservas.crear(req.reservaValidada);
    return res
      .location(`/api/reservas/${reserva.id}`)
      .status(201)
      .json(reserva);
  }

  return {
    listarReservas,
    mostrarNuevaReserva,
    mostrarDetalleReserva,
    crearReserva,
    mostrarEstado,
    listarApi,
    obtenerApi,
    crearApi,
  };
}

module.exports = { crearControladorReservas };
