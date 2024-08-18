import { useContext, useEffect, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { API_URL, AuthContext, ContextoGlobal, Mensagem, Sala, SalaApi, Usuario, UsuarioApi, UsuarioSala, ContextoGlobalT, ContextoSSE } from "../App"
import EventSource from "react-native-sse"
export function Botao({title, onPress}:any) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}
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
            <View style={styles.centro}>
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
export function Login({navigation}: any) {
    const [userName, setUserName] = useState('');
    const {setAutenticado, estaAutenticado} = useContext(AuthContext)
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    const {contextoSSE, setContextoSSE} = useContext(ContextoSSE)
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
        contextoGlobal.usuario = usuario
        contextoSSE.sse = new EventSource(`${API_URL}/sse/${usuario.apelido}`);
        setContextoSSE(contextoSSE)
        if(!contextoSSE.sse.eventHandlers['chat-nova-mensagem']) {
            contextoSSE.sse.addEventListener('chat-nova-mensagem', (e:any) => {
                const json = JSON.parse(e.data).conteudo
                const msg: Mensagem = {
                    id: generateUniqueId(),
                    conteudo: json.mensagem,
                    remetente: json.remetente,
                    sala: json.sala
                }
                if(!contextoGlobal.listaMensagens) {
                    contextoGlobal.listaMensagens = [];
                    setContextoGlobal(contextoGlobal)
                }
                contextoGlobal.listaMensagens.push(msg)
                setContextoGlobal({...contextoGlobal})
            })
        }
        setContextoSSE(contextoSSE)
        setContextoGlobal(contextoGlobal)
        setAutenticado(true)
    }
    const onPressRegister = async () => {
        navigation.navigate('Cadastro', {})
    }
    return (
     <SafeAreaView>
        <View style={styles.centro}>
            <InputTexto valor={userName} onChangeText={setUserName} title="Digite o nome de usuario"/>
            <View style={styles.buttonContainer}>
                <Botao title="Login" onPress={onPressLogin} />
                <Botao title="Cadastro" onPress={onPressRegister} />
            </View>
         </View>
     </SafeAreaView>
    );
}
export function Chat({navigation}: any) {
    const {contextoGlobal, setContextoGlobal}:any = useContext(ContextoGlobal)
    useEffect(() => {
        //setMensagens([...contextoGlobal.listaMensagens]);
    }, [contextoGlobal.listaMensagens]);
    return (
        <View style={[styles.mainContainer, styles.debug]}>
            <View style={styles.tituloWrapper}>
                <Titulo>{contextoGlobal.SALA_SELECIONADA}</Titulo>
            </View>
            <ScrollView style={[styles.containerMensagens]}>
                {contextoGlobal.listaMensagens?.filter(mensagem => contextoGlobal.SALA_SELECIONADA == mensagem.sala).map(mensagem => {
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
            <View style={[styles.debug, styles.containerBotoes]}>
                <View></View>
                <Botao title="Enviar" onPress={() => console.log("Enviar mensagem")} />
            </View>
        </View>
    )
}
export function InputTexto({title, onChangeText, valor}: any) {
    return (
        <TextInput
            style={styles.input}
            value={valor}
            placeholder={title}
            onChangeText={onChangeText}
        />
    )
}

const formatarData = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
};

export function MensagemC({ id, alinhamento, mensagem, cor, remetente }: any) {
  return (
    <View id={id} style={[styles.container, styles[alinhamento]]}>
      <View style={styles.messageContent}>
        <Text>{mensagem}</Text>
      </View>
      <View style={styles.footer}>
            <Text style={[styles.remetente, { color: cor }]}>{remetente}</Text>
        <Text style={styles.data}>{formatarData()}</Text>
      </View>
    </View>
  );
};
export function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function TelaInicial({navigation}: any) {
    const {contextoGlobal , setContextoGlobal} = useContext<ContextoGlobalT>(ContextoGlobal)
    useEffect(() => {
        buscarSalas(contextoGlobal.usuario)
        .then((salas?:SalaApi[]) => {
            if(!salas) return
            contextoGlobal.salas = salas
            setContextoGlobal(contextoGlobal)
            iniciarChat(contextoGlobal, setContextoGlobal)
        })
    }, [contextoGlobal.usuario])

    const ctxGlobal = contextoGlobal as ContextoGlobalT
        const onPressSala = () => {
        navigation.navigate('Salas')
    }
    return(
        <View style={styles.mainContainer}>
            <Botao title="Salas" onPress={onPressSala} />
        </View>
    )
}
const buscarSalas = async (usuario:UsuarioApi) => {
    const res = await fetch(`${API_URL}/chat/${usuario.apelido}/salas`)
    if(res.status != 200) {
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

function iniciarChat (ctxGlobal: ContextoGlobalT, setContextoGlobal:any) {
    const salas = ctxGlobal.salas
    if(!salas) return console.log("Sem salas para inicar chat")
    if(salas.length == 0) return
    if(!ctxGlobal.listaSalas) {
        ctxGlobal.listaSalas = [] as Sala[];
    }
    salas.forEach((s) => {
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
export function Salas({navigation}) {
    const {contextoGlobal, setContextoGlobal} = useContext<ContextoGlobalT>(ContextoGlobal)
    const [salas, setSalas] = useState<SalaApi[]>(contextoGlobal.salas);
    return (
        <View style={[styles.salaMainContainer]}>
            <ScrollView contentContainerStyle={[styles.scrollContent]}>
                {salas.map((sala:SalaApi) => (
                    <SalaC key={generateUniqueId()} sala={sala} navigation={navigation}/>
                ))}
            </ScrollView>
        </View>
    )
}
export const Titulo = ({ children }) => {
  return (
    <Text style={styles.medium}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
    button: {
        margin: 2,
        backgroundColor: '#ff6b6b', // Cor de fundo do botão
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3, // Somente para Android
    },
    buttonText: {
        color: '#fff', // Cor do texto
        fontSize: 16,
        fontWeight: 'bold',
    },
    centro:  {
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    },
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
    },
    input: {
        height: 50,
        width: 300,
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
    buttonContainer: {
        display: 'flex',
    },
    container: {
        flexDirection: 'column',
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        padding: 8,
        alignSelf: 'flex-start', // Este estilo pode ser ajustado para refletir o alinhamento correto
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
        messageContent: {
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    remetente: {
        fontWeight: 'bold',
        marginRight: 4,
    },
        data: {
        color: '#718096',
    },
        esquerda: {
        alignSelf: 'flex-start',
    },
        direita: {
        alignSelf: 'flex-end',
    },
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
    },
    medium: {
        fontSize: 24,
        fontWeight: '600',
    },
})
