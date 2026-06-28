import {
    useState,
    useEffect
} from 'react';


import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    Alert
} from 'react-native';


import {
    obtenerConvocados,
    registrarResultado
} from '../services/competenciaService';



export default function ResultadosCompetenciaScreen({route}) {


    const { competencia } = route.params;


    const [atletas,setAtletas] = useState([]);



    useEffect(()=>{


        cargar();


    },[]);





    function cargar(){


        setAtletas(

            obtenerConvocados(

                competencia.id

            )

        );


    }





    function guardar(item, posicion, marca){



        if(posicion === "" || marca === ""){


            Alert.alert(

                "Completa los datos"

            );


            return;

        }





        registrarResultado({



            competenciaId: competencia.id,


            atletaId: item.id,


            posicion: Number(posicion),


            marca,


            fecha: new Date().toISOString()



        });





        Alert.alert(

            "Resultado guardado correctamente"

        );


    }






    return(



        <View


            style={{


                flex:1,

                padding:20


            }}



        >



            <Text>


                Resultados:

                {competencia.nombre}


            </Text>





            <FlatList


                data={atletas}



                keyExtractor={(item)=>

                    item.id.toString()

                }





                renderItem={({item})=>{



                    const [posicion,setPosicion] = useState("");

                    const [marca,setMarca] = useState("");



                    return(



                        <View


                            style={{


                                marginTop:20,

                                padding:10,

                                borderWidth:1


                            }}


                        >



                            <Text>


                                {item.nombre}

                                {" "}

                                {item.apellido}


                            </Text>





                            <TextInput


                                placeholder="Posición"


                                keyboardType="numeric"


                                value={posicion}


                                onChangeText={setPosicion}


                                style={{


                                    borderWidth:1,

                                    marginTop:10,

                                    padding:5


                                }}


                            />





                            <TextInput


                                placeholder="Marca"


                                value={marca}


                                onChangeText={setMarca}


                                style={{


                                    borderWidth:1,

                                    marginTop:10,

                                    padding:5


                                }}


                            />





                            <Button


                                title="Guardar resultado"


                                onPress={()=>


                                    guardar(

                                        item,

                                        posicion,

                                        marca

                                    )


                                }


                            />



                        </View>


                    );


                }}



            />




        </View>


    );

}