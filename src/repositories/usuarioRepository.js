

import { db } from '../database/database';

export const usuarioRepository = {

    crear(usuario) {
        db.runSync(
            `
            INSERT INTO usuarios
            (
                nombre,
                correo,
                password,
                intentos,
                bloqueoHasta,
                pregunta1,
                respuesta1,
                pregunta2,
                respuesta2,
                activo,
                creadoEn
            )
            VALUES (?,?,?,?,?,?,?,?,?,1,?)
            `,
            [
                usuario.nombre,
                usuario.correo,
                usuario.password,
                0,
                null,
                usuario.pregunta1,
                usuario.respuesta1,
                usuario.pregunta2,
                usuario.respuesta2,
                new Date().toISOString(),
            ]
        );
    },

    existeAlguno() {
        const resultado = db.getFirstSync(
            `SELECT id FROM usuarios LIMIT 1`
        );
        return resultado !== null;
    },

    buscarPorCorreo(correo) {
        return db.getFirstSync(
            `SELECT * FROM usuarios WHERE correo = ?`,
            [correo]
        );
    },

    actualizarIntentos(id, intentos) {
        db.runSync(
            `UPDATE usuarios SET intentos = ? WHERE id = ?`,
            [intentos, id]
        );
    },

    bloquear(id, fechaIso) {
        db.runSync(
            `UPDATE usuarios SET bloqueoHasta = ? WHERE id = ?`,
            [fechaIso, id]
        );
    },

    desbloquearYResetearIntentos(id) {
        db.runSync(
            `UPDATE usuarios SET intentos = 0, bloqueoHasta = null WHERE id = ?`,
            [id]
        );
    },

    actualizarPassword(id, nuevaPassword) {
        db.runSync(
            `
            UPDATE usuarios
            SET password = ?, intentos = 0, bloqueoHasta = null
            WHERE id = ?
            `,
            [nuevaPassword, id]
        );
    },
};
