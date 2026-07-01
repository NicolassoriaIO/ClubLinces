import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerAtletas } from '../services/atletaService';

const GRANATE = '#7A1F3B';

const AVATAR_COLORES = ['#e8d5d5','#d5e8d5','#d5d5e8','#e8e4d5','#e8d5e4','#d5e8e8'];

function colorAvatar(nombre) {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash += nombre.charCodeAt(i);
    return AVATAR_COLORES[hash % AVATAR_COLORES.length];
}

function iniciales(nombre, apellido) {
    return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
}

import { GRUPOS } from '../constants/opciones';

export default function AtletasScreen({ navigation }) {

    const [atletas,  setAtletas]  = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtro,   setFiltro]   = useState('Todos');

    useFocusEffect(
        React.useCallback(() => { cargarAtletas(); }, [])
    );

    function cargarAtletas() {
        setAtletas(obtenerAtletas());
    }

    const lista = atletas.filter((a) => {
        const coincideBusqueda =
            a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
            (a.disciplina ?? '').toLowerCase().includes(busqueda.toLowerCase());

        const coincideFiltro = filtro === 'Todos' || a.grupo === filtro;

        return coincideBusqueda && coincideFiltro;
    });

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={GRANATE} />

            
            <View style={s.header}>
                <View>
                    <Text style={s.titulo}>Atletas</Text>
                    <Text style={s.subtitulo}>{atletas.length} registrados · {lista.length} visibles</Text>
                </View>
                <TouchableOpacity
                    style={s.btnCrear}
                    onPress={() => navigation.navigate('CrearAtleta')}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            
            <View style={s.buscadorWrap}>
                <Ionicons name="search-outline" size={16} color="#aaa" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Buscar por nombre o disciplina..."
                    placeholderTextColor="#aaa"
                    value={busqueda}
                    onChangeText={setBusqueda}
                    style={s.buscador}
                />
            </View>

            
            <FlatList
                horizontal
                data={['Todos', ...GRUPOS]}
                keyExtractor={(f) => f}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.filtrosRow}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[s.chip, filtro === item && s.chipActivo]}
                        onPress={() => setFiltro(item)}
                    >
                        <Text style={[s.chipTexto, filtro === item && s.chipTextoActivo]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            
            <FlatList
                data={lista}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={s.card}
                        onPress={() => navigation.navigate('DetalleAtleta', { atleta: item })}
                    >
                        
                        <View style={[s.avatar, { backgroundColor: colorAvatar(item.nombre) }]}>
                            <Text style={s.avatarTexto}>{iniciales(item.nombre, item.apellido)}</Text>
                        </View>

                        
                        <View style={{ flex: 1 }}>
                            <Text style={s.nombre}>{item.nombre} {item.apellido}</Text>
                            <View style={s.tagsRow}>
                                <View style={s.tag}>
                                    <Text style={s.tagTexto}>{item.grupo}</Text>
                                </View>
                                <Text style={s.disciplina}>{item.disciplina}</Text>
                            </View>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color="#ccc" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={s.vacio}>No hay atletas registrados.</Text>
                }
            />

            
            <TouchableOpacity
                style={s.fab}
                onPress={() => navigation.navigate('CrearAtleta')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
    root:   { flex: 1, backgroundColor: '#f5f5f5' },

    header: { backgroundColor: GRANATE, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
    subtitulo: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
    btnCrear: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

    buscadorWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(122,31,59,0.08)', marginHorizontal: 16, marginTop: 14, marginBottom: 4, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    buscador: { flex: 1, fontSize: 14, color: '#333' },

    filtrosRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
    chip:       { borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#fff' },
    chipActivo: { backgroundColor: GRANATE, borderColor: GRANATE },
    chipTexto:  { fontSize: 13, color: '#555' },
    chipTextoActivo: { color: '#fff', fontWeight: '600' },

    card:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarTexto: { fontWeight: 'bold', fontSize: 15, color: '#555' },
    nombre: { fontWeight: 'bold', fontSize: 15, color: '#1a1a1a' },
    tagsRow:{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
    tag:    { backgroundColor: '#f0e8ea', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    tagTexto: { fontSize: 12, color: GRANATE, fontWeight: '600' },
    disciplina: { fontSize: 12, color: '#888' },

    fab:    { position: 'absolute', bottom: 24, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: GRANATE, alignItems: 'center', justifyContent: 'center', elevation: 4 },
    vacio:  { textAlign: 'center', color: '#aaa', marginTop: 40 },
});