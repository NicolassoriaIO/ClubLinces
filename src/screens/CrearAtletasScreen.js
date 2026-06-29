import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    Platform
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
    insertarAtleta,
    verificarCompatibilidadGrupo
} from '../services/atletaService';

import { GRUPOS, DISCIPLINAS } from '../constants/opciones';

import { formatearFecha, parsearFecha } from '../utils/fechas';



export default function CrearAtletaScreen({ navigation }) {

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [disciplina, setDisciplina] = useState("");
    const [grupo, setGrupo] = useState("");



    function onCambiarFecha(event, fechaSeleccionada) {

        setMostrarCalendario(Platform.OS === "ios");

        if (fechaSeleccionada) {
            setFechaNacimiento(formatearFecha(fechaSeleccionada));
        }
    }



    function guardar() {

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

        const advertencia = verificarCompatibilidadGrupo(fechaNacimiento, grupo);

        if (advertencia) {

            Alert.alert(
                "Grupo y categoría no coinciden",
                advertencia,
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Continuar igual",
                        onPress: () => confirmarGuardado()
                    }
                ]
            );

            return;
        }

        confirmarGuardado();
    }



    function confirmarGuardado() {

        insertarAtleta(nombre, apellido, fechaNacimiento, disciplina, grupo);

        Alert.alert("Éxito", "El atleta fue registrado correctamente.");

        limpiar();
        navigation.goBack();
    }



    function limpiar() {
        setNombre("");
        setApellido("");
        setFechaNacimiento("");
        setDisciplina("");
        setGrupo("");
    }



    return (

        <View style={{ flex: 1, padding: 20 }}>

            <Text style={{ fontSize: 22, marginBottom: 20 }}>
                Registrar Atleta
            </Text>

            <TextInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                style={{ marginBottom: 10 }}
            />

            <TextInput
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
                style={{ marginBottom: 10 }}
            />

            <Text>Fecha de nacimiento</Text>

            <Button
                title={fechaNacimiento === "" ? "Seleccionar fecha" : fechaNacimiento}
                onPress={() => setMostrarCalendario(true)}
            />

            {
                mostrarCalendario &&
                <DateTimePicker
                    value={fechaNacimiento === "" ? new Date(2010, 0, 1) : parsearFecha(fechaNacimiento)}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={onCambiarFecha}
                />
            }

            <Text style={{ marginTop: 10 }}>Disciplina</Text>

            <Picker selectedValue={disciplina} onValueChange={setDisciplina}>
                <Picker.Item label="Seleccione una disciplina" value="" />
                {DISCIPLINAS.map((d) => (
                    <Picker.Item key={d} label={d} value={d} />
                ))}
            </Picker>

            <Text>Grupo</Text>

            <Picker selectedValue={grupo} onValueChange={setGrupo}>
                <Picker.Item label="Seleccione un grupo" value="" />
                {GRUPOS.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                ))}
            </Picker>

            <Button title="Guardar" onPress={guardar} />

        </View>
    );
}