import {
    useState
} from 'react';


import {
    View,
    Text,
    TextInput,
    Button,
    Alert
} from 'react-native';


import {
    crearCompetencia
} from '../services/competenciaService';



export default function CrearCompetenciaScreen({ navigation }) {



    const [nombre,setNombre] = useState("");

    const [fecha,setFecha] = useState("");

    const [lugar,setLugar] = useState("");

    const [disciplinas,setDisciplinas] = useState("");





    function guardar(){



        if(

            nombre === "" ||

            fecha === "" ||

            lugar === ""

        ){


            Alert.alert(

                "Completa los campos"

            );


            return;


        }





        crearCompetencia({


            nombre,

            fecha,

            lugar,

            disciplinas


        });





        Alert.alert(

            "Competencia guardada correctamente"

        );



        navigation.goBack();



    }





    return(



        <View


            style={{


                flex:1,

                padding:20


            }}



        >



            <Text>


                Nueva competencia


            </Text>





            <TextInput


                placeholder="Nombre"


                value={nombre}


                onChangeText={setNombre}


                style={{

                    borderWidth:1,

                    marginTop:10,

                    padding:10

                }}


            />






            <TextInput


                placeholder="Fecha"


                value={fecha}


                onChangeText={setFecha}


                style={{

                    borderWidth:1,

                    marginTop:10,

                    padding:10

                }}


            />






            <TextInput


                placeholder="Lugar"


                value={lugar}


                onChangeText={setLugar}


                style={{

                    borderWidth:1,

                    marginTop:10,

                    padding:10

                }}


            />







            <TextInput


                placeholder="Disciplinas"


                value={disciplinas}


                onChangeText={setDisciplinas}


                style={{

                    borderWidth:1,

                    marginTop:10,

                    padding:10

                }}


            />






            <Button


                title="Guardar competencia"


                onPress={guardar}


            />



        </View>



    );


}