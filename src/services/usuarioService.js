import { db } from '../database/database';



export function registrarUsuario(
    nombre,
    correo,
    password
){

    db.runSync(

        `
        INSERT INTO usuarios
        (
            nombre,
            correo,
            password,
            intentos,
            bloqueoHasta
        )

        VALUES (?,?,?,?,?)

        `,

        [

            nombre,

            correo,

            password,

            0,

            null

        ]

    );

}



export function existeUsuarioRegistrado(){

    const resultado = db.getFirstSync(

        `
        SELECT id

        FROM usuarios

        LIMIT 1
        `

    );

    return resultado !== null;

}





export function buscarUsuario(correo){


    return db.getFirstSync(

        `

        SELECT *

        FROM usuarios

        WHERE correo = ?

        `,

        [

            correo

        ]

    );


}






export function actualizarIntentos(
    id,
    intentos
){


    db.runSync(

        `

        UPDATE usuarios

        SET intentos = ?

        WHERE id = ?

        `,


        [

            intentos,

            id

        ]

    );


}





export function bloquearUsuario(
    id,
    fecha
){


    db.runSync(

        `

        UPDATE usuarios

        SET bloqueoHasta = ?

        WHERE id = ?

        `,

        [

            fecha,

            id

        ]

    );


}






export function loginUsuario(
    correo,
    password
){


    const usuario = buscarUsuario(correo);



    if(!usuario){

        return {

            correcto:false,

            mensaje:"Correo o contraseña incorrectos"

        };

    }





    const ahora = new Date();


    const bloqueo = usuario.bloqueoHasta

        ?

        new Date(usuario.bloqueoHasta)

        :

        null;





    if(
        bloqueo &&
        bloqueo > ahora
    ){

        return {

            correcto:false,

            mensaje:"Cuenta bloqueada temporalmente. Intente en 15 minutos"

        };

    }





    if(usuario.password !== password){


        const nuevosIntentos =

            usuario.intentos + 1;



        if(nuevosIntentos >= 5){



            const fechaBloqueo =

                new Date();



            fechaBloqueo.setMinutes(

                fechaBloqueo.getMinutes() + 15

            );



            bloquearUsuario(

                usuario.id,

                fechaBloqueo.toISOString()

            );


        }

        else{


            actualizarIntentos(

                usuario.id,

                nuevosIntentos

            );


        }




        return {


            correcto:false,

            mensaje:"Correo o contraseña incorrectos"


        };

    }





    // Login correcto

    db.runSync(

        `

        UPDATE usuarios

        SET

            intentos = 0,

            bloqueoHasta = null

        WHERE id = ?

        `,


        [

            usuario.id

        ]

    );





    return {


        correcto:true,

        usuario

    };

}