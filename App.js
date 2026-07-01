import { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import Login                    from './src/screens/Login';
import RegistroScreen           from './src/screens/RegistroScreen';
import RecuperarContraseniaScreen from './src/screens/RecuperarContraseniaScreen';

import Home                     from './src/screens/Home';
import AgendaScreen             from './src/screens/AgendaScreen';
import AtletasScreen            from './src/screens/AtletasScreen';
import DetalleRendimientoScreen from './src/screens/DetalleRendimientoScreen';
import CompetenciasScreen       from './src/screens/CompetenciasScreen';

import CrearAtletaScreen        from './src/screens/CrearAtletasScreen';
import EditarAtletasScreen      from './src/screens/EditarAtletasScreen';
import DetalleAtletaScreen      from './src/screens/DetalleAtletaScreen';
import CrearSesionScreen        from './src/screens/CrearSesionScreen';
import EditarSesionScreen       from './src/screens/EditarSesionScreen';
import DetalleSesionScreen      from './src/screens/DetalleSesionScreen';
import AsistenciaScreen         from './src/screens/AsistenciaScreen';
import RegistrarRendimientoScreen from './src/screens/RegistrarRendimientoScreen';
import SeleccionarAtletaScreen  from './src/screens/SeleccionarAtletaScreen';
import DetalleCompetenciaScreen from './src/screens/DetalleCompetenciaScreen';
import CrearCompetenciaScreen   from './src/screens/CrearCompetenciaScreen';
import ResultadosCompetenciaScreen from './src/screens/ResultadosCompetenciaScreen';

import { crearTablas }                        from './src/database/database';
import { actualizarCategoriasAutomaticamente } from './src/services/atletaService';
import { obtenerSesion, cerrarSesion }        from './src/services/sesionService';
import { SessionContext }                     from './src/context/SessionContext';

const GRANATE = '#7A1F3B';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const headerOpts = {
    headerStyle: { backgroundColor: GRANATE },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
};

function InicioStack() {
    return (
        <Stack.Navigator screenOptions={headerOpts}>
            <Stack.Screen name="InicioHome"  component={Home}   options={{ headerShown: false }} />
            <Stack.Screen name="Agenda"  component={AgendaScreen}  options={{ title: 'Agenda semanal' }} />
            <Stack.Screen name="CrearSesion"   component={CrearSesionScreen}   options={{ title: 'Nueva sesión' }} />
            <Stack.Screen name="EditarSesion"  component={EditarSesionScreen}  options={{ title: 'Editar sesión' }} />
            <Stack.Screen name="DetalleSesion" component={DetalleSesionScreen} options={{ title: 'Detalle sesión' }} />
            <Stack.Screen name="Asistencia"    component={AsistenciaScreen}    options={{ title: 'Asistencia' }} />
            <Stack.Screen name="SeleccionarAtleta"    component={SeleccionarAtletaScreen}    options={{ title: 'Seleccionar atleta' }} />
            <Stack.Screen name="RegistrarRendimiento" component={RegistrarRendimientoScreen} options={{ title: 'Registrar marca' }} />
        </Stack.Navigator>
    );
}

function AgendaStack() {
    return (
        <Stack.Navigator screenOptions={headerOpts}>
            <Stack.Screen name="AgendaRoot"    component={AgendaScreen}        options={{ title: 'Agenda semanal' }} />
            <Stack.Screen name="CrearSesion"   component={CrearSesionScreen}   options={{ title: 'Nueva sesión' }} />
            <Stack.Screen name="EditarSesion"  component={EditarSesionScreen}  options={{ title: 'Editar sesión' }} />
            <Stack.Screen name="DetalleSesion" component={DetalleSesionScreen} options={{ title: 'Detalle sesión' }} />
            <Stack.Screen name="Asistencia"    component={AsistenciaScreen}    options={{ title: 'Asistencia' }} />
            <Stack.Screen name="SeleccionarAtleta"    component={SeleccionarAtletaScreen}    options={{ title: 'Seleccionar atleta' }} />
            <Stack.Screen name="RegistrarRendimiento" component={RegistrarRendimientoScreen} options={{ title: 'Registrar marca' }} />
        </Stack.Navigator>
    );
}

function AtletasStack() {
    return (
        <Stack.Navigator screenOptions={headerOpts}>
            <Stack.Screen name="AtletasRoot"  component={AtletasScreen}      options={{ title: 'Atletas' }} />
            <Stack.Screen name="CrearAtleta"  component={CrearAtletaScreen}  options={{ title: 'Nuevo atleta' }} />
            <Stack.Screen name="EditarAtleta" component={EditarAtletasScreen} options={{ title: 'Editar atleta' }} />
            <Stack.Screen name="DetalleAtleta" component={DetalleAtletaScreen} options={{ title: 'Detalle atleta' }} />
            <Stack.Screen name="DetalleRendimiento" component={DetalleRendimientoScreen} options={{ title: 'Historial' }} />
        </Stack.Navigator>
    );
}

function MarcasStack() {
    return (
        <Stack.Navigator screenOptions={headerOpts}>
            <Stack.Screen name="SeleccionarAtletaMarcas" component={SeleccionarAtletaScreen}  options={{ title: 'Seleccionar atleta' }} />
            <Stack.Screen name="DetalleRendimiento" component={DetalleRendimientoScreen} options={{ title: 'Historial de marcas' }} />
            <Stack.Screen name="RegistrarRendimiento" component={RegistrarRendimientoScreen} options={{ title: 'Registrar marca' }} />
        </Stack.Navigator>
    );
}

function CompetenciasStack() {
    return (
        <Stack.Navigator screenOptions={headerOpts}>
            <Stack.Screen name="CompetenciasRoot"      component={CompetenciasScreen}          options={{ title: 'Competencias' }} />
            <Stack.Screen name="CrearCompetencia"      component={CrearCompetenciaScreen}      options={{ title: 'Nueva competencia' }} />
            <Stack.Screen name="DetalleCompetencia"    component={DetalleCompetenciaScreen}    options={{ title: 'Detalle competencia' }} />
            <Stack.Screen name="ResultadosCompetencia" component={ResultadosCompetenciaScreen} options={{ title: 'Resultados' }} />
        </Stack.Navigator>
    );
}

function MainTabs({ onSalir }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: GRANATE,
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: '#eee',
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Inicio:        'home-outline',
                        Agenda:        'calendar-outline',
                        Atletas:       'people-outline',
                        Marcas:        'pulse-outline',
                        Competencias:  'trophy-outline',
                        Salir:         'log-out-outline',
                    };
                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio"       component={InicioStack} />
            <Tab.Screen name="Agenda"       component={AgendaStack} />
            <Tab.Screen name="Atletas"      component={AtletasStack} />
            <Tab.Screen name="Marcas"       component={MarcasStack} />
            <Tab.Screen name="Competencias" component={CompetenciasStack} />
            <Tab.Screen
                name="Salir"
                component={Home} 
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        onSalir();
                    },
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {

    const [cargando, setCargando] = useState(true);
    const [sesion,   setSesion]   = useState(null);

    useEffect(() => {
        try {
            crearTablas();
            actualizarCategoriasAutomaticamente();
        } catch (error) {
            console.error('Error inicializando app:', error);
        }
        revisarSesion();
    }, []);

    async function revisarSesion() {
        try {
            const usuario = await obtenerSesion();
            setSesion(usuario);
        } catch (error) {
            console.error('Error revisando sesión:', error);
            setSesion(null);
        } finally {
            setCargando(false);
        }
    }

    async function cerrarSesionApp() {
        try {
            await cerrarSesion();
            setSesion(null);
        } catch (error) {
            console.error('Error cerrando sesión:', error);
            setSesion(null);
        }
    }

    function iniciarSesionApp(usuario) {
        setSesion(usuario);
    }

    if (cargando) return null;

    return (
        <SessionContext.Provider value={{ cerrarSesionApp, iniciarSesionApp, sesion }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {sesion ? (
                        <Stack.Screen name="Main">
                            {() => <MainTabs onSalir={cerrarSesionApp} />}
                        </Stack.Screen>
                    ) : (
                        <>
                            <Stack.Screen name="Login"               component={Login} />
                            <Stack.Screen name="Registro"            component={RegistroScreen} />
                            <Stack.Screen name="RecuperarContrasenia" component={RecuperarContraseniaScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SessionContext.Provider>
    );
}