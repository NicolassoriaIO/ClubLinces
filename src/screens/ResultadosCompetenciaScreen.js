import {
    useState,
    useEffect
} from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    Alert,
    StyleSheet
} from 'react-native';

import {
    obtenerConvocados,
    registrarResultado,
    obtenerResultados
} from '../services/competenciaService';

import { esMarcaPersonal } from '../services/rendimientoService';

function FilaResultado({ item, onGuardar, yaGuardado }) {

    const [posicion, setPosicion] = useState("");
    const [marca, setMarca] = useState("");

    function handleGuardar() {
        onGuardar(item, posicion, marca);
    }

    if (yaGuardado) {
        return (
            <View style={[styles.card, styles.cardGuardada]}>
                <Text style={styles.nombreAtleta}>
                    {item.nombre} {item.apellido}
                </Text>
                <Text style={styles.textoGuardado}>✓ Resultado ya registrado</Text>
            </View>
        );
    }

    return (

        <View style={styles.card}>

            <Text style={styles.nombreAtleta}>
                {item.nombre} {item.apellido}
            </Text>

            <TextInput
                placeholder="Posición"
                keyboardType="numeric"
                value={posicion}
                onChangeText={setPosicion}
                placeholderTextColor="#B9ABAE"
                style={styles.input}
            />

            <TextInput
                placeholder="Marca"
                keyboardType="numeric"
                value={marca}
                onChangeText={setMarca}
                placeholderTextColor="#B9ABAE"
                style={styles.input}
            />

            <Button title="Guardar resultado" onPress={handleGuardar} />

        </View>
    );
}

export default function ResultadosCompetenciaScreen({ route }) {

    const { competencia } = route.params || {};

    const [atletas, setAtletas] = useState([]);
    const [idsGuardados, setIdsGuardados] = useState(new Set());
    
    const [nuevosRecords, setNuevosRecords] = useState({});
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        cargar();
    }, []);

    function cargar() {
        if (!competencia?.id) return;

        setAtletas(obtenerConvocados(competencia.id));

        const res = obtenerResultados(competencia.id);
        setResultados(res);

        
        const ids = new Set(res.map((r) => r.atletaId));
        setIdsGuardados(ids);
    }

    function guardar(item, posicion, marca) {

        if (posicion === "" || marca === "") {
            Alert.alert("Completa los datos", "Debes ingresar posición y marca.");
            return;
        }

        const posicionNumerica = Number(posicion);
        const marcaNumerica = Number(marca);

        if (isNaN(posicionNumerica) || posicionNumerica <= 0) {
            Alert.alert(
                "Posición inválida",
                "Ingrese un número de posición válido (mayor a 0)."
            );
            return;
        }

        if (isNaN(marcaNumerica) || marcaNumerica < 0) {
            Alert.alert(
                "Marca inválida",
                "Ingrese un valor numérico válido para la marca."
            );
            return;
        }

        
        const esRecord = esMarcaPersonal(item.id, "Competencia", marcaNumerica);

        registrarResultado({
            competenciaId: competencia.id,
            atletaId: item.id,
            posicion: posicionNumerica,
            marca: marcaNumerica,
            fecha: new Date().toISOString()
        });

        
        if (esRecord) {
            setNuevosRecords((prev) => ({
                ...prev,
                [item.id]: true
            }));
        }

        setIdsGuardados((prev) => new Set([...prev, item.id]));

        const mensaje = esRecord
            ? "★ Nuevo Récord Personal registrado"
            : "Resultado guardado correctamente";

        Alert.alert("Éxito", mensaje);

        
        setResultados(obtenerResultados(competencia.id));
    }

    return (

        <View style={styles.contenedor}>

            <Text style={styles.titulo}>
                Resultados: {competencia.nombre}
            </Text>

            
            {resultados.length > 0 && (
                <View style={styles.seccionResultados}>
                    <Text style={styles.subtitulo}>Resultados registrados</Text>
                    {resultados.map((r, idx) => (
                        <View key={idx} style={styles.filaResultado}>
                            <Text style={styles.textoResultado}>
                                {r.posicion}° — {r.nombre} {r.apellido} — {r.marca}
                                
                                {nuevosRecords[r.atletaId]
                                    ? "  ★ Nuevo Récord Personal"
                                    : ""}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            
            <Text style={styles.subtitulo}>Ingresar resultados</Text>

            <FlatList
                data={atletas}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <FilaResultado
                        item={item}
                        onGuardar={guardar}
                        yaGuardado={idsGuardados.has(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.textoVacio}>
                        No hay atletas convocados para esta competencia.
                    </Text>
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({

    contenedor: {
        flex: 1,
        padding: 20
    },

    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16
    },

    subtitulo: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8
    },

    seccionResultados: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8
    },

    filaResultado: {
        paddingVertical: 4
    },

    textoResultado: {
        fontSize: 13,
        color: "#333"
    },

    card: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8
    },

    cardGuardada: {
        backgroundColor: "#f0f0f0"
    },

    nombreAtleta: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8
    },

    textoGuardado: {
        color: "#27ae60",
        fontSize: 13
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 8,
        marginTop: 8
    },

    textoVacio: {
        marginTop: 30,
        textAlign: "center",
        color: "#888"
    }
});
