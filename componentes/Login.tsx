import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Botao } from "./Botao";
import { InputTexto } from "./InputTexto";

export function Login({navigation}) {
const [userName, setUserName] = useState('');
const onPressLogin = async () => {
    console.log("APERTOU LOGIN")
}
const onPressRegister = async () => {
    console.log("APERTOU REGISTRAR")
}
    return (
     <SafeAreaView>
        <View style={style.centro}>
            <InputTexto valor={userName} onChangeText={setUserName} title="Digite o nome de usuario"/>
            <View style={style.buttonContainer}>
                <Botao title="Login" onPress={onPressLogin} />
                <Botao title="Cadastro" onPress={() => navigation.navigate('Cadastro', {})} />
            </View>
         </View>
     </SafeAreaView>
    );
}

const style = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
    },
    centro: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        margin: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Only for Android
    },
})
