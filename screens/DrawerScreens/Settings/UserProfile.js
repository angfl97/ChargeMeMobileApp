import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  TextInput,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  ScrollView
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {TextInputMask} from 'react-native-masked-text';
import AwesomeAlert from 'react-native-awesome-alerts';
import ButtonComponent from '../../../components/ButtonComponent'
import TextInputComponent from '../../../components/TextInputComponent'
import * as firebase from 'firebase';

const{width} = Dimensions.get('window')
let usernameEmpty = false;
let firstNameEmpty = false;
let lastNameEmpty = false;
let phoneEmpty = false;
let showAlert = false;
let usernameMessage = '';
let firstnameMessage = '';
let lastnameMessage = '';
let phoneMessage = '';

export default class UserProfile extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        OGusername: '',
        birthday: '',
        profilePic: '',
        uid: '',
        disable: true,
      };
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

  //function that executes when page loads
  componentDidMount(){
    //clear out all error messages
    usernameMessage = '';
    firstnameMessage = '';
    lastnameMessage = '';
    phoneMessage = '';
    usernameEmpty = false;
    firstNameEmpty = false;
    lastNameEmpty = false;
    phoneEmpty = false;

    //disable buttons
    this.setState({disable: true});

    //get the current user
    var user = firebase.auth().currentUser;
    //get current user uid
    var uid = user.uid;

    //if there is a user logged in
    if (user != null) {
      //grab user's info
      this.setState({
        email : user.email,
        uid: uid
      })
    }

    firebase.database().ref('users/'+uid).once("value", snapshot => {
      //query firebase for other user attributes
       this.setState({
         firstname : snapshot.val().firstName,
         lastname : snapshot.val().lastName,
         phone : snapshot.val().phone,
         username : snapshot.val().username,
         OGusername: snapshot.val().username,
         birthday : snapshot.val().birthday,
         email : snapshot.val().email,
         profilePic: snapshot.val().profilePic
       })
    });
  }

  handleUsername= (value) => {
    this.setState({disable: false});
    usernameMessage = ''
    if(value == ''){
      usernameEmpty = true;
    }
    else{
      usernameEmpty = false;
    }
    //clear out any existing errors
    //usernameMessage = '';
    //enable buttons
    //this.setState({disable: false});
    //update username
    this.setState({username: value});
  }

  handleFirstName= (value) => {
    if(value == ''){
      firstNameEmpty = true;
    }
    else{
      firstNameEmpty = false;
    }
    //clear out any existing errors
    firstnameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update first name
    this.setState({firstname: value});
  }

  handleLastName = (value) => {
    if(value == ''){
      lastNameEmpty = true;
    }
    else{
      lastNameEmpty = false;
    }
    //clear out any existing errors
    lastnameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update last name
    this.setState({lastname: value});
  }

  handlePhone = () =>{
    //get raw value of phone field
    value = this.phoneNum.getRawValue();

    if(value == ''){
      phoneEmpty = true;
    }
    else{
      phoneEmpty = false;
    }
    //clear out any existing errors
    phoneMessage = '';

    //make sure phone number is correct length
    if(value.length < 11){
      phoneMessage = 'Invalid phone number'
    }
    //enable buttons
    this.setState({disable: false});
    //update phone
    this.setState({phone: value});
  }

  _onUsernameSubmitted = () => {
    const el = this.phoneNum.getElement()
    el.focus()
  }

  onUpdatePress = () =>{

    //check that all fields have been filled out
    if(this.state.username == ''){
      usernameMessage = 'Please enter a username';
      //new
      //usernameEmpty = true;
    }
    if(this.state.firstname == ''){
      firstnameMessage = 'Please enter a first name';
    }
    if(this.state.lastname == ''){
      lastnameMessage = 'Please enter a last name';
    }
    if(this.state.phone == ''){
      phoneMessage = 'Please enter a phone';
    }

    //force refresh
    this.forceUpdate();

    //check that there are no errors
    if(usernameEmpty == false && usernameMessage == '' && firstnameMessage == '' && lastnameMessage == '' && phoneMessage == ''){

      //new
      this.makeUsernameUnique()
      //showAlert = true;
    }
  }

  //function to update user
  updateUser = () =>{
    //get user id
      var uid = firebase.auth().currentUser.uid;

      //format phone
       let unMask = this.phoneNum.getRawValue();


      //write user info
      firebase.database().ref('users/' + uid).set({
        username: this.state.username,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        phone: unMask,
        birthday: this.state.birthday,
        email: this.state.email,
      });

      //show confirmation alert
      showAlert = true;

      //delay one second to allow user to see confirmation alert before dismissing it
      var delayInMilliseconds = 1000; //1 second
      setTimeout(() => {this.hideAlert();}, delayInMilliseconds);

      //disable the buttons again
      this.setState({disable: true});
    }

  //function to check if entered username already exists
  makeUsernameUnique = () =>{
    //save the username entered
    var currentUsername = this.state.username;

    //save the root reference to the database
    var ref = firebase.database().ref();

    //find all users that have the current username
    ref.child('users').orderByChild('username').equalTo(currentUsername).once('value', snapshot => {
      let result = snapshot;
      console.log('new(?) username: ', this.state.username)
      console.log('og username: ', this.state.OGusername)

      //if the username does not exist in the database or it has been unchanged
      if(!result || this.state.username == this.state.OGusername){
        //clear username error
        usernameMessage = '';
        //call create user function
        this.updateUser();
      }
      //if username is already taken
      else{
        //set username error message
        usernameMessage= 'Username is taken';
        this.forceUpdate();
      }
    });
  }
  navigate=()=>{
    console.log('edit pressed')
    this.props.navigation.navigate('Gallery')
  }

  render() {
    //const showAlert  = this.state.showAlert;
    const username = this.state.username;
    const isDisabled  = this.state.disable;
    const profilePic  = this.state.profilePic
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />
          <KeyboardAwareScrollView>

          <View style = {styles.infoContainer}>
          <Avatar
            size = {width/3}
            source={{uri: profilePic ? profilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'}}
            showEditButton={true}
            editButton={{size:width/12}}
            onEditPress={this.navigate.bind(this)}
            rounded = {true}
            containerStyle={{marginBottom:width/37.5, marginTop:width/37.5, marginLeft: width/3.4}}
          />

            <View style={styles.nameContainer}>
              <View style={styles.nameInputContainer}>
                <Text style={styles.inputTitle}>First Name</Text>
                <TextInputComponent
                  empty={firstNameEmpty}
                  error={firstnameMessage}
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="rgba(1,1,1,0.6)"
                  defaultValue = {this.state.firstname}
                  returnKeyType='next'
                  onChangeText={(firstname) => this.handleFirstName(firstname)}
                  onSubmitEditing={()=> this.lastName.focus()}
                />
              </View>

                <View style={styles.nameInputContainer}>
                <Text style={styles.inputTitle}>Last Name</Text>
                <TextInputComponent
                  empty={lastNameEmpty}
                  error={lastnameMessage}
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(1,1,1,0.6)"
                  defaultValue = {this.state.lastname}
                  inputRef = {(input) => {this.lastName = input}}
                  returnKeyType='next'
                  onChangeText={(lastname) => this.handleLastName(lastname)}
                  onSubmitEditing={()=> this.username.focus()}
                />
              </View>
            </View>

            <Text style={styles.inputTitle}>Username</Text>
            <TextInputComponent
              empty= {usernameEmpty}
              error= {usernameMessage}
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(1,1,1,0.6)"
              defaultValue = {username}
              inputRef = {(input) => {this.username = input}}
              autoCapitalize = 'none'
              returnKeyType='next'
              onChangeText={(username) => this.handleUsername(username)}
              onSubmitEditing={() => { this._onUsernameSubmitted() }}
            />
            <Text style = {styles.errorMessage}>{usernameMessage}</Text>



            <Text style={styles.inputTitle}>Phone</Text>
            <TextInputMask
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
              onChangeText= {() => this.handlePhone()}
              style={[styles.input,{
                borderColor: phoneEmpty == true || phoneMessage != ''
                  ? 'red'
                  : '#35b0d2',
              }]}
              placeholder="Phone"
              placeholderTextColor="rgba(1,1,1,0.6)"
              keyboardType='numeric'
              returnKeyType='next'
            />
            <Text style = {styles.errorMessage}>{phoneMessage}</Text>

          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWidth}>
              <ButtonComponent
                text='UPDATE'
                onPress={this.onUpdatePress.bind(this)}
                disabled={isDisabled}
                primary={true}
              />
            </View>

            <View style={styles.buttonWidth}>
              <ButtonComponent
                text='CANCEL'
                onPress={this.componentDidMount.bind(this)}
                disabled={isDisabled}
                primary={false}
              />
            </View>
          </View>
          <AwesomeAlert
              show={showAlert}
              customView={this.renderCustomAlertView()}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
            />
          </KeyboardAwareScrollView>
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
    imageContainer: {
        resizeMode:'cover',
        flex:1,
    },
    titleContainer:{
      justifyContent: 'flex-end',
      padding: width/18.75,
      flex: 1,
      width: width,
    },
    buttonContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttonWidth: {
      width: width/2.4,
    },
    infoContainer: {
      flex: 1,
      width: width,
      padding:width/18.75,
      justifyContent: 'center',
      alignContent: 'center'
    },
    nameContainer:{
      height: width/4.167,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    errorMessage:{
      color: 'red',
    },
    header:{
      position:'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(69,85,117,0.7)',
    },
    logo: {
      flex: 1,
      resizeMode: 'contain',
    },
    input: {
      height:width/9.375,
      backgroundColor: 'rgba(255,255,255,1)',
      color:'rgba(1,1,1,0.8)',
      marginBottom: width/75,
      paddingHorizontal:width/37.5,
      borderWidth: 2,
      borderRadius: width/18.75,
    },
    nameInputContainer: {
      height:width/5.36,
      width: width/2.3,
    },
    title:{
      fontWeight: 'bold',
      color: '#fff',
      fontSize: width/15,
      textAlign:'center',
    },
    inputTitle: {
      color: "white",
      fontSize: width/18.75,
      fontWeight: 'bold',
      marginBottom: width/75,
    },
});
