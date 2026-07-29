import { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from '../constants/colors'
import { initDatabase, addIngestao, buscarIngestoes, Ingestao } from "@/database/init";

export function HomeScreen() {

    const [items, setItems] = useState<Ingestao[]>([])

    useEffect(() => {
        async function carregarDados() {
            initDatabase();
            const todasIngestoes = await buscarIngestoes();
            setItems(todasIngestoes);
        }
        carregarDados();
    }, [])

    const adicionarIngestao = async () => {
        addIngestao(200);
        const todasIngestoes = await buscarIngestoes();
        setItems(todasIngestoes);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <StatusBar barStyle='light-content'></StatusBar>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Ariel</Text>
                </View>
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
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <Text>{item.horario}</Text>}
                    >
                    </FlatList>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 56,
        width: '100%',
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    texto: {
        color: '#ffffff',
    },
    botao: {
        backgroundColor: '#ffffff',
        marginTop: 24,
    }
});