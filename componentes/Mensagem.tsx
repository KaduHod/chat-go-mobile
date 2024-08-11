import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MensagemProps {
  id: string;
  alinhamento: string;
  mensagem: string;
  cor: string;
  remetente: string;
}

const formatarData = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
};

export const MensagemC: React.FC<MensagemProps> = ({ id, alinhamento, mensagem, cor, remetente }) => {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 8,
    maxWidth: 'fit-content',
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
});
