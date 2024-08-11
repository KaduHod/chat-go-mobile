import { SafeAreaView, StyleSheet, View } from "react-native";
import { Botao } from "./Botao";
import { InputTexto } from "./InputTexto";
import { useContext, useState } from "react";
import { AuthContext } from "../App";

export function Cadastro({navigation}: any) {
    const [nomeCompleto, setNomeCompleto] = useState('')
    const [apelido, setApelido] = useState('')
    const {setAutenticado} = useContext(AuthContext)
    const onPressCadastrar = async () => {
        try {
            const config = {
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: nomeCompleto, apelido })
            }
            const res = await fetch('http://192.168.0.76:3000/chat/api/usuario/cadastrar', config)
            if(res.status > 299) {
                console.log(res)
                console.error("Não foi possivel criar o usuario")
            }
            const resJson = await res.json()
            const {usuario} = resJson
            setAutenticado(true)
        } catch (error) {
            console.log({error})
        }
    }
    const onPressLogin = async () => {
        navigation.navigate('Login')
    }

    return (
        <SafeAreaView>
            <View style={style.centro}>
                <InputTexto valor={nomeCompleto} title="Digite o seu nome completo..." onChangeText={setNomeCompleto} />
                <InputTexto valor={apelido} title="Digite o seu apelido" onChangeText={setApelido} />
                <View>
                    <Botao title="Cadastrar" onPress={onPressCadastrar}/>
                    <Botao title="Login" onPress={onPressLogin}/>
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
