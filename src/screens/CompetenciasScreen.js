import {
    useState,
    useCallback
} from 'react';


import {
    useFocusEffect
} from '@react-navigation/native';


import {
    View,
    Text,
    Button,
    FlatList
} from 'react-native';


import {
    obtenerCompetencias
} from '../services/competenciaService';



export default function CompetenciasScreen({ navigation }) {


    const [competencias, setCompetencias] = useState([]);



    useFocusEffect(

        useCallback(()=>{

            cargarCompetencias();

        },[])

    );




    function cargarCompetencias(){


        setCompetencias(

            obtenerCompetencias()

        );


    }





    return (


        <View

            style={{

                flex:1,

                padding:20

            }}

        >



            <Text>


                Competencias


            </Text>





            <Button

                title="Nueva competencia"

                onPress={()=>


                    navigation.navigate(

                        "CrearCompetencia"

                    )


                }


            />





            <FlatList



                data={competencias}



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


                            Nombre:
                            {item.nombre}


                            {"\n"}


                            Fecha:
                            {item.fecha}


                            {"\n"}


                            Lugar:
                            {item.lugar}


                        </Text>





                        <Button


                            title="Ver competencia"


                            onPress={()=>


                                navigation.navigate(

                                    "DetalleCompetencia",

                                    {

                                        competencia:item

                                    }


                                )


                            }


                        />


                    </View>


                )}




                ListEmptyComponent={


                    <Text>


                        No hay competencias registradas.


                    </Text>


                }


            />





        </View>

    );


}