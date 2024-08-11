import { useContext } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ContextoGlobal, ContextoGlobalT, Sala, SalaApi, Usuario, UsuarioSala } from "../App"
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
