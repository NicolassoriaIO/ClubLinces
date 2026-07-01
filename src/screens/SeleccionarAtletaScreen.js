import React, { useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native';

import {
    obtenerAtletasPorGrupo,
    obtenerAtletas
} from '../services/atletaService';

export default function SeleccionarAtletaScreen({ route, navigation }) {

    const { sesion } = route.params || {};

    const [atletas, setAtletas] = useState([]);

    useFocusEffect(

        React.useCallback(() => {

            cargarAtletas();

        }, [])

    );

    function cargarAtletas() {

        if (sesion) {
            setAtletas(
                obtenerAtletasPorGrupo(sesion.grupo)
            );
        } else {
            setAtletas(obtenerAtletas());
        }

    }

    function handleSeleccionar(item) {
        if (sesion) {
            navigation.navigate("RegistrarRendimiento", {
                atleta: item,
                sesion
            });
        } else {
            navigation.navigate("DetalleRendimiento", {
                atleta: item
            });
        }
    }

    return (

        <View
            style={{
                flex: 1,
                padding: 20
            }}
        >

            <FlatList

                data={atletas}

                keyExtractor={(item) =>
                    item.id.toString()
                }

                renderItem={({ item }) => (

                    <TouchableOpacity

                        onPress={() => handleSeleccionar(item)}

                    >

                        <View
                            style={{
                                marginTop: 20,
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 8
                            }}
                        >

                            <Text>

                                {item.nombre} {item.apellido}

                                {"\n"}

                                {item.categoria}

                            </Text>

                        </View>

                    </TouchableOpacity>

                )}

            />

        </View>

    );

}