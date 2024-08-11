import { useContext } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ContextoGlobal, ContextoGlobalT, Sala, SalaApi, Usuario, UsuarioSala, getContextoGlobal } from "../App"
import { Botao } from "./Botao"

function generateUniqueId() {
    const randomPart = Math.random().toString(36).substring(2, 15);
    const timePart = Date.now().toString(36);
    return randomPart + timePart;
}
export function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function TelaInicial({navigation}: any) {
    const {contextoGlobal , setContextoGlobal} = useContext(ContextoGlobal)
    const ctxGlobal = contextoGlobal as ContextoGlobalT
    const iniciarChat = (salas: SalaApi[]) => {
        if(salas.length == 0) return
        if(!ctxGlobal.listaSalas) {
            ctxGlobal.listaSalas = [] as Sala[];
        }
        salas.forEach(s => {
            const sala: Sala = {
                id: `sala__${s.nome}`,
                nome: s.nome
            }
            ctxGlobal.listaSalas?.push(sala)
            const salaUsuarioLogado:UsuarioSala = {
                id: generateUniqueId(),
                idsala: sala.id,
                idusuario: ctxGlobal.usuario?.id as number
            }
            const user:Usuario = {
                cor: getRandomHexColor(),
                id: `usuario__${generateUniqueId()}`,
                nome: ctxGlobal.usuario?.apelido as string
            }
            if(!ctxGlobal.listaUsuarios) {
                ctxGlobal.listaUsuarios = [] as Usuario[]
            }
            ctxGlobal.listaUsuarios.push(user)
            if(!ctxGlobal.listaUsuariosSalas) {
                ctxGlobal.listaUsuariosSalas = [] as UsuarioSala[]
            }
            ctxGlobal.listaUsuariosSalas.push(salaUsuarioLogado)
            if(!s.usuarios) {
                setContextoGlobal(ctxGlobal)
                return
            }
            s.usuarios.forEach(apelido => {
                if(apelido == ctxGlobal.usuario?.apelido) return
                const user:Usuario = {
                    cor: getRandomHexColor(),
                    id: `usuario__${generateUniqueId()}`,
                    nome: apelido
                }
                ctxGlobal.listaUsuarios?.push(user)
                const salaUser: UsuarioSala = {
                    id: generateUniqueId(),
                    idsala: sala.id,
                    idusuario: user.id
                }
                ctxGlobal.listaUsuariosSalas?.push(salaUser)
            })
        })
        setContextoGlobal(ctxGlobal)
        /*Abrir conexao sse*/
    }
    const onPressSala = () => {
        navigation.navigate('Salas')
    }
    return(
        <View style={styles.mainContainer}>
            <Botao title="Salas" onPress={onPressSala} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: 3
    }
})
