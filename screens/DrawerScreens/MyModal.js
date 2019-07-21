import React from 'react';
import {StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    Dimensions,
    FlatList,
    ScrollView,
    Button,
    TouchableHighlight} from 'react-native';
import Modal from "react-native-modal";
import ButtonComponent from '../../components/ButtonComponent'
import * as firebase from "firebase";
import { ListItem, Icon } from 'react-native-elements';

const { width, height } = Dimensions.get("window");

let paying = false;
let pressedPay = false;
let enoughBalance = false;
let chargePaid = false;
let cards = []
let banks = []

export default class MyModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      balance: 0,
    }
  }

  componentDidMount(){
    paying = false
    enoughBalance = false
    pressedPay = false
    chargePaid = false
    cards=[]
    banks=[]
    this.forceUpdate()

    //get user's firebase id
    var uid = firebase.auth().currentUser.uid;
    let  balance = 0
    let price = this.props.selectedItem.amount

    //get user's balance
    firebase
    .database()
    .ref("payments/" + uid + '/wallet')
    .once("value", snapshot => {
      balance = snapshot.val().balance
      if(balance >= price){
        enoughBalance = true
        this.setState({
          balance: balance
        })
      }
    });

    if(!enoughBalance){
      //get users cards
      firebase
        .database()
        .ref("payments/" + uid)
        .child("cards")
        .once("value", snapshot => {


          // for each card
          snapshot.forEach((childSnapShot) => {
            //save card name, number, and type
            cards.push({
                                name: childSnapShot.key,
                                number: childSnapShot.val().number,
                                checked: false
                              })
          });
          })

      //get users banks
      firebase
        .database()
        .ref("payments/" + uid)
        .child("banks")
        .once("value", snapshot => {


          // for each bank
          snapshot.forEach((childSnapShot) => {
            //save bank name, number, and type
            banks.push({
                                name: childSnapShot.key,
                                number: childSnapShot.val().number,
                                checked: false
                              })
          });

          })
    }
    console.log('pressedPay: ',pressedPay)
    console.log('chargePaid: ',chargePaid)
  }

  _onRemind=()=>{
    console.log('remind')
  }

  _onPay=()=>{
    pressedPay =  true
    this.forceUpdate()
  }

  _pressCard=(index)=>{

    for (i = 0; i < cards.length; i++ ){
      if(i == index){
        cards[i].checked = true
      }
      else{
        cards[i].checked = false
      }
    }
    for (x = 0; x < banks.length; x++ ){
      banks[x].checked = false
    }
    this.forceUpdate()
  }

  _pressBank=(index)=>{

    console.log('PRESSED ', index)

    for (i = 0; i < banks.length; i++ ){
      if(i == index){
        banks[i].checked = true
      }
      else{
        banks[i].checked = false
      }
    }
    for (x = 0; x < cards.length; x++ ){
      cards[x].checked = false
    }

    this.forceUpdate()
  }

  _payCharge=()=>{

    console.log('enough balance? ', enoughBalance)
    //if wallet covers charge
    if(enoughBalance){
      let { balance } = this.state
      //take charge from wallet
      balance = balance - this.props.selectedItem.amount
      //get user's firebase id
      var uid = firebase.auth().currentUser.uid;
      //write in new balance
      firebase.database().ref('payments/' + uid + '/wallet').set({
        balance: balance,
      })

      this.confirm()
    }

    if(!enoughBalance){
      let checked = false

      for (x = 0; x < cards.length; x++ ){
        if(cards[x].checked == true){
          checked = true
        }
      }

      for (i = 0; x < banks.length; i++ ){
        if(banks[i].checked == true){
          checked = true
        }
      }

      if(checked){
        this.confirm()
      }
    }
  }
  confirm=()=>{

    let item  = this.props.selectedItem
    console.log('confirming')

    //upgrade current transaction to past transaction
    console.log('charging: ',item.charging)
    console.log('paying: ',item.paying)
    console.log('key: ',item.key)

    let friendBalance = 0

    //get friend's balance
    firebase.database().ref('payments/' + item.charging + '/wallet')
    .once("value", snapshot => {
      friendBalance = snapshot.val().balance
    });

    console.log("their balance: ", friendBalance)

    //update friend's balance
    friendBalance = friendBalance + item.amount

    console.log("their updated balance: ", friendBalance)

    //write in friend's new balance
    firebase.database().ref('payments/' + item.charging + '/wallet').set({
      balance: friendBalance,
    })

    //clear out on charging
    firebase
      .database()
      .ref("currentTransactions/" + item.charging  + "/" + item.key)
      .remove();

      //clear out on paying
      firebase
        .database()
        .ref("currentTransactions/" + item.paying  + "/" + item.key)
        .remove();

        //dispatch paid charge to charging
        firebase
          .database()
          .ref("pastTransactions/" + item.charging + "/" + item.key )
          .set({
                charging: item.charging,
                paying: item.paying,
                amount: item.amount,
                name: item.name,
                date: item.date,
          });

          //dispatch paid charge to paying
          firebase
            .database()
            .ref("pastTransactions/" + item.paying + "/" + item.key )
            .set({
                  charging: item.charging,
                  paying: item.paying,
                  amount: item.amount,
                  name: item.name,
                  date: item.date,
            });



    //render confirmation
    chargePaid = true
    pressedPay = false
    this.forceUpdate()

    const { navigate } = this.props.navigation;

    //delay one second to allow user to see confirmation alert before navigating
    var delayInMilliseconds = 1000; //1 second
    setTimeout(() => {navigate('PastTransactions');}, delayInMilliseconds);

  }

    render() {
      var uid = firebase.auth().currentUser.uid
      if(uid == this.props.selectedItem.paying){
        paying = true
      }

      const{ balance } = this.state
      var price = this.props.selectedItem.amount
      return (
          <View>
              <Modal
                backdropColor={'rgba(1,1,1,0.6)'}
                animationInTiming={500}
                animationIn='fadeIn'
                animationOut='fadeOut'
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                isVisible={this.props.modalVisible}
              >
              <View style={styles.container}>
                  {!pressedPay && !chargePaid &&
                    <View style={styles.innerContainer}>
                      <View style={{alignItems: 'flex-start'}}>
                      <Icon
                        name= 'cancel'
                        color='#202646'
                        onPress= {this.props.hideModal}
                        size={width/15}
                        containerStyle={{marginTop: width/75, marginLeft: width/75}}
                      />
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.title}>Item Detail</Text>
                        <Text style={styles.nameDescription}>{this.props.selectedItem.name}</Text>
                        <Text style={styles.amountDescription}>{'$'+this.props.selectedItem.amount.toFixed(2)}</Text>
                        <Text style={styles.dateDescription}>{this.props.selectedItem.date}</Text>

                        {paying && <TouchableHighlight
                            style={styles.blueButton}
                            onPress={() => this._onPay()} >
                        <Text style={styles.buttonText}>Pay</Text>
                        </TouchableHighlight>}

                        {!paying && <TouchableHighlight
                            style={styles.blueButton}
                            onPress={() => this._onRemind()}
                            >
                        <Text style={styles.buttonText}>Remind</Text>
                        </TouchableHighlight>}

                        <TouchableHighlight
                            style={styles.buttonContainer}
                            onPress={this.props.hideModal}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                  </View>}



                  {pressedPay &&

                    <View style={styles.innerContainer}>
                    <View style={{alignItems: 'flex-start'}}>
                    <Icon
                      name= 'cancel'
                      color='#202646'
                      onPress= {this.props.hideModal}
                      size={width/15}
                      containerStyle={{marginTop: width/75, marginLeft: width/75}}
                    />
                    </View>
                      <View style={{alignItems: 'center'}}>

                        <Text style={[styles.nameDescription,{paddingTop: 0}]}>Payment Methods</Text>

                        { enoughBalance &&
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
                              ${balance.toFixed(2)}
                            </Text>
                          </View>
                        </View>}

                        {!enoughBalance &&
                          <View style={{height: height/4.5}}>
                          <ScrollView>
                            {cards.map((card, index) => (
                              <ListItem
                                Component={TouchableOpacity}
                                containerStyle={styles.listContainer}
                                onPress={() => this._pressCard(index)}
                                key={index}
                                leftIcon={{name: 'ios-card', type: 'ionicon', color: 'rgba(1,1,1,0.8)', size: width/11, containerStyle: {marginLeft: width/75}}}
                                title={card.name}
                                titleStyle = {[styles.titleText, {marginLeft: width/75}]}
                                subtitle = {card.number}
                                subtitleStyle= {styles.subtitleText}
                                bottomDivider = {true}
                                topDivider = {true}
                                rightIcon = {{name: 'check-circle', color: card.checked ? 'green' : 'transparent' , size: width/14.5 }}
                              />
                            ))}

                            {banks.map((bank, index) => (
                              <ListItem
                                Component={TouchableOpacity}
                                containerStyle={styles.listContainer}
                                onPress={() => this._pressBank(index)}
                                key={index}
                                leftIcon={{name: 'university', type: 'font-awesome', color: 'rgba(1,1,1,0.8)', size: width/11}}
                                title={bank.name}
                                titleStyle = {styles.titleText}
                                subtitle = {bank.number}
                                subtitleStyle= {styles.subtitleText}
                                bottomDivider = {true}
                                topDivider = {true}
                                rightIcon = {{name: 'check-circle', color: bank.checked ? 'green' : 'transparent' , size: width/14.5 }}
                              />
                            ))}

                          </ScrollView>
                          </View>
                        }

                        <TouchableHighlight
                            style={styles.blueButton}
                            onPress={this._payCharge.bind(this)}>
                            <Text style={styles.buttonText}>Pay ${price}</Text>
                        </TouchableHighlight>


                    </View>
                  </View>}

                  {chargePaid &&
                    <View style={styles.innerContainer}>
                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Icon
                          name='check-circle'
                          color= 'green'
                          size= {width/2.5}
                          containerStyle={{marginTop: width/4.7}}
                        />
                      </View>
                    </View>
                  }
                </View>
            </Modal>
          </View>
      );
    }
  }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: width/18.75,
        },
        innerContainer: {
            borderRadius: width/37.5,
            backgroundColor: '#ecf0f1',
            height: height/2.5
        },
        title: {
            color: '#35b0d2',
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
        },
        nameDescription: {
            color: '#12728d',
            fontWeight: 'bold',
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
            fontSize: width/15
        },
        dateDescription: {
            color: '#808080',
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
            fontSize: width/20.833
        },
        amountDescription: {
            color: '#12728d',
            fontSize: width/37.5,
            height:width/9.375,
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
            fontSize: width/20.833
        },
        buttonContainer: {
            padding: width/25,
            width: width/2,
            backgroundColor: '#2c3e50',
            borderRadius: width/37.5,
            marginTop: width/37.5,
            marginBottom: width/18.75,
        },
        buttonText: {
          textAlign: 'center',
          color: '#ecf0f1',
          fontWeight: '700',
          fontSize: width/25
        },
        blueButton: {
          padding:width/25,
          borderRadius:width/37.5,
          borderWidth: 1,
          borderColor: 'transparent',
          backgroundColor: '#35b0d2',
          marginTop:width/75,
          width: width/2,
        },
        titleText: {
          color: 'rgba(1,1,1,0.8)',
          fontSize: width/20,
          fontWeight : 'bold'
        },
        subtitleText: {
          color: 'rgba(1,1,1,0.8)',
          fontSize: width/23.4
        },
        listContainer: {
          justifyContent: "center",
          alignItems: "center",
          width: width/1.3,
          backgroundColor: 'transparent'
        },
    });
