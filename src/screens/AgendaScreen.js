import React, { useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
    View,
    Text,
    Button,
    FlatList
} from 'react-native';

import {
    obtenerSesiones
} from '../services/agendaService';

import {
    filtrarSesionesSemana,
    obtenerRangoSemana
} from '../services/agendaUtils';



export default function AgendaScreen({ navigation }) {


    const [sesiones, setSesiones] = useState([]);

    const [fechaActual, setFechaActual] = useState(new Date());



    useFocusEffect(

        React.useCallback(() => {

            cargarSesiones();

        }, [fechaActual])

    );



    function cargarSesiones() {

        const todas = obtenerSesiones();

        setSesiones(

            filtrarSesionesSemana(
            todas,
            fechaActual
            )

        );

    }

    function semanaAnterior() {

        const nueva = new Date(fechaActual);

        nueva.setDate(nueva.getDate() - 7);

        setFechaActual(nueva);

    }



    function semanaSiguiente() {

        const nueva = new Date(fechaActual);

        nueva.setDate(nueva.getDate() + 7);

        setFechaActual(nueva);

    }



    return (

        <View
            style={{
                flex: 1,
                padding: 20
            }}
        >

            <Button

                title="Crear Sesión"

                onPress={() =>
                    navigation.navigate("CrearSesion")
                }

            />

            <Button

                title="Semana anterior"

                onPress={semanaAnterior}

            />

            <Button

                title="Semana siguiente"

                onPress={semanaSiguiente}

            />

            <Text
                style={{
                    marginTop: 15,
                    marginBottom: 15,
                    fontWeight: "bold"
                }}
            >

                Semana:

                {" "}

                {obtenerRangoSemana(fechaActual)}

            </Text>    


            <FlatList

                data={sesiones}

                keyExtractor={(item) => item.id.toString()}

                contentContainerStyle={{
                    paddingBottom: 30
                }}

                renderItem={({ item }) => (

                    <View
                        style={{
                            marginTop: 20,
                            padding: 10,
                            borderWidth: 1,
                            borderRadius: 8
                        }}
                    >

                        <Text>

                            Fecha: {item.fecha}

                            {"\n"}

                            Hora: {item.horaInicio} - {item.horaFin}

                            {"\n"}

                            Lugar: {item.lugar}

                            {"\n"}

                            Grupo: {item.grupo}

                            {"\n"}

                            Descripción: {item.descripcion}

                            {"\n"}

                            Estado: {item.estado}

                        </Text>

                        <Button

                            title="Ver sesión"

                            onPress={() =>
                                navigation.navigate(
                                    "DetalleSesion",
                                    {
                                        sesion: item
                                    }
                                )
                            }

                        />


                    </View>

                )}

                ListEmptyComponent={

                    <Text>

                        No hay sesiones registradas.

                    </Text>

                }

            />

        </View>

    );

}