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

    const adicionarIngestao = async (qnt:number) => {
        addIngestao(qnt);
        console.log('qnt',qnt);
        
        const todasIngestoes = await buscarIngestoes();
        setItems(todasIngestoes);
    }

    const renderItemIngestao = ({ item, index }: { item: Ingestao; index: number }) => {
        const normHor = item.horario.substring(11, 16);
        const dataAtual = item.horario.split(' ')[0];
        const dataAnterior = index > 0 ? items[index - 1].horario.split(' ')[0] : null;

        const separadorDias = dataAtual !== dataAnterior;

        return (
            <View>
                {separadorDias && (
                    <View style={styles.itemSeparador}>
                        <Text style={styles.textoSeparador}>📅  {dataAtual.split('-').reverse().join('/')}</Text>
                        <Text style={styles.textoSeparador}>   💧{item.total_dia} ml</Text>
                    </View>
                )}
                <View style={styles.itemLista}>
                    <Text style={styles.textoQnt}>{item.qnt_ml} ml</Text>
                    <Text style={styles.textoHor}>{normHor}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <StatusBar barStyle='light-content'></StatusBar>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Ariel - Beba Água!</Text>
                </View>
                <View style={styles.topSection}>
                    <Text style={styles.texto}>Meta Diária:</Text>
                    <Text style={styles.texto}>2500 ml</Text>
                    <View style={styles.containerBotao}>
                        <TouchableHighlight
                            style={styles.botao}
                            onPress={()=>adicionarIngestao(50)}
                            underlayColor='#ffffff'
                        >
                            <Text style={styles.textoBotao}>50 ml</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.botao}
                            onPress={()=>adicionarIngestao(100)}
                            underlayColor='#ffffff'
                        >
                            <Text style={styles.textoBotao}>100 ml</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.botao}
                            onPress={()=>adicionarIngestao(200)}
                            underlayColor='#ffffff'
                        >
                            <Text style={styles.textoBotao}>200 ml</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.botao}
                            onPress={()=>adicionarIngestao(400)}
                            underlayColor='#ffffff'
                        >
                            <Text style={styles.textoBotao}>400 ml</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItemIngestao}
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
        backgroundColor: colors.azul,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBotao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
    },
    header: {
        height: 56,
        width: '100%',
        backgroundColor: colors.azul,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    headerTitle: {
        color: colors.branco,
        fontSize: 18,
        fontWeight: 'bold'
    },
    texto: {
        color: colors.branco,
        fontSize: 30
    },
    textoBotao: {
        fontSize: 18,
    },
    botao: {
        backgroundColor: colors.branco,
        margin: 8,
        padding: 8,
        borderRadius: 12
    },
    topSection: {
        flex: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        flex: 6,
        width: '100%',
        backgroundColor: colors.cinza,
        paddingTop: 8,
    },
    itemLista: {
        flexDirection: 'row',
        height: 65,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.branco,
        padding: 16,
    },
    itemSeparador: {
        flexDirection: 'row',
        height: 65,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: colors.branco,
        padding: 16,
    },
    textoQnt: {
        color: colors.textoAzul,
        fontSize: 18
    },
    textoHor: {
        color: colors.textoCinza,
        fontSize: 18
    },
    textoSeparador: {
        color: colors.textoPreto,
        fontSize: 18
    },
});