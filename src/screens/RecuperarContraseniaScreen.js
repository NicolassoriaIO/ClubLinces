import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet
} from 'react-native';

import {
    obtenerPreguntasSeguridad,
    verificarPreguntasSeguridad,
    resetearPassword
} from '../services/usuarioService';

import {
    esCorreoValido,
    hayCamposVacios,
    esRespuestaSeguridadValida
} from '../utils/validaciones';

import { COLORS } from '../constants/theme';

// Flujo de 3 pasos, igual al "restablecer contraseña con preguntas de
// seguridad" de Windows:
//   1) El usuario escribe su correo -> el sistema muestra SUS preguntas.
//   2) El usuario responde ambas preguntas -> se verifican.
//   3) Si son correctas, puede definir una nueva contraseña.
const PASOS = {
    CORREO: 1,
    PREGUNTAS: 2,
    NUEVA_PASSWORD: 3,
};

export default function RecuperarContraseniaScreen({ navigation }) {

    const [paso, setPaso] = useState(PASOS.CORREO);

    const [correo, setCorreo] = useState("");
    const [pregunta1, setPregunta1] = useState("");
    const [pregunta2, setPregunta2] = useState("");

    const [respuesta1, setRespuesta1] = useState("");
    const [respuesta2, setRespuesta2] = useState("");

    const [usuarioId, setUsuarioId] = useState(null);

    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    function buscarPreguntas() {

        if (correo === "" || !esCorreoValido(correo)) {
            Alert.alert(
                "Correo inválido",
                "Ingrese un correo electrónico válido."
            );
            return;
        }

        const resultado = obtenerPreguntasSeguridad(correo);

        if (!resultado.existe) {
            Alert.alert(
                "No encontrado",
                resultado.mensaje
            );
            return;
        }

        setPregunta1(resultado.pregunta1);
        setPregunta2(resultado.pregunta2);
        setPaso(PASOS.PREGUNTAS);
    }

    function verificarRespuestas() {

        if (
            hayCamposVacios({ respuesta1, respuesta2 }) ||
            !esRespuestaSeguridadValida(respuesta1) ||
            !esRespuestaSeguridadValida(respuesta2)
        ) {
            Alert.alert(
                "Respuestas incompletas",
                "Responda ambas preguntas de seguridad."
            );
            return;
        }

        const resultado = verificarPreguntasSeguridad(
            correo,
            respuesta1,
            respuesta2
        );

        if (!resultado.correcto) {
            Alert.alert(
                "Respuestas incorrectas",
                resultado.mensaje
            );
            return;
        }

        setUsuarioId(resultado.usuarioId);
        setPaso(PASOS.NUEVA_PASSWORD);
    }

    function guardarNuevaPassword() {

        if (
            nuevaPassword === "" ||
            confirmarPassword === ""
        ) {
            Alert.alert(
                "Campos incompletos",
                "Ingrese y confirme la nueva contraseña."
            );
            return;
        }

        if (nuevaPassword.length < 6) {
            Alert.alert(
                "Contraseña muy corta",
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            Alert.alert(
                "No coincide",
                "Las contraseñas ingresadas no coinciden."
            );
            return;
        }

        resetearPassword(usuarioId, nuevaPassword);

        Alert.alert(
            "Éxito",
            "Tu contraseña fue actualizada. Ya puedes iniciar sesión.",
            [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Login"),
                },
            ]
        );
    }

    return (

        <View style={styles.contenedor}>

            <Text style={styles.titulo}>
                Recuperar contraseña
            </Text>

            {
                paso === PASOS.CORREO &&
                <View>

                    <Text style={styles.ayuda}>
                        Ingresa el correo de tu cuenta para mostrarte tus
                        preguntas de seguridad.
                    </Text>

                    <TextInput
                        placeholder="Correo"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <Button
                        title="Continuar"
                        onPress={buscarPreguntas}
                        color={COLORS.primario}
                    />

                </View>
            }

            {
                paso === PASOS.PREGUNTAS &&
                <View>

                    <Text style={styles.etiqueta}>
                        {pregunta1}
                    </Text>

                    <TextInput
                        placeholder="Tu respuesta"
                        value={respuesta1}
                        onChangeText={setRespuesta1}
                        style={styles.input}
                    />

                    <Text style={styles.etiqueta}>
                        {pregunta2}
                    </Text>

                    <TextInput
                        placeholder="Tu respuesta"
                        value={respuesta2}
                        onChangeText={setRespuesta2}
                        style={styles.input}
                    />

                    <Button
                        title="Verificar respuestas"
                        onPress={verificarRespuestas}
                        color={COLORS.primario}
                    />

                </View>
            }

            {
                paso === PASOS.NUEVA_PASSWORD &&
                <View>

                    <Text style={styles.ayuda}>
                        Define tu nueva contraseña.
                    </Text>

                    <TextInput
                        placeholder="Nueva contraseña"
                        value={nuevaPassword}
                        onChangeText={setNuevaPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Confirmar contraseña"
                        value={confirmarPassword}
                        onChangeText={setConfirmarPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Button
                        title="Guardar nueva contraseña"
                        onPress={guardarNuevaPassword}
                        color={COLORS.primario}
                    />

                </View>
            }

            <Button
                title="Volver al inicio de sesión"
                onPress={() => navigation.navigate("Login")}
            />

        </View>

    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.fondo,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.primario,
        marginBottom: 16,
    },
    ayuda: {
        color: COLORS.textoSecundario,
        marginBottom: 12,
    },
    etiqueta: {
        marginTop: 10,
        marginBottom: 6,
        fontWeight: "600",
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
