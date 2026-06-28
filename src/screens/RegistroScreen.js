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
    registrarUsuario
} from '../services/usuarioService';



export default function RegistroScreen({navigation}){


    const [nombre,setNombre] = useState("");

    const [correo,setCorreo] = useState("");

    const [password,setPassword] = useState("");



    function registrar(){

        if(
            nombre === "" ||
            correo === "" ||
            password === ""
        ){

            Alert.alert(
                "Campos incompletos",
                "Debe completar todos los campos."
            );

            return;

        }

        try{

            registrarUsuario(

                nombre,

                correo,

                password

            );

            Alert.alert(
                "Éxito",
                "Cuenta creada correctamente"
            );

            navigation.navigate("Login");

        }
        catch(error){

            if(
                error.message &&
                error.message.includes("UNIQUE")
            ){

                Alert.alert(
                    "Correo ya registrado",
                    "Ya existe una cuenta con ese correo. Intenta iniciar sesión."
                );

            }
            else{

                Alert.alert(
                    "Error",
                    "No se pudo crear la cuenta. Intenta nuevamente."
                );

            }

        }

    }






    return(


        <View

            style={{

                flex:1,

                padding:20

            }}

        >



            <Text>

                Crear cuenta entrenador

            </Text>





            <TextInput

                placeholder="Nombre"

                value={nombre}

                onChangeText={setNombre}

            />





            <TextInput

                placeholder="Correo"

                value={correo}

                onChangeText={setCorreo}

                keyboardType="email-address"

            />





            <TextInput

                placeholder="Contraseña"

                value={password}

                onChangeText={setPassword}

                secureTextEntry

            />






            <Button

                title="Crear cuenta"

                onPress={registrar}

            />




        </View>


    );


}