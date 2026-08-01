import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import { colors } from "@/constants/colors";

interface StepperProps {
    value: number; 
    min: number; 
    max:number; 
    stepp:number; 
    onChange:(newValue:number)=>void;
    unit?:string;
}

export function Stepper({value, min, max, stepp, onChange, unit=''}:StepperProps){
    const handleDecrement = ()=>{
        if(value-stepp>=min){
            onChange(value-stepp);
        }
    };

    const handleIncrement = ()=>{
        if(value+stepp<=max){
            onChange(value+stepp);
        }
    }

    const isMinDisabled = value <=min;
    const isMaxDisabled = value >=max;

    return(
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, isMinDisabled&&styles.buttonDisabled]}
                onPress={handleDecrement}
                disabled={isMinDisabled}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.valueContainer}>
                <Text style={styles.valueText}>
                    {value}{unit}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.button, isMaxDisabled&&styles.buttonDisabled]}
                onPress={handleIncrement}
                disabled={isMaxDisabled}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:colors.azul,
        borderRadius:12,
        padding:4,
        borderWidth:1,
        borderColor:colors.preto,
        width:170,
        height:48,
    },
    button:{
        width:40,
        height:40,
        backgroundColor:colors.azul,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonDisabled:{
        backgroundColor:colors.azulDisabled,
    },
    buttonText:{
        color:colors.branco,
        fontSize:22,
        fontWeight:'bold',
        marginTop:-2,
    },
    valueContainer:{
        flex:1,
        alignItems:'center',
    },
    valueText:{
        fontSize:16,
        fontWeight:'bold',
        color:colors.branco,
    },
})