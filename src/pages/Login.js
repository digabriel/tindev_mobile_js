import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login({ navigation }) {
  const [dev, setDev] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('dev').then(dev => {
      if (dev) {
        navigation.navigate('Main', { currentDev: dev })
      }
    })
  }, [])

  async function handleLogin() {
    const response = await api.post('/devs', { username: dev })
    const { _id } = response.data
    await AsyncStorage.setItem('dev', _id);
    navigation.navigate('Main', { currentDev: _id });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}
    >
      <Image source={logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        placeholder="Digite seu usuário no Github"
        placeholderTextColor="#999"
        onChangeText={setDev} />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },

  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#df4723',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})