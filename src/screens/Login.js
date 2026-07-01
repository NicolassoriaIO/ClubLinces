import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import {
    useState,
    useContext,
    useCallback
} from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
    loginUsuario,
    existeUsuarioRegistrado
} from '../services/usuarioService';

import {
    guardarSesion
} from '../services/sesionService';

import { SessionContext } from '../context/SessionContext';
import { COLORS } from '../constants/theme';

export default function Login({navigation}){

    const { iniciarSesionApp } = useContext(SessionContext);

    const [correo,setCorreo] = useState("");

    const [password,setPassword] = useState("");

    const [mostrarRegistro, setMostrarRegistro] = useState(true);

    useFocusEffect(

        useCallback(()=>{

            setMostrarRegistro(
                !existeUsuarioRegistrado()
            );

        },[])

    );

    async function iniciarSesion(){
        try {
            const resultado = loginUsuario(correo, password);

            if(resultado.correcto){
                try {
                    await guardarSesion(resultado.usuario);
                    iniciarSesionApp(resultado.usuario);
                } catch (storageError) {
                    Alert.alert(
                        "Error",
                        "No se pudo guardar la sesión. Intenta nuevamente."
                    );
                }
            }
            else{
                Alert.alert("Error", resultado.mensaje);
            }
        } catch (error) {
            console.error('Error en inicio de sesión:', error);
            Alert.alert("Error", "Ocurrió un error. Intenta nuevamente.");
        }
    }

    return(

        <View style={styles.contenedor}>

            <Text style={styles.titulo}>
                CLUB LINCES
            </Text>

            <TextInput
                placeholder="Correo electrónico"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#B9ABAE"
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
                placeholderTextColor="#B9ABAE"
                style={styles.input}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("RecuperarContrasenia")}
            >
                <Text style={styles.enlace}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.boton}
                onPress={iniciarSesion}
            >
                <Text style={styles.textoBoton}>Ingresar</Text>
            </TouchableOpacity>

            {
                mostrarRegistro &&
                <TouchableOpacity
                    style={styles.botonSecundario}
                    onPress={()=>
                        navigation.navigate("Registro")
                    }
                >
                    <Text style={styles.textoBotonSecundario}>Crear cuenta entrenador</Text>
                </TouchableOpacity>
            }

        </View>

    );

}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: Math.max(width * 0.06, 20),
        justifyContent: "center",
        backgroundColor: COLORS.fondo,
    },
    titulo: {
        fontSize: Math.max(width * 0.08, 28),
        fontWeight: "bold",
        color: COLORS.primario,
        textAlign: "center",
        marginBottom: Math.max(height * 0.04, 24),
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.borde,
        borderRadius: 8,
        padding: Math.max(width * 0.03, 12),
        marginBottom: Math.max(height * 0.02, 12),
        backgroundColor: COLORS.blanco,
        fontSize: 16,
        color: COLORS.texto,
    },
    enlace: {
        color: COLORS.primario,
        textAlign: "right",
        marginBottom: Math.max(height * 0.025, 16),
        fontSize: 14,
        fontWeight: "500",
    },
    boton: {
        backgroundColor: COLORS.primario,
        padding: 14,
        borderRadius: 8,
        marginBottom: Math.max(height * 0.02, 12),
        alignItems: "center",
    },
    textoBoton: {
        color: COLORS.blanco,
        fontSize: 16,
        fontWeight: "bold",
    },
    botonSecundario: {
        backgroundColor: COLORS.blanco,
        borderWidth: 2,
        borderColor: COLORS.primario,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    textoBotonSecundario: {
        color: COLORS.primario,
        fontSize: 14,
        fontWeight: "600",
    },
});
