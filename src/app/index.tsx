import { useEffect } from 'react';

import { agendarNotificacao } from '@/services/notifications';
import  {HomeScreen} from '../screens/HomeScreen'

export default function IndexRoute () {
  useEffect(()=>{
    agendarNotificacao(7,20);
  },[])
  
  return <HomeScreen/>;
}