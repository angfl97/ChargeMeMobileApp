import React from 'react';
import * as firebase from "firebase";
import ButtonComponent from '../../../components/ButtonComponent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import { StackActions } from 'react-navigation';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  FlatList
} from 'react-native';
import {
  ListItem,
  Icon
} from 'react-native-elements';
import DatePicker from 'react-native-datepicker'

//get dimensions of screen
const{width, } = Dimensions.get('window')
//set bools for showing alerts
let showOptionAlert = false;
let showLoadingAlert = false;
let showConfirmedAlert = false;
let pickDate = ''

export default class SplitByCustomAmountReview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      date: '',
    }

    //make sure bools reset every time page is loaded
    showOptionAlert = false;
    showLoadingAlert = false;
    showConfirmedAlert = false;
    pickDate = ''
  }

  //function to show option alert
  showOptionAlert =() => {
    if(this.state.date != ''){
      showOptionAlert = true;
    }
    if(this.state.date == ''){
      pickDate = 'Please select a date'
    }
    this.forceUpdate();
  }
  //function to show loading alert
  showLoadingAlert =() => {
    showLoadingAlert = true;
    this.forceUpdate();
  }
  //function to show confirmed alert
  showConfirmedAlert =() => {
    showConfirmedAlert = true;
    this.forceUpdate();
  }

  //function to hide option alert
  hideOptionAlert = () => {
      showOptionAlert= false;
      this.forceUpdate();
  }
  //function to hide loading alert
  hideLoadingAlert = () => {
      showLoadingAlert= false;
      this.forceUpdate();
  }
  //function to hide confirmed alert
  hideConfirmedAlert = () => {
      showConfirmedAlert= false;
      this.forceUpdate();
  }

  //navigation that takes place after bill split is submitted
  navigating(){
    //reset screen stack of billSplit stack
    this.props.navigation.dispatch(StackActions.popToTop());
    //navigate to dashboard
    this.props.navigation.navigate('Dashboard');
  }

  //function to handle when user clicks confirm button on option alert
  onSubmitBillSplit(){
    //call correct sequence of alerts
    this.hideOptionAlert()
    this.showLoadingAlert()

    const { navigation } = this.props;

    const name = navigation.getParam('name');
    const friendAmounts = navigation.getParam('friendAmounts');

    //get current user's uid
    var uid = firebase.auth().currentUser.uid

    for (let i = 0; i < friendAmounts.length; i++){
      const unique = moment()
      console.log('unique: ', unique)
      //dispatch charge to database under user
      firebase
        .database()
        .ref("currentTransactions/" + uid + "/" + unique )
        .set({
              charging: uid,
              paying: friendAmounts[i].friend.key,
              amount: parseFloat(friendAmounts[i].amount),
              name: name,
              date: this.state.date
        });

        //dispatch charge to database under friend
        firebase
          .database()
          .ref("currentTransactions/" + friendAmounts[i].friend.key + "/" + unique)
          .set({
                charging: uid,
                paying: friendAmounts[i].friend.key,
                amount: parseFloat(friendAmounts[i].amount),
                name: name,
                date: this.state.date
          });
     }

    this.hideLoadingAlert()
    this.showConfirmedAlert()

    //delay one second to allow user to see confirmation alert before navigating
    var delayInMilliseconds = 1000; //1 second
    setTimeout(() => {this.navigating();}, delayInMilliseconds);

  }

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

  changeDate = (date) => {
    this.setState({date: date});
    pickDate = '';
    this.forceUpdate();
  }

  render(){
    const { navigation } = this.props;

    const name = navigation.getParam('name');
    const friendAmounts = navigation.getParam('friendAmounts')
    console.log('friendamounts: ', friendAmounts)

    let amountsFlat = []
    var y;
    for (y in friendAmounts) {
      var friendName = friendAmounts[y].friend.firstName + " " + friendAmounts[y].friend.lastName
      amountsFlat[y] = { id: y, name: friendName, amount: friendAmounts[y].amount };
    }
    console.log("amountsflat: ", amountsFlat)
    return(
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../assets/group-dinner.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

          <View style={{ width: width/1.2, padding:width/18.75, paddingBottom: 0}}>

            <View style = {{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', marginLeft: (width-(width/2.1))/2 - (width/18.75),width: width/2.1,}}>

              <TouchableOpacity style = {styles.progressButton}
                disabled = {true}
                >
                <Icon name = 'check' color='white' size = {24}/>
              </TouchableOpacity>

              <View style={styles.line}/>

              <TouchableOpacity style = {styles.progressButton}
                disabled = {true}
                >
                <Icon name = 'check' color='white' size = {24}/>
              </TouchableOpacity>

              <View style={styles.line}/>

              <TouchableOpacity style = {styles.progressButton}
                disabled = {true}
                >
                <Text style={styles.stepLabel}>3</Text>
              </TouchableOpacity>

            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center',marginLeft: width/5.2,width: width/1.2,}}>
              <Text style={{marginLeft: width/28, marginRight: width/12, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Info</Text>
              <Text style={{marginRight: width/17, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Amount</Text>
              <Text style={{color: 'white', fontSize: width/25}}>Review</Text>
            </View>
          </View>

          <KeyboardAwareScrollView keyboardShouldPersistTaps='always'contentContainerStyle={styles.contentContainer}>
            <Text style={styles.pageTitle}>{name}</Text>
            <View style={styles.borderContainer}>
              <View style={styles.infoContainer}>

              <DatePicker
                  style={{width: width/2.3, height: width/12.5, marginBottom:width/18.75, padding: 0}}
                  showIcon = {true }
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="MM-DD-YYYY"
                  maxDate= {moment().format("MM-DD-YYYY")}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      marginLeft: 0
                    },
                    dateInput: {
                      backgroundColor: "white",
                      marginLeft: width/6.7,
                      borderColor: 'rgba(255,255,255,1)',
                      borderWidth: 2,
                      borderRadius: width/75,
                      height: width/12.5,
                      width: width/3.5
                    },
                    dateText: {
                      color: 'rgba(1,1,1,0.6)',
                      fontWeight: 'bold'
                    },
                    placeholderText:{
                      color: "rgba(1,1,1,0.6)"
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.changeDate(date)}}
                />
                <Text style={styles.errorMessage}>{pickDate}</Text>


                <Text style={[styles.sectionTitle, {marginTop: width/53.57}]}>Who's Paying What:</Text>

                <FlatList
                  data={amountsFlat}
                  extraData={this.state}
                  renderItem={({item}) =>
                    <View style={styles.searchboxContainer}>
                      <Text style={{marginLeft: width/15,marginTop: width/41.7,color: 'white', fontWeight: 'bold',fontSize: width/25, textAlign: 'center'}}>{item.name}</Text>
                      <Text style={{marginRight: width/15,marginTop: width/41.7,color: 'white', fontWeight: 'bold',fontSize: width/25, textAlign: 'center'}}>${item.amount}</Text>
                    </View>
                  }
                  keyExtractor={item => item.id}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ButtonComponent
                text='SUBMIT'
                onPress={() => this.showOptionAlert()}
                disabled={false}
                primary={true}
              />
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
          <AwesomeAlert
              show={showOptionAlert}
              showProgress={false}
              title="Charge Friends? "
              titleStyle={{textAlign: 'center'}}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              cancelButtonStyle={{width: width/7, alignItems: 'center'}}
              showConfirmButton={true}
              confirmButtonStyle={{width: width/7, alignItems: 'center'}}
              cancelText="NO"
              cancelButtonTextStyle= {{fontWeight: 'bold', fontSize: width/31.25}}
              confirmText="YES"
              confirmButtonTextStyle= {{fontWeight: 'bold', fontSize: width/31.25}}
              confirmButtonColor='#35b0d2'
              onCancelPressed={() => {
                this.hideOptionAlert();
              }}
              onConfirmPressed={() => {
                this.onSubmitBillSplit();
              }}
            />
            <AwesomeAlert
                show={showLoadingAlert}
                showProgress={true}
                title="Submitting... "
                titleStyle={{textAlign: 'center'}}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
              />
              <AwesomeAlert
                  show={showConfirmedAlert}
                  customView={this.renderCustomAlertView()}
                  closeOnTouchOutside={false}
                  closeOnHardwareBackPress={false}
                />
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  infoContainer: {
    flex: 1,
    padding: width/18.75
  },
  borderContainer: {
    borderColor: '#35b0d2',
    borderWidth: 2,
    margin: width/18.75,
  },
  contentContainer: {
    width: width,
  },
  searchboxContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'space-between',
    height: width/9.375,
    borderColor: '#35b0d2',
    backgroundColor: '#35b0d2',
    borderWidth: 2,
    borderRadius: width/75,
    flexDirection: 'row',
    marginBottom: width/37.5,
  },
  valueContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    height: width/12.5,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderRadius: width/75,
    width: width/3.5,
  },
  buttonContainer: {
    marginLeft: width/18.75,
    marginRight: width/18.75,
  },
  pageTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: width/15.625,
    fontWeight: 'bold',
    marginTop: width/12.5,
  },
  sectionTitle: {
    textAlign: 'left',
    color: 'white',
    fontSize: width/20.83,
    fontWeight: 'bold',
    marginBottom: width/37.5,

  },
  customView: {
    height: width/3,
    width: width/3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressButton: {
    margin: 0,
    justifyContent: 'center',
    width: width/9.375,
    height: width/9.375,
    borderRadius: width/3.75,
    backgroundColor: '#35b0d2',
  },
  line: {
    width: width/12 ,
    height: 3,
    backgroundColor: '#35b0d2'
  },
  stepLabel: {
    color: 'white',
    textAlign: 'center',
    fontSize: width/23.4375
  },
  errorMessage:{
    color: 'red',
    marginBottom: width/75
  },
});
