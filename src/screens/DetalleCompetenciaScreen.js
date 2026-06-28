import {
    useState,
    useEffect
} from 'react';


import {
    View,
    Text,
    Button,
    FlatList,
    Alert
} from 'react-native';


import {
    obtenerTodosAtletas
} from '../services/atletaService';


import {
    convocarAtleta,
    obtenerConvocados
} from '../services/competenciaService';

import {
    generarPDFConvocatoria
} from '../services/pdfServices';

import {
    obtenerResultados
} from '../services/competenciaService';


import {
    generarPDFResultados
} from '../services/pdfServices';




export default function DetalleCompetenciaScreen({route, navigation}){


    const { competencia } = route.params;


    const [atletas,setAtletas] = useState([]);

    const [convocados,setConvocados] = useState([]);





    useEffect(()=>{


        cargar();


    },[]);





    function cargar(){


        setAtletas(

            obtenerTodosAtletas()

        );


        setConvocados(

            obtenerConvocados(

                competencia.id

            )

        );


    }






    function seleccionar(id){


        const yaConvocado = convocados.some(
            (c) => c.id === id
        );

        if(yaConvocado){

            Alert.alert(

                "Atleta ya convocado",

                "Este atleta ya fue convocado a esta competencia."

            );

            return;

        }


        convocarAtleta(

            competencia.id,

            id

        );


        cargar();


    }





    return(



        <View


            style={{


                flex:1,

                padding:20


            }}


        >




            <Text>


                Competencia:
                {competencia.nombre}


                {"\n"}


                Fecha:
                {competencia.fecha}


                {"\n"}


                Lugar:
                {competencia.lugar}


            </Text>







            <Button


                title="Registrar resultados"


                onPress={()=>


                    navigation.navigate(

                        "ResultadosCompetencia",

                        {

                            competencia

                        }

                    )


                }


            />

            <Button

                title="Exportar convocatoria PDF"

                onPress={()=>


                generarPDFConvocatoria(

                    competencia,

                    convocados

                )


                }

            />

            <Button

                title="Exportar resultados PDF"


                onPress={()=>{


                const resultados = obtenerResultados(

                competencia.id

                );



                generarPDFResultados(

                competencia,

                resultados

                );



                }}

            />






            <Text>


                Atletas convocados


            </Text>






            <FlatList


                data={convocados}


                keyExtractor={(item)=>

                    item.id.toString()

                }


                renderItem={({item})=>(


                    <Text>


                        {item.nombre}

                        {" "}

                        {item.apellido}


                    </Text>


                )}



            />







            <Text>


                Seleccionar atletas


            </Text>







            <FlatList


                data={atletas}


                keyExtractor={(item)=>

                    item.id.toString()

                }




                renderItem={({item})=>(



                    <View



                        style={{


                            marginTop:10,

                            borderWidth:1,

                            padding:10


                        }}



                    >




                        <Text>


                            {item.nombre}

                            {" "}

                            {item.apellido}


                        </Text>






                        <Button


                            title="Convocar"


                            onPress={()=>


                                seleccionar(item.id)


                            }



                        />





                    </View>



                )}



            />





        </View>



    );


}