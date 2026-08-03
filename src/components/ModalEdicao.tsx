import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { Stepper } from '@/components/Stepper';

interface ModalEdicaoProps {
    visivel: boolean;
    quantidadeInicial: number;
    horarioInicial: string;
    aoSalvar: (novaQuantidade: number, novoHorarioStr: string) => void;
    aoCancelar: () => void;
}

export function ModalEdicao({
    visivel,
    quantidadeInicial,
    horarioInicial,
    aoSalvar,
    aoCancelar
}: ModalEdicaoProps) {
    const [quantidade, setQuantidade] = useState<number>(quantidadeInicial);
    const [dataHora, setDataHora] = useState<Date>(new Date());
    const [mostrarPicker, setMostrarPicker] = useState<boolean>(false);

    useEffect(() => {
        if (visivel) {
            setQuantidade(quantidadeInicial);
            if (horarioInicial) {
                const dataFormatada = new Date(horarioInicial.replace(' ', 'T'));
                setDataHora(isNaN(dataFormatada.getTime()) ? new Date() : dataFormatada);
            } else {
                setDataHora(new Date());
            }
        }
    }, [visivel, quantidadeInicial, horarioInicial]);

    const handleSalvar = () => {
        const ano = dataHora.getFullYear();
        const mes = String(dataHora.getMonth() + 1).padStart(2, '0');
        const dia = String(dataHora.getDate()).padStart(2, '0');
        const horas = String(dataHora.getHours()).padStart(2, '0');
        const minutos = String(dataHora.getMinutes()).padStart(2, '0');
        const segundos = String(dataHora.getSeconds()).padStart(2, '0');

        const stringHorarioBanco = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        aoSalvar(quantidade, stringHorarioBanco);
    };

    const formatarHoraDisplay = (date: Date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    };

    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType="fade"
            onRequestClose={aoCancelar}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitulo}>Editar Registro</Text>

                    <View style={styles.campoContainer}>
                        <Text style={styles.labelCampo}>Quantidade:</Text>
                        <Stepper
                            value={quantidade}
                            min={50}
                            max={2000}
                            stepp={50}
                            unit="ml"
                            onChange={setQuantidade}
                        />
                    </View>

                    <View style={styles.campoContainer}>
                        <Text style={styles.labelCampo}>Horário:</Text>
                        <TouchableOpacity
                            style={styles.botaoHora}
                            onPress={() => setMostrarPicker(true)}
                        >
                            <Ionicons name="time-outline" size={22} color={colors.textoAzul} />
                            <Text style={styles.textoHora}>{formatarHoraDisplay(dataHora)}</Text>
                        </TouchableOpacity>
                    </View>

                    {mostrarPicker && (
                        <DateTimePicker
                            value={dataHora}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => {
                                setMostrarPicker(Platform.OS === 'ios');
                                if (date) setDataHora(date);
                            }}
                        />
                    )}

                    <View style={styles.modalBotoes}>
                        <TouchableHighlight
                            style={[styles.botaoModal, { backgroundColor: colors.cinza }]}
                            onPress={aoCancelar}
                            underlayColor="#E0E0E0"
                        >
                            <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={[styles.botaoModal, { backgroundColor: colors.azul }]}
                            onPress={handleSalvar}
                            underlayColor="#0B3564"
                        >
                            <Text style={styles.textoBotaoSalvar}>Salvar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '85%',
        backgroundColor: colors.branco,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.textoAzul,
    },
    campoContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    labelCampo: {
        fontSize: 14,
        color: colors.textoCinza,
        marginBottom: 6,
    },
    botaoHora: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cinza,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    textoHora: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textoAzul,
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 16,
    },
    botaoModal: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    textoBotaoCancelar: {
        color: colors.textoPreto,
        fontWeight: '500',
    },
    textoBotaoSalvar: {
        color: colors.branco,
        fontWeight: 'bold',
    },
});