import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContextoGlobal, ContextoGlobalT, Mensagem, generateUniqueId, globalStyle } from "../App";
import Titulo from "./Titulo";
import { Botao } from "./Botao";
import { MensagemC } from "./Mensagem";

export function Chat({navigation}: any) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    const [mensagens, setMensagens] = useState<Mensagem[]>([])
    useEffect(() => {
        const handleNovaMensagem = (e: any) => {
            const { sala, remetente, mensagem } = JSON.parse(e.data).conteudo;
            const novaMensagem: Mensagem = {
                id: generateUniqueId(),
                conteudo: mensagem,
                sala,
                remetente,
            };
            console.log({ novaMensagem });
            setMensagens((prevMensagens) => [...prevMensagens, novaMensagem]);
        };
        contextoGlobal.sse.addEventListener('chat-nova-mensagem', handleNovaMensagem)
        return () => {
            contextoGlobal.sse.removeEventListener('chat-nova-mensagem')
        }
    }, [contextoGlobal.sse])
    return (
        <View style={[styles.mainContainer, globalStyle.debug]}>
            <View style={styles.tituloWrapper}>
                <Titulo>{contextoGlobal.SALA_SELECIONADA}</Titulo>
            </View>
            <ScrollView style={[styles.containerMensagens]}>
                {mensagens.map(mensagem => {
                    return <MensagemC
                        key={mensagem.id}
                        id={generateUniqueId()}
                        alinhamento="direita"
                        cor="#f6f7f8"
                        remetente={mensagem.remetente}
                        mensagem={mensagem.conteudo}
                    />
                })}
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
