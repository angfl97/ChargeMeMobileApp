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
import {Icon} from 'react-native-elements';
import {TextInputMask} from 'react-native-masked-text';
import * as firebase from 'firebase';
import ButtonComponent from '../../../../components/ButtonComponent'
import TextInputComponent from '../../../../components/TextInputComponent'
import AwesomeAlert from 'react-native-awesome-alerts';
import { StackActions } from 'react-navigation';

const{width} = Dimensions.get('window')
let cardNumEmpty = false
let cardNumErrorMessage = ''
let expDateEmpty = false
let expDateErrorMessage = ''
let securityCodeEmpty = false
let securityCodeErrorMessage = ''
let zipcodeEmpty = false
let zipcodeErrorMessage = ''
let nameEmpty = false
let showConfirmedAlert = false;


export default class DebitCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cardNum: '',
      expDate: '',
      securityCode: '',
      zipcode: '',
      name: ''
    }
    cardNumEmpty = false
    cardNumErrorMessage = ''
    expDateEmpty = false
    expDateErrorMessage = ''
    securityCodeEmpty = false
    securityCodeErrorMessage = ''
    zipcodeEmpty = false
    zipcodeErrorMessage = ''
    nameEmpty = false
    showConfirmedAlert = false
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

  onAddCard = () => {
    let cardNumbers = this.cardNumField.getRawValue()
    let expDateRaw = this.state.expDate.replace(/\D/g,'')

    if( this.state.name == ''){
      nameEmpty = true
    }
    if( cardNumbers.length != 4 ||  cardNumbers[(cardNumbers.length)-1].length != 4){
      cardNumErrorMessage = 'Invalid card number'
    }
    if( expDateRaw == '' || expDateRaw.length != 4){
      expDateErrorMessage = 'Invalid expiration date'
    }
    if( this.state.securityCode == '' || this.state.securityCode.length != 3){
      securityCodeErrorMessage = 'Invalid security code'
    }
    if( this.state.zipcode == '' || this.state.zipcode.length != 5){
      zipcodeErrorMessage = 'Invalid zipcode'
    }
    this.forceUpdate()

    if( nameEmpty == false &&
        cardNumErrorMessage == '' &&
        expDateErrorMessage == '' &&
        securityCodeErrorMessage == '' &&
        zipcodeErrorMessage == ''
      ){

        //get user id
        var userId = firebase.auth().currentUser.uid;

        //write card into database payment methoods
        firebase.database().ref('payments/' + userId + '/cards/' + this.state.name).set({
          number: '**'  + cardNumbers[(cardNumbers.length)-1]
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

  updateCardNum = (text) => {
    if(text == ''){
      cardNumEmpty = true
    }
    else{
      cardNumEmpty = false
    }
    cardNumErrorMessage=''
    this.setState({cardNum: text})
    this.forceUpdate()
  }

  updateExpDate = (text) => {
    if(text == ''){
      expDateEmpty = true
    }
    else{
      expDateEmpty = false
    }
    expDateErrorMessage=''
    this.setState({expDate: text})
    this.forceUpdate()
  }

  updateSecurityCode = (text) => {
    if(text == ''){
      securityCodeEmpty = true
    }
    else{
      securityCodeEmpty = false
    }
    securityCodeErrorMessage=''
    this.setState({securityCode: text})
    this.forceUpdate()
  }

  updateZipcode = (text) => {
    if(text == ''){
      zipcodeEmpty = true
    }
    else{
      zipcodeEmpty = false
    }
    zipcodeErrorMessage=''
    this.setState({zipcode: text})
    this.forceUpdate()
  }

  _onNameSubmitted = () => {
    const el = this.cardNumField.getElement()
    el.focus()
  }

  _onCardNumSubmitted = () => {
    const el = this.expDateField.getElement()
    el.focus()
  }

  _onExpDateSubmitted = () => {
    const el = this.securityCodeField.getElement()
    el.focus()
  }

  _onSecurityCodeSubmitted = () => {
    const el = this.zipcodeField.getElement()
    el.focus()
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
                placeholder="Card Name, ex. 'Chase Personal'"
                placeholderTextColor="rgba(1,1,1,0.6)"
                onChangeText={(name) => this.updateName(name)}
                onSubmitEditing={() => { this._onNameSubmitted() }}
                returnKeyType='next'
              />

              <TextInputMask
                style={[styles.input,{ marginTop: width/18.75,
                  borderColor: cardNumEmpty == true || cardNumErrorMessage != ''
                    ? 'red'
                    : '#35b0d2',
                }]}
                type={'credit-card'}
                value={this.state.cardNum}
                ref={(ref) => this.cardNumField = ref}
                placeholder= 'Card Number'
                placeholderTextColor="rgba(1,1,1,0.6)"
                onChangeText={(text) => this.updateCardNum(text)}
                onSubmitEditing={() => { this._onCardNumSubmitted() }}
              />
              <Text style={styles.errorMessage}>{cardNumErrorMessage}</Text>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <TextInputMask
                    style={[styles.input,{ width: width/2.4,
                      borderColor: expDateEmpty == true || expDateErrorMessage != ''
                        ? 'red'
                        : '#35b0d2',
                    }]}
                    type={'custom'}
                    options={{
                      mask: '99/99'
                    }}
                    value={this.state.expDate}
                    ref={(ref) => this.expDateField = ref}
                    keyboardType='numeric'
                    placeholder= 'Exp. date, MM/YY'
                    placeholderTextColor="rgba(1,1,1,0.6)"
                    onChangeText={(text) => this.updateExpDate(text)}
                    onSubmitEditing={() => { this._onExpDateSubmitted() }}
                  />
                  <Text style={styles.errorMessage}>{expDateErrorMessage}</Text>
                </View>

                <View>
                  <TextInputMask
                    style={[styles.input,{ width: width/2.4,
                      borderColor: securityCodeEmpty == true || securityCodeErrorMessage != ''
                        ? 'red'
                        : '#35b0d2',
                    }]}
                    type={'custom'}
                    options={{
                      mask: '999'
                    }}
                    value={this.state.securityCode}
                    ref={(ref) => this.securityCodeField = ref}
                    keyboardType='numeric'
                    placeholder= 'Security Code'
                    placeholderTextColor="rgba(1,1,1,0.6)"
                    onChangeText={(text) => this.updateSecurityCode(text)}
                    onSubmitEditing={() => { this._onSecurityCodeSubmitted() }}
                  />
                  <Text style={styles.errorMessage}>{securityCodeErrorMessage}</Text>
                </View>
              </View>


              <TextInputMask
                style={[styles.input,{ width: width/2.4,
                  borderColor: zipcodeEmpty == true || zipcodeErrorMessage != ''
                    ? 'red'
                    : '#35b0d2',
                }]}
                type={'custom'}
                options={{
                  mask: '99999'
                }}
                value={this.state.zipcode}
                ref={(ref) => this.zipcodeField = ref}
                keyboardType='numeric'
                placeholder= 'Zip Code'
                placeholderTextColor="rgba(1,1,1,0.6)"
                onChangeText={(text) => this.updateZipcode(text)}
              />
              <Text style={styles.errorMessage}>{zipcodeErrorMessage}</Text>

              <View style={{marginTop: width/25, height: width/6.25}}>
              <ButtonComponent
                text='ADD CARD'
                onPress ={() => this.onAddCard()}
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
  inputContainer: {
    padding: width/18.75
  },
  input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,1)',
    color:'rgba(1,1,1,0.8)',
    marginTop: width/75,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
  },
  errorMessage:{
    color: 'red',
  },
});
