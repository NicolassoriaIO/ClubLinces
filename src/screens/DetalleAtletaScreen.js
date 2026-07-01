import {
    View,
    Text,
    Button,
    Alert
} from 'react-native';

import { desactivarAtleta } from '../services/atletaService';

export default function DetalleAtletaScreen({
    route,
    navigation
}) {

    const { atleta } = route.params;

    function desactivar(){

        Alert.alert(

            "Desactivar atleta",

            "¿Seguro que querés desactivar a este atleta?",

            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Desactivar",
                    style: "destructive",
                    onPress: () => {
                        desactivarAtleta(atleta.id);
                        navigation.goBack();
                    }
                }
            ]

        );

    }

    return (

        <View
            style={{
                flex:1,
                padding:20
            }}
        >

            <Text>
                ID: {atleta.id}
            </Text>

            <Text>
                Nombre: {atleta.nombre}
            </Text>

            <Text>
                Apellido: {atleta.apellido}
            </Text>

            <Text>
                Fecha nacimiento: {atleta.fechaNacimiento}
            </Text>

            <Text>
                Categoria: {atleta.categoria}
            </Text>

            <Text>
                Disciplina: {atleta.disciplina}
            </Text>

            <Text>
                Grupo: {atleta.grupo}
            </Text>

            <Button

                title="Editar"

                onPress={() =>
                    navigation.navigate(
                        "EditarAtleta",
                        {
                            atleta: atleta
                        }
                    )
                }

            />

            <Button

                title="Ver rendimiento"

                onPress={() =>

                    navigation.navigate(

                        "DetalleRendimiento",

                        {

                            atleta

                        }

                    )

                }

            />

            <Button
            
                title="Desactivar"
            
                onPress={desactivar}
            
            />

        </View>

    );

}