import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import {Icon} from 'react-native-elements'
import {TextInputMask} from 'react-native-masked-text';
import * as firebase from 'firebase';
import ButtonComponent from '../../../../components/ButtonComponent'
import TextInputComponent from '../../../../components/TextInputComponent'
import AwesomeAlert from 'react-native-awesome-alerts';
import { StackActions } from 'react-navigation';

const{width} = Dimensions.get('window')
let nameEmpty = false
let routingNumEmpty = false
let accountNumEmpty = false
let confirmAccountNumEmpty = false
let confirmAccountNumError = ''
let showConfirmedAlert = false;

export default class Bank extends React.Component {
constructor(props){
  super(props);
  this.state = {
    routingNum: '',
    accountNum: '',
    confirmAccountNum: '',
    name: '',
  }
  nameEmpty = false
  routingNumEmpty = false
  accountNumEmpty = false
  confirmAccountNumEmpty = false
  confirmAccountNumError = ''
  showConfirmedAlert = false;
}

  //function to show confirmed alert
  showConfirmedAlert =() => {
    showConfirmedAlert = true;
    this.forceUpdate();
  }

  //function to hide confirmed alert
  hideConfirmedAlert = () => {
      showConfirmedAlert= false;
      this.forceUpdate();
  }

  renderCustomAlertView = () => (
    <View style={styles.customView}>
      <Icon
        name='check-circle'
        color= 'green'
        size= {width/6.25}
        onChangeText={text => this.setState({ text })}
      />
    </View>
  );

  updateName = (text) => {
    if(text == ''){
      nameEmpty = true
    }
    else{
      nameEmpty = false
    }
    this.setState({name: text})
    this.forceUpdate()
  }

  updateRoutingNum = (text) => {
    if(text == ''){
      routingNumEmpty = true
    }
    else{
      routingNumEmpty = false
    }
    this.setState({routingNum: text})
    this.forceUpdate()
  }

  updateAccountNum = (text) => {
    if(text == ''){
      accountNumEmpty = true
    }
    else{
      accountNumEmpty = false
    }
    this.setState({accountNum: text})
    this.forceUpdate()
  }

  updateConfirmAccountNum = (text) => {
    if(text != ''){
      confirmAccountNumEmpty = false
    }
    if(text == ''){
      confirmAccountNumEmpty = true
    }
    if(text != this.state.accountNum){
      confirmAccountNumError = 'Does not match entered account number'
    }
    else{
      confirmAccountNumError = ''
    }
    this.setState({confirmAccountNum: text})
    this.forceUpdate()
  }

  _onNameSubmitted = () => {
    const el = this.refs.routingNumInput.getElement()
    el.focus()
  }
  _onRoutingNumSubmitted = () => {
    const el = this.refs.accountNumInput.getElement()
    el.focus()
  }
  _onAccountNumSubmitted = () => {
    const el = this.refs.confirmAccountNumInput.getElement()
    el.focus()
  }

  onAddBank = () => {
    if(this.state.name == ''){
      nameEmpty = true
    }
    if (this.state.routingNum == ''){
      routingNumEmpty = true
    }
    if(this.state.accountNum == '' || this.state.accountNum.length < 4){
      accountNumEmpty = true
    }
    if(this.state.confirmAccountNum == ''){
      confirmAccountNumEmpty = true
    }
    this.forceUpdate()

    if(nameEmpty == false &&
       routingNumEmpty == false &&
       accountNumEmpty == false &&
       confirmAccountNumEmpty == false &&
       confirmAccountNumError == ''
     ){
         //get user id
         var userId = firebase.auth().currentUser.uid;
         var lastFour = this.state.accountNum.slice(-4)

         //write card into database payment methoods
         firebase.database().ref('payments/' + userId + '/banks/' + this.state.name).set({
           number: '**' + lastFour
         })

         this.showConfirmedAlert()

         //delay one second to allow user to see confirmation alert before navigating
         var delayInMilliseconds = 1000; //1 second
         setTimeout(() => {this.navigating();}, delayInMilliseconds);
       }
  }


  //navigation that takes place after bill split is submitted
  navigating(){
    //reset screen stack of settings stack
    this.props.navigation.dispatch(StackActions.popToTop());
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />
          <View style={styles.container}>
            <View style={styles.inputContainer}>

            <TextInputComponent
              empty = {nameEmpty}
              style={styles.input}
              ref='nameInput'
              placeholder="Card name, ex. 'Chase Savings'"
              placeholderTextColor="rgba(1,1,1,0.6)"
              onChangeText={(name) => this.updateName(name)}
              returnKeyType='next'
              onSubmitEditing={() => { this._onNameSubmitted() }}
            />


            <TextInputMask
              style={[styles.input,{
                borderColor: routingNumEmpty == true
                  ? 'red'
                  : '#35b0d2',
              }]}
              type={'custom'}
              options={{
                mask: '999999999'
              }}
              ref='routingNumInput'
              value={this.state.routingNum}
              keyboardType='numeric'
              placeholder= 'Routing Number'
              placeholderTextColor="rgba(1,1,1,0.6)"
              returnKeyType='next'
              onChangeText={(text) => this.updateRoutingNum(text)}
              onSubmitEditing={() => { this._onRoutingNumSubmitted() }}
            />

              <TextInputMask
                style={[styles.input,{
                  borderColor: accountNumEmpty == true
                    ? 'red'
                    : '#35b0d2',
                }]}
                type={'custom'}
                options={{
                  mask: '9999999999'
                }}
                value={this.state.accountNum}
                ref='accountNumInput'
                keyboardType='numeric'
                placeholder= 'Account Number'
                placeholderTextColor="rgba(1,1,1,0.6)"
                returnKeyType='next'
                onChangeText={(text) => this.updateAccountNum(text)}
                onSubmitEditing={() => { this._onAccountNumSubmitted() }}
              />

              <TextInputMask
                style={[styles.input,{
                  borderColor: confirmAccountNumError != '' || confirmAccountNumEmpty == true
                    ? 'red'
                    : '#35b0d2',
                }]}
                type={'custom'}
                options={{
                  mask: '9999999999'
                }}
                value={this.state.confirmAccountNum}
                ref='confirmAccountNumInput'
                keyboardType='numeric'
                placeholder= 'Confirm Account Number'
                placeholderTextColor="rgba(1,1,1,0.6)"
                returnKeyType='go'
                onChangeText={(text) => this.updateConfirmAccountNum(text)}
              />
              <Text style={styles.errorMessage}>{confirmAccountNumError}</Text>


            <View style={{marginTop: width/25, height: width/6.25}}>
            <ButtonComponent
              text='ADD BANK'
              onPress ={() => this.onAddBank()}
              disabled = {false}
              primary={true}
            />
            </View>

            </View>
          </View>
        </ImageBackground>
        <AwesomeAlert
            show={showConfirmedAlert}
            customView={this.renderCustomAlertView()}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
          />
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  },
  input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,1)',
    color:'rgba(1,1,1,0.8)',
    marginBottom: width/37.5,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
  },
  inputTitle: {
    color: "white",
    fontSize: width/18.75,
    fontWeight: 'bold',
    marginBottom: width/75,
    marginTop: width/37.5,
  },
  errorMessage:{
    color: 'red',
  },
  inputContainer: {
    padding: width/18.75,
    paddingTop: width/9.375
  },
});
