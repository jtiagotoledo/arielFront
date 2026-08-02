import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite'; 

import { agendarNotificacao } from '@/services/notifications';
import { HomeScreen } from '../screens/HomeScreen';
import { buscarProfile } from "@/database/init";

export default function IndexRoute() {
  const db = useSQLiteContext(); 

  useEffect(() => {
    async function carregarDados() {
      if (!db) return; 
      
      const profile = await buscarProfile(db); 
      if (profile) {
        const { hor_acordar, hor_dormir } = profile;
        agendarNotificacao(hor_acordar, hor_dormir);
      }
    }
    carregarDados();
  }, [db]);

  return <HomeScreen />;
}