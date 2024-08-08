import { SafeAreaView, StyleSheet, View } from "react-native";
import { Botao } from "./Botao";
import { InputTexto } from "./InputTexto";
import { useState } from "react";

export function Cadastro({navigation}) {
const [nomeCompleto, setNomeCompleto] = useState('')
const [apelido, setApelido] = useState('')
const onPressCadastrar = async () => {
    try {
        const res = await fetch('http://192.168.0.76:3000/chat/api/usuario/cadastrar', {method:"POST", body: JSON.stringify({nome:nomeCompleto, apelido})})
        const resJson = await res.json()
        console.log({resJson, res})
    } catch (error) {
        console.log({error})
    }
}
const onPressLogin = async () => {
    console.log("Clicou em login")
}


   const onPressDefault = async () => {}
    return (
        <SafeAreaView>
            <View style={style.centro}>
                <InputTexto valor={nomeCompleto} title="Digite o seu nome completo..." onChangeText={setNomeCompleto} />
                <InputTexto valor={apelido} title="Digite o seu apelido" onChangeText={setApelido} />
                <View>
                    <Botao title="Cadastrar" onPress={onPressCadastrar}/>
                    <Botao title="Login" onPress={() => navigation.navigate('Login')}/>
                </View>
            </View>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    centro:  {
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})
