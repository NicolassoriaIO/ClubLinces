import {
    useState
} from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    Platform
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
    crearCompetencia
} from '../services/competenciaService';

import {
    formatearFecha,
    parsearFecha
} from '../utils/fechas';

export default function CrearCompetenciaScreen({ navigation }) {

    const [nombre,setNombre] = useState("");

    const [fecha,setFecha] = useState("");

    const [mostrarCalendario, setMostrarCalendario] = useState(false);

    const [lugar,setLugar] = useState("");

    const [disciplinas,setDisciplinas] = useState("");

    function onCambiarFecha(event, fechaSeleccionada) {

        setMostrarCalendario(Platform.OS === "ios");

        if (fechaSeleccionada) {

            setFecha(
                formatearFecha(fechaSeleccionada)
            );

        }

    }

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

            <Text style={{ marginTop: 10 }}>
                Fecha
            </Text>

            <Button

                title={fecha === "" ? "Seleccionar fecha" : fecha}

                onPress={() => setMostrarCalendario(true)}

            />

            {
                mostrarCalendario &&

                <DateTimePicker

                    value={

                        fecha === ""

                            ? new Date()

                            : parsearFecha(fecha)

                    }

                    mode="date"

                    display="default"

                    onChange={onCambiarFecha}

                />
            }

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