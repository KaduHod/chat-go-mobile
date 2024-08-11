import { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContextoGlobal, ContextoGlobalT, generateUniqueId, globalStyle } from "../App";
import Titulo from "./Titulo";
import { Botao } from "./Botao";
import { Mensagem } from "./Mensagem";
import { getRandomHexColor } from "./PaginaInicial";

export function Chat({navigation}: any) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    return (
        <View style={[styles.mainContainer, globalStyle.debug]}>
            <View style={styles.tituloWrapper}>
                <Titulo>{contextoGlobal.SALA_SELECIONADA}</Titulo>
            </View>
            <ScrollView style={[globalStyle.debug, styles.containerMensagens]}>
                <Mensagem
                    mensagem="teste"
                    id={generateUniqueId()}
                    cor={getRandomHexColor()}
                    remetente="usuario1"
                    alinhamento="esquerda"
                />
                <Mensagem
                    mensagem="teste"
                    id={generateUniqueId()}
                    cor={getRandomHexColor()}
                    remetente="usuario2"
                    alinhamento="direita"
                />
            </ScrollView>
            <View style={[globalStyle.debug, styles.containerBotoes]}>
                <View></View>
                <Botao title="Enviar" onPress={() => console.log("Enviar mensagem")} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tituloWrapper: {
        alignItems:"center"
    },
    mainContainer:{
        flex: 1,
        padding: 2
    },
    containerMensagens: {
        flex:1,
        marginVertical: 2,
        padding: 4
    },
    containerBotoes: {
        height: 70,
        justifyContent: "flex-end",
        flexDirection: "row"
    }
})
