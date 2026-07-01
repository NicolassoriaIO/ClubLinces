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
    obtenerAtletasPorGrupo
} from '../services/atletaService';

import {
    registrarAsistencia,
    existeAsistenciaSesion,
    estaBloqueadaPorTiempo
} from '../services/asistenciaService';

export default function AsistenciaScreen({ route }) {

    const { sesion } = route.params;

    const [atletas,setAtletas] = useState([]);

    const [asistencias,setAsistencias] = useState({});

    const [soloLectura, setSoloLectura] = useState(false);

    const [bloqueadoPorTiempo, setBloqueadoPorTiempo] = useState(false);

    useEffect(()=>{

        cargarAtletas();

    },[]);

    function cargarAtletas(){

        setAtletas(

            obtenerAtletasPorGrupo(sesion.grupo)

        );

        const yaGuardada = existeAsistenciaSesion(
            sesion.id
        );

        const vencida = estaBloqueadaPorTiempo(sesion);

        setBloqueadoPorTiempo(vencida);

        setSoloLectura(
            yaGuardada || vencida
        );

        if(vencida && !yaGuardada){

            Alert.alert(
                "Tiempo vencido",
                "El tiempo para registrar asistencia de esta sesión ha vencido."
            );

        }

    }

    function marcar(id, estado){

        if(soloLectura){

            return;

        }
        setAsistencias({

            ...asistencias,

            [id]: estado

        });

    }

    function guardar(){

        atletas.forEach((atleta)=>{

            if(asistencias[atleta.id]){

                registrarAsistencia({

                    atletaId: atleta.id,

                    sesionId: sesion.id,

                    estado: asistencias[atleta.id],

                    fechaRegistro: new Date().toISOString()

                });

            }

        });

        setSoloLectura(true);

    }

    function calcularPorcentaje(){

    let total = atletas.length;

    let presentes = 0;

    atletas.forEach((atleta)=>{

        if(
            asistencias[atleta.id] === "P"
        ){

            presentes++;

        }

    });

    if(total === 0){

        return 0;

    }

    return Math.round(

        (presentes / total) * 100

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

                Registrar asistencia

                {"\n"}

                Grupo: {sesion.grupo}

            </Text>

            <FlatList

                data={atletas}

                keyExtractor={(item)=>

                    item.id.toString()

                }

                renderItem={({item})=>(

                    <View

                        style={{

                            marginTop:20,

                            padding:10,

                            borderWidth:1,

                            borderRadius:8,

                            borderColor: "#ddd"

                        }}

                    >

                        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>

                            {item.nombre} {item.apellido}

                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                            <View style={{ alignItems: "center" }}>

                                <Button

                                    title="P"

                                    disabled={soloLectura}

                                    color={asistencias[item.id] === "P" ? "#4CAF50" : "#2196F3"}

                                    onPress={()=>

                                        marcar(
                                            item.id,
                                            "P"
                                        )

                                    }

                                />

                                {asistencias[item.id] === "P" && <Text style={{ fontSize: 12, marginTop: 4 }}>✓</Text>}

                            </View>

                            <View style={{ alignItems: "center" }}>

                                <Button

                                    title="F"

                                    disabled={soloLectura}

                                    color={asistencias[item.id] === "F" ? "#F44336" : "#2196F3"}

                                    onPress={()=>

                                        marcar(
                                            item.id,
                                            "F"
                                        )

                                    }

                                />

                                {asistencias[item.id] === "F" && <Text style={{ fontSize: 12, marginTop: 4 }}>✓</Text>}

                            </View>

                            <View style={{ alignItems: "center" }}>

                                <Button

                                    title="L"

                                    disabled={soloLectura}

                                    color={asistencias[item.id] === "L" ? "#FFC107" : "#2196F3"}

                                    onPress={()=>

                                        marcar(
                                            item.id,
                                            "L"
                                        )

                                    }

                                />

                                {asistencias[item.id] === "L" && <Text style={{ fontSize: 12, marginTop: 4 }}>✓</Text>}

                            </View>

                        </View>

                    </View>

                )}

            />

                <Text>

                    Porcentaje asistencia:
                    {calcularPorcentaje()}%

                </Text>

                {
                    bloqueadoPorTiempo &&

                    <Text style={{ color: "red", marginTop: 10 }}>

                        El tiempo para registrar asistencia de esta sesión ha vencido.

                    </Text>
                }

                {
                    !soloLectura &&

                    <Button

                        title="Guardar asistencia"

                        onPress={guardar}

                    />
                }

        </View>

    );

}