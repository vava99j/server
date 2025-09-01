// App.js no seu projeto Expo

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [ping, setPing] = useState(null);

  useEffect(() => {
    axios.get('http:localhost/plantas') // veja abaixo sobre o host
      .then(response => setPing(response.data.result))
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
