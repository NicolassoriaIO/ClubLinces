import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert
} from 'react-native';

import {
    actualizarAtleta
} from '../services/atletaService';



export default function EditarAtletaScreen({ route, navigation }) {


    const { atleta } = route.params;



    const [nombre, setNombre] = useState(atleta.nombre);

    const [apellido, setApellido] = useState(atleta.apellido);

    const [fechaNacimiento, setFechaNacimiento] = useState(atleta.fechaNacimiento);

    const [disciplina, setDisciplina] = useState(atleta.disciplina);

    const [grupo, setGrupo] = useState(atleta.grupo);




    function actualizar() {


        if (

            nombre === "" ||

            apellido === "" ||

            fechaNacimiento === "" ||

            disciplina === "" ||

            grupo === ""

        ) {

            Alert.alert(
                "Campos incompletos",
                "Debe completar todos los campos."
            );

            return;

        }



        actualizarAtleta(

            atleta.id,

            nombre,

            apellido,

            fechaNacimiento,

            disciplina,

            grupo

        );

        Alert.alert(
            "Éxito",
            "Perfil actualizado correctamente"
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

                Editar Atleta

            </Text>



            <TextInput

                placeholder="Nombre"

                value={nombre}

                onChangeText={setNombre}

            />



            <TextInput

                placeholder="Apellido"

                value={apellido}

                onChangeText={setApellido}

            />



            <TextInput

                placeholder="Fecha Nacimiento (YYYY-MM-DD)"

                value={fechaNacimiento}

                onChangeText={setFechaNacimiento}

            />



            <TextInput

                placeholder="Disciplina"

                value={disciplina}

                onChangeText={setDisciplina}

            />



            <TextInput

                placeholder="Grupo"

                value={grupo}

                onChangeText={setGrupo}

            />



            <Button

                title="Actualizar"

                onPress={actualizar}

            />



            <Button

                title="Cancelar"

                onPress={() => navigation.goBack()}

            />


        </View>

    );

}