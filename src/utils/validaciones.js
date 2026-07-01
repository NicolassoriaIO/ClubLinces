

export function hayCamposVacios(campos) {
    return Object.values(campos).some(
        (valor) => valor === "" || valor === null || valor === undefined
    );
}

export function esNumeroValido(valor, opciones = {}) {
    const numero = Number(valor);

    if (isNaN(numero)) {
        return false;
    }

    if (opciones.permitirCero === false) {
        return numero > 0;
    }

    return numero >= 0;
}

export function esCorreoValido(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(correo);
}

export function esFechaNacimientoValida(fecha, edadMinima = 5) {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return false;
    }

    const hoy = new Date();

    if (fecha > hoy) {
        return false;
    }

    const edadMs = hoy - fecha;
    const edadAnios = edadMs / (1000 * 60 * 60 * 24 * 365.25);

    return edadAnios >= edadMinima;
}

export function esRespuestaSeguridadValida(respuesta) {
    return typeof respuesta === "string" && respuesta.trim().length >= 2;
}
