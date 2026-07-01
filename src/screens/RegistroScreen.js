import {
    useState
} from 'react';

import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
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
                placeholderTextColor="#999"
                style={styles.input}
            />

            <TextInput
                placeholder="Correo"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
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
                style={styles.picker}
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
                placeholderTextColor="#999"
                style={styles.input}
            />

            <Text style={styles.etiqueta}>
                Pregunta 2
            </Text>

            <Picker
                selectedValue={pregunta2}
                onValueChange={setPregunta2}
                style={styles.picker}
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
                placeholderTextColor="#999"
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.boton}
                onPress={registrar}
            >
                <Text style={styles.textoBiotn}>Crear cuenta entrenador</Text>
            </TouchableOpacity>

        </ScrollView>

    );

}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    contenedor: {
        padding: Math.max(width * 0.05, 16),
        backgroundColor: COLORS.fondo,
    },
    titulo: {
        fontSize: Math.max(width * 0.06, 20),
        fontWeight: "bold",
        color: COLORS.primario,
        marginBottom: Math.max(height * 0.02, 16),
    },
    seccion: {
        fontSize: Math.max(width * 0.045, 14),
        fontWeight: "bold",
        marginTop: Math.max(height * 0.02, 16),
        color: COLORS.texto,
    },
    ayuda: {
        color: COLORS.textoSecundario,
        marginBottom: 8,
        fontSize: Math.max(width * 0.035, 12),
    },
    etiqueta: {
        marginTop: 10,
        marginBottom: 5,
        color: COLORS.texto,
        fontWeight: "600",
        fontSize: Math.max(width * 0.04, 14),
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.borde,
        borderRadius: 8,
        padding: Math.max(width * 0.03, 10),
        marginBottom: 10,
        backgroundColor: COLORS.blanco,
        fontSize: 16,
        color: COLORS.texto,
    },
    picker: {
        borderWidth: 1,
        borderColor: COLORS.borde,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: COLORS.blanco,
        color: COLORS.texto,
    },
    boton: {
        backgroundColor: COLORS.primario,
        padding: 14,
        borderRadius: 8,
        marginTop: Math.max(height * 0.03, 20),
        marginBottom: Math.max(height * 0.02, 16),
        alignItems: "center",
    },
    textoBiotn: {
        color: COLORS.blanco,
        fontSize: 16,
        fontWeight: "bold",
    },
});
