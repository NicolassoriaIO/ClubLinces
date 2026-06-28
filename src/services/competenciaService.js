import { db } from '../database/database';

import { esMarcaPersonal } from './rendimientoService';





export function crearCompetencia(competencia){


    db.runSync(

        `
        INSERT INTO competencias
        (
            nombre,
            fecha,
            lugar,
            disciplinas
        )

        VALUES (?,?,?,?)

        `,

        [

            competencia.nombre,

            competencia.fecha,

            competencia.lugar,

            competencia.disciplinas

        ]

    );


}







export function obtenerCompetencias(){


    return db.getAllSync(

        `

        SELECT *

        FROM competencias

        ORDER BY fecha DESC

        `

    );


}







export function obtenerCompetenciaPorId(id){


    return db.getFirstSync(

        `

        SELECT *

        FROM competencias

        WHERE id = ?

        `,

        [

            id

        ]

    );


}








export function convocarAtleta(competenciaId, atletaId){


    db.runSync(

        `

        INSERT INTO convocatorias

        (

            competenciaId,

            atletaId

        )

        VALUES (?,?)

        `,

        [

            competenciaId,

            atletaId

        ]

    );


}







export function obtenerConvocados(competenciaId){


    return db.getAllSync(

        `

        SELECT atletas.*

        FROM convocatorias

        INNER JOIN atletas

        ON atletas.id = convocatorias.atletaId

        WHERE competenciaId = ?

        `,

        [

            competenciaId

        ]

    );


}








export function registrarResultado(resultado){


    const marcaPersonal = esMarcaPersonal(

        resultado.atletaId,

        "Competencia",

        Number(resultado.marca)

    ) ? 1 : 0;


    db.runSync(

        `

        INSERT INTO resultadosCompetencia

        (

            competenciaId,

            atletaId,

            posicion,

            marca,

            fecha

        )

        VALUES (?,?,?,?,?)

        `,


        [

            resultado.competenciaId,

            resultado.atletaId,

            resultado.posicion,

            resultado.marca,

            resultado.fecha

        ]

    );








    db.runSync(

        `

        INSERT INTO rendimientos

        (

            atletaId,

            sesionId,

            disciplina,

            resultado,

            fecha,

            marcaPersonal

        )

        VALUES (?,?,?,?,?,?)

        `,


        [

            resultado.atletaId,

            null,

            "Competencia",

            Number(resultado.marca),

            resultado.fecha,

            marcaPersonal

        ]

    );



}









export function obtenerResultados(competenciaId){



    return db.getAllSync(


        `

        SELECT


        atletas.nombre,


        atletas.apellido,


        resultadosCompetencia.posicion,


        resultadosCompetencia.marca



        FROM resultadosCompetencia



        INNER JOIN atletas



        ON atletas.id = resultadosCompetencia.atletaId




        WHERE resultadosCompetencia.competenciaId = ?




        ORDER BY resultadosCompetencia.posicion ASC



        `,



        [


            competenciaId


        ]



    );



}