// src/screens/AgendaScreen.js
//
// HU-05 — Consultar agenda semanal
// Crit. 3: sesión cancelada aparece tachada con etiqueta CANCELADO y motivo.
// Crit. 4: sin entrenamientos → mensaje "Sin entrenamientos esta semana".

import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet
} from 'react-native';

import { obtenerSesiones } from '../services/agendaService';

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
            filtrarSesionesSemana(todas, fechaActual)
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



    function renderSesion({ item }) {

        const estaCancelada = item.estado === "CANCELADA";

        return (

            <View
                style={[
                    styles.card,
                    estaCancelada && styles.cardCancelada
                ]}
            >
                {/* HU-05 crit. 3: etiqueta CANCELADO */}
                {estaCancelada && (
                    <Text style={styles.chipCancelado}>CANCELADO</Text>
                )}

                {/* HU-05 crit. 3: texto tachado si cancelada */}
                <Text
                    style={[
                        styles.textoInfo,
                        estaCancelada && styles.tachado
                    ]}
                >
                    {item.fecha}{"\n"}
                    {item.horaInicio} - {item.horaFin}{"\n"}
                    {item.lugar}{"\n"}
                    {item.grupo}{"\n"}
                    {item.descripcion}
                </Text>

                {/* HU-05 crit. 3: motivo de cancelación */}
                {estaCancelada && item.motivo ? (
                    <Text style={styles.textoMotivo}>
                        Motivo: {item.motivo}
                    </Text>
                ) : null}

                {/* Botón solo para sesiones no canceladas */}
                {!estaCancelada && (
                    <Button
                        title="Ver sesión"
                        onPress={() =>
                            navigation.navigate("DetalleSesion", { sesion: item })
                        }
                    />
                )}
            </View>
        );
    }



    return (

        <View style={styles.contenedor}>

            <Button
                title="Crear Sesión"
                onPress={() => navigation.navigate("CrearSesion")}
            />

            <View style={styles.filaSemana}>
                <Button title="◀" onPress={semanaAnterior} />
                <Text style={styles.textoSemana}>
                    {obtenerRangoSemana(fechaActual)}
                </Text>
                <Button title="▶" onPress={semanaSiguiente} />
            </View>

            <FlatList
                data={sesiones}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 30 }}
                renderItem={renderSesion}

                // HU-05 crit. 4
                ListEmptyComponent={
                    <Text style={styles.textoVacio}>
                        Sin entrenamientos esta semana.
                    </Text>
                }
            />

        </View>
    );
}



const styles = StyleSheet.create({

    contenedor: {
        flex: 1,
        padding: 20
    },

    filaSemana: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12
    },

    textoSemana: {
        fontWeight: "bold",
        fontSize: 14,
        flex: 1,
        textAlign: "center"
    },

    card: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ccc"
    },

    // HU-05 crit. 3: fondo levemente grisado para canceladas
    cardCancelada: {
        backgroundColor: "#f5f5f5",
        borderColor: "#aaa"
    },

    chipCancelado: {
        color: "#fff",
        backgroundColor: "#c0392b",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 6
    },

    textoInfo: {
        fontSize: 14,
        color: "#333"
    },

    // HU-05 crit. 3: texto tachado
    tachado: {
        textDecorationLine: "line-through",
        color: "#888"
    },

    textoMotivo: {
        marginTop: 6,
        color: "#c0392b",
        fontSize: 13,
        fontStyle: "italic"
    },

    textoVacio: {
        marginTop: 40,
        textAlign: "center",
        color: "#888"
    }
});
