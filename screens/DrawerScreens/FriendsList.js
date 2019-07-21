import React from "react";
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard
} from "react-native";
import { Header, Left, Right, Icon, List } from "native-base";
import { ListItem } from 'react-native-elements';
const { width, height } = Dimensions.get("window");
import * as firebase from "firebase";
import AwesomeAlert from 'react-native-awesome-alerts';
import SearchableDropdown from "react-native-searchable-dropdown";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ButtonComponent from '../../components/ButtonComponent'


let currentFriends = []
let possibleFriends = []
let tempArray = []
let userFirstName=''
let userLastName=''
let userUsername=''
let userProfilePic=''

export default class FriendsList extends React.Component {
  constructor(props) {
    super(props);

    possibleFriends = []
    currentFriends = []
    tempArray = []
  }


  //function to add friend to current friends
  addFriend = item => {
    index = eval(JSON.stringify(item.id))
    item.name = ""

    var uid = firebase.auth().currentUser.uid;
    //add new friend to current user's friendlist
    firebase
      .database()
      .ref("friendslist/" + uid + "/currentFriends/" + possibleFriends[index].key)
      .set({
              firstName: possibleFriends[index].firstName,
              lastName: possibleFriends[index].lastName,
              username: possibleFriends[index].username,
              profilePic: possibleFriends[index].profilePic
      });

    //add current user to new friend's friendlist
    firebase
      .database()
      .ref("friendslist/" + possibleFriends[index].key + "/currentFriends/" + uid)
      .set({
              firstName: userFirstName,
              lastName: userLastName,
              username: userUsername,
              profilePic: userProfilePic
      });

    // And put friend in currentFriends
    currentFriends.push(possibleFriends[index]);

    // Pull friend out of possibleFriends
    possibleFriends.splice(index, 1);
    tempArray.splice(index, 1);
    this.forceUpdate();
  };

  //function to remove friend from current friends
  removeFriend = index => {
    console.log(currentFriends)
    // And put friend in possibleFriends
    possibleFriends.push(currentFriends[index]);

    var uid = firebase.auth().currentUser.uid;
    //clear out removed friend from  current user's friendslist
    firebase
      .database()
      .ref("friendslist/" + uid + "/currentFriends/" + currentFriends[index].key)
      .remove();

    //clear out current user friend from removed friend's friendslist
    firebase
      .database()
      .ref("friendslist/" + currentFriends[index].key + "/currentFriends/" + uid)
      .remove();

    // Pull friend out of currentFriends
    currentFriends.splice(index, 1);
    this.forceUpdate();

  };

  //function that is called everytime page mounts
  componentDidMount() {
    // get current user's uid
    var uid = firebase.auth().currentUser.uid;

    // gets user data
    firebase.database().ref('users/'+uid).once("value", snapshot => {
      userFirstName = snapshot.val().firstName;
      userLastName = snapshot.val().lastName;
      userUsername = snapshot.val().username;
      userProfilePic = snapshot.val().profilePic;

    });

    // load their current friends
    firebase
      .database()
      .ref("friendslist/" + uid)
      .child("currentFriends")
      .once("value")
      .then((snapshot) => {

        // for each friend
        snapshot.forEach((childSnapShot) => {
          //save their first name, last name, user id, and username
          currentFriends.push({
                              key: childSnapShot.key,
                              firstName: childSnapShot.val().firstName,
                              lastName: childSnapShot.val().lastName,
                              username: childSnapShot.val().username,
                              profilePic: childSnapShot.val().profilePic,
                            })
                            console.log('curr: ', childSnapShot)
        });

      })

      //load possible friends
      firebase
        .database()
        .ref()
        .child("users")
        .once("value")
        .then ((snapshot) => {

          // for each user
          snapshot.forEach((childSnapShot) => {
            //save their first name, last name, user id, and username
            possibleFriends.push({
                                key: childSnapShot.key,
                                firstName: childSnapShot.val().firstName,
                                lastName: childSnapShot.val().lastName,
                                username: childSnapShot.val().username,
                                profilePic: childSnapShot.val().profilePic,
                              })

          });

            //remove the current user from the list
            possibleFriends.splice(possibleFriends.map((el) => el.key).indexOf(uid), 1);

            //remove current friends from possible friends
            if(currentFriends.length > 0){
              var y;
              for( y in currentFriends){
                possibleFriends.splice(possibleFriends.map((el) => el.key).indexOf(currentFriends[y].key), 1);
              }
            }
            this.forceUpdate();
        })
  }

