import { useContext } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ContextoGlobal, Sala, SalaApi, Usuario, UsuarioSala, getContextoGlobal } from "../App"
import { Botao } from "./Botao"

function generateUniqueId() {
    const randomPart = Math.random().toString(36).substring(2, 15);
    const timePart = Date.now().toString(36);
    return randomPart + timePart;
}
function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function TelaInicial({navigation}: any) {
    const {contextoGlobal , setContextoGlobal} = useContext(ContextoGlobal)
    const iniciarChat = (salas: SalaApi[]) => {
        if(salas.length == 0) return
        if(!contextoGlobal.listaSalas) {
            contextoGlobal.listaSalas = [] as Sala[];
        }
        salas.forEach(s => {
            const sala: Sala = {
                id: `sala__${s.nome}`,
                nome: s.nome
            }
            contextoGlobal.listaSalas.push(sala)
            const salaUsuarioLogado:UsuarioSala = {
                id: generateUniqueId(),
                idsala: sala.id,
                idusuario: contextoGlobal.usuario.id
            }
            const user:Usuario = {
                cor: getRandomHexColor(),
                id: `usuario__${generateUniqueId()}`,
                nome: contextoGlobal.usuario.apelido
            }
            if(!contextoGlobal.listaUsuarios) {
                contextoGlobal.listaUsuarios = [] as Usuario[]
            }
            contextoGlobal.listaUsuarios.push(user)
            if(!contextoGlobal.listaUsuariosSala) {
                contextoGlobal.listaUsuariosSala = [] as UsuarioSala[]
            }
            contextoGlobal.listaUsuariosSala.push(salaUsuarioLogado)
            if(!s.usuarios) {
                setContextoGlobal(contextoGlobal)
                return
            }
            s.usuarios.forEach(apelido => {
                if(apelido == contextoGlobal.usuario.apelido) return
                const user:Usuario = {
                    cor: getRandomHexColor(),
                    id: `usuario__${generateUniqueId()}`,
                    nome: apelido
                }
                contextoGlobal.listaUsuarios.push(user)
                const salaUser: UsuarioSala = {
                    id: generateUniqueId(),
                    idsala: sala.id,
                    idusuario: user.id
                }
                contextoGlobal.listaUsuariosSala.push(salaUser)
            })
        })
        setContextoGlobal(contextoGlobal)
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
