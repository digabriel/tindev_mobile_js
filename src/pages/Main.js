import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { View, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native'

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
export default function Main({ navigation }) {
  const id = navigation.getParam('currentDev')
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs', {
        headers: { user: id }
      })

      setDevs(response.data)
    }

    loadDevs();
  }, [id])

  async function handleLike(isLike) {
    if (devs.length > 0) {
      const [dev, ...rest] = devs;

      await api.post(`/devs/${dev._id}/${isLike ? "likes" : "dislikes"}`, null, {
        headers: { user: id }
      })

      setDevs(rest)
    }
  }

  async function handleLogout() {
    AsyncStorage.clear();
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logo} onPress={handleLogout}>
        <Image source={logo} />
      </TouchableOpacity>


      <View style={styles.cardsContainer}>
        {devs.length === 0 ? <Text style={styles.empty}>Acabou :(</Text> :
          (devs.map((dev, index) => (
            <View key={dev._id} style={[styles.card, { zIndex: devs.length - index }]}>
              <Image style={styles.image} source={{ uri: dev.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.name}>{dev.name}</Text>
                <Text styles={styles.bio}>{dev.bio}</Text>
              </View>
            </View>
          )))
        }
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleLike(false)}>
          <Image source={dislike} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleLike(true)}>
          <Image source={like} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: { marginTop: 30 },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between'

  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500
  },

  card: {
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff'
  },

  image: {
    flex: 1,
    height: 300
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15
  },

  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333'
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 60
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  }
})