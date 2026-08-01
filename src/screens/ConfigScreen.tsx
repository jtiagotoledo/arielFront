import { useState, useEffect } from "react";
import { View, Text, TouchableHighlight, StyleSheet, StatusBar } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { colors } from '../constants/colors'
import { Stepper } from "@/components/Stepper";
import { atualizarProfile, buscarProfile} from "@/database/init";


export function ConfigScreen() {

    const router = useRouter();

    const [meta, setMeta] = useState<number>(2500);
    const [hAcordar, setHAcordar] = useState<number>(7);
    const [hDormir, setHDormir] = useState<number>(20);

    useEffect(() => {
            async function carregarDados() {
                const profile = await buscarProfile();
                if(profile){
                    const {meta_ml, hor_acordar, hor_dormir} = profile;
                    setMeta(meta_ml);
                    setHAcordar(hor_acordar);
                    setHDormir(hor_dormir);
                }
            }
            carregarDados();
        }, [])

    const handleSaveConfigs = async ()=>{
        await atualizarProfile(meta,hAcordar,hDormir);
        router.push('/');
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <StatusBar barStyle='light-content'></StatusBar>
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
                            onChange={(novoValor) => setMeta(novoValor)}
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
                            onChange={(novoValor) => setHAcordar(novoValor)}
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
                            onChange={(novoValor) => setHDormir(novoValor)}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.botao}
                        onPress={() => handleSaveConfigs()}
                        underlayColor={colors.branco}
                    >
                        <Text style={styles.textoBotao}>Salvar e voltar</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.azul,
        alignItems: 'center',
    },
    containerConfig: {
        flex: 1,
        justifyContent: 'center'
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
    fieldGroup: {
        marginBottom: 24,
    },
    label: {
        color: colors.branco,
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 6
    },
    textoBotao: {
        fontSize: 18,
        color:colors.branco,
        textAlign: 'center',
    },
    botao: {
        backgroundColor: colors.azul,
        margin: 8,
        padding: 8,
        borderRadius: 12,
        borderWidth:1,
        elevation:4,
        marginTop:24,
    },
});