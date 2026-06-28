import { db } from '../database/database';



function calcularCategoria(fechaNacimiento) {


    const nacimiento = new Date(fechaNacimiento);

    const hoy = new Date();


    let edad = hoy.getFullYear() - nacimiento.getFullYear();


    const diferenciaMes =
        hoy.getMonth() - nacimiento.getMonth();



    if (

        diferenciaMes < 0 ||

        (

            diferenciaMes === 0 &&

            hoy.getDate() < nacimiento.getDate()

        )

    ) {

        edad--;

    }



    if (edad >= 8 && edad <= 12) {

        return "Infantil";

    }



    if (edad >= 13 && edad <= 17) {

        return "Juvenil";

    }



    return "Fuera de categoria";


}





export function insertarAtleta(
    nombre,
    apellido,
    fechaNacimiento,
    disciplina,
    grupo
) {



    db.runSync(


        `

        INSERT INTO atletas

        (

            nombre,

            apellido,

            fechaNacimiento,

            categoria,

            disciplina,

            grupo,

            activo

        )


        VALUES

        (

            ?,

            ?,

            ?,

            ?,

            ?,

            ?,

            1

        )

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







export function actualizarAtleta(
    id,
    nombre,
    apellido,
    fechaNacimiento,
    disciplina,
    grupo
) {



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


        [

            id

        ]


    );


}







export function obtenerAtletasPorGrupo(grupo){



    return db.getAllSync(


        `

        SELECT *

        FROM atletas


        WHERE activo = 1


        AND grupo = ?


        `,


        [

            grupo

        ]


    );


}







export function obtenerTodosAtletas(){



    return db.getAllSync(


        `

        SELECT *

        FROM atletas


        WHERE activo = 1


        ORDER BY nombre ASC


        `


    );


}