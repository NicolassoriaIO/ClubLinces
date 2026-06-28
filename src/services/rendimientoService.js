import { db } from '../database/database';



export function esMarcaPersonal(

    atletaId,

    disciplina,

    resultado

){

    const mejor = db.getFirstSync(

        `
        SELECT resultado

        FROM rendimientos

        WHERE atletaId = ?

        AND disciplina = ?

        ORDER BY resultado ASC

        LIMIT 1
        `,

        [

            atletaId,

            disciplina

        ]

    );



    if(mejor === null){

        return true;

    }



    return resultado < mejor.resultado;

}





export function registrarRendimiento(rendimiento){



    const marcaPersonal = esMarcaPersonal(

        rendimiento.atletaId,

        rendimiento.disciplina,

        rendimiento.resultado

    ) ? 1 : 0;



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

            rendimiento.atletaId,
            rendimiento.sesionId,
            rendimiento.disciplina,
            rendimiento.resultado,
            rendimiento.fecha,
            marcaPersonal

        ]

    );

}




export function obtenerRendimientosPorAtleta(atletaId){

    return db.getAllSync(

        `
        SELECT *

        FROM rendimientos

        WHERE atletaId = ?

        ORDER BY fecha DESC
        `,

        [

            atletaId

        ]

    );

}