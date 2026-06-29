import {
    useState
} from 'react';


import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    ScrollView,
    StyleSheet
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import {
    registrarUsuario
} from '../services/usuarioService';

import {
    esCorreoValido,
    hayCamposVacios,
    esRespuestaSeguridadValida
} from '../utils/validaciones';

import {
    PREGUNTAS_SEGURIDAD
} from '../constants/opciones';

import { COLORS } from '../constants/theme';



export default function RegistroScreen({navigation}){


    const [nombre,setNombre] = useState("");

    const [correo,setCorreo] = useState("");

    const [password,setPassword] = useState("");

    // Preguntas de seguridad (estilo Windows): se eligen de un combobox
    // cerrado para evitar preguntas ambiguas, y se escribe la respuesta.
    const [pregunta1, setPregunta1] = useState("");
    const [respuesta1, setRespuesta1] = useState("");

    const [pregunta2, setPregunta2] = useState("");
    const [respuesta2, setRespuesta2] = useState("");


    function registrar(){

        if(
            hayCamposVacios({
                nombre,
                correo,
                password,
                pregunta1,
                respuesta1,
                pregunta2,
                respuesta2
            })
        ){

            Alert.alert(
                "Campos incompletos",
                "Debe completar todos los campos, incluyendo las dos preguntas de seguridad."
            );

            return;

        }

        if(!esCorreoValido(correo)){

            Alert.alert(
                "Correo inválido",
                "Ingrese un correo electrónico válido."
            );

            return;
        }

        if(pregunta1 === pregunta2){

            Alert.alert(
                "Preguntas repetidas",
                "Seleccione dos preguntas de seguridad diferentes."
            );

            return;
        }

        if(
            !esRespuestaSeguridadValida(respuesta1) ||
            !esRespuestaSeguridadValida(respuesta2)
        ){

            Alert.alert(
                "Respuesta muy corta",
                "Las respuestas de seguridad deben tener al menos 2 caracteres."
            );

            return;
        }

        try{

            registrarUsuario(
                nombre,
                correo,
                password,
                pregunta1,
                respuesta1,
                pregunta2,
                respuesta2
            );

            Alert.alert(
                "Éxito",
                "Cuenta creada correctamente"
            );

            navigation.replace("Login");
        }
        catch(error){

            if(
                error.message &&
                error.message.includes("UNIQUE")
            ){

                Alert.alert(
                    "Correo ya registrado",
                    "Ya existe una cuenta con ese correo. Intenta iniciar sesión."
                );

            }
            else{

                Alert.alert(
                    "Error",
                    "No se pudo crear la cuenta. Intenta nuevamente."
                );

            }

        }

    }


    return(

        <ScrollView
            contentContainerStyle={styles.contenedor}
        >

            <Text style={styles.titulo}>
                Crear cuenta entrenador
            </Text>

            <TextInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
            />

            <TextInput
                placeholder="Correo"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Text style={styles.seccion}>
                Preguntas de seguridad
            </Text>

            <Text style={styles.ayuda}>
                Se usarán para recuperar tu contraseña si la olvidas.
            </Text>

            <Text style={styles.etiqueta}>
                Pregunta 1
            </Text>

            <Picker
                selectedValue={pregunta1}
                onValueChange={setPregunta1}
            >
                <Picker.Item label="Seleccione una pregunta" value="" />
                {
                    PREGUNTAS_SEGURIDAD.map((p) => (
                        <Picker.Item key={p} label={p} value={p} />
                    ))
                }
            </Picker>

            <TextInput
                placeholder="Respuesta 1"
                value={respuesta1}
                onChangeText={setRespuesta1}
                style={styles.input}
            />

            <Text style={styles.etiqueta}>
                Pregunta 2
            </Text>

            <Picker
                selectedValue={pregunta2}
                onValueChange={setPregunta2}
            >
                <Picker.Item label="Seleccione una pregunta" value="" />
                {
                    PREGUNTAS_SEGURIDAD
                        .filter((p) => p !== pregunta1)
                        .map((p) => (
                            <Picker.Item key={p} label={p} value={p} />
                        ))
                }
            </Picker>

            <TextInput
                placeholder="Respuesta 2"
                value={respuesta2}
                onChangeText={setRespuesta2}
                style={styles.input}
            />

            <Button
                title="Crear cuenta"
                onPress={registrar}
                color={COLORS.primario}
            />

        </ScrollView>

    );


}

const styles = StyleSheet.create({
    contenedor: {
        padding: 20,
        backgroundColor: COLORS.fondo,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.primario,
        marginBottom: 16,
    },
    seccion: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 16,
        color: COLORS.texto,
    },
    ayuda: {
        color: COLORS.textoSecundario,
        marginBottom: 8,
    },
    etiqueta: {
        marginTop: 10,
        color: COLORS.texto,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.borde,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: COLORS.blanco,
    },
});
