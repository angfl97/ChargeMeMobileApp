import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as firebase from 'firebase';
import moment from 'moment';
import {TextInputMask} from 'react-native-masked-text';
import AwesomeAlert from 'react-native-awesome-alerts';
import { StackActions, NavigationActions } from 'react-navigation';
import TextInputComponent from '../../components/TextInputComponent.js'

const{width} = Dimensions.get('window')
let firstNameError = false;
let lastNameError = false;
let phoneError = false;
let birthdayError = false;
let usernameError = false;
let emailError = false;
let passwordError = false;
let loading = false;
let passwordErrorMessage = '';
let emailErrorMessage = '';
let birthdayErrorMessage = '';
let usernameErrorMessage = '';
let phoneErrorMessage = '';


const resetToLogin = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
});

export default class CreateAccount extends React.Component {
  // constructor with state of email, password,username, firstName, lastName, phoneNumber,birthday, street, city,
  // state, zipCode, error, loading properties to support account creation
  constructor(props){
    super(props);
    this.state = {
      username:'',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthday: '',
      password:'',
      disable: true,
    };
    firstNameError = false;
    lastNameError = false;
    phoneError = false;
    birthdayError = false;
    usernameError = false;
    emailError = false;
    passwordError = false;
    loading = false;
    firstnameErrorMessage = '';
    lastnameErrorMessage = '';
    passwordErrorMessage = '';
    emailErrorMessage = '';
    birthdayErrorMessage = '';
    usernameErrorMessage = '';
    phoneErrorMessage = '';

  }

  onLoginPress(){
    this.props.navigation.dispatch(resetToLogin)
  }

  //function to handle clicking sign up button
  onSignUpPress(){
    if(this.state.firstName == ''){
      firstNameError = true;
    }
    if(this.state.lastName == ''){
      lastNameError = true;
    }
    if(this.state.phone == ''){
      phoneError = true;
    }
    if(this.state.birthday == ''){
      birthdayError = true;
    }
    if(this.state.username == ''){
      usernameError = true;
    }
    if(this.state.email == ''){
      emailError = true;
    }
    if(this.state.password == ''){
      passwordError = true;
    }

    const isValid = this.datetimeField.isValid()
    if(isValid == false){
      birthdayErrorMessage= 'Please enter a valid date - MM/DD/YYYY';
    }
    else{
      birthdayErrorMessage = '';
    }

    let unMasked = this.phoneNum.getRawValue();

    //force page to rerender to display accurate error messages
    this.forceUpdate();

    //make sure no errors exist
    if( firstNameError == false
        && lastNameError == false
        && phoneError == false
        && birthdayError == false
        && usernameError == false
        && emailError == false
        && passwordError == false
        && lastnameErrorMessage == ''
        && firstnameErrorMessage == ''
        && passwordErrorMessage == ''
        && usernameErrorMessage == ''
        && emailErrorMessage == ''
        && birthdayErrorMessage == ''
        && phoneErrorMessage == ''){

        //call makeUsernameUnique function
        this.makeUsernameUnique()

    }
  }

  //function to create user
  createUser(){

      //get email and password from state
      const{email,password} = this.state;

      //display loading spinner
      loading = true;

      //call firebase authentication method using email and password
      firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(() => {
            //if we are signed in without any error

            //display sign up button
            loading = false;

            //get user id
            var userId = firebase.auth().currentUser.uid;

            //format birthday
            const momentDay = this.datetimeField.getRawValue()
            const day = moment(momentDay).format("MMM Do YY");

            //format phoneNum
            let unMask = this.phoneNum.getRawValue();

            //write user info
            firebase.database().ref('users/' + userId).set({
              username: this.state.username,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              phone: unMask,
              birthday: day,
            });
            //allow access to app
            this.props.navigation.navigate('App');
      })
      .catch(() =>{
            //if there is an error during account creation

            //display sign up button
            loading = false;

            //display email error
            emailErrorMessage = "That email is taken";
            this.forceUpdate();
      })
  }

  //function to check if entered username already exists
  makeUsernameUnique(){
    //display loading spinner
    loading = true;

    //save the username entered
    var currentUsername = this.state.username;

    //save the root reference to the database
    var ref = firebase.database().ref();

    //find all users that have the current username
    ref.child('users').orderByChild('username').equalTo(currentUsername).once('value', snapshot => {
      let result = snapshot.val();

      //if the username does not exist in the database
      if(!result){
        //clear username error
        usernameErrorMessage = '';
        //call create user function
        this.createUser();
      }
      //if username is already taken
      else{

        //display sign up button
        loading = false;
        //set username error message
        usernameErrorMessage= 'Username is taken';
        this.forceUpdate();
      }
    });
  }

