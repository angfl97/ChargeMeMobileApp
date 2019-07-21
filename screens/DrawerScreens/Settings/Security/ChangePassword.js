import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as firebase from 'firebase';
import AwesomeAlert from 'react-native-awesome-alerts'
import ButtonComponent from '../../../../components/ButtonComponent'
import TextInputComponent from '../../../../components/TextInputComponent'

const{width} = Dimensions.get('window')
let confirmMessage = '';
let newMessage = '';
let currentMessage = '';
let confirmEmpty = false;
let newEmpty = false;
let currentEmpty = false;
let showAlert = false;

export default class ChangePassword extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      disable : true};
  }

  componentDidMount(){
    confirmMessage = '';
    newMessage = '';
    currentMessage = '';
    confirmEmpty = false;
    newEmpty = false;
    currentEmpty = false;
    this.hideAlert()

  }

  hideAlert = () => {
    showAlert = false;
    this.forceUpdate();
  };

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

  //on every keystroke in the newPassword, call this function
  checkNewPassword(text){
    this.setState({disable: false});
    if(text == ''){
      newEmpty = true;
    }
    else{
      newEmpty = false;
    }
    //if new password matches current password
    if(text == this.state.currentPassword){
      //set error message for new password
      newMessage = "Must be a new password";
    }
    //if new password does not match current password
    if(text != this.state.currentPassword){
      //clear error message for new password
      newMessage = '';
    }
    //if new password is too short
    if(text.length < 6){
      //set error message for new password
      newMessage = 'New password must be at least 6 characters long';
    }

    //reflect changes in confirm password
    if(this.state.confirmPassword != '' && this.state.confirmPassword != text){
      confirmMessage = 'Must match new password';
    }
    if(this.state.confirmPassword == text){
      confirmMessage = '';
    }
    //upadte new password state
    this.setState({newPassword: text });
  }

  //on every keystroke in the confirm new password field, call this function
  checkConfirmPassword(text){
    if(text == ''){
      confirmEmpty = true;
    }
    else{
      confirmEmpty = false;
    }
    this.setState({disable: false});
    //if confirm password does not match new password
    if(text != this.state.newPassword){
      //set error message for confirm password
      confirmMessage = "Must match new password";
    }
    //if confirm password matches new password
    if(text == this.state.newPassword){
      //clear error message for confirm password
      confirmMessage = '';
    }
    //update confirm password state
    this.setState({confirmPassword: text });
  }

  //on every keystroke in the current password field, call this function
  checkCurrentPassword(text){
    this.setState({disable: false});
    if(text == ''){
      currentEmpty = true;
    }
    else{
      currentEmpty = false;
    }
    //if current password field is not empty
    if(text != ''){
      //clear error message for current password
      currentMessage = '';
    }
    //reflect changes in new password
    if(this.state.newPassword != '' && this.state.newPassword == text){
      newMessage = 'Must be a new password';
    }
    if(this.state.newPassword != '' && this.state.newPassword != text && this.state.newPassword.length < 6){
      newMessage = 'New password must be at least 6 characters long';
    }
    if(this.state.newPassword != text && this.state.newPassword.length >= 6){
      newMessage = '';
    }
    //update current password state
    this.setState({currentPassword: text});
  }

  //when user presses button to update password, call this function
  onChangePasswordPress(){
    //check that current password field has been filled
    if(this.state.currentPassword == ''){
      currentMessage = 'Please enter your current password';
    }
    //check that new password field has been filled
    if(this.state.newPassword == ''){
      newMessage = 'Please enter your new password';
    }
    //check that confirm password field has been filled
    if(this.state.confirmPassword == ''){
      confirmMessage = 'Please retype your new password';
    }

    //force re-render
    this.forceUpdate();

    //make sure there are no errors before continuing
    if( currentMessage == '' && newMessage == '' && confirmMessage == '' ){

      //get the current user
      var user = firebase.auth().currentUser;

      //get the user's email
      email = user.email;

      //get credentials token for the current user
      const credentials = firebase.auth.EmailAuthProvider.credential(
        email,
        this.state.currentPassword
      );

      //reauthenticate user
      user.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(() => {
          //if user successfully reauthenticated, update password
          user.updatePassword(this.state.newPassword)
          .then(() => {

              //show confirmation alert
              showAlert = true;
              this.forceUpdate()

              //delay one second to allow user to see confirmation alert before sending back to login page
              var delayInMilliseconds = 1000; //1 second
              setTimeout(() => {this.props.navigation.navigate('Auth');}, delayInMilliseconds);
          })
          .catch((error) => {console.log(error); });
      })
      .catch(() => {
        //if reauthentication fails, it must be because they entered the wrong password
        currentMessage = "Incorrect password";
        //force re-render
        this.forceUpdate();
      })
    }

  }


  render() {
    const isDisabled  = this.state.disable;
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../../assets/blue.jpg')} style={styles.imageContainer}>

        <KeyboardAwareScrollView contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between'
        }}>

        <View style={styles.overlay} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose a new secure password</Text>
            <Text> </Text>
            <Text style={styles.title}>Changing your password will log you out of the app. You will need to log back in with your new password.</Text>
          </View>
          <View style={styles.infoContainer}>

            <Text style={styles.inputTitle}>Current Password</Text>
            <TextInputComponent
              empty={currentEmpty}
              error={currentMessage}
              style={styles.input}
              placeholder="********"
              placeholderTextColor="rgba(1,1,1,0.6)"
              onChangeText={(text) => this.checkCurrentPassword(text)}
              returnKeyType='next'
              inputRef = {(input) => {this.current = input}}
              autoCorrect={false}
              secureTextEntry={true}
              onSubmitEditing={()=> this.new.focus()}
            />
            <Text style = {styles.errorMessage}>{currentMessage}</Text>

            <Text style={styles.inputTitle}>New Password</Text>
            <TextInputComponent
              empty={newEmpty}
              error={newMessage}
              style={styles.input}
              placeholder="********"
              placeholderTextColor="rgba(1,1,1,0.6)"
              onChangeText={(text) => this.checkNewPassword(text)}
              returnKeyType='next'
              inputRef= {(input) => {this.new = input}}
              autoCorrect={false}
              secureTextEntry={true}
              onSubmitEditing={()=> this.confirm.focus()}
            />
            <Text style = {styles.errorMessage}>{newMessage}</Text>

            <Text style={styles.inputTitle}>Confirm New Password</Text>
            <TextInputComponent
              empty={confirmEmpty}
              error={confirmMessage}
              style={styles.input}
              placeholder="********"
              placeholderTextColor="rgba(1,1,1,0.6)"
              onChangeText={(text) =>this.checkConfirmPassword(text)}
              returnKeyType='go'
              inputRef = {(input) => {this.confirm = input}}
              autoCorrect={false}
              secureTextEntry={true}
            />
            <Text style = {styles.errorMessage}>{confirmMessage}</Text>

            <ButtonComponent
              text='UPDATE'
              onPress={this.onChangePasswordPress.bind(this)}
              disabled={isDisabled}
              primary={true}
            />

            </View>

            </KeyboardAwareScrollView>
            <AwesomeAlert
                show={showAlert}
                customView={this.renderCustomAlertView()}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
              />
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
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  titleContainer:{
    justifyContent: 'center',
    padding: width/18.75,
    flex: 1,
    width: width,
  },
  infoContainer: {
    flex: 3,
    width: width,
    padding:width/18.75,
  },
  title:{
    fontWeight: 'bold',
    color: '#fff',
    fontSize: width/18.75,
    textAlign:'left',
  },
  input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,1)',
    color:'rgba(1,1,1,0.6)',
    marginBottom: width/75,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
  },
  inputTitle: {
    color: 'white',
    fontSize: width/18.75,
    fontWeight: 'bold',
    marginBottom: width/75,
    marginTop: width/37.5,
  },
});
