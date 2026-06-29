import {
    useEffect,
    useState
} from 'react';


import { 
    NavigationContainer 
} from '@react-navigation/native';


import { 
    createNativeStackNavigator 
} from '@react-navigation/native-stack';



import Login from './src/screens/Login';

import Home from './src/screens/Home';

import AtletasScreen from './src/screens/AtletasScreen';

import CrearAtletaScreen from './src/screens/CrearAtletasScreen';

import EditarAtletasScreen from './src/screens/EditarAtletasScreen';

import DetalleAtletaScreen from './src/screens/DetalleAtletaScreen';

import AgendaScreen from './src/screens/AgendaScreen';

import CrearSesionScreen from './src/screens/CrearSesionScreen';

import EditarSesionScreen from './src/screens/EditarSesionScreen';

import DetalleSesionScreen from './src/screens/DetalleSesionScreen';

import AsistenciaScreen from './src/screens/AsistenciaScreen';

import RegistrarRendimientoScreen from './src/screens/RegistrarRendimientoScreen';

import SeleccionarAtletaScreen from './src/screens/SeleccionarAtletaScreen';

import DetalleRendimientoScreen from './src/screens/DetalleRendimientoScreen';

import CompetenciasScreen from './src/screens/CompetenciasScreen';

import DetalleCompetenciaScreen from './src/screens/DetalleCompetenciaScreen';

import CrearCompetenciaScreen from './src/screens/CrearCompetenciaScreen';

import ResultadosCompetenciaScreen from './src/screens/ResultadosCompetenciaScreen';

import RegistroScreen from './src/screens/RegistroScreen';

import RecuperarContraseniaScreen from './src/screens/RecuperarContraseniaScreen';



import { 
    crearTablas 
} from './src/database/database';

import {
    actualizarCategoriasAutomaticamente
} from './src/services/atletaService';



import {
    obtenerSesion,
    cerrarSesion
} from './src/services/sesionService';





import { SessionContext } from './src/context/SessionContext';

const Stack = createNativeStackNavigator();






export default function App(){


    const [cargando,setCargando] = useState(true);


    const [sesion,setSesion] = useState(null);




    useEffect(()=>{


        crearTablas();

        // HU-02 crit. 3: actualizar categorías automáticamente al arrancar
        actualizarCategoriasAutomaticamente();

        revisarSesion();


    },[]);





    async function revisarSesion(){


        const usuario = await obtenerSesion();


        setSesion(usuario);


        setCargando(false);

    }


    async function cerrarSesionApp(){

        await cerrarSesion();

        setSesion(null);

    }

    function iniciarSesionApp(usuario){

        setSesion(usuario);

    }






    if(cargando){


        return null;


    }





    return(


        <SessionContext.Provider value={{ cerrarSesionApp, iniciarSesionApp }}>

        <NavigationContainer>


            <Stack.Navigator>



                {
                    sesion

                    ?

                    (

                        <Stack.Screen

                            name="Home"

                            component={Home}

                        />

                    )

                    :

                    (

                        <Stack.Screen

                            name="Login"

                            component={Login}

                        />

                    )

                }





                <Stack.Screen

                    name="Atletas"

                    component={AtletasScreen}

                />




                <Stack.Screen

                    name="CrearAtleta"

                    component={CrearAtletaScreen}

                />




                <Stack.Screen

                    name="EditarAtleta"

                    component={EditarAtletasScreen}

                />




                <Stack.Screen

                    name="DetalleAtleta"

                    component={DetalleAtletaScreen}

                />




                <Stack.Screen

                    name="Agenda"

                    component={AgendaScreen}

                />




                <Stack.Screen

                    name="CrearSesion"

                    component={CrearSesionScreen}

                />




                <Stack.Screen

                    name="EditarSesion"

                    component={EditarSesionScreen}

                />




                <Stack.Screen

                    name="DetalleSesion"

                    component={DetalleSesionScreen}

                />




                <Stack.Screen

                    name="Asistencia"

                    component={AsistenciaScreen}

                />




                <Stack.Screen

                    name="RegistrarRendimiento"

                    component={RegistrarRendimientoScreen}

                />




                <Stack.Screen

                    name="SeleccionarAtleta"

                    component={SeleccionarAtletaScreen}

                />




                <Stack.Screen

                    name="DetalleRendimiento"

                    component={DetalleRendimientoScreen}

                />




                <Stack.Screen

                    name="Competencias"

                    component={CompetenciasScreen}

                />




                <Stack.Screen

                    name="DetalleCompetencia"

                    component={DetalleCompetenciaScreen}

                />




                <Stack.Screen

                    name="CrearCompetencia"

                    component={CrearCompetenciaScreen}

                />




                <Stack.Screen

                    name="ResultadosCompetencia"

                    component={ResultadosCompetenciaScreen}

                />




                <Stack.Screen

                    name="Registro"

                    component={RegistroScreen}

                />


                <Stack.Screen

                    name="RecuperarContrasenia"

                    component={RecuperarContraseniaScreen}

                />


            </Stack.Navigator>


        </NavigationContainer>
        </SessionContext.Provider>


    );


}