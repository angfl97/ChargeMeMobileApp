import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';
import firebase from 'firebase'
import RNFetchBlob from 'rn-fetch-blob'
import CameraRollPicker from 'react-native-camera-roll-picker'
import AwesomeAlert from 'react-native-awesome-alerts';

const { width, height } = Dimensions.get("window");

let fName = ''
let lName = ''
let user = ''
let email = ''
let phone = ''
let birthday = ''
let showAlert = false

export default class Gallery extends React.Component {
  constructor(props){
    super(props);
    fName = ''
    lName = ''
    user = ''
    email = ''
    phone = ''
    birthday = ''
    showAlert = false
  }

  getSelectedImages = (selectedImages, currentImage) => {

    console.log('fetching')
    var uid = firebase.auth().currentUser.uid;

    const image = currentImage.uri

    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob


    let uploadBlob = null
    const imageRef = firebase.storage().ref(uid ).child('/profilePic')
    let mime = 'image/jpg'
    fs.readFile(image, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
    })
    .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        showAlert = true
        this.forceUpdate()
        //write user info
        firebase.database().ref('users/' + uid).set({
          username: user,
          firstName: fName,
          lastName: lName,
          email: email,
          phone: phone,
          birthday: birthday,
          profilePic: url,
        })
        .then(
          this.props.navigation.navigate('Dashboard')
        );
        // URL of the image uploaded on Firebase storage
        console.log(url);

      })
      .catch((error) => {
        console.log(error);

      })
  }

  componentDidMount(){

    var uid = firebase.auth().currentUser.uid;

    // gets user data
    firebase.database().ref('users/'+uid).once("value", snapshot => {
      fName = snapshot.val().firstName;
      lName = snapshot.val().lastName;
      user = snapshot.val().username;
      email = snapshot.val().email;
      phone = snapshot.val().phone;
      birthday = snapshot.val().birthday;
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={{marginTop: width/3.75}}>
          <Text style={styles.gallery}>
            Image Gallery
          </Text>
          <CameraRollPicker
            selected={[]}
            maximum={1}
            callback={this.getSelectedImages}
            groupTypes={'All'}
            />

        </View>
        <AwesomeAlert
            show={showAlert}
            showProgress={true}
            title="Uploading... "
            titleStyle={{textAlign: 'center'}}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={false}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  gallery: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
