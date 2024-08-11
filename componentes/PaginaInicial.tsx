import { useContext } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ContextoGlobal } from "../App"
import { Botao } from "./Botao"
export function TelaInicial({navigation}: any) {
    const {contextoGlobal, setContextoGlobal} = useContext(ContextoGlobal)
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
