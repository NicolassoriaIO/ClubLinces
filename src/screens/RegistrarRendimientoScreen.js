import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import {
    registrarRendimiento,
    validarRangoResultado
} from '../services/rendimientoService';

import { DISCIPLINAS } from '../constants/opciones';



export default function RegistrarRendimientoScreen({ route, navigation }) {

    const { atleta, sesion } = route.params;

    const [disciplina, setDisciplina] = useState("");
    const [resultado, setResultado] = useState("");



    function guardar() {

        if (disciplina === "" || resultado === "") {
            Alert.alert(
                "Campos incompletos",
                "Debe completar todos los campos."
            );
            return;
        }

        const valorNumerico = parseFloat(resultado);

        // HU-07 crit. 3: no negativo
        if (isNaN(valorNumerico) || valorNumerico < 0) {
            Alert.alert(
                "Valor inválido",
                "Ingrese un resultado numérico válido (mayor o igual a 0)."
            );
            return;
        }

   
        const errorRango = validarRangoResultado(disciplina, valorNumerico);
        if (errorRango) {
            Alert.alert("Valor fuera de rango", errorRango);
            return;
        }

        registrarRendimiento({
            atletaId: atleta.id,
            sesionId: sesion.id,
            disciplina,
            resultado: valorNumerico,
            fecha: new Date().toISOString()
        });

        Alert.alert("Éxito", "Marca registrada correctamente.");
        navigation.goBack();
    }



    return (

        <View style={styles.contenedor}>

            <Text style={styles.tituloAtleta}>
                Atleta: {atleta.nombre} {atleta.apellido}
            </Text>

            <Text style={styles.etiqueta}>Disciplina</Text>

            <Picker
                selectedValue={disciplina}
                onValueChange={setDisciplina}
            >
                <Picker.Item label="Seleccione una disciplina" value="" />
                {DISCIPLINAS.map((d) => (
                    <Picker.Item key={d} label={d} value={d} />
                ))}
            </Picker>

            <TextInput
                placeholder="Resultado"
                value={resultado}
                onChangeText={setResultado}
                keyboardType="numeric"
                style={styles.input}
            />

            <Button title="Guardar marca" onPress={guardar} />

        </View>
    );
}



const styles = StyleSheet.create({

    contenedor: {
        flex: 1,
        padding: 20
    },

    tituloAtleta: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16
    },

    etiqueta: {
        marginTop: 10,
        fontWeight: "600"
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginTop: 12,
        marginBottom: 16
    }
});
