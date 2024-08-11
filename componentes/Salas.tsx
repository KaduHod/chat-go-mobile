import { useContext, useEffect } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { API_URL, ContextoGlobal, SalaApi, UsuarioApi } from "../App"
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
function SalaC({sala}: {sala:SalaApi}) {
    return (
        <TouchableOpacity style={[styles.sala, styles.salaVermelha]}>
            <Text style={styles.salaNome}>{sala.nome}</Text>
        </TouchableOpacity>
    );
}
export default function Salas() {
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
                    <SalaC sala={sala} />
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
