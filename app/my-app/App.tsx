import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { styles } from "../my-app/style/style";
import { useUserStore } from "./zustand/UserIdZustand";

const API_URL = "http://localhost:17928";

export default function LoginScreen() {
  const [telefone, setTelefone] = useState("");
  const [senha_hash, setSenha] = useState("");
  const [showCadastro, setShowCadastro] = useState(true); // formulário de cadastro visível
  const [showLogin, setShowLogin] = useState(false);      // formulário de login visível

  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.setUserId);
  const clearUser = useUserStore((state) => state.clearUser);

  // Cadastrar usuário
  async function handleCadastro() {
    if (!telefone || !senha_hash) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, senha: senha_hash }), // ajuste conforme coluna do banco
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao cadastrar usuário");
      }

      Alert.alert("Sucesso!", "Usuário cadastrado com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            setShowCadastro(false);
            setShowLogin(true); // mostra o formulário de login após cadastro
          },
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  // Fazer login
  async function handleLogin() {
    if (!telefone || !senha_hash) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, senha_hash }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao fazer login");
      }

      const data = await res.json();
      setUserId(data.id); // salva no zustand

      Alert.alert("Sucesso!", `Usuário logado com id: ${data.id}`);
      setShowLogin(false); // esconde o login
    } catch (err) {
      console.error(err);
    }
  }

  // Logout
  function handleLogout() {
    clearUser();
    setShowCadastro(true); // volta para o cadastro (ou poderia ser tela inicial)
    setTelefone("");
    setSenha("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.separator} />

      {/* Formulário de cadastro */}
      {showCadastro && (
        <View style={styles.planta}>
          <Text>Cadastro</Text>
          <Text>Telefone</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={telefone}
            onChangeText={setTelefone}
          />
          <Text>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha_hash}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={handleCadastro}>
            <Text style={styles.button}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowCadastro(false);
              setShowLogin(true);
            }}
          >
            <Text style={styles.button}>Já tenho conta (Login)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Formulário de login */}
      {showLogin && !userId && (
        <View style={styles.planta}>
          <Text>Login</Text>
          <Text>Telefone</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={telefone}
            onChangeText={setTelefone}
          />
          <Text>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha_hash}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.button}>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tela do usuário logado */}
      {userId && (
        <View style={styles.planta}>
          <Text>Bem-vindo! ID do usuário: {userId}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.button}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.separator}></View>
    </View>
  );
}
