import { 
    View, 
    Text, 
    TextInput, 
    Button,
    Alert
} from 'react-native';

import { 
    useState,
    useContext,
    useCallback
} from 'react';

import { useFocusEffect } from '@react-navigation/native';


import {
    loginUsuario,
    existeUsuarioRegistrado
} from '../services/usuarioService';


import {
    guardarSesion
} from '../services/sesionService';

import { SessionContext } from '../context/SessionContext';



export default function Login({navigation}){

    const { iniciarSesionApp } = useContext(SessionContext);

    const [correo,setCorreo] = useState("");

    const [password,setPassword] = useState("");

    const [mostrarRegistro, setMostrarRegistro] = useState(true);



    useFocusEffect(

        useCallback(()=>{

            setMostrarRegistro(
                !existeUsuarioRegistrado()
            );

        },[])

    );




    async function iniciarSesion(){


        const resultado = loginUsuario(

            correo,

            password

        );




        if(resultado.correcto){



            await guardarSesion(

                resultado.usuario

            );



            iniciarSesionApp(

                resultado.usuario

            );


        }

        else{


            Alert.alert(

                "Error",

                resultado.mensaje

            );


        }


    }





    return(

        <View>


            <Text>

                CLUB LINCES

            </Text>





            <TextInput

                placeholder="Correo"

                value={correo}

                onChangeText={setCorreo}

            />





            <TextInput

                placeholder="Contraseña"

                value={password}

                secureTextEntry={true}

                onChangeText={setPassword}

            />





            <Button

                title="Ingresar"

                onPress={iniciarSesion}

            />





            {
                mostrarRegistro &&

                <Button

                    title="Crear cuenta entrenador"

                    onPress={()=>


                        navigation.navigate(

                            "Registro"

                        )


                    }

                />
            }


        </View>


    );


}