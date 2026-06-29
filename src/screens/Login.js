import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity
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


        const resultado = loginUsuario(

            correo,

            password

        );



        if(resultado.correcto){



            await guardarSesion(

                resultado.usuario

            );



            iniciarSesionApp(

                resultado.usuario

            );


        }
        else{


            Alert.alert(

                "Error",

                resultado.mensaje

            );


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
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("RecuperarContrasenia")}
            >
                <Text style={styles.enlace}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </TouchableOpacity>

            <Button
                title="Ingresar"
                onPress={iniciarSesion}
                color={COLORS.primario}
            />

            {
                mostrarRegistro &&
                <Button
                    title="Crear cuenta entrenador"
                    onPress={()=>

                        navigation.navigate(
                            "Registro"
                        )

                    }
                />
            }

        </View>

    );


}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: COLORS.fondo,
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: COLORS.primario,
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.borde,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: COLORS.blanco,
    },
    enlace: {
        color: COLORS.primario,
        textAlign: "right",
        marginBottom: 16,
    },
});
