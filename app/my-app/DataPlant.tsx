import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useUserStore } from './zustand/UserIdZustand';
export default function App() {
  const [ping, setPing] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:17928/plantas/1') // <- substitua pelo IP real
      .then(response => {
        setPing(JSON.stringify(response.data)); // exibe o JSON como string
      })
      .catch(err => console.error(err));
  }, []);
console.log(ping)
  return (
    <View style={styles.container}>
      <Text>Resposta do backend:</Text>
      <Text style={styles.result}>{ping !== null ? ping : 'carregando...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  result: { fontSize: 13, marginTop: 10 , fontWeight: 'bold'},
});
