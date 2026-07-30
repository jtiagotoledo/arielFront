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

    const renderItemIngestao = ({item}:{item:Ingestao}) => {
        const normHor = item.horario.substring(11,16);
        return (
            <View style={styles.itemLista}>
                <Text style={styles.textoQnt}>{item.qnt_ml} ml</Text>
                <Text style={styles.textoHor}>{normHor}</Text>
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
    },
    botao: {
        backgroundColor: colors.branco,
        marginTop: 24,
    },
    topSection: {
        flex: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        flex: 6,
        width:'100%',
        backgroundColor:colors.cinza,
        paddingTop:8,
    },
    itemLista:{
        flexDirection:'row',
        height:65,
        width:'100%',
        alignSelf:'center',
        justifyContent:'space-between',
        backgroundColor:colors.branco,
        padding:16,
    },
    textoQnt: {
        color:colors.textoAzul,
        fontSize:18
    },
    textoHor: {
        color:colors.textoCinza,
        fontSize:18
    },
});