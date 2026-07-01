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
    actualizarAtleta,
    verificarCompatibilidadGrupo
} from '../services/atletaService';

import { GRUPOS, DISCIPLINAS } from '../constants/opciones';

import { formatearFecha, parsearFecha } from '../utils/fechas';

export default function EditarAtletaScreen({ route, navigation }) {

    const { atleta } = route.params || {};

    const [nombre, setNombre] = useState(atleta?.nombre || "");
    const [apellido, setApellido] = useState(atleta?.apellido || "");
    const [fechaNacimiento, setFechaNacimiento] = useState(atleta?.fechaNacimiento || "");
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [disciplina, setDisciplina] = useState(atleta?.disciplina || "");
    const [grupo, setGrupo] = useState(atleta?.grupo || "");

    function onCambiarFecha(event, fechaSeleccionada) {

        setMostrarCalendario(Platform.OS === "ios");

        if (fechaSeleccionada) {
            setFechaNacimiento(formatearFecha(fechaSeleccionada));
        }
    }

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
                        onPress: () => confirmarActualizacion()
                    }
                ]
            );

            return;
        }

        confirmarActualizacion();
    }

    function confirmarActualizacion() {
        if (!atleta?.id) {
            Alert.alert("Error", "Atleta no válido.");
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

        Alert.alert("Éxito", "Perfil actualizado correctamente.");
        navigation.goBack();
    }

    return (

        <View style={{ flex: 1, padding: 20 }}>

            <Text>Editar Atleta</Text>

            <TextInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                placeholderTextColor="#B9ABAE"
            />

            <TextInput
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
                placeholderTextColor="#B9ABAE"
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

            <Button title="Actualizar" onPress={actualizar} />

            <Button title="Cancelar" onPress={() => navigation.goBack()} />

        </View>
    );
}