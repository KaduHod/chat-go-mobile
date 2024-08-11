import { useContext, useEffect } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { API_URL, ContextoGlobal, Sala, SalaApi, UsuarioApi } from "../App"
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
    console.log({salas})
    return salas
}
function SalaC({sala, navigation}: {sala:SalaApi, navigation: any}) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    const onSelecionarSala = () => {
        contextoGlobal.SAALA_SELECIONADA = sala.nome
        setContextoGlobal(contextoGlobal)
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
export default function Salas({navigation}) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
    useEffect(() => {
        buscarSalas(contextoGlobal.usuario)
        .then((salas?:SalaApi[]) => {
            if(!salas) return
            contextoGlobal.salas = salas
            setContextoGlobal(contextoGlobal)
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
