import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function Botao({title, onPress}) {
return (
    <TouchableOpacity style={style.button} onPress={onPress}>
        <Text style={style.buttonText}>{title}</Text>
    </TouchableOpacity>
    )
}

const style = StyleSheet.create({
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
})
