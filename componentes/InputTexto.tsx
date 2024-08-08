import { StyleSheet, TextInput } from "react-native";

export function InputTexto({title, onChangeText, valor}) {
    return (
        <TextInput
            style={style.input}
            value={valor}
            placeholder={title}
            onChangeText={onChangeText}
        />
    )
}

const style = StyleSheet.create({
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
    }
})