  render() {
    var x;
    for (x in possibleFriends) {
      var name = possibleFriends[x].firstName + " " + possibleFriends[x].lastName
      tempArray[x] = { id: x, name: name };
    }


    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../assets/friends.jpeg")}
          style={styles.imageContainer}
        >
          <View style={styles.overlay} />
          <Header style={{borderBottomWidth:0,backgroundColor:'transparent', zIndex:100, top: 0, left:0, right:0}}>
            <Left>
              <Icon name="bars" type="FontAwesome" style={{color:'white' }} onPress={()=>this.props.navigation.openDrawer()}/>
            </Left>
          </Header>
          <View style={styles.infoContainer}>

          <SearchableDropdown
            onItemSelect={item => this.addFriend(item)}
            containerStyle={{  width: width-(width/9.375), alignContent: 'center'}}
            textInputStyle={{
              fontSize: width/25,
              color:'#fff',
              textAlign: 'center',
              padding: width/75,
              borderWidth: 1,
              borderColor: "#35b0d2",
              borderRadius: width/18.75,
              height: width/9.375,
              backgroundColor: '#35b0d2',
            }}
            itemStyle={{
              height: width/10.714,
              padding: width/53.57,
              marginTop: width/187.5,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderColor: "#35b0d2",
              borderWidth: 1,
              borderRadius: width/75
            }}
            itemTextStyle={{ color: "white", textAlign: 'center', fontSize: width/25, }}
            itemsContainerStyle={{ maxHeight: width/2.5 }}
            items={tempArray}
            defaultIndex={2}
            placeholder="Search for friends!"
            placeholderTextColor="rgba(255,255,255,0.8)"
            resetValue={false}
            underlineColorAndroid="transparent"
          />

            <Text style={styles.title}> My Friends</Text>
            <KeyboardAwareScrollView contentContainerStyle = {{width: width,height: height/2}}>
              <View style={styles.container}>

                {currentFriends.map((friend, index) => (
                  <ListItem
                    containerStyle={styles.listContainer}
                    key={index}
                    leftAvatar= {{
                                  size: width/7.5,
                                  source: {uri: friend.profilePic ? friend.profilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                                  rounded: true
                                }}
                    title={friend.firstName + ' ' + friend.lastName}
                    titleStyle = {styles.titleText}
                    subtitle = {'@' + friend.username}
                    subtitleStyle= {styles.subtitleText}
                    rightElement = {
                                      <View style={styles.removeBtn}>
                                        <TouchableOpacity
                                          onPress={() => this.removeFriend(index)}
                                        >
                                          <Text style={styles.btnText}>Remove</Text>
                                        </TouchableOpacity>
                                      </View>
                                    }
                    bottomDivider = {true}
                    topDivider = {true}
                  />
                ))}
              </View>
            </KeyboardAwareScrollView>

          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  imageContainer: {
    resizeMode: "cover",
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(69,85,117,0.7)"
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: width,
    backgroundColor: 'transparent'
  },
  infoContainer: {
    flex: 1,
    width: width,
    paddingBottom: 0,
    paddingTop: width/9.375,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: width/9.375,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    marginBottom: width/18.75,
    paddingHorizontal: width/75
  },
  removeBtn: {
    right: width/37.5,
    height: width/25
  },
  titleText: {
    color: 'white',
    fontSize: width/18.75,
    fontWeight : 'bold'
  },
  subtitleText: {
    color: 'rgba(225,225,225,0.8)',
    fontSize: width/23.4
  },
  btnText: {
    color: 'white',
    fontSize: width/28.8
  },
  title:{
    fontWeight: 'bold',
    color: '#fff',
    fontSize: width/15,
    textAlign:'center',
    marginTop: width/18.75,
    marginBottom: width/18.75
  }
});
