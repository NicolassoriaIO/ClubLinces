import AsyncStorage from '@react-native-async-storage/async-storage';

export async function guardarSesion(usuario){
    try {
        await AsyncStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuario)
        );
    } catch (error) {
        console.error('Error guardando sesión:', error);
        throw new Error('No se pudo guardar la sesión.');
    }
}

export async function obtenerSesion(){
    try {
        const usuario = await AsyncStorage.getItem("usuarioActivo");
        if(usuario){
            try {
                return JSON.parse(usuario);
            } catch (parseError) {
                console.error('Error parseando sesión:', parseError);
                await AsyncStorage.removeItem("usuarioActivo");
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo sesión:', error);
        return null;
    }
}

export async function cerrarSesion(){
    try {
        await AsyncStorage.removeItem("usuarioActivo");
    } catch (error) {
        console.error('Error cerrando sesión:', error);
        throw new Error('No se pudo cerrar la sesión.');
    }
}