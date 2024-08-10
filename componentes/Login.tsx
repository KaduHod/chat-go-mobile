import { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Botao } from "./Botao";
import { InputTexto } from "./InputTexto";
import { AuthContext } from "../App";

export function Login({navigation}: any) {
    const [userName, setUserName] = useState('');
    const {setAutenticado, estaAutenticado} = useContext(AuthContext)
    const onPressLogin = async () => {
        const config = {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({apelido: userName})
        }
        const res = await fetch('http://192.168.0.76:3000/chat/api/usuario/login', config)
        if(res.status != 200) {
            const {status} = res
            if(status == 404) {
                console.log("Usuario de login "+userName+" nao econtrado")
                return
            }
            console.error("Erro ao efetuar login")
            return
        }
        const {usuario} = await res.json()
        setAutenticado(true)
    }
    const onPressRegister = async () => {
        navigation.navigate('Cadastro', {})
    }
    return (
     <SafeAreaView>
        <View style={style.centro}>
            <InputTexto valor={userName} onChangeText={setUserName} title="Digite o nome de usuario"/>
            <Text>{estaAutenticado ? "Esta" : "Não Está"}</Text>
            <View style={style.buttonContainer}>
                <Botao title="Login" onPress={onPressLogin} />
                <Botao title="Cadastro" onPress={onPressRegister} />
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
