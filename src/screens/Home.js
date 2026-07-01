import { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { SessionContext }   from '../context/SessionContext';
import { obtenerAtletas }   from '../services/atletaService';
import { obtenerSesiones }  from '../services/agendaService';
import { obtenerCompetencias } from '../services/competenciaService';

const GRANATE = '#7A1F3B';
const ROSA    = '#C0392B';

export default function Home({ navigation }) {

    const { cerrarSesionApp, sesion } = useContext(SessionContext);

    const [totalAtletas,    setTotalAtletas]    = useState(0);
    const [sesionesHoy,     setSesionesHoy]     = useState([]);
    const [totalCompetencias, setTotalCompetencias] = useState(0);

    useFocusEffect(
        useCallback(() => {
            cargar();
        }, [])
    );

    function cargar() {
        const atletas = obtenerAtletas();
        setTotalAtletas(atletas.length);

        const hoy = new Date();
        const dd  = String(hoy.getDate()).padStart(2, '0');
        const mm  = String(hoy.getMonth() + 1).padStart(2, '0');
        const yyyy = hoy.getFullYear();
        const fechaHoy = `${dd}/${mm}/${yyyy}`;

        const todas = obtenerSesiones();
        setSesionesHoy(todas.filter(s => s.fecha === fechaHoy && s.estado !== 'CANCELADA'));

        const comps = obtenerCompetencias();
        setTotalCompetencias(comps.length);
    }

    function confirmarSalir() {
        Alert.alert(
            'Cerrar sesión',
            '¿Seguro que querés cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', style: 'destructive', onPress: cerrarSesionApp }
            ]
        );
    }

    const nombre = sesion?.nombre ?? 'Entrenador';

    const accesos = [
        { label: 'Agenda',       sub: 'Ver semana',          icon: 'calendar-outline',  tab: 'Agenda' },
        { label: 'Atletas',      sub: `${totalAtletas} activos`, icon: 'people-outline', tab: 'Atletas' },
        { label: 'Marcas',       sub: 'Registrar',           icon: 'pulse-outline',     tab: 'Marcas' },
        { label: 'Competencias', sub: `${totalCompetencias} registradas`, icon: 'trophy-outline', tab: 'Competencias' },
    ];

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={GRANATE} />

            
            <View style={s.header}>
                <View>
                    <Text style={s.fecha}>
                        {new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                    <Text style={s.saludo}>Hola, Prof. {nombre}</Text>
                </View>
                <TouchableOpacity onPress={confirmarSalir} style={s.btnSalir}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

                
                <View style={s.banner}>
                    <View style={s.bannerIcon}>
                        <Ionicons name="shield-checkmark" size={22} color={GRANATE} />
                    </View>
                    <View>
                        <Text style={s.bannerNombre}>Club Deportivo Linces</Text>
                        <Text style={s.bannerSub}>Santa Cruz, Bolivia</Text>
                    </View>
                </View>

                
                <View style={s.statsRow}>
                    <View style={s.statCard}>
                        <Text style={s.statNum}>{totalAtletas}</Text>
                        <Text style={s.statLabel}>Atletas</Text>
                    </View>
                    <View style={s.statCard}>
                        <Text style={s.statNum}>{sesionesHoy.length}</Text>
                        <Text style={s.statLabel}>Sesiones hoy</Text>
                        {sesionesHoy[0] && (
                            <Text style={s.statSub}>{sesionesHoy[0].horaInicio} – {sesionesHoy[sesionesHoy.length-1]?.horaFin}</Text>
                        )}
                    </View>
                    <View style={s.statCard}>
                        <Text style={[s.statNum, { color: '#27ae60' }]}>—</Text>
                        <Text style={s.statLabel}>Asistencia</Text>
                        <Text style={s.statSub}>esta semana</Text>
                    </View>
                </View>

                
                <View style={s.gridRow}>
                    {accesos.map((a) => (
                        <TouchableOpacity
                            key={a.label}
                            style={s.gridCard}
                            onPress={() => navigation.navigate(a.tab)}
                        >
                            <View style={s.gridIcon}>
                                <Ionicons name={a.icon} size={22} color={GRANATE} />
                            </View>
                            <Text style={s.gridLabel}>{a.label}</Text>
                            <Text style={s.gridSub}>{a.sub}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                
                <View style={s.seccion}>
                    <View style={s.seccionHeader}>
                        <Text style={s.seccionTitulo}>Sesiones de hoy</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                            <Text style={s.verAgenda}>Ver agenda ›</Text>
                        </TouchableOpacity>
                    </View>

                    {sesionesHoy.length === 0 ? (
                        <Text style={s.textoVacio}>Sin sesiones programadas para hoy.</Text>
                    ) : (
                        sesionesHoy.map((s2) => (
                            <View key={s2.id} style={s.sesionFila}>
                                <Text style={s.sesionHora}>{s2.horaInicio}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.sesionGrupo}>{s2.grupo}</Text>
                                    <Text style={s.sesionLugar}>{s2.lugar}</Text>
                                </View>
                                <View style={s.chipDescripcion}>
                                    <Text style={s.chipTexto}>{s2.descripcion}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    root:   { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: GRANATE, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    fecha:  { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    saludo: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 2 },
    btnSalir: { padding: 6 },
    body:   { padding: 16, paddingBottom: 40 },

    banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(122,31,59,0.08)', borderRadius: 12, padding: 14, marginBottom: 16 },
    bannerIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    bannerNombre: { fontWeight: 'bold', fontSize: 15, color: '#1a1a1a' },
    bannerSub: { fontSize: 12, color: '#777', marginTop: 2 },

    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'flex-start' },
    statNum:  { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
    statLabel:{ fontSize: 12, color: '#555', marginTop: 2 },
    statSub:  { fontSize: 11, color: '#999', marginTop: 2 },

    gridRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    gridCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 14 },
    gridIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(122,31,59,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    gridLabel:{ fontWeight: 'bold', fontSize: 14, color: '#1a1a1a' },
    gridSub:  { fontSize: 12, color: '#888', marginTop: 2 },

    seccion:       { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    seccionTitulo: { fontWeight: 'bold', fontSize: 16, color: '#1a1a1a' },
    verAgenda:     { fontSize: 13, color: ROSA, fontWeight: '600' },

    sesionFila:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    sesionHora:   { width: 50, fontSize: 14, fontWeight: 'bold', color: ROSA },
    sesionGrupo:  { fontWeight: '600', fontSize: 14, color: '#1a1a1a' },
    sesionLugar:  { fontSize: 12, color: '#888', marginTop: 2 },
    chipDescripcion: { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    chipTexto:    { fontSize: 11, color: '#555' },
    textoVacio:   { color: '#aaa', textAlign: 'center', paddingVertical: 20 },
});