import {
    useState
} from 'react';

import {
    View,
    Text,
    Button,
    TextInput,
    Alert
} from 'react-native';

import {
    cancelarSesion
} from '../services/agendaService';

export default function DetalleSesionScreen({ route, navigation }) {

    const { sesion } = route.params;

    const [motivo, setMotivo] = useState("");

    function cancelar() {

        if(motivo === ""){

            Alert.alert(
                "Falta motivo",
                "Debe ingresar el motivo de cancelación."
            );

            return;

        }

        cancelarSesion(

            sesion.id,

            motivo

        );

        Alert.alert(

            "Sesión cancelada",

            "La sesión fue cancelada correctamente."

        );

        navigation.goBack();

    }

    return (

        <View

            style={{
                flex:1,
                padding:20
            }}

        >

            <Text>

                Fecha: {sesion.fecha}

                {"\n"}

                Hora: {sesion.horaInicio} - {sesion.horaFin}

                {"\n"}

                Lugar: {sesion.lugar}

                {"\n"}

                Grupo: {sesion.grupo}

                {"\n"}

                Descripción: {sesion.descripcion}

                {"\n"}

                Estado: {sesion.estado}

            </Text>

            <Button

                title="Editar sesión"

                onPress={()=>

                    navigation.navigate(

                        "EditarSesion",

                        {

                            sesion

                        }

                    )

                }

            />

            <Button

                title="Registrar asistencia"

                onPress={()=>

                    navigation.navigate(

                        "Asistencia",

                        {

                            sesion

                        }

                    )

                }

            />
            
            <Button

                title="Registrar marcas"

                onPress={() =>

                    navigation.navigate(

                        "SeleccionarAtleta",

                        {

                            sesion

                        }

                    )

                }

            />

            <TextInput

                placeholder="Motivo de cancelación"

                value={motivo}

                onChangeText={setMotivo}

            />

            <Button

                title="Cancelar sesión"

                onPress={cancelar}

            />

        </View>

    );

}