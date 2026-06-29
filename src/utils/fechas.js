// src/utils/fechas.js
//
// Funciones puras para convertir entre el objeto Date (que entrega el
// mini calendario / DateTimePicker) y el string "DD/MM/AAAA" que se
// guarda y muestra en la app.
//
// Mantener esto en un solo lugar es justamente el principio de
// Responsabilidad Única (SRP): las pantallas (CrearAtletaScreen,
// CrearSesionScreen, CrearCompetenciaScreen, etc.) NO saben cómo se
// formatea una fecha, solo llaman a estas funciones.

/**
 * Convierte un objeto Date a "DD/MM/AAAA".
 * @param {Date} fecha
 * @returns {string}
 */
export function formatearFecha(fecha) {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return "";
    }

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
}

/**
 * Convierte "DD/MM/AAAA" a un objeto Date. Si el string no tiene ese
 * formato, intenta interpretarlo como ISO; si tampoco funciona, devuelve
 * la fecha actual (para no romper el DateTimePicker).
 * @param {string} texto
 * @returns {Date}
 */
export function parsearFecha(texto) {
    if (!texto) {
        return new Date();
    }

    const partes = texto.split("/");

    if (partes.length === 3) {
        const [dia, mes, anio] = partes.map(Number);
        const fecha = new Date(anio, mes - 1, dia);

        if (!isNaN(fecha.getTime())) {
            return fecha;
        }
    }

    const fechaIso = new Date(texto);

    if (!isNaN(fechaIso.getTime())) {
        return fechaIso;
    }

    return new Date();
}

/**
 * Convierte "DD/MM/AAAA" a "AAAA-MM-DD" (útil para ordenar/comparar
 * como string o guardar en SQLite de forma ordenable).
 * @param {string} texto
 * @returns {string}
 */
export function aFormatoISO(texto) {
    const fecha = parsearFecha(texto);
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}
