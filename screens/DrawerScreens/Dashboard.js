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
import CameraRollPicker from 'react-native-camera-roll-picker';



const {width} = Dimensions.get('window')

let activity=''
let balance = 0

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName:'',
      lastName:'',
      username:'',
      userProfilePic:''
    }
    currentTransactions=[]
    pastTransactions=[]
    tempArray=[]
    currFriends=[]
    currTransCount = 0
    activity = ''
    balance = 0

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
                last: childSnapShot.val().lastName,
                username: childSnapShot.val().username,
                profilePic: childSnapShot.val().profilePic,
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
        const profilePic = snapshot.val().profilePic;
        this.setState({
          firstName: fName,
          initials: fName.charAt(0) + lName.charAt(0),
          username: user,
          userProfilePic: profilePic
        })

      });

      //get user's balance
      firebase
      .database()
      .ref("payments/" + uid + '/wallet')
      .once("value")
      .then((snapshot) => {
        balance = snapshot.val().balance
      })
    }


  renderMain(item){
  const {selectedIndex}= this.state;
  var uid = firebase.auth().currentUser.uid;
  var username;
  var profilePic;
    if(item.paying==uid){
      for(var x in currFriends){
        if(currFriends[x].key==item.charging){
        username=currFriends[x].username;
        profilePic=currFriends[x].profilePic
        }
      };
      return (
        <ListItem
          containerStyle= {styles.redButton}
          leftAvatar= {{
                        size: width/7.5,
                        source: {uri: profilePic ? profilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                        rounded: true
                      }}
          title={'Paying' }
          titleStyle={{color:'white', fontWeight:'bold', fontSize: width/26}}
          subtitle={'@' + username}
          subtitleStyle={{color:'white', fontSize: width/27}}
          rightTitle={item.name}
          rightTitleStyle={{color:'white', fontWeight:'bold', fontSize: width/26, width: width/3.6}}
          rightSubtitle={'$' + (item.amount).toFixed(2)}
          rightSubtitleStyle={{color:'white', fontSize: width/27, width: width/3.6}}
        />
      );
    }
    else if(item.charging==uid)
    {
      for(var x in currFriends){
        if(currFriends[x].key==item.paying){
        username=currFriends[x].username;
        profilePic=currFriends[x].profilePic
        }
      }
      return(
        <ListItem
          containerStyle= {styles.blueButton}
          leftAvatar= {{
                        size: width/7.5,
                        source: {uri: profilePic ? profilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                        rounded: true
                      }}
          title={'Charging'}
          titleStyle={{color:'white', fontWeight:'bold', fontSize: width/26}}
          subtitle={'@' + username}
          subtitleStyle={{color:'white', fontSize: width/27}}
          rightTitle={item.name}
          rightTitleStyle={{color:'white', fontWeight:'bold', fontSize: width/26, width: width/3.6}}
          rightSubtitle={'$' + (item.amount).toFixed(2)}
          rightSubtitleStyle={{color:'white', fontSize: width/27, width: width/3.6}}
        />
    );
    }
}

  renderItem = ({item})=> (
    this.renderMain(item)
    )

  navigate=()=>{
    console.log('edit pressed')
    this.props.navigation.navigate('Gallery')
  }

  render() {
    const { userProfilePic } = this.state
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
                size = {width/2.5}
                source={{uri: userProfilePic ? userProfilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'}}
                defaultSource = {require('../../assets/default-profile.png')}
                showEditButton={true}
                editButton={{size:width/11}}
                onEditPress={this.navigate.bind(this)}
                rounded = {true}
                containerStyle={{marginLeft: width/37.5, marginTop:width/37.5}}
              />

              <View style={styles.nameContainer}>
                <Text style={styles.name}>Welcome, {this.state.firstName}</Text>
                <Text style={styles.username}>@{this.state.username}</Text>
              </View>
            </View>



            <View style={styles.statsContainer}>


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

            <View style={styles.line}/>
              <View style = {{margin: width/37.5}}>
                <Text style={{color: 'white', fontSize: width/20.83}}>Balance: ${balance.toFixed(2)}</Text>
              </View>
            <View style={styles.line}/>



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
  statsContainer:{
    flex: 1,
    flexDirection: 'row',
    paddingTop: width/37.5,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    marginBottom: width/25
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
    padding:width/37.5,
    backgroundColor: '#35b0d2',
    marginTop:width/37.5,
    borderRadius:width/37.5,
    borderColor: '#35b0d2',
    borderWidth: 1,
  },
  redButton: {
    padding:width/37.5,
    backgroundColor: 'coral',
    marginTop:width/37.5,
    borderRadius:width/37.5,
    borderColor: 'coral',
    borderWidth: 1,
  },
  overlay:{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  imageContainer:{
      resizeMode:'cover',
      flex:1,
  },
  line:{
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 1,
    width: width
  }
});
