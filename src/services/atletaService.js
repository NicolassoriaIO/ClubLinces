import { db } from '../database/database';
import { parsearFecha } from '../utils/fechas';


function calcularCategoria(fechaNacimiento) {

    const nacimiento = parsearFecha(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

    if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    if (edad >= 8  && edad <= 12) return "Infantil (8-12 años)";
    if (edad >= 13 && edad <= 17) return "Juvenil (13-17 años)";

    return "Fuera de categoría";
}




const GRUPOS_POR_CATEGORIA = {
    "Infantil (8-12 años)": ["Infantil Mañana", "Infantil Tarde"],
    "Juvenil (13-17 años)": ["Juvenil Mañana", "Juvenil Tarde"],
    "Fuera de categoría":   [],
};


export function verificarCompatibilidadGrupo(fechaNacimiento, grupo) {

    const categoria = calcularCategoria(fechaNacimiento);
    const gruposCompatibles = GRUPOS_POR_CATEGORIA[categoria] ?? [];

    if (gruposCompatibles.includes(grupo)) return null;

    return `Este atleta es "${categoria}" pero estás asignándolo al grupo "${grupo}". ¿Querés continuar de todas formas?`;
}





export function insertarAtleta(nombre, apellido, fechaNacimiento, disciplina, grupo) {

    db.runSync(
        `
        INSERT INTO atletas
        (nombre, apellido, fechaNacimiento, categoria, disciplina, grupo, activo)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        `,
        [
            nombre,
            apellido,
            fechaNacimiento,
            calcularCategoria(fechaNacimiento),
            disciplina,
            grupo
        ]
    );
}



export function obtenerAtletas() {

    return db.getAllSync(
        `
        SELECT *
        FROM atletas
        WHERE activo = 1
        ORDER BY id DESC
        `
    );
}



export function actualizarAtleta(id, nombre, apellido, fechaNacimiento, disciplina, grupo) {

    db.runSync(
        `
        UPDATE atletas
        SET
            nombre = ?,
            apellido = ?,
            fechaNacimiento = ?,
            categoria = ?,
            disciplina = ?,
            grupo = ?
        WHERE id = ?
        `,
        [
            nombre,
            apellido,
            fechaNacimiento,
            calcularCategoria(fechaNacimiento),
            disciplina,
            grupo,
            id
        ]
    );
}



export function desactivarAtleta(id) {

    db.runSync(
        `
        UPDATE atletas
        SET activo = 0
        WHERE id = ?
        `,
        [id]
    );
}



export function obtenerAtletasPorGrupo(grupo) {

    return db.getAllSync(
        `
        SELECT *
        FROM atletas
        WHERE activo = 1
        AND grupo = ?
        `,
        [grupo]
    );
}



export function obtenerTodosAtletas() {

    return db.getAllSync(
        `
        SELECT *
        FROM atletas
        WHERE activo = 1
        ORDER BY nombre ASC
        `
    );
}



export function actualizarCategoriasAutomaticamente() {

    const atletas = db.getAllSync(
        `SELECT id, fechaNacimiento FROM atletas WHERE activo = 1`
    );

    atletas.forEach((atleta) => {

        const nuevaCategoria = calcularCategoria(atleta.fechaNacimiento);

        db.runSync(
            `UPDATE atletas SET categoria = ? WHERE id = ?`,
            [nuevaCategoria, atleta.id]
        );
    });
}