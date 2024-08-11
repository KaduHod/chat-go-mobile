import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export const Titulo = ({ children }) => {
  return (
    <Text style={styles.medium}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  small: {
    fontSize: 18,
    fontWeight: '500',
  },
  medium: {
    fontSize: 24,
    fontWeight: '600',
  },
  large: {
    fontSize: 32,
    fontWeight: '700',
  },
});

export default Titulo;
