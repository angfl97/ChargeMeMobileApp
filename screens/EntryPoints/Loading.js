import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  SafeAreaView,
  Keyboard,
  Dimensions
} from 'react-native';
import * as firebase from 'firebase';

const{width} = Dimensions.get('window')

export default class Loading extends React.Component{

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'App' : 'Auth')
    })
  }

  render(){
    return(

      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../assets/coin.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

            <KeyboardAvoidingView style={styles.container}>

                <View style={styles.container}>
                      <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../../assets/logo_transparent.png')}/>
                      </View>

                      <View style={styles.infoContainer}>
                        <Text style={styles.pageTitle}>Loading</Text>
                        <ActivityIndicator size="large" color="#34c6de"/>
                      </View>

                </View>

            </KeyboardAvoidingView>
          </ImageBackground>
        </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
  },
  imageContainer: {
    resizeMode:'cover',
    flex:1,
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  logo: {
    flex: 1,
    width: width/1.5,
    resizeMode: 'contain',
  },
  logoContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: width/18.75,
  },
  infoContainer: {
    flex: 1,
    width: width,
    padding:width/18.75,
    padding: width/18.75,
  },
  pageTitle: {
    color: '#fff',
    fontSize: width/15,
    marginBottom: width/18.75,
    textAlign: 'center',
  },
});
