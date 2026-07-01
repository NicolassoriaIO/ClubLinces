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
    actualizarSesion
} from '../services/agendaService';

import {
    GRUPOS
} from '../constants/opciones';

import {
    formatearFecha,
    parsearFecha
} from '../utils/fechas';

export default function EditarSesionScreen({
    route,
    navigation
}) {

    const { sesion } = route.params;

    const [fecha, setFecha] = useState(sesion.fecha);

    const [mostrarCalendario, setMostrarCalendario] = useState(false);

    const [horaInicio, setHoraInicio] = useState(sesion.horaInicio);

    const [horaFin, setHoraFin] = useState(sesion.horaFin);

    const [lugar, setLugar] = useState(sesion.lugar);

    const [grupo, setGrupo] = useState(sesion.grupo);

    const [descripcion, setDescripcion] = useState(sesion.descripcion);

    function onCambiarFecha(event, fechaSeleccionada) {

        setMostrarCalendario(Platform.OS === "ios");

        if (fechaSeleccionada) {

            setFecha(
                formatearFecha(fechaSeleccionada)
            );

        }

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

        actualizarSesion(

            sesion.id,

            {
                fecha,
                horaInicio,
                horaFin,
                lugar,
                grupo,
                descripcion
            }

        );

        Alert.alert(
            "Éxito",
            "Sesión actualizada correctamente"
        )

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
                Editar sesión
            </Text>

            <Text style={{ marginTop: 10 }}>
                Fecha
            </Text>

            <Button

                title={fecha === "" ? "Seleccionar fecha" : fecha}

                onPress={() => setMostrarCalendario(true)}

            />

            {
                mostrarCalendario &&

                <DateTimePicker

                    value={

                        fecha === ""

                            ? new Date()

                            : parsearFecha(fecha)

                    }

                    mode="date"

                    display="default"

                    onChange={onCambiarFecha}

                />
            }

            <TextInput
                placeholder="Hora inicio"
                value={horaInicio}
                onChangeText={setHoraInicio}
                style={{ marginTop: 10 }}
            />

            <TextInput
                placeholder="Hora fin"
                value={horaFin}
                onChangeText={setHoraFin}
            />

            <TextInput
                placeholder="Lugar"
                value={lugar}
                onChangeText={setLugar}
            />

            <Text style={{ marginTop: 10 }}>
                Grupo
            </Text>

            <Picker

                selectedValue={grupo}

                onValueChange={setGrupo}

            >

                <Picker.Item label="Seleccione un grupo" value="" />

                {
                    GRUPOS.map((g) => (

                        <Picker.Item key={g} label={g} value={g} />

                    ))
                }

            </Picker>

            <TextInput
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <Button

                title="Actualizar"

                onPress={guardar}

            />

        </View>

    );

}