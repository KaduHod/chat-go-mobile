import { useContext, useEffect } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { API_URL, ContextoGlobal, ContextoGlobalT, Sala, SalaApi, UsuarioApi, Usuario, UsuarioSala } from "../App"
import EventSource from "react-native-sse"
import "event-source-polyfill"
import { getRandomHexColor } from "./PaginaInicial"
const buscarSalas = async (usuario:UsuarioApi) => {
    const res = await fetch(`${API_URL}/chat/${usuario.apelido}/salas`)
    if(res.status != 200) {
        console.log({res}, "Erro ao buscar salas de usuarios")
        return
    }
    const resposta = await res.json();
    const {salas} = resposta as {
        salas: SalaApi[]
    }
    return salas
}
const entrarEmSala = async (apelido:string, nomesala:string) => fetch(`${API_URL}/chat/sse/${apelido}/entrar/${nomesala}`)
function SalaC({sala, navigation}: {sala:SalaApi, navigation: any}) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    const onSelecionarSala = async () => {
        contextoGlobal.SALA_SELECIONADA = sala.nome
        setContextoGlobal(contextoGlobal)
        const res = await entrarEmSala(contextoGlobal.usuario.apelido, sala.nome)
        console.log({res})
        navigation.navigate("Chat")
    }
    return (
        <TouchableOpacity style={[styles.sala, styles.salaVermelha]} onPress={onSelecionarSala}>
            <Text style={styles.salaNome}>{sala.nome}</Text>
        </TouchableOpacity>
    );
}
function generateUniqueId() {
    const randomPart = Math.random().toString(36).substring(2, 15);
    const timePart = Date.now().toString(36);
    return randomPart + timePart;
}

const iniciarChat = (ctxGlobal: ContextoGlobalT, setContextoGlobal:any) => {
    const salas = ctxGlobal.salas
    if(!salas) return console.log("Sem salas para inicar chat")
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
    if(ctxGlobal.sse) return
    ctxGlobal.sse = new EventSource(`${API_URL}/sse/${ctxGlobal.usuario?.apelido}`)
    setContextoGlobal(ctxGlobal)
    /*Abrir conexao sse*/
}
export default function Salas({navigation}) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    useEffect(() => {
        buscarSalas(contextoGlobal.usuario)
        .then((salas?:SalaApi[]) => {
            if(!salas) return
            contextoGlobal.salas = salas
            setContextoGlobal(contextoGlobal)
            iniciarChat(contextoGlobal, setContextoGlobal)
        })
    }, [contextoGlobal.usuario])
    return (
        <View style={[styles.salaMainContainer]}>
            <ScrollView contentContainerStyle={[styles.scrollContent]}>
                {contextoGlobal.salas?.map((sala:SalaApi) => (
                    <SalaC key={generateUniqueId()} sala={sala} navigation={navigation}/>
                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    sala: {
        width: '100%',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: '#4a90e2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3, // Para Android
    },
    salaVermelha: {
        backgroundColor: '#ff6b6b', // Vermelho
    },
    salaVerde: {
        backgroundColor: '#27ae60', // Verde
    },
    salaNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    salaMainContainer: {
        padding: 3,
        flex: 1,
        backgroundColor: "#f5f5f5",
        display: 'flex',
        flexDirection: "column",
    },
    scrollContent: {
        flexDirection: "column",
        paddingHorizontal: 10
    },
    debug: {
        borderColor: 'red',  // Borda vermelha para debug
        borderWidth: 1,
    }
})
