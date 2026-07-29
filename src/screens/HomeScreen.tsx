import { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, FlatList, StyleSheet } from 'react-native';
import { initDatabase, addIngestao, buscarIngestoes } from "@/database/init";

export function HomeScreen() {

    const[items, setItems] = useState<{horario:string, id: number, qnt_ml:string}[]>([])

    useEffect(() => {
        initDatabase();
        const todasIngestoes = buscarIngestoes();
        //setItems(todasIngestoes)
    }, [])

    const adicionarIngestao = () => {
        addIngestao(200);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Beba Água!</Text>
            <TouchableHighlight
                style={styles.botao}
                onPress={adicionarIngestao}
                underlayColor='#ffffff'
            >
                <Text>Add</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.botao}
                onPress={() => buscarIngestoes()}
                underlayColor='#ffffff'
            >
                <Text>Buscar</Text>
            </TouchableHighlight>
            {/* <FlatList
                data={ }
                keyExtractor={ }

            >

            </FlatList> */}
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3995EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    texto: {
        color: '#ffffff',
    },
    botao: {
        backgroundColor: '#ffffff',
        marginTop: 24,
    }
});