  updateBday(bday){
    this.setState({disable: false});
    if(bday == ''){
      birthdayError = true
      birthdayErrorMessage = ''
    }
    else{
      birthdayError = false
      if(bday.length < 10){
        birthdayErrorMessage= 'Please enter a valid date - MM/DD/YYYY';
      }
      else{
        birthdayErrorMessage = ''
      }
    }
    this.setState({birthday: bday })
  }

  updateFirstName(first){
    this.setState({disable: false});
    if(first == ''){
      firstNameError = true
    }
    else{
      firstNameError = false
    }
    this.setState({firstName: first })
  }

  updateLastName(last){
    this.setState({disable: false});
    if(last == ''){
      lastNameError = true
    }
    else{
      lastNameError = false
    }
    this.setState({lastName: last })
  }

  updateUsername(user){
    this.setState({disable: false});
    usernameErrorMessage = ''
    if(user == ''){
      usernameError = true
    }
    else{
      usernameError = false
    }
    this.setState({username: user})
  }

  updatePhone(phone){
    this.setState({disable: false});
    if(phone == ''){
      phoneError = true
    }
    else{
      phoneError = false
    }
    if(phone.length != 15 && phone.length != 0){
      phoneErrorMessage = 'Please enter a valid phone number'
    }
    else{
      phoneErrorMessage = ''
    }
    this.setState({phone: phone })
  }

  updateEmail(email){
    this.setState({disable: false});
    if(email == ''){
      emailError = true
      emailErrorMessage = ''
    }
    else{
      emailError = false
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      if(reg.test(email) === false){
        emailErrorMessage = 'Please enter a valid email address'
      }
      else{
        emailErrorMessage = ''
      }
    }
    this.setState({email: email })
  }

  updatePassword(password){
    this.setState({disable: false});
    if(password == ''){
      passwordError = true
    }
    else{
      passwordError = false
    }
    if(password.length < 6 && password.length > 0){
      passwordErrorMessage = 'Password must be at least 6 characters'
    }
    else{
      passwordErrorMessage = ''
    }
    this.setState({password: password })
  }

  //function to decide whether to display login button or loading spin
  renderButtonOrLoading(){
    if(loading == false){
      //if not in state of loading show sign up button (button is bound to
      //onSignUpPress function)
      const isDisabled  = this.state.disable;
      return (
        <View style={styles.container}>
        <View style={isDisabled?styles.disabled:styles.enabled}>
          <TouchableOpacity
            style={styles.button}
            onPress ={this.onSignUpPress.bind(this)}
            disabled = {isDisabled}>
            <Text style={styles.btntext}>SIGN UP</Text>
          </TouchableOpacity>
        </View>

        <View style = {styles.container}>
          <Text
          style={styles.title}
          onPress={this.onLoginPress.bind(this)}> Already have an Account? </Text>
        </View>
        </View>
      )
    }
  }

  render(){
    let showAlert = loading
    return(

      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../assets/coin.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />
          <StatusBar barStyle="light-content" />
            <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
              <View style={styles.container}>

                <View style={styles.logoContainer}>
                  <Image style={styles.logo} source={require('../../assets/logo_transparent.png')}/>
                </View>

                <View style={styles.infoContainer}>

                  <KeyboardAwareScrollView contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                  }}>

                    <View style = {styles.inputBoxContainer}>
                    <Text style={styles.pageTitle}>Please fill out all fields</Text>

                      <View style={styles.nameContainer}>
                      <View style={styles.nameInputContainer}>
                        <TextInput
                          style={[styles.input,{
                            borderColor: firstNameError == true || firstnameErrorMessage != ''
                              ? 'red'
                              : '#35b0d2',
                          }]}
                          placeholder="First Name"
                          placeholderTextColor="rgba(255,255,255,0.8)"
                          ref = "firstName"
                          autoCorrect= {false}
                          returnKeyType='next'
                          onChangeText={(first) => this.updateFirstName(first)}
                          onSubmitEditing={()=> this.refs.lastName.focus()}
                        />
                        </View>
                        <Text/>
                        <View style={styles.nameInputContainer}>
                        <TextInput
                          style={[styles.input,{
                            borderColor: lastNameError == true || lastnameErrorMessage != ''
                              ? 'red'
                              : '#35b0d2',
                          }]}
                          placeholder="Last Name"
                          placeholderTextColor="rgba(255,255,255,0.8)"
                          ref = "lastName"
                          autoCorrect= {false}
                          returnKeyType='next'
                          onChangeText={(last) => this.updateLastName(last)}
                        />
                        </View>
                        <Text/>
                      </View>

