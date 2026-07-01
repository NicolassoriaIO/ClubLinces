import { db } from '../database/database';

export function registrarAsistencia(asistencia) {
    try {
        db.runSync(
            `
            INSERT INTO asistencias
            (
                sesionId,
                atletaId,
                estado,
                fechaRegistro
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                asistencia.sesionId,
                asistencia.atletaId,
                asistencia.estado,
                asistencia.fechaRegistro
            ]
        );
    } catch (error) {
        console.error('Error registrando asistencia:', error);
        throw new Error('No se pudo registrar la asistencia.');
    }
}

export function obtenerAsistenciasPorSesion(sesionId) {

    return db.getAllSync(

        `
        SELECT *

        FROM asistencias

        WHERE sesionId = ?
        `,

        [sesionId]

    );

}

export function existeAsistenciaSesion(sesionId){

    const resultado = db.getFirstSync(

        `
        SELECT id

        FROM asistencias

        WHERE sesionId = ?

        LIMIT 1
        `,

        [

            sesionId

        ]

    );

    return resultado !== null;

}

export function estaBloqueadaPorTiempo(sesion){

    const finSesion = new Date(`${sesion.fecha}T${sesion.horaFin}`);

    if(isNaN(finSesion.getTime())){
        return false;
    }

    const horasTranscurridas =
        (new Date() - finSesion) / (1000 * 60 * 60);

    return horasTranscurridas > 2;

}