import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import * as firebase from 'firebase';
import { ListItem, Icon } from 'react-native-elements';

const{width} = Dimensions.get('window')

export default class PaymentMethods extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      balance: 0,
      cards: [],
      banks: [],
    };
  }

  // //function called to save changes when user navigates away from screen
  //   componentWillUnmount() {
  //     var uid = firebase.auth().currentUser.uid;
  //     const { cards, banks } = this.state;
  //
  //     //clear out user's current cards
  //     firebase
  //       .database()
  //       .ref("payments/" + uid + "/cards")
  //       .set(" ");
  //
  //     //write in each card
  //     for (let i = 0; i < cards.length; i++){
  //       firebase
  //         .database()
  //         .ref("payments/" + uid + "/cards/"+ cards[i].name)
  //         .set({
  //                 number: cards[i].number,
  //               });
  //     }
  //
  //     //clear out user's current banks
  //     firebase
  //       .database()
  //       .ref("payments/" + uid + "/banks")
  //       .set(" ");
  //
  //     //write in each bank
  //     for (let i = 0; i < banks.length; i++){
  //       firebase
  //         .database()
  //         .ref("payments/" + uid + "/banks/"+ banks[i].name)
  //         .set({
  //                 number: banks[i].number,
  //               });
  //     }
  //   }

  componentDidMount(){

    //get user's firebase id
    var uid = firebase.auth().currentUser.uid;

    //get user's balance
    firebase
    .database()
    .ref("payments/" + uid + '/wallet')
    .once("value", snapshot => {
      this.setState({
        balance: (snapshot.val().balance).toFixed(2)
      })
    });

    //get users cards
    firebase
      .database()
      .ref("payments/" + uid)
      .child("cards")
      .once("value", snapshot => {

        var cardsArray = []
        // for each card
        snapshot.forEach((childSnapShot) => {
          //save card name, number, and type
          cardsArray.push({
                              name: childSnapShot.key,
                              number: childSnapShot.val().number,
                            })
        });
        console.log('cards array: ', cardsArray)
        this.setState({cards: cardsArray})
        })

    //get users banks
    firebase
      .database()
      .ref("payments/" + uid)
      .child("banks")
      .once("value", snapshot => {

        var banksArray = []
        // for each bank
        snapshot.forEach((childSnapShot) => {
          //save bank name, number, and type
          banksArray.push({
                              name: childSnapShot.key,
                              number: childSnapShot.val().number,
                            })
        });
        console.log('banks array: ', banksArray)
        this.setState({banks: banksArray})
        })
  }

  //function to remove card
  removeCard = (index) => {
    const { cards } = this.state;

    var uid = firebase.auth().currentUser.uid;
    //clear out removed card
    firebase
      .database()
      .ref("payments/" + uid + "/cards/" + cards[index].name)
      .remove();

    // Pull card out
    this.state.cards.splice(index, 1);
    this.forceUpdate();
  };

  //function to remove bank
  removeBank = (index) => {
    const { banks } = this.state;

    var uid = firebase.auth().currentUser.uid;
    //clear out removed bank
    firebase
      .database()
      .ref("payments/" + uid + "/banks/" + banks[index].name)
      .remove();

    // Pull card out
    this.state.banks.splice(index, 1);
    this.forceUpdate();
  };

  render() {

    const { balance, cards, banks } = this.state
    return (

      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={{flex:1}}>
          <ScrollView>

            <View style={{flexDirection: 'row', padding: width/25, height: width/5}}>
              <Icon
                name='ios-wallet'
                type='ionicon'
                color='#35b0d2'
                size= {width/10}
              />

              <View style={{marginLeft: width/18.75}}>
                <Text style={styles.titleText}>
                  ChargeMe Balance
                </Text>
                <Text style={styles.subtitleText}>
                  ${balance}
                </Text>
              </View>
            </View>

            <View style={styles.container}>
              {cards.map((card, index) => (
                <ListItem
                  containerStyle={styles.listContainer}
                  key={index}
                  leftIcon={{name: 'ios-card', type: 'ionicon', color: 'white', size: width/11, containerStyle: {marginLeft: width/75}}}
                  title={card.name}
                  titleStyle = {[styles.titleText, {marginLeft: width/75}]}
                  subtitle = {card.number}
                  subtitleStyle= {styles.subtitleText}
                  bottomDivider = {true}
                  topDivider = {true}
                  rightElement = {
                                    <View style={styles.removeBtn}>
                                      <TouchableOpacity
                                      onPress={() => this.removeCard(index)}
                                      >
                                        <Text style={styles.btnText}>Remove</Text>
                                      </TouchableOpacity>
                                    </View>
                                  }
                />
              ))}
            </View>

            <View style={styles.container}>
              {banks.map((bank, index) => (
                <ListItem
                  containerStyle={styles.listContainer}
                  key={index}
                  leftIcon={{name: 'university', type: 'font-awesome', color: 'white', size: width/11}}
                  title={bank.name}
                  titleStyle = {styles.titleText}
                  subtitle = {bank.number}
                  subtitleStyle= {styles.subtitleText}
                  bottomDivider = {true}
                  topDivider = {true}
                  rightElement = {
                                    <View style={styles.removeBtn}>
                                      <TouchableOpacity
                                        onPress={() => this.removeBank(index)}
                                      >
                                        <Text style={styles.btnText}>Remove</Text>
                                      </TouchableOpacity>
                                    </View>
                                  }
                />
              ))}
            </View>


            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Bank')}>
                <Text style={styles.btntext}>ADD BANK </Text>
                <Icon name="angle-right" type="font-awesome" iconStyle={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('DebitCard')}>
                <Text style={styles.btntext}>ADD DEBIT CARD </Text>
                <Icon name="angle-right" type="font-awesome" iconStyle={styles.icon}/>
            </TouchableOpacity>

          </ScrollView>
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
  text: {
    fontSize: width/18.75,
    alignSelf: 'stretch',
    padding: width/18.75,
    width: '100%',
    alignSelf: 'center',
    marginTop: width/18.75,
    color: 'white',
  },
  button: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: width/18.75,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    marginTop: width/37.5,
  },
  btntext:{
    fontSize: width/18.75,
    color: '#fff',
  },
  icon:{
    fontSize:width/13.39,
    color: 'white',
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  },
  itemText: {
    color: 'white',
    fontSize:  width/23.44
  },
  itemTextTitle: {
    color: 'white',
    fontSize:  width/20.83,
    fontWeight: 'bold'
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: width,
    backgroundColor: 'transparent'
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
  removeBtn: {
    right: width/37.5,
    height: width/25
  },
  btnText: {
    color: 'white',
    fontSize: width/28.8
  },
});
