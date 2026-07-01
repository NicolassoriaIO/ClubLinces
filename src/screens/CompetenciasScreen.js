import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerCompetencias } from '../services/competenciaService';
import { obtenerConvocados, obtenerResultados } from '../services/competenciaService';

const GRANATE = '#7A1F3B';

function estadoCompetencia(competencia) {

    const resultados = obtenerResultados(competencia.id);
    return resultados.length > 0 ? 'Finalizada' : 'Pendiente';
}

export default function CompetenciasScreen({ navigation }) {

    const [competencias, setCompetencias] = useState([]);

    useFocusEffect(
        useCallback(() => { cargar(); }, [])
    );

    function cargar() {
        const todas = obtenerCompetencias();
        const enriquecidas = todas.map(c => ({
            ...c,
            estado:      estadoCompetencia(c),
            nroAtletas:  obtenerConvocados(c.id).length,
        }));
        setCompetencias(enriquecidas);
    }

    const pendientes   = competencias.filter(c => c.estado === 'Pendiente');
    const finalizadas  = competencias.filter(c => c.estado === 'Finalizada');

    function renderCard(item) {
        const esPendiente = item.estado === 'Pendiente';
        return (
            <TouchableOpacity
                style={s.card}
                onPress={() => navigation.navigate('DetalleCompetencia', { competencia: item })}
            >
                <View style={[s.cardBorde, { backgroundColor: esPendiente ? '#e67e22' : '#27ae60' }]} />
                <View style={{ flex: 1, padding: 12 }}>
                    <View style={s.cardTop}>
                        <Text style={s.cardNombre} numberOfLines={2}>{item.nombre}</Text>
                        <View style={[s.chipEstado, { backgroundColor: esPendiente ? '#fef3e2' : '#e8f8f0' }]}>
                            <Text style={[s.chipEstadoTexto, { color: esPendiente ? '#e67e22' : '#27ae60' }]}>
                                {item.estado}
                            </Text>
                        </View>
                    </View>
                    <View style={s.metaRow}>
                        <Ionicons name="calendar-outline" size={13} color="#888" />
                        <Text style={s.metaTexto}> {item.fecha}</Text>
                        <Ionicons name="location-outline" size={13} color="#888" style={{ marginLeft: 10 }} />
                        <Text style={s.metaTexto}> {item.lugar}</Text>
                    </View>
                    <View style={s.metaRow}>
                        <Ionicons name="people-outline" size={13} color="#888" />
                        <Text style={s.metaTexto}> {item.nroAtletas} atletas</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={GRANATE} />

            
            <View style={s.header}>
                <View>
                    <Text style={s.titulo}>Competencias</Text>
                    <Text style={s.subtitulo}>
                        {pendientes.length} pendientes · {finalizadas.length} finalizadas
                    </Text>
                </View>
                <TouchableOpacity
                    style={s.btnAdd}
                    onPress={() => navigation.navigate('CrearCompetencia')}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={[]}
                keyExtractor={() => 'dummy'}
                ListHeaderComponent={
                    <View style={{ paddingBottom: 30 }}>

                        
                        {pendientes.length > 0 && (
                            <View>
                                <View style={s.seccionHeader}>
                                    <View style={[s.puntito, { backgroundColor: '#e67e22' }]} />
                                    <Text style={s.seccionTitulo}>PENDIENTES</Text>
                                    <View style={s.badgeCount}>
                                        <Text style={s.badgeTexto}>{pendientes.length}</Text>
                                    </View>
                                </View>
                                {pendientes.map(c => <View key={c.id}>{renderCard(c)}</View>)}
                            </View>
                        )}

                        
                        {finalizadas.length > 0 && (
                            <View>
                                <View style={s.seccionHeader}>
                                    <View style={[s.puntito, { backgroundColor: '#27ae60' }]} />
                                    <Text style={s.seccionTitulo}>FINALIZADAS</Text>
                                    <View style={s.badgeCount}>
                                        <Text style={s.badgeTexto}>{finalizadas.length}</Text>
                                    </View>
                                </View>
                                {finalizadas.map(c => <View key={c.id}>{renderCard(c)}</View>)}
                            </View>
                        )}

                        {competencias.length === 0 && (
                            <Text style={s.vacio}>No hay competencias registradas.</Text>
                        )}
                    </View>
                }
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
}

const s = StyleSheet.create({
    root:   { flex: 1, backgroundColor: '#f5f5f5' },

    header: { backgroundColor: GRANATE, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
    subtitulo: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
    btnAdd: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

    seccionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8 },
    puntito:       { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    seccionTitulo: { fontSize: 12, fontWeight: 'bold', color: '#555', letterSpacing: 1 },
    badgeCount:    { marginLeft: 8, backgroundColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 1 },
    badgeTexto:    { fontSize: 12, color: '#555', fontWeight: '600' },

    card:        { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
    cardBorde:   { width: 4 },
    cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    cardNombre:  { fontWeight: 'bold', fontSize: 15, color: '#1a1a1a', flex: 1, marginRight: 8 },
    metaRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    metaTexto:   { fontSize: 13, color: '#666' },

    chipEstado:      { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
    chipEstadoTexto: { fontSize: 12, fontWeight: '600' },

    vacio: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});