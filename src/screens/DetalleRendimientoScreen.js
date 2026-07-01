import { useState, useEffect } from 'react';

import {
    obtenerRendimientosPorAtleta
} from '../services/rendimientoService';

import { DISCIPLINAS } from '../constants/opciones';

import { formatearFecha, parsearFecha } from '../utils/fechas';

import {
    View,
    Text,
    FlatList
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

export default function DetalleRendimientoScreen({ route }) {

    const { atleta } = route.params || {};

    const [rendimientos, setRendimientos] = useState([]);

    const [disciplina, setDisciplina] = useState("");

    useEffect(() => {

        cargarRendimientos();

    }, []);

    function cargarRendimientos() {
        if (atleta?.id) {
            setRendimientos(
                obtenerRendimientosPorAtleta(atleta.id)
            );
        }
    }

    const lista = rendimientos.filter((item) =>

        disciplina === "" ||

        item.disciplina === disciplina

    );

    const ultimos = lista

        .slice(0,10)

        .reverse();

    return (

        <View

            style={{

                flex:1,

                padding:20

            }}

        >

            <Text>

                Historial de rendimiento

                {"\n"}

                {atleta.nombre} {atleta.apellido}

            </Text>

            {

                atleta.activo === 0 && (

                    <Text>

                        Atleta inactivo

                    </Text>

                )

            }

            <Picker

                selectedValue={disciplina}

                onValueChange={setDisciplina}

            >

                <Picker.Item

                    label="Todas"

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

            <Text>

                Evolución últimos registros

            </Text>

            <View

                style={{

                    height:150,

                    borderWidth:1,

                    marginTop:10,

                    padding:10,

                    justifyContent:"flex-end"

                }}

            >

                {

                    ultimos.map((item,index)=>(

                        <View

                            key={item.id}

                            style={{

                                flexDirection:"row",

                                alignItems:"center",

                                marginTop:5

                            }}

                        >

                            <Text>

                                {index + 1}

                            </Text>

                            <View

                                style={{

                                    width:Number(item.resultado) * 5,

                                    height:10,

                                    borderWidth:1,

                                    marginLeft:10

                                }}

                            />

                            <Text>

                                {item.resultado}

                            </Text>

                        </View>

                    ))

                }

            </View>

            <FlatList

                data={lista}

                keyExtractor={(item)=>

                    item.id.toString()

                }

                renderItem={({item})=>(

                    <View

                        style={{

                            marginTop:20,

                            padding:10,

                            borderWidth:1,

                            borderRadius:8

                        }}

                    >

                        <Text>

                            Disciplina: {item.disciplina}

                            {"\n"}

                            Resultado: {item.resultado}

                            {"\n"}

                            Fecha: {formatearFecha(parsearFecha(item.fecha))}

                            {"\n"}

                            {

                                item.marcaPersonal === 1

                                ?

                                "★ Marca Personal"

                                :

                                ""

                            }

                        </Text>

                    </View>

                )}

                ListEmptyComponent={

                    <Text>

                        Aún no hay marcas registradas para este atleta.

                    </Text>

                }

            />

        </View>

    );

}