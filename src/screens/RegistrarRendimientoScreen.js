import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert
} from 'react-native';

import {
    registrarRendimiento
} from '../services/rendimientoService';



export default function RegistrarRendimientoScreen({ route, navigation }) {

    const { atleta, sesion } = route.params;

    const [disciplina, setDisciplina] = useState("");

    const [resultado, setResultado] = useState("");



    function guardar() {

        if (
            disciplina === "" ||
            resultado === ""
        ) {

            Alert.alert(
                "Campos incompletos",
                "Debe completar todos los campos."
            );

            return;

        }

        const valorNumerico = parseFloat(resultado);

        if (
            isNaN(valorNumerico) ||
            valorNumerico < 0
        ) {

            Alert.alert(
                "Valor inválido",
                "Ingrese un resultado numérico válido."
            );

            return;

        }



        registrarRendimiento({

            atletaId: atleta.id,

            sesionId: sesion.id,

            disciplina,

            resultado: valorNumerico,

            fecha: new Date().toISOString()

        });



        Alert.alert(
            "Éxito",
            "Marca registrada correctamente."
        );



        navigation.goBack();

    }



    return (

        <View
            style={{
                flex: 1,
                padding: 20
            }}
        >

            <Text>

                Atleta:
                {"\n"}
                {atleta.nombre} {atleta.apellido}

            </Text>



                <Picker

                    selectedValue={disciplina}

                    onValueChange={setDisciplina}

                >

                    <Picker.Item

                        label="Seleccione una disciplina"

                        value=""

                    />

                    <Picker.Item

                        label="Velocidad"

                        value="Velocidad"

                    />

                    <Picker.Item

                        label="Resistencia"

                        value="Resistencia"

                    />

                    <Picker.Item

                        label="Coordinación"

                        value="Coordinación"

                    />

                    <Picker.Item

                        label="Técnica"

                        value="Técnica"

                    />

                </Picker>



            <TextInput

                placeholder="Resultado"

                value={resultado}

                onChangeText={setResultado}

                keyboardType="numeric"

            />



            <Button

                title="Guardar marca"

                onPress={guardar}

            />

        </View>

    );

}