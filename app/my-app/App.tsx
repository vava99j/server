import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [ping, setPing] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://192.168.56.1:17928/plantas') // <- substitua pelo IP real
      .then(response => {
        setPing(JSON.stringify(response.data)); // exibe o JSON como string
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Resposta do backend:</Text>
      <Text style={styles.result}>{ping !== null ? ping : 'carregando...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  result: { fontSize: 24, marginTop: 10 },
});
