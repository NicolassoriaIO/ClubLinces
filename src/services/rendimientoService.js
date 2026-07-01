import { db } from '../database/database';

const DISCIPLINAS_TIEMPO = ["Velocidad", "Resistencia"];   

const RANGOS = {
    Velocidad:     { min: 1,    max: 600   },   
    Resistencia:   { min: 1,    max: 7200  },   
    Coordinación:  { min: 0,    max: 100   },   
    Técnica:       { min: 0,    max: 100   },   
    Saltos:        { min: 0.01, max: 10    },   
    Lanzamientos:  { min: 0.01, max: 100   },   
    Competencia:   { min: 0,    max: 9999  },   
};

export function validarRangoResultado(disciplina, valor) {

    const rango = RANGOS[disciplina];

    if (!rango) return null; 

    if (valor < rango.min || valor > rango.max) {
        return `El valor ${valor} está fuera del rango válido para ${disciplina} (${rango.min} – ${rango.max}).`;
    }

    return null; 
}

export function esMarcaPersonal(atletaId, disciplina, resultado) {

    const esTiempo = DISCIPLINAS_TIEMPO.includes(disciplina);

    const orden = esTiempo ? "ASC" : "DESC";

    const mejor = db.getFirstSync(
        `
        SELECT resultado
        FROM rendimientos
        WHERE atletaId = ?
        AND disciplina = ?
        ORDER BY resultado ${orden}
        LIMIT 1
        `,
        [atletaId, disciplina]
    );

    if (mejor === null) return true; 

    if (esTiempo) {
        return resultado < mejor.resultado;
    } else {
        return resultado > mejor.resultado;
    }
}

export function registrarRendimiento(rendimiento) {
    try {
        const marcaPersonal = esMarcaPersonal(
            rendimiento.atletaId,
            rendimiento.disciplina,
            rendimiento.resultado
        ) ? 1 : 0;

        db.runSync(
            `
            INSERT INTO rendimientos
            (atletaId, sesionId, disciplina, resultado, fecha, marcaPersonal)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                rendimiento.atletaId,
                rendimiento.sesionId,
                rendimiento.disciplina,
                rendimiento.resultado,
                rendimiento.fecha,
                marcaPersonal
            ]
        );
    } catch (error) {
        console.error('Error registrando rendimiento:', error);
        throw new Error('No se pudo registrar el rendimiento.');
    }
}

export function obtenerRendimientosPorAtleta(atletaId) {

    return db.getAllSync(
        `
        SELECT *
        FROM rendimientos
        WHERE atletaId = ?
        ORDER BY fecha DESC
        `,
        [atletaId]
    );
}
