import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function InicioScreen({ navigation }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);



  const handleInicio = async () => {
    try {
      setError(null);
      const response = await fetch(`http://192.168.0.113:3000/inicio?name=${name}`);
      const data = await response.json();

      if (response.ok) {
        // Navega para a tela de jogo passando o nome
        navigation.navigate('Jogo', { name: name });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro de rede ou servidor!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Jogo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />
      <Button title="Iniciar" onPress={handleInicio} />
      {/* Adicionar o botão para navegar diretamente para a tela de Jogo */}
      <Button
        title="Jogar Sem Inserir Nome"
        onPress={() => navigation.navigate('Jogo')}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}


  const handleProximo = async () => {
    try {
      setJogoError(null); // Reset error
      const response = await fetch(`http://192.168.0.113:3000/jogo?name=${name || 'anônimo'}`);
      const data = await response.json();

      if (response.ok) {
        setJogoResult(data); // Atualiza o resultado do jogo
      } else {
        setJogoError(data.error);
        setJogoResult(null);
      }
    } catch (err) {
      setJogoError('Erro de rede ou servidor!');
      setJogoResult(null);
    }
  };

  // Faz a primeira chamada quando a tela de jogo for aberta
  useEffect(() => {
    handleProximo();
  }, []);

  return (
    <View style={styles.container}>
      {jogoResult && (
        <>
          <Text style={styles.title}>Resultado do Jogo</Text>
          <Image style={styles.image} source={{ uri: jogoResult.imagem }} />
          <Text>Acertos: {jogoResult.qtdAcertos}</Text>
          <Text>Erros: {jogoResult.qtdErros}</Text>
          <View style={styles.namesContainer}>
            {jogoResult.nomesAleatorios.map((nome, index) => (
              <Button key={index} title={nome} onPress={() => alert(`Você escolheu: ${nome}`)} />
            ))}
          </View>
        </>
      )}
      {jogoError && <Text style={styles.error}>{jogoError}</Text>}

      {/* Botão para jogar novamente */}
      <Button title="proximo" onPress={handleProximo} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={InicioScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="Jogo" component={JogoScreen} options={{ title: 'Jogo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  namesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});