                      <TextInputMask
                        style={[styles.input,{
                          borderColor: phoneError == true || phoneErrorMessage != ''
                            ? 'red'
                            : '#35b0d2',
                        }]}
                        type={'custom'}
                        options={
                          {
                            mask: '+1(999)999-9999',
                            getRawValue: function(value,settings){
                              return value.replace(/\D/g,'');
                            }
                          }
                        }
                        ref = {(phone) => this.phoneNum = phone}
                        value={this.state.phone}
                        onChangeText= {(phone) => this.updatePhone(phone)}
                        placeholder="Phone"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        keyboardType={'numeric'}
                        returnKeyType='next'
                      />
                      <Text style = {styles.errorMessage}>{phoneErrorMessage}</Text>

                      <TextInputMask
                        type={'datetime'}
                        style={[styles.input,{
                          borderColor: birthdayError == true || birthdayErrorMessage != ''
                            ? 'red'
                            : '#35b0d2',
                        }]}
                        options={{
                          format: 'MM/DD/YYYY'
                        }}
                        value={this.state.birthday}
                        placeholder="Birthday"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        onChangeText={(bday) => this.updateBday(bday)}
                        returnKeyType='next'
                        ref={(ref) => this.datetimeField = ref}
                        onSubmitEditing={()=> this.refs.username.focus()}
                      />
                      <Text style = {styles.errorMessage}>{birthdayErrorMessage}</Text>

                      <TextInput
                        style={[styles.input,{
                          borderColor: usernameError == true || usernameErrorMessage != ''
                            ? 'red'
                            : '#35b0d2',
                        }]}
                        placeholder="Username"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        ref = "username"
                        autoCorrect= {false}
                        autoCapitalize = 'none'
                        returnKeyType='next'
                        onChangeText={(user) => this.updateUsername(user)}
                        onSubmitEditing={()=> this.refs.email.focus()}
                      />
                      <Text style = {styles.errorMessage}>{usernameErrorMessage}</Text>

                      <TextInput
                        style={[styles.input,{
                          borderColor: emailError == true || emailErrorMessage != ''
                            ? 'red'
                            : '#35b0d2',
                        }]}
                        placeholder="Email"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        ref = "email"
                        autoCorrect= {false}
                        autoCapitalize = 'none'
                        returnKeyType='next'
                        onChangeText={(email) => this.updateEmail(email)}
                        onSubmitEditing={()=> this.refs.password.focus()}
                      />
                      <Text style = {styles.errorMessage}>{emailErrorMessage}</Text>

                      <TextInput
                        style={[styles.input,{
                          borderColor: passwordError == true || passwordErrorMessage != ''
                            ? 'red'
                            : '#35b0d2',
                        }]}
                        placeholder="Password"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        ref = "password"
                        autoCorrect= {false}
                        secureTextEntry
                        returnKeyType='go'
                        onChangeText={(password) => this.updatePassword(password)}
                      />
                      <Text style = {styles.errorMessage}>{passwordErrorMessage}</Text>

                    </View>

                    <View style = {styles.signUpContainer}>
                        {this.renderButtonOrLoading()}
                    </View>

                  </KeyboardAwareScrollView>
                </View>
                <AwesomeAlert
                  show={showAlert}
                  showProgress={true}
                  title="Creating Account"
                  closeOnTouchOutside={false}
                  closeOnHardwareBackPress={false}
                />
              </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column',

  },
  errorMessage:{
    color: 'red',
    marginBottom: width/75,
    fontSize: width/25,
  },
  inputBoxContainer:{
    flex:8,
    justifyContent: 'center',
  },
  signUpContainer: {
    flex:1,
    alignItems: 'center',
  },
  header:{
    position:'absolute',
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
  },
  logoContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: width/18.75,
  },
  infoContainer: {
    flex: 4,
    width: width,
    padding:width/18.75,
  },
  nameContainer:{
    height: width/5.859,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInputContainer: {
    height:width/12.5,
    width: width/2.3,
  },
  input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color:'#fff',
    marginBottom: width/75,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
  },
  title:{
    color: '#fff',
    fontSize: width/25,
    textAlign:'center',
    marginTop: width/18.75,
  },
  inputTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: width/23.438,
    marginBottom: width/75,
    marginTop: width/37.5,
  },
  button: {
    width: width/1.875,
    marginTop:width/37.5,
    marginBottom: width/37.5,
    paddingTop:width/25,
    paddingBottom:width/25,
    borderRadius:width/37.5,
    borderWidth: 1,
    borderColor: '#35b0d2',
    backgroundColor: '#35b0d2',
  },
  btntext:{
    textAlign: 'center',
    color: 'rgb(32,53,70)',
    color: 'white',
    fontSize: width/20.833,
  },
  disabled: {
    flex:1,
    opacity: 0.3,
  },
  enabled: {
    flex:1,
    opacity: 1,
  },
  pageTitle: {
    color: '#fff',
    fontSize: width/15,
    marginBottom: width/18.75,
    textAlign: 'center',
  },
});
