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
import Modal from "react-native-modal";
import MyModal from './MyModal';
const { width, height } = Dimensions.get("window");


class MyItem extends React.Component {
  _onPress = () => {
      this.props.onPressItem(this.props.item);
  };


  _renderMain = () =>{
  let chargingName, payingName, chargingUsername, payingUsername, payingProfilePic, chargingProfilePic;
  this.tempArray = tempArray.map((item,key) =>{

    if(item.key==this.props.item.paying){
      payingName=item.first;
      payingUsername = item.username
      payingProfilePic = item.profilePic
    }
    else if(item.key==this.props.item.charging){
      chargingName=item.first;
      chargingUsername = item.username
      chargingProfilePic = item.profilePic
    }
  });

    // return this.props.renderPay(this.props.item);
  if(this.props.selectedIdx==0){
    if(this.props.item.paying==uid){
        return(
        <ListItem
        {...this.props}
        onPress={this._onPress}
        containerStyle= {styles.redButton}
        Component={TouchableOpacity}
        leftAvatar= {{
                      size: width/7.5,
                      source: {uri: chargingProfilePic ? chargingProfilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                      rounded: true
                    }}
        title={'Paying'}
        titleStyle={{color:'white', fontWeight:'bold', fontSize: width/26}}
        subtitle={'@' + chargingUsername}
        subtitleStyle={{color:'white', fontSize: width/27}}
        rightTitle={this.props.item.name}
        rightTitleStyle={{color:'white', fontWeight:'bold', fontSize: width/26, width: width/3.6}}
        rightSubtitle={'$' + (this.props.item.amount).toFixed(2)}
        rightSubtitleStyle={{color:'white', fontSize: width/27, width: width/3.6}}
        chevronColor="white"
        chevron
        />)
      }

        if(this.props.item.charging==uid){
        return(
        <ListItem
          {...this.props}
          onPress={this._onPress.bind(this)}
          containerStyle= {styles.blueButton}
          Component={TouchableOpacity}
          leftAvatar= {{
                        size: width/7.5,
                        source: {uri: payingProfilePic ? payingProfilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                        rounded: true,
                      }}
          title='Charging'
          titleStyle={{color:'white', fontWeight:'bold', fontSize: width/26}}
          subtitle={'@' + payingUsername}
          subtitleStyle={{color:'white', fontSize: width/27}}
          rightTitle={this.props.item.name}
          rightTitleStyle={{color:'white', fontWeight:'bold', fontSize: width/26, width: width/3.6}}
          rightSubtitle={'$' + (this.props.item.amount).toFixed(2)}
          rightSubtitleStyle={{color:'white', fontSize: width/27, width: width/3.6}}
          chevronColor="white"
          chevron
          />)
        }
  }
    if(this.props.selectedIdx==1){
        // console.log(this.props.selectedIdx);
      if(this.props.item.paying==uid){
        return(
        <ListItem
          {...this.props}
          {...this.props}
          onPress={this._onPress}
          containerStyle= {styles.redButton}
          Component={TouchableOpacity}
          leftAvatar= {{
                        size: width/7.5,
                        source: {uri: chargingProfilePic ? chargingProfilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                        rounded: true
                      }}
          title={'Paying'}
          titleStyle={{color:'white', fontWeight:'bold', fontSize: width/26}}
          subtitle={'@' + chargingUsername}
          subtitleStyle={{color:'white', fontSize: width/27}}
          rightTitle={this.props.item.name}
          rightTitleStyle={{color:'white', fontWeight:'bold', fontSize: width/26, width: width/3.6}}
          rightSubtitle={'$' + (this.props.item.amount).toFixed(2)}
          rightSubtitleStyle={{color:'white', fontSize: width/27, width: width/3.6}}
          chevronColor="white"
          chevron
          />)
        }
        else{
          return(
            <Text></Text>
          )
        }
    }
    if(this.props.selectedIdx==2){
      // console.log(this.props.selectedIdx);
      if(this.props.item.charging==uid){
        return(
        <ListItem
        {...this.props}
        onPress={this._onPress}
        containerStyle= {styles.blueButton}
        Component={TouchableOpacity}
        leftAvatar= {{
                      size: width/7.5,
                      source: {uri: payingProfilePic ? payingProfilePic : 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'},
                      rounded: true,
                    }}
        title='Charging'
        titleStyle={{color:'white', fontWeight:'bold', fontSize: width/26}}
        subtitle={'@' + payingUsername}
        subtitleStyle={{color:'white', fontSize: width/27}}
        rightTitle={this.props.item.name}
        rightTitleStyle={{color:'white', fontWeight:'bold', fontSize: width/26, width: width/3.6}}
        rightSubtitle={'$' + (this.props.item.amount).toFixed(2)}
        rightSubtitleStyle={{color:'white', fontSize: width/27, width: width/3.6}}
        chevronColor="white"
        chevron
        />)
        }
        else{
          return(
            <Text></Text>

          )
        }
    }
    else{
      return(
        <Text>Thats all folks...</Text>
      )
    }
}
  render() {
    // console.log("temp?",this.props.temp);
    return(
        this._renderMain()
    )
  }
}

let uid;
let transactionData =[]
let tempArray =[]
export default class CurrentTransactions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      first: '',
      name:'',
      isModalVisible: false,
      selectedItem:null,
    };
    transactionData= [],
    tempArray =[],
    uid=firebase.auth().currentUser.uid,
    this.updateIndex = this.updateIndex.bind(this);
  };



//updates the three option menu at the top
updateIndex(selectedIndex) {
  this.setState({ selectedIndex });
};


_onPressItem = (item) => {
  this._showModal(item);
};

//to close modal
_toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

_showModal = (item) => this.setState({ isModalVisible: true, selectedItem: item });

_hideModal = () => this.setState({isModalVisible:false})


//function that is called everytime page mounts
componentDidMount(){
  var uid = firebase.auth().currentUser.uid
  this.setState({uid:uid})

  firebase
  .database()
  .ref()
  .child("currentTransactions/" + uid)
  .once("value")
  .then((snapshot) => {

    // for each current transaction
    snapshot.forEach((childSnapShot) => {
      //save transaction information
      transactionData.push({
                          key: childSnapShot.key,
                          amount: childSnapShot.val().amount,
                          charging: childSnapShot.val().charging,
                          date: childSnapShot.val().date,
                          name: childSnapShot.val().name,
                          paying: childSnapShot.val().paying,

                        })

    });
  })

    firebase
    .database()
    .ref("friendslist/" + uid)
    .child('currentFriends')
    .once("value")
    .then ((snapshot) => {
      // for each friend
      snapshot.forEach((childSnapShot) => {
          tempArray.push({
            key: childSnapShot.key,
            first: childSnapShot.val().firstName,
            last: childSnapShot.val().lastName,
            username: childSnapShot.val().username,
            profilePic: childSnapShot.val().profilePic,
          })
          this.setState(
            {
              tempArray:tempArray
            }
          )
        });
        });


    this.forceUpdate();

}

keyExtractor = (item,index) =>index.toString()


renderItem = ({item})=> (
//

// this.renderMain(item)
  <MyItem
  item={item}
  paying={item.paying}
  charging={item.charging}
  uid = {uid}
  temp={tempArray}
  selectedIdx ={this.state.selectedIndex}
  renderCharge ={()=>this._renderCharging(item)}
  renderPay={()=>this._renderPaying(item)}
  onPressItem={()=>this._onPressItem(item)}
  renderM={()=>this.renderMain(item)}
  />
);

  render() {

    const buttons = ["All", "Paying", "Charging"];
    const { selectedIndex } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../../assets/group-dinner.jpg")}
          style={styles.imageContainer}
        >
          <View style={styles.overlay} />
          <Header style={{borderBottomWidth:0,backgroundColor:'transparent', zIndex:100, top: 0, left:0, right:0}}>
          <Left>
            <Icon name="bars" type="FontAwesome" style={{color:'white' }} onPress={()=>this.props.navigation.openDrawer()}/>
          </Left>
        </Header>
          <View style={styles.mainContainer}>
          <Text style={{color:'white', fontWeight:'bold', fontSize: width/15, marginBottom: width/37.5}}> Current Transactions</Text>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{ height: width/12.5 }}
              />
            <View style={styles.infoContainer}>

            <FlatList style={{flex:1}}
              keyExtractor={this.keyExtractor}
              data={transactionData}
              renderItem={this.renderItem}
            />

        { this.state.isModalVisible && <MyModal selectedItem={this.state.selectedItem} modalVisible={this.state.isModalVisible} hideModal={this._toggleModal} navigation={this.props.navigation}/> }

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
    marginTop:width/30,

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
    padding: width/37.5,
    justifyContent: "flex-end",
    width:width,
    marginTop:width/37.5
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
  modalContent: {
    backgroundColor: 'white',
    padding: width/17.045,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width/93.75,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: width/31.25,
    margin: width/23.4375,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width/93.75,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
