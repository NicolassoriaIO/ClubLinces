// src/utils/validaciones.js
//
// SRP (Responsabilidad Única): las pantallas se encargan de mostrar UI
// y reaccionar a eventos; estas funciones se encargan SOLO de validar
// datos. Antes, cada screen (CrearAtletaScreen, EditarAtletasScreen,
// RegistroScreen, etc.) repetía sus propias validaciones "a mano" mezcladas
// con la lógica de guardado. Ahora todas reutilizan estas funciones.

/**
 * Verifica que ningún campo del objeto venga vacío ("" , null o undefined).
 * @param {Object} campos  ej: { nombre, apellido, fecha }
 * @returns {boolean}
 */
export function hayCamposVacios(campos) {
    return Object.values(campos).some(
        (valor) => valor === "" || valor === null || valor === undefined
    );
}

/**
 * Valida que un texto sea un número válido y, opcionalmente, no negativo.
 * @param {string|number} valor
 * @param {{permitirCero?: boolean}} opciones
 */
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

/**
 * Valida formato básico de correo electrónico.
 * @param {string} correo
 */
export function esCorreoValido(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(correo);
}

/**
 * Valida que la fecha de nacimiento no sea futura y corresponda a una
 * persona de al menos `edadMinima` años (por defecto 5).
 * @param {Date} fecha
 * @param {number} edadMinima
 */
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

/**
 * Valida que la respuesta de seguridad no esté vacía y tenga un mínimo
 * de longitud razonable (para evitar respuestas tipo "a").
 * @param {string} respuesta
 */
export function esRespuestaSeguridadValida(respuesta) {
    return typeof respuesta === "string" && respuesta.trim().length >= 2;
}
