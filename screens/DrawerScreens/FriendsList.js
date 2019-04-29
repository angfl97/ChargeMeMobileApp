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
import { Header, Left, Right, Icon, ListItem, List } from "native-base";
const { width, height } = Dimensions.get("window");
import * as firebase from "firebase";
import AwesomeAlert from 'react-native-awesome-alerts';
import SearchableDropdown from "react-native-searchable-dropdown";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ButtonComponent from '../../components/ButtonComponent'


let currentFriends = []
let possibleFriends = []
let tempArray = []

export default class FriendsList extends React.Component {
  constructor(props) {
    super(props);

    possibleFriends = []
    currentFriends = []
    tempArray = []
  }

//function called to save changes when use navigates away from screen
  componentWillUnmount() {
    var uid = firebase.auth().currentUser.uid;

    //clear out user's current friends
    firebase
      .database()
      .ref("friendslist/" + uid + "/currentFriends")
      .set(" ");

    //write in each current friend
    for (let i = 0; i < currentFriends.length; i++){
      firebase
        .database()
        .ref("friendslist/" + uid + "/currentFriends/"+ currentFriends[i].key)
        .set({
                firstName: currentFriends[i].firstName,
                lastName: currentFriends[i].lastName,
                username: currentFriends[i].username
              });
    }
  }

  //function to add friend to current friends
  addFriend = item => {
    index = eval(JSON.stringify(item.id))
    item.name = ""
    // And put friend in currentFriends
    currentFriends.push(possibleFriends[index]);

    // Pull friend out of possibleFriends
    possibleFriends.splice(index, 1);
    tempArray.splice(index, 1);
    this.forceUpdate();
  };

  //function to remove friend from current friends
  removeFriend = index => {
    // And put friend in possibleFriends
    possibleFriends.push(currentFriends[index]);

    // Pull friend out of currentFriends
    currentFriends.splice(index, 1);
    this.forceUpdate();

  };

  //function that is called everytime page mounts
  componentDidMount() {
    // get current user's uid
    var uid = firebase.auth().currentUser.uid;

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
                            })

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

            <Text style={styles.title}> My Friends</Text>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' extraScrollHeight={150} contentContainerStyle = {{height: height/3}}>
              <View style={styles.container}>



                {currentFriends.map((friend, index) => (
                  <ListItem style={styles.listContainer}>
                    <Left>
                      <Text style={[styles.btntext,{fontWeight: 'bold'}]} key={friend.username}>
                        {" "}
                        {`${friend.firstName + ' ' + friend.lastName}`}{" "}
                      </Text>
                    </Left>
                    <Right>
                      <View style={styles.removeBtn}>
                        <TouchableOpacity
                          style={styles.btntext}
                          onPress={() => this.removeFriend(index)}
                          key={friend.username}
                        >
                          <Text style={styles.btntext}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </Right>
                  </ListItem>
                ))}
              </View>
            </KeyboardAwareScrollView>

            <SearchableDropdown
              onItemSelect={item => this.addFriend(item)}
              containerStyle={{ height: 400, width: width-40, alignContent: 'center'}}
              textInputStyle={{
                fontSize: 15,
                color:'#fff',
                textAlign: 'center',
                padding: 5,
                borderWidth: 1,
                borderColor: "#35b0d2",
                borderRadius: 20,
                height: 40,
                backgroundColor: '#35b0d2',
              }}
              itemStyle={{
                height: 35,
                padding: 7,
                marginTop: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: "#35b0d2",
                borderWidth: 1,
                borderRadius: 5
              }}
              itemTextStyle={{ color: "white", textAlign: 'center', fontSize: 15, }}
              itemsContainerStyle={{ maxHeight: 150 }}
              items={tempArray}
              defaultIndex={2}
              placeholder="Search for friends!"
              placeholderTextColor="rgba(255,255,255,0.8)"
              resetValue={false}
              underlineColorAndroid="transparent"
            />


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
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: width-40
  },
  infoContainer: {
    flex: 1,
    width: width,
    padding:20,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    width: width/2,
    flex: 1,
    marginTop: 5,
  },
  input: {
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    marginBottom: 20,
    paddingHorizontal: 5
  },
  removeBtn: {
    right: 10,
    height: 15
  },
  btntext: {
    color: 'white',
  },
  title:{
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 25,
    textAlign:'center',
    marginTop: 20,
    marginBottom: 20
  }
});
