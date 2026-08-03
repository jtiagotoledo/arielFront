import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function solicitarPermissao() {
    const { status: statusExistente } = await Notifications.getPermissionsAsync();
    let statusFinal = statusExistente;

    if (statusExistente !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        statusFinal = status;
    }

    if (statusFinal !== 'granted') {
        console.log('Permissão de notificação negada!');
        return false;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('lembretes-agua',{
            name: 'Lembretes de água',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern:[0,250,250,250],
        });
    }
    return true;
}

export async function agendarNotificacao(hor_inicio:number,hor_fim:number){
    const temPermissao = await solicitarPermissao();
    if(!temPermissao) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    for(let hora = hor_inicio; hora<=hor_fim; hora++){
        await Notifications.scheduleNotificationAsync({
            content:{
                title:'Ariel - Beba água!',
                body: 'Mantenha-se hidratado...',
                sound: true,
            },
            trigger:{
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour:hora,
                minute:0,
            },
        });
    }
}