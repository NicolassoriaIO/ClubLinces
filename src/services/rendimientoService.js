// src/services/rendimientoService.js
//
// SRP: responsabilidad única → lógica de rendimiento/marcas.
// DIP: depende de la abstracción `db` (inyectada desde database.js),
//      no de una implementación concreta de SQLite.

import { db } from '../database/database';

// Tipos de disciplina que determinan si "mejor" es menor o mayor valor.
const DISCIPLINAS_TIEMPO = ["Velocidad", "Resistencia"];   // menor = mejor
// El resto (Coordinación, Técnica, Saltos, Lanzamientos, Competencia) → mayor = mejor

// Límites lógicos por tipo para HU-07 crit. 3
// Formato: { min, max }  — valores fuera de este rango se rechazan.
const RANGOS = {
    Velocidad:     { min: 1,    max: 600   },   // segundos: 1s a 10 min
    Resistencia:   { min: 1,    max: 7200  },   // segundos: 1s a 2 horas
    Coordinación:  { min: 0,    max: 100   },   // puntuación 0-100
    Técnica:       { min: 0,    max: 100   },   // puntuación 0-100
    Saltos:        { min: 0.01, max: 10    },   // metros
    Lanzamientos:  { min: 0.01, max: 100   },   // metros
    Competencia:   { min: 0,    max: 9999  },   // genérico
};

// HU-07 crit. 3: valida que el resultado esté dentro del rango lógico
// para la disciplina. Devuelve null si es válido, o un mensaje de error.
export function validarRangoResultado(disciplina, valor) {

    const rango = RANGOS[disciplina];

    if (!rango) return null; // disciplina desconocida → no bloquear

    if (valor < rango.min || valor > rango.max) {
        return `El valor ${valor} está fuera del rango válido para ${disciplina} (${rango.min} – ${rango.max}).`;
    }

    return null; // OK
}



// HU-07 crit. 2: determina si el resultado supera la marca personal.
// Para disciplinas de TIEMPO: menor resultado es mejor.
// Para el resto: mayor resultado es mejor.
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

    if (mejor === null) return true; // primer registro → siempre es marca

    if (esTiempo) {
        return resultado < mejor.resultado;
    } else {
        return resultado > mejor.resultado;
    }
}



export function registrarRendimiento(rendimiento) {

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
