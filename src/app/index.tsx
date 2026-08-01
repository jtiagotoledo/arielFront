import { useEffect } from 'react';

import { agendarNotificacao } from '@/services/notifications';
import { HomeScreen } from '../screens/HomeScreen'
import { buscarProfile } from "@/database/init";

export default function IndexRoute() {
  useEffect(() => {
    async function carregarDados() {
      const profile = await buscarProfile();
      if (profile) {
        const { hor_acordar, hor_dormir } = profile;
        agendarNotificacao(hor_acordar, hor_dormir);
      }
    }
    carregarDados();
  }, [])
  return <HomeScreen />;
}