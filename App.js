import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <Button title="Iniciar" onPress={() => navigation.navigate('Jogo')} />
    
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function JogoScreen({ route, navigation }) {
  // Estados para armazenar os dados recebidos da API
  const [name, getName] = useEffect();
  const [nameP1, getNameP1, setNameP1] = useState(null);
  const [nameP2, getNameP2, setNameP2] = useState(null);
  const [nameP3, getNameP3, setNameP3] = useState(null);
  const [nameP4, getNameP4, setNameP4] = useState(null);
  const [imagenP, getImagenP] = useState(null);
  const [jogoError, setJogoError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar os dados da API
  const fetchPokemonData = async () => {
    try {
      const response = await fetch('http://localhost:3000/jogo?name=charmander'); // Endpoint da API
      const data = await response.json(); // Convertendo a resposta para JSON

      // Armazenando os dados no estado
      getNameP1(data.nomesAleatorios[0]);
      getNameP2(data.nomesAleatorios[1]);
      getNameP3(data.nomesAleatorios[2]);
      getNameP4(data.nomesAleatorios[3]);
      getImagenP(data.imagem); 
      setIsLoading(false); 

      if (response.ok) {
        setJogoResult(data); 
      } else {
        setJogoError(data.error);
        setJogoResult(null);
      }
    } catch (err) {
      setJogoError('Erro de rede ou servidor!');
      setJogoResult(null);
    }
  };

  
  useEffect(() => {
    JogoScreen();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual nome desse pokemon: </Text>
      
      <Image style={styles.image} source={{getImagenP}} />
          
          <View style={styles.namesContainer}>
            {jogoResult.nomesAleatorios.map((nameP1, index) => (
              <Button key={index} title={nome} onPress={() => alert(`Você escolheu: ${nameP1}`)} />
            ))}
          </View>
        
      
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