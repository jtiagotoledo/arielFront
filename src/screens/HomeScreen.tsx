import { useState, useCallback } from "react";
import { View, Text, TouchableHighlight, FlatList, StyleSheet, StatusBar, TouchableOpacity, Alert, Pressable } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

import { colors } from '../constants/colors';
import { addIngestao, deletarIngestao, buscarIngestoes, Ingestao, buscarProfile } from "@/database/init";

export function HomeScreen() {
    const router = useRouter();
    const db = useSQLiteContext();

    const [items, setItems] = useState<Ingestao[]>([]);
    const [meta, setMeta] = useState<number>(2500);
    const [parcial, setParcial] = useState<number>(0);

    const carregarDadosTela = useCallback(async () => {
        try {
            const [profile, todasIngestoes] = await Promise.all([
                buscarProfile(db),
                buscarIngestoes(db)
            ]);
            if (profile) {
                setMeta(profile.meta_ml);
                setParcial(profile.consumo_parcial);
            }
            setItems(todasIngestoes);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }, [db]);

    useFocusEffect(
        useCallback(() => {
            carregarDadosTela();
        }, [carregarDadosTela])
    );

    const adicionarIngestao = async (qnt: number) => {
        await addIngestao(db, qnt);
        await carregarDadosTela();
    };

    const handleLongPress = useCallback((id: number) => {
        Alert.alert(
            'Remover registro',
            'Deseja remover esse registro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar', style: 'destructive',
                    onPress: async () => {
                        await deletarIngestao(db, id);
                        await carregarDadosTela(); 
                    }
                },
            ]
        );
    }, [db, carregarDadosTela]);

    const renderItemIngestao = useCallback(({ item, index }: { item: Ingestao; index: number }) => {
        const normHor = item.horario ? item.horario.substring(11, 16) : '--:--';
        const dataAtual = item.horario ? item.horario.split(' ')[0] : '';
        const dataAnterior = index > 0 && items[index - 1]?.horario ? items[index - 1].horario.split(' ')[0] : null;

        const separadorDias = dataAtual !== dataAnterior;

        return (
            <View>
                {separadorDias && dataAtual !== '' && (
                    <View style={styles.itemSeparador}>
                        <Text style={styles.textoSeparador}>📅  {dataAtual.split('-').reverse().join('/')}</Text>
                        <Text style={styles.textoSeparador}>   💧{item.total_dia} ml</Text>
                    </View>
                )}
                <Pressable
                    style={styles.itemLista}
                    onLongPress={() => handleLongPress(item.id)}
                >
                    <Text style={styles.textoQnt}>{item.qnt_ml} ml</Text>
                    <Text style={styles.textoHor}>{normHor}</Text>
                </Pressable>
            </View>
        );
    }, [items, handleLongPress]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <StatusBar barStyle='light-content' />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/config')}>
                        <Ionicons name="settings-outline" color={colors.branco} size={28} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ariel - Beba Água!</Text>
                </View>

                <View style={styles.topSection}>
                    <Text style={styles.texto}>{parcial}/{meta} ml</Text>
                    <View style={styles.containerBotao}>
                        {[50, 100, 200, 400].map((qnt) => (
                            <TouchableHighlight
                                key={qnt}
                                style={styles.botao}
                                onPress={() => adicionarIngestao(qnt)}
                                underlayColor={colors.branco}
                            >
                                <Text style={styles.textoBotao}>{qnt} ml</Text>
                            </TouchableHighlight>
                        ))}
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItemIngestao}
                        initialNumToRender={12}
                        maxToRenderPerBatch={10}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
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
        marginTop: 40,
    },
    header: {
        flexDirection: 'row',
        height: 56,
        width: '100%',
        backgroundColor: colors.azul,
        alignItems: 'center',
        elevation: 4,
        padding: 12,
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