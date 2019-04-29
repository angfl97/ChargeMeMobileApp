import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {
  Header,
  Left,
  Icon
} from 'native-base'
import { Constants } from 'expo';
import * as firebase from 'firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Avatar, ListItem } from 'react-native-elements';
import DashboardStatComponent from '../../components/DashboardStatComponent'



const {width} = Dimensions.get('window')
console.log("width: ", width)


let activity=''

export default class Dashboard extends React.Component {
  static navigationOptions = {header: null}
  constructor(props) {
    super(props)
    this.state = {
      firstName:'',
      lastName:'',
      username:''
    }
    currentTransactions=[]
    pastTransactions=[]
    tempArray=[]
    currFriends=[]
    currTransCount = 0

  }

    componentDidMount() {
      var uid = firebase.auth().currentUser.uid;

      // gets Current Transactions
      firebase
      .database()
      .ref("currentTransactions/" + uid)
      .orderByKey()
      .limitToLast(3)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapShot) => {
          currentTransactions.push({
                              key: childSnapShot.key,
                              amount: childSnapShot.val().amount,
                              charging: childSnapShot.val().charging,
                              date: childSnapShot.val().date,
                              name: childSnapShot.val().name,
                              paying: childSnapShot.val().paying,
                            })
        });

        //get current transaction count
        firebase
        .database()
        .ref("currentTransactions/" + uid)
        .once("value")
        .then((snapshot) => {
          currTransCount = snapshot.numChildren()
          if(currTransCount == 0){

            activity = '... no recent activity :('
            this.forceUpdate();
          }
        })





        // gets all current friends
        firebase
        .database()
        .ref("friendslist/" + uid)
        .child("currentFriends")
        .once("value")
        .then ((snapshot) => {
          // for each user
          snapshot.forEach((childSnapShot) => {

              currFriends.push({
                key: childSnapShot.key,
                first: childSnapShot.val().firstName,
              })
              this.setState(
                {
                  currFriends:currFriends
                }
              )
            });
            });

        this.forceUpdate();
      })

      // gets user data
      firebase.database().ref('users/'+uid).once("value", snapshot => {
        const fName = snapshot.val().firstName;
        const lName = snapshot.val().lastName;
        const user = snapshot.val().username;
        this.setState({
          firstName: fName,
          initials: fName.charAt(0) + lName.charAt(0),
          username: user,
        })

      });
    }



  renderMain(item){
  const {selectedIndex}= this.state;
  var uid = firebase.auth().currentUser.uid;
  var name;
    if(item.paying==uid){
      for(var x in currFriends){
        if(currFriends[x].key==item.charging){
        name=currFriends[x].first;
        }
      };
      return <ListItem
      containerStyle= {styles.blueButton}
      title={item.name}
      titleStyle={{color:'white', fontWeight:'bold'}}
      subtitle={item.date }
      subtitleStyle={{color:'white'}}
      rightElement={<Text style = {{color: 'white'}}> $ {(item.amount).toFixed(2)}</Text>}
      rightTitle={<Text style = {{fontSize: width/24,color:'white'}}>Paying{"\n"}{name}</Text>}
      rightTitleStyle={{ width: width/4.6875}}


      />;  }
    else if(item.charging==uid)
    {
      for(var x in currFriends){
        if(currFriends[x].key==item.paying){
        name=currFriends[x].first;
        }
      };
      return <ListItem
      containerStyle= {styles.redButton}
      title={item.name}
      titleStyle={{color:'white', fontWeight:'bold'}}
      subtitle={item.date }
      subtitleStyle={{color:'white'}}
      rightElement={<Text style = {{color: 'white'}}> $ {(item.amount).toFixed(2)}</Text>}
      rightTitle={<Text style = {{fontSize: width/24,color:'white'}}>Charging{"\n"}{name}</Text>}
      rightTitleStyle={{width: width/4.6875}}

      />
    }
};





  renderItem = ({item})=> (
    this.renderMain(item)
    )
  render() {

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

          <Header style={{borderBottomWidth:0,backgroundColor:'transparent', zIndex:100, top: 0, left:0, right:0}}>
          <Left>
            <Icon name="bars" type="FontAwesome" style={{color:'white' }} onPress={()=>this.props.navigation.openDrawer()}/>
          </Left>
        </Header>
      <View style={styles.container}>



          <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' extraScrollHeight={width/2.885}>

            <View style={styles.userContainer}>
              <Avatar
                size = "xlarge"
                rounded title = {this.state.initials}
                containerStyle={{marginLeft: width/37.5, marginTop:width/37.5}}
              />

              <View style={styles.nameContainer}>
                <Text style={styles.name}>Welcome, {this.state.firstName}</Text>
                <Text style={styles.username}>@{this.state.username}</Text>
              </View>
            </View>


            <View style={styles.userContainer}>


                <DashboardStatComponent
                  onPress={() => this.props.navigation.navigate('FriendsList')}
                  text={"\n" +"Friends:"}
                  secondText={String(currFriends.length)}
                />


                <DashboardStatComponent
                  onPress={() => this.props.navigation.navigate('PastTransactions')}
                  text={"Past" + "\n" + "Transactions:"  }
                  secondText={String(pastTransactions.length)}
                />

                <DashboardStatComponent
                  onPress={() => this.props.navigation.navigate('CurrentTransactions')}
                  text={"Current" + "\n" + "Transactions:" }
                  secondText={String(currTransCount)}
                />


            </View>



            <View style={styles.infoContainer}>
              <Text style={styles.text}>Your Recent Activity:</Text>
              <Text style ={{marginTop: width/25, color:'white', textAlign: 'center', fontSize: width/20.833}}>{activity}</Text>
              <FlatList style={{flex:1}}
                keyExtractor={this.keyExtractor}
                data={currentTransactions}
                renderItem={this.renderItem}
              />
            </View>
            </KeyboardAwareScrollView>
          </View>

      </View>
      </ImageBackground>
    </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
container:{
  flex: 1,
},
nameContainer:{
  flex: 1,
  alignItems: 'center',
  paddingBottom: width/18.75,
},
listItemContainer:{
  backgroundColor: '#fff',
  margin: width/75,
  borderRadius: width/75,
},
listItem:{
  fontSize:width/18.75,
  padding: width/37.5,
},
name:{
  fontSize: width/9.375,
  color: "white",
  textAlign: 'center',
},
username:{
  fontSize: width/18.75,
  color: "white",
  textAlign: 'center',
},
text:{
  fontSize: width/15,
  color: "white",
},
userContainer:{
  flex: 1,
  flexDirection: 'row',
  padding: width/37.5,
  alignItems: 'flex-end',
  justifyContent: 'space-evenly',
},
infoContainer:{
  flex: 2,
  padding: width/18.75,
  justifyContent: "flex-end",
  width:width,
},
button:{
  height: width/3.75,
  width: width/3.75,
  borderRadius: width/7.5,
  backgroundColor: "rgba(255,255,255,0.2)",
  justifyContent: 'center',
  alignItems: 'center',
},
blueButton:{
  padding:width/25,
  backgroundColor: '#202646',
  borderRadius:width/37.5,
  borderWidth: 1,
  borderColor: '#35b0d2',
  backgroundColor: '#35b0d2',
  marginTop:width/37.5,
},
redButton: {
  padding:width/25,
  backgroundColor: '#202646',
  borderRadius:width/37.5,
  borderWidth: 1,
  borderColor: 'coral',
  backgroundColor: 'coral',
  marginTop:width/37.5,
},
overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,85,117,0.7)',
},
imageContainer:{
    resizeMode:'cover',
    flex:1,
},
});
