import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerSesiones } from '../services/agendaService';
import { filtrarSesionesSemana, obtenerRangoSemana } from '../services/agendaUtils';

const GRANATE = '#7A1F3B';
const DIAS    = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function getLunesDeSemana(fecha) {
    const d = new Date(fecha);
    const dia = d.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    d.setDate(d.getDate() + diff);
    d.setHours(0,0,0,0);
    return d;
}

function diasDeSemana(lunes) {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(lunes);
        d.setDate(d.getDate() + i);
        return d;
    });
}

function toStr(fecha) {
    const dd   = String(fecha.getDate()).padStart(2,'0');
    const mm   = String(fecha.getMonth()+1).padStart(2,'0');
    const yyyy = fecha.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

export default function AgendaScreen({ navigation }) {

    const [todasSesiones, setTodasSesiones] = useState([]);
    const [fechaActual,   setFechaActual]   = useState(new Date());
    const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());

    useFocusEffect(
        React.useCallback(() => { cargarSesiones(); }, [fechaActual])
    );

    function cargarSesiones() {
        setTodasSesiones(obtenerSesiones());
    }

    const lunes   = getLunesDeSemana(fechaActual);
    const semana  = diasDeSemana(lunes);

    
    const sesionesDia = todasSesiones.filter(s => s.fecha === toStr(diaSeleccionado));

    
    function tieneSesiones(fecha) {
        return todasSesiones.some(s => s.fecha === toStr(fecha));
    }

    function semanaAnterior() {
        const n = new Date(fechaActual);
        n.setDate(n.getDate() - 7);
        setFechaActual(n);
        setDiaSeleccionado(getLunesDeSemana(n));
    }

    function semanaSiguiente() {
        const n = new Date(fechaActual);
        n.setDate(n.getDate() + 7);
        setFechaActual(n);
        setDiaSeleccionado(getLunesDeSemana(n));
    }

    const hoyStr = toStr(new Date());

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={GRANATE} />

           
            <View style={s.header}>
                <View>
                    <Text style={s.titulo}>Agenda semanal</Text>
                    <Text style={s.subtitulo}>{obtenerRangoSemana(fechaActual)}</Text>
                </View>
                <TouchableOpacity style={s.btnAdd} onPress={() => navigation.navigate('CrearSesion')}>
                    <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            
            <View style={s.selectorSemana}>
                <TouchableOpacity onPress={semanaAnterior} style={s.btnFlecha}>
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.diasRow}>
                    {semana.map((fecha, idx) => {
                        const seleccionado = toStr(fecha) === toStr(diaSeleccionado);
                        const esHoy        = toStr(fecha) === hoyStr;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[s.diaBtn, seleccionado && s.diaBtnActivo]}
                                onPress={() => setDiaSeleccionado(fecha)}
                            >
                                <Text style={[s.diaNombre, seleccionado && s.diaTextoActivo]}>
                                    {DIAS[(idx + 1) % 7]}
                                </Text>
                                <Text style={[s.diaNum, seleccionado && s.diaTextoActivo, esHoy && !seleccionado && { color: '#ffb3b3' }]}>
                                    {fecha.getDate()}
                                </Text>
                                {tieneSesiones(fecha) && (
                                    <View style={[s.punto, seleccionado && { backgroundColor: '#fff' }]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <TouchableOpacity onPress={semanaSiguiente} style={s.btnFlecha}>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

          
            <View style={s.body}>

                
                <View style={s.diaHeader}>
                    <Text style={s.diaHeaderTexto}>
                        {diaSeleccionado.toLocaleDateString('es-BO', { weekday: 'short', day: 'numeric', month: 'long' })}
                    </Text>
                    {sesionesDia.length > 0 && (
                        <View style={s.chipCount}>
                            <Text style={s.chipCountTexto}>{sesionesDia.length} sesiones</Text>
                        </View>
                    )}
                </View>

                <FlatList
                    data={sesionesDia}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    renderItem={({ item }) => {
                        const cancelada = item.estado === 'CANCELADA';
                        return (
                            <TouchableOpacity
                                style={[s.card, cancelada && s.cardCancelada]}
                                onPress={() => !cancelada && navigation.navigate('DetalleSesion', { sesion: item })}
                                activeOpacity={cancelada ? 1 : 0.7}
                            >
                                <View style={[s.cardBorde, { backgroundColor: cancelada ? '#aaa' : GRANATE }]} />
                                <View style={{ flex: 1 }}>
                                    <View style={s.cardTop}>
                                        <Text style={[s.cardGrupo, cancelada && s.tachado]}>
                                            {item.grupo}
                                        </Text>
                                        {cancelada ? (
                                            <View style={s.chipCancelado}><Text style={s.chipCanceladoTexto}>CANCELADO</Text></View>
                                        ) : (
                                            <View style={s.chipDesc}><Text style={s.chipDescTexto}>{item.descripcion}</Text></View>
                                        )}
                                    </View>
                                    <View style={s.cardMeta}>
                                        <Ionicons name="time-outline" size={13} color="#888" />
                                        <Text style={[s.cardMetaTexto, cancelada && s.tachado]}>
                                            {' '}{item.horaInicio}–{item.horaFin}
                                        </Text>
                                        <Ionicons name="location-outline" size={13} color="#888" style={{ marginLeft: 10 }} />
                                        <Text style={[s.cardMetaTexto, cancelada && s.tachado]}>
                                            {' '}{item.lugar}
                                        </Text>
                                    </View>
                                    {cancelada && item.motivo ? (
                                        <Text style={s.motivoTexto}>Motivo: {item.motivo}</Text>
                                    ) : (
                                        <Text style={s.registrarTexto}>Tocar para ver detalle →</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <Text style={s.vacio}>Sin entrenamientos este día.</Text>
                    }
                />
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    root:   { flex: 1, backgroundColor: '#f5f5f5' },

    header: { backgroundColor: GRANATE, paddingTop: 50, paddingBottom: 12, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    titulo: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    subtitulo: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
    btnAdd: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

    selectorSemana: { backgroundColor: GRANATE, flexDirection: 'row', alignItems: 'center', paddingBottom: 14, paddingHorizontal: 4 },
    btnFlecha: { padding: 8 },
    diasRow:   { flexDirection: 'row', gap: 4, paddingHorizontal: 4 },
    diaBtn:    { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, minWidth: 40 },
    diaBtnActivo: { backgroundColor: 'rgba(255,255,255,0.25)' },
    diaNombre: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
    diaNum:    { color: '#fff', fontSize: 17, fontWeight: 'bold', marginTop: 2 },
    diaTextoActivo: { color: '#fff' },
    punto:     { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 3 },

    body:      { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 16 },
    diaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
    diaHeaderTexto: { fontWeight: 'bold', fontSize: 16, color: '#1a1a1a', textTransform: 'capitalize' },
    chipCount: { backgroundColor: '#e8e8e8', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
    chipCountTexto: { fontSize: 12, color: '#555' },

    card:        { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' },
    cardCancelada: { opacity: 0.7 },
    cardBorde:   { width: 4 },
    cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingBottom: 4 },
    cardGrupo:   { fontWeight: 'bold', fontSize: 15, color: '#1a1a1a', flex: 1 },
    cardMeta:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 4 },
    cardMetaTexto: { fontSize: 13, color: '#666' },
    tachado:     { textDecorationLine: 'line-through', color: '#aaa' },

    chipDesc:    { backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    chipDescTexto: { fontSize: 11, color: '#555' },
    chipCancelado: { backgroundColor: '#c0392b', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    chipCanceladoTexto: { fontSize: 11, color: '#fff', fontWeight: 'bold' },

    registrarTexto: { fontSize: 12, color: GRANATE, paddingHorizontal: 12, paddingBottom: 10, marginTop: 2 },
    motivoTexto:    { fontSize: 12, color: '#c0392b', paddingHorizontal: 12, paddingBottom: 10, fontStyle: 'italic' },
    vacio: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});