import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  FlatList,
  Button,
} from "react-native";
import { Header, Left, Icon } from "native-base";
import * as firebase from "firebase";

import ButtonComponent from "../../components/ButtonComponent";
import { List, ListItem, ButtonGroup } from "react-native-elements";

const { width, height } = Dimensions.get("window");

export default class PastTransactions extends React.Component {
  static navigationOptions = {
    drawerIcon: tintColor => (
      <Icon
        name="clock-o"
        type="FontAwesome"
        style={{ fontSize: 24, color: tintColor }}
      />
    )
  };
  constructor() {
    super();
    this.state = {
      selectedIndex: 2
    };
    transactionData= [],
    this.updateIndex = this.updateIndex.bind(this);
  }
//updates the three option menu at the top
updateIndex(selectedIndex) {
  this.setState({ selectedIndex });
}

getUserName = (userUID) =>{
  var name;

  firebase
        .database()
        .ref()
        .child("users")
        .once("value")
        .then ((snapshot) => {
          // for each user
          snapshot.forEach((childSnapShot) => {
            // console.log("comparing...",childSnapShot.key);
            // console.log("and...",userUID);
            if(childSnapShot.key==userUID){

              console.log("found name!!",childSnapShot.val().firstName);
              name= childSnapShot.val().firstName;

            }
          // console.log(name);
           return (name);
          });
});
}

//function that is called everytime page mounts
componentDidMount(){
  var uid = firebase.auth().currentUser.uid;
  firebase
  .database()
  .ref()
  .child("pastTransactions/" + uid)
  .once("value")
  .then((snapshot) => {

    // for each friend
    snapshot.forEach((childSnapShot) => {
      //save their transaction information
      transactionData.push({
                          key: childSnapShot.key,
                          amount: childSnapShot.val().amount,
                          charging: childSnapShot.val().charging,
                          date: childSnapShot.val().date,
                          name: childSnapShot.val().name,
                          paying: childSnapShot.val().paying,

                        })

    });
    this.forceUpdate();

  })

}

keyExtractor = (item,index) =>index.toString()
renderItem = ({item})=> (
  <ListItem
  containerStyle= {styles.blueButton}

  title={item.name}
  titleStyle={{color:'white', fontWeight:'bold'}}
  subtitle={item.date }
  subtitleStyle={{color:'white'}}
  rightElement={item.amount}
  rightTitle={() =>this.getUserName(item.charging)}
  rightTitleStyle={{color:'white'}}
  chevronColor="white"
  chevron

  />
)

  render() {
    // var shit = firebase.auth().currentUser.uid;
    // console.log("shit", shit);
    // // console.log(transactionData);
    // console.log("TESTING THIS METHOD:",this.getUserName(shit));
    const buttons = ["All", "Paid", "Received"];
    const { selectedIndex } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../assets/group-dinner.jpg")}
          style={styles.imageContainer}
        >
          <View style={styles.overlay} />
          <View style={styles.mainContainer}>
              <Text style={{color:'white', fontWeight:'bold'}}> Past transactions</Text>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{ height: 30 }}
              />
                 <View style={styles.infoContainer}>

            <FlatList style={{flex:1}}
              keyExtractor={this.keyExtractor}
              data={transactionData}
              renderItem={this.renderItem}
            />
            </View>
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
  mainContainer:{
    flex: 1 ,
    alignItems: "center",
    justifyContent:"center",
    position:"relative",
    width:width,
    height: height,
    marginTop:50,

  },
  imageContainer: {
    resizeMode: "cover",
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(69,85,117,0.7)"
  },
  infoContainer: {
    flex: 2,
    padding: 20,
    justifyContent: "flex-end",
    width:width,
    marginTop:20,


  },
  blueButton: {
  	padding:15,
  	backgroundColor: '#202646',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#35b0d2',
    backgroundColor: '#35b0d2',
    marginTop:10,
    marginBottom: 10,
  },
});
