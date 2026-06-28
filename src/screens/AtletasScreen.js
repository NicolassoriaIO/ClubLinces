import React, { useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity
} from 'react-native';

import {
    obtenerAtletas,
    desactivarAtleta
} from '../services/atletaService';



export default function AtletasScreen({ navigation }) {

    const [atletas, setAtletas] = useState([]);

    const [busqueda, setBusqueda] = useState("");



    useFocusEffect(

        React.useCallback(() => {

            cargarAtletas();

        }, [])

    );



    function cargarAtletas() {

        setAtletas(
            obtenerAtletas()
        );

    }



   


    const lista = atletas.filter((a) =>

        a.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase())

        ||

        a.apellido
            .toLowerCase()
            .includes(busqueda.toLowerCase())

    );



    return (

        <View
            style={{
                flex: 1,
                padding: 20
            }}
        >

            <Button
                title="Crear Atleta"
                onPress={() => navigation.navigate("CrearAtleta")}
            />



            <TextInput
                placeholder="Buscar atleta"
                value={busqueda}
                onChangeText={setBusqueda}
            />



            <FlatList

                data={lista}

                keyExtractor={(item) => item.id.toString()}

                contentContainerStyle={{
                    paddingBottom: 30
                }}

                renderItem={({ item }) => (

                    <TouchableOpacity

                        onPress={() =>
                            navigation.navigate(
                                "DetalleAtleta",
                                {
                                    atleta: item
                                }
                            )
                        }

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

                                Atleta-Código: {item.id}

                                {"\n"}

                                Nombre: {item.nombre} {item.apellido}

                                {"\n"}

                                Fecha de nacimiento: {item.fechaNacimiento}

                                {"\n"}

                                Categoría: {item.categoria}

                                {"\n"}

                                Disciplina: {item.disciplina}

                                {"\n"}

                                Grupo: {item.grupo}

                            </Text>



                            

                        </View>

                    </TouchableOpacity>

                )}

                ListEmptyComponent={

                    <Text>

                        No hay atletas registrados.

                    </Text>

                }

            />

        </View>

    );

}