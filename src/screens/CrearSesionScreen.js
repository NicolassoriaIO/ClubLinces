// src/screens/CrearSesionScreen.js
//
// HU-04 — Crear sesión de entrenamiento
// Crit. 3: fecha en pasado → bloquea con mensaje.

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

import { insertarSesion } from '../services/agendaService';

import { GRUPOS } from '../constants/opciones';

import { formatearFecha, parsearFecha } from '../utils/fechas';



export default function CrearSesionScreen({ navigation }) {

    const [fecha, setFecha] = useState("");
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [lugar, setLugar] = useState("");
    const [grupo, setGrupo] = useState("");
    const [descripcion, setDescripcion] = useState("");



    function onCambiarFecha(event, fechaSeleccionada) {

        setMostrarCalendario(Platform.OS === "ios");

        if (fechaSeleccionada) {
            setFecha(formatearFecha(fechaSeleccionada));
        }
    }



    // HU-04 crit. 3: compara la fecha seleccionada con hoy (sin hora).
    function esFechaEnPasado(fechaStr) {

        const seleccionada = parsearFecha(fechaStr);
        const hoy = new Date();

        // Normalizar a medianoche para comparar solo fechas
        hoy.setHours(0, 0, 0, 0);
        seleccionada.setHours(0, 0, 0, 0);

        return seleccionada < hoy;
    }



    function guardar() {

        if (
            fecha === "" ||
            horaInicio === "" ||
            horaFin === "" ||
            lugar === "" ||
            grupo === "" ||
            descripcion === ""
        ) {
            Alert.alert(
                "Campos incompletos",
                "Debe completar todos los campos."
            );
            return;
        }

        // HU-04 crit. 3
        if (esFechaEnPasado(fecha)) {
            Alert.alert(
                "Fecha inválida",
                "No se pueden programar sesiones en fechas pasadas."
            );
            return;
        }

        insertarSesion({
            fecha,
            horaInicio,
            horaFin,
            lugar,
            grupo,
            descripcion
        });

        Alert.alert("Éxito", "Sesión guardada correctamente");
        navigation.goBack();
    }



    return (

        <View style={{ flex: 1, padding: 20 }}>

            <Text>Crear sesión de entrenamiento</Text>

            <Text style={{ marginTop: 10 }}>Fecha</Text>

            <Button
                title={fecha === "" ? "Seleccionar fecha" : fecha}
                onPress={() => setMostrarCalendario(true)}
            />

            {
                mostrarCalendario &&
                <DateTimePicker
                    value={fecha === "" ? new Date() : parsearFecha(fecha)}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}   // bloquea pasado en el picker también
                    onChange={onCambiarFecha}
                />
            }

            <TextInput
                placeholder="Hora inicio (ej. 08:00)"
                value={horaInicio}
                onChangeText={setHoraInicio}
                style={{ marginTop: 10 }}
            />

            <TextInput
                placeholder="Hora fin (ej. 10:00)"
                value={horaFin}
                onChangeText={setHoraFin}
            />

            <TextInput
                placeholder="Lugar"
                value={lugar}
                onChangeText={setLugar}
            />

            <Text style={{ marginTop: 10 }}>Grupo</Text>

            <Picker selectedValue={grupo} onValueChange={setGrupo}>
                <Picker.Item label="Seleccione un grupo" value="" />
                {GRUPOS.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                ))}
            </Picker>

            <TextInput
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <Button title="Guardar" onPress={guardar} />

        </View>
    );
}
