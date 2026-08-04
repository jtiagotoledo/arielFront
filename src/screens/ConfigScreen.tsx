import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableHighlight, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

import { colors } from '../constants/colors';
import { Stepper } from "@/components/Stepper";
import { atualizarProfile, buscarProfile } from "@/database/init";
import { agendarNotificacao } from "@/services/notifications";

export function ConfigScreen() {
    const router = useRouter();
    const db = useSQLiteContext();

    const [meta, setMeta] = useState<number>(2500);
    const [hAcordar, setHAcordar] = useState<number>(7);
    const [hDormir, setHDormir] = useState<number>(20);

    const carregarDados = useCallback(async () => {
        try {
            const profile = await buscarProfile(db);
            if (profile) {
                const { meta_ml, hor_acordar, hor_dormir } = profile;
                setMeta(meta_ml);
                setHAcordar(hor_acordar);
                setHDormir(hor_dormir);
            }
        } catch (error) {
            console.error("Erro ao carregar configurações:", error);
        }
    }, [db]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const handleSaveConfigs = async () => {
        try {
            await atualizarProfile(db, meta, hAcordar, hDormir);
            await agendarNotificacao(hAcordar, hDormir);
            
            router.replace('/');
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <StatusBar barStyle='light-content' />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Configurações</Text>
                </View>
                
                <View style={styles.containerConfig}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Meta Diária (ml)</Text>
                        <Stepper
                            value={meta}
                            min={500}
                            max={5000}
                            stepp={100}
                            unit="ml"
                            onChange={setMeta}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Horário de Acordar</Text>
                        <Stepper
                            value={hAcordar}
                            min={1}
                            max={23}
                            stepp={1}
                            unit=":00h"
                            onChange={setHAcordar}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Horário de Dormir</Text>
                        <Stepper
                            value={hDormir}
                            min={1}
                            max={23}
                            stepp={1}
                            unit=':00h'
                            onChange={setHDormir}
                        />
                    </View>

                    <TouchableHighlight
                        style={styles.botao}
                        onPress={handleSaveConfigs}
                        underlayColor={colors.branco}
                    >
                        <Text style={styles.textoBotao}>Salvar e voltar</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.azul,
        alignItems: 'center',
    },
    containerConfig: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        width: '85%',
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
        fontWeight: 'bold',
    },
    fieldGroup: {
        marginBottom: 24,
        width: '100%',         
        alignItems: 'center',  
    },
    label: {
        color: colors.branco,
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 6,
    },
    textoBotao: {
        fontSize: 18,
        color: colors.branco,
        textAlign: 'center',
    },
    botao: {
        backgroundColor: colors.azul,
        width: '100%',          
        marginVertical: 8,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.branco,
        elevation: 4,
        marginTop: 24,
    },
});