import AsyncStorage from '@react-native-async-storage/async-storage';



export async function guardarSesion(usuario){


    await AsyncStorage.setItem(

        "usuarioActivo",

        JSON.stringify(usuario)

    );


}




export async function obtenerSesion(){


    const usuario = await AsyncStorage.getItem(

        "usuarioActivo"

    );



    if(usuario){

        return JSON.parse(usuario);

    }



    return null;


}




export async function cerrarSesion(){


    await AsyncStorage.removeItem(

        "usuarioActivo"

    );


}