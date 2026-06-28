import { 
    View, 
    Button,
    Alert
} from 'react-native';

import { useContext } from 'react';

import { SessionContext } from '../context/SessionContext';


export default function Home({navigation}){

    const { cerrarSesionApp } = useContext(SessionContext);


    function cerrarSesion(){

        Alert.alert(

            "Cerrar sesión",

            "¿Seguro que querés cerrar sesión?",

            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: () => cerrarSesionApp()
                }
            ]

        );

    }



    return(

        <View>


            <Button

                title="Ver atletas"

                onPress={() => 
                    navigation.navigate('Atletas')
                }

            />



            <Button

                title="Agenda"

                onPress={() => 
                    navigation.navigate('Agenda')
                }

            />



            <Button

                title="Competencias"

                onPress={() => 
                    navigation.navigate('Competencias')
                }

            />



            <Button

                title="Cerrar sesión"

                onPress={cerrarSesion}

            />


        </View>

    );

}