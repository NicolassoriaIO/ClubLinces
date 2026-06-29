// src/repositories/usuarioRepository.js
//
// DIP (Inversión de Dependencias):
// Antes, `usuarioService.js` llamaba directamente a `db.runSync(...)` /
// `db.getFirstSync(...)`. Eso significa que la lógica de negocio (reglas
// de login, bloqueo por intentos, recuperación de contraseña) dependía
// directamente del detalle concreto "SQLite".
//
// Ahora esta dependencia se invierte: el servicio (capa alta) depende de
// una ABSTRACCIÓN (este objeto, con un contrato fijo de funciones), y este
// archivo (capa baja) es el único que conoce a `db` / SQLite.
//
// Si algún día se cambia SQLite por una API REST, AsyncStorage, Firebase,
// etc., solo se reescribe ESTE archivo. `usuarioService.js` no se toca,
// porque solo conoce el contrato (las firmas de las funciones), no la
// implementación.

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
