import { parsearFecha } from '../utils/fechas';

export function obtenerInicioSemana(fecha) {

    const inicio = new Date(fecha);

    const dia = inicio.getDay();

    const diferencia = dia === 0 ? -6 : 1 - dia;

    inicio.setDate(inicio.getDate() + diferencia);

    inicio.setHours(0, 0, 0, 0);

    return inicio;

}

export function obtenerFinSemana(fecha) {

    const fin = obtenerInicioSemana(fecha);

    fin.setDate(fin.getDate() + 6);

    fin.setHours(23, 59, 59, 999);

    return fin;

}

export function filtrarSesionesSemana(
    sesiones,
    fecha
) {

    const inicio = obtenerInicioSemana(fecha);

    const fin = obtenerFinSemana(fecha);

    return sesiones.filter((sesion) => {

        const fechaSesion = parsearFecha(sesion.fecha);

        return fechaSesion >= inicio &&
               fechaSesion <= fin;

    });

}

export function obtenerRangoSemana(fecha) {

    const inicio = obtenerInicioSemana(fecha);

    const fin = obtenerFinSemana(fecha);

    return (

        inicio.toLocaleDateString()

        +

        " - "

        +

        fin.toLocaleDateString()

    );

}