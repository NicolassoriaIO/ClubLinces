import { usuarioRepository as repositorioPorDefecto } from '../repositories/usuarioRepository';

const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

export function registrarUsuario(
    nombre,
    correo,
    password,
    pregunta1,
    respuesta1,
    pregunta2,
    respuesta2,
    repositorio = repositorioPorDefecto
) {
    repositorio.crear({
        nombre,
        correo,
        password,
        pregunta1,
        respuesta1: normalizarRespuesta(respuesta1),
        pregunta2,
        respuesta2: normalizarRespuesta(respuesta2),
    });
}

export function existeUsuarioRegistrado(repositorio = repositorioPorDefecto) {
    return repositorio.existeAlguno();
}

export function buscarUsuario(correo, repositorio = repositorioPorDefecto) {
    return repositorio.buscarPorCorreo(correo);
}

export function actualizarIntentos(id, intentos, repositorio = repositorioPorDefecto) {
    repositorio.actualizarIntentos(id, intentos);
}

export function bloquearUsuario(id, fecha, repositorio = repositorioPorDefecto) {
    repositorio.bloquear(id, fecha);
}

function normalizarRespuesta(respuesta) {
    return (respuesta || '').trim().toLowerCase();
}

export function loginUsuario(correo, password, repositorio = repositorioPorDefecto) {

    const usuario = repositorio.buscarPorCorreo(correo);

    if (!usuario) {
        return {
            correcto: false,
            mensaje: "Correo o contraseña incorrectos",
        };
    }

    const ahora = new Date();
    const bloqueo = usuario.bloqueoHasta ? new Date(usuario.bloqueoHasta) : null;

    if (bloqueo && bloqueo > ahora) {
        return {
            correcto: false,
            mensaje: "Cuenta bloqueada temporalmente. Intente en 15 minutos",
        };
    }

    if (usuario.password !== password) {

        const nuevosIntentos = usuario.intentos + 1;

        if (nuevosIntentos >= MAX_INTENTOS) {
            const fechaBloqueo = new Date();
            fechaBloqueo.setMinutes(fechaBloqueo.getMinutes() + MINUTOS_BLOQUEO);
            repositorio.bloquear(usuario.id, fechaBloqueo.toISOString());
        } else {
            repositorio.actualizarIntentos(usuario.id, nuevosIntentos);
        }

        return {
            correcto: false,
            mensaje: "Correo o contraseña incorrectos",
        };
    }

    repositorio.desbloquearYResetearIntentos(usuario.id);

    return {
        correcto: true,
        usuario,
    };
}

export function obtenerPreguntasSeguridad(correo, repositorio = repositorioPorDefecto) {

    const usuario = repositorio.buscarPorCorreo(correo);

    if (!usuario || !usuario.pregunta1 || !usuario.pregunta2) {
        return {
            existe: false,
            mensaje: "No se encontró una cuenta con ese correo o no tiene preguntas configuradas.",
        };
    }

    return {
        existe: true,
        pregunta1: usuario.pregunta1,
        pregunta2: usuario.pregunta2,
    };
}

export function verificarPreguntasSeguridad(
    correo,
    respuesta1,
    respuesta2,
    repositorio = repositorioPorDefecto
) {
    const usuario = repositorio.buscarPorCorreo(correo);

    if (!usuario) {
        return {
            correcto: false,
            mensaje: "No se encontró una cuenta con ese correo.",
        };
    }

    const coincide1 = usuario.respuesta1 === normalizarRespuesta(respuesta1);
    const coincide2 = usuario.respuesta2 === normalizarRespuesta(respuesta2);

    if (!coincide1 || !coincide2) {
        return {
            correcto: false,
            mensaje: "Una o ambas respuestas son incorrectas.",
        };
    }

    return {
        correcto: true,
        usuarioId: usuario.id,
    };
}

export function resetearPassword(usuarioId, nuevaPassword, repositorio = repositorioPorDefecto) {
    repositorio.actualizarPassword(usuarioId, nuevaPassword);
}
