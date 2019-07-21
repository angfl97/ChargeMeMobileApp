import React from 'react';
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
  CheckBox,
  Icon,
} from 'react-native-elements';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';
import {TextInputMask} from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ButtonComponent from '../../../components/ButtonComponent'
import TextInputComponent from '../../../components/TextInputComponent'
import SearchableDropdown from "react-native-searchable-dropdown";
import * as firebase from "firebase";

const{width} = Dimensions.get('window')
let friendAmounts = []
let emptyAmount = ''

export default class SplitByCustomAmount extends React.Component{
  constructor(props){
    super(props);
    const { navigation } = this.props;
    this.state= {
      name: navigation.getParam('name'),
      friends: navigation.getParam('friends'),
    }
  }

  componentDidMount(){
    const { friends } = this.state;
    console.log('friends: ', friends)
    friendAmounts = []
    var x;
    for(x in friends){
      friendAmounts[x] = ({friend: friends[x], amount: 0, index: x})
    }
    emptyAmount= ''
    this.forceUpdate();
  }

  checkAmount = (amount, index) => {
    friendAmounts[index].amount = amount.replace(/\$/g,'');
    console.log("changinf amount", friendAmounts)
    emptyAmount = ''
    this.forceUpdate();
  }

  //function to handle when user clicks review button
  onSubmitBillSplit = () => {

    var y;
    for (y in friendAmounts){
      console.log('amount: ', friendAmounts[y].amount)
      if(friendAmounts[y].amount ==  0){
        emptyAmount = 'Enter an amount for each friend'
      }
    }

    this.forceUpdate();

    if(emptyAmount == ''){

      console.log('sending friendamounts: ', friendAmounts)

      this.props.navigation.navigate('SplitByCustomAmountReview', {
                                                            name: this.state.name,
                                                            friendAmounts: friendAmounts
                                                          })
    }
  }

  render(){

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
              <Text style={[styles.stepLabel, {color: 'white'}]}>2</Text>
            </TouchableOpacity>

            <View style={[styles.line, {backgroundColor: 'rgba(225,225,225,0.2)'}]}/>

            <TouchableOpacity style = {[styles.progressButton, {backgroundColor: 'rgba(225,225,225,0.2)'}]}
              disabled = {true}
              >
              <Text style={[styles.stepLabel, {color: 'rgba(225,225,225,0.2)'}]}>3</Text>
            </TouchableOpacity>

          </View>

          <View style = {{flexDirection: 'row', alignItems: 'center',marginLeft: width/5.2,width: width/1.2,}}>
            <Text style={{marginLeft: width/28, marginRight: width/12, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Info</Text>
            <Text style={{marginRight: width/17, color: 'white', fontSize: width/25}}>Amount</Text>
            <Text style={{color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Review</Text>
          </View>
        </View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always' extraScrollHeight={width/2.885}>
          <View style={styles.infoContainer}>

          <Text style={[styles.inputTitle, {marginTop: width/37.5}]}>Enter Amounts:</Text>

          <FlatList
            data = {friendAmounts}
            extraData={this.state}
            renderItem={({item}) =>

              <View style={{
                            height: width/7.5,
                            flexDirection: 'row',
                            borderColor: 'transparent',
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(255,255,255, 1)',
                            borderWidth: 2,
                            borderRadius: width/75,
                            paddingLeft: width/20,
                            paddingRight: width/20,
                            marginTop: width/75,
                            marginBottom: width/75
                          }}>

              <Text style={{marginTop:width/28.8, color: 'rgba(0,0,0,0.6)', fontWeight: 'bold',fontSize: width/25}}>{item.friend.firstName} {item.friend.lastName}</Text>

                <TextInputMask
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: '.',
                    delimiter: ',',
                    unit: '$',
                    suffixUnit: ''
                  }}
                  value={item.amount}
                  onChangeText={(amount, index) => this.checkAmount(amount, item.index)}
                  style={[styles.input,{
                    borderColor: '#35b0d2',
                    marginTop: 3,
                    width: width/4
                  }]}
                  ref={(ref) => this.totalField = ref}
                  placeholder="$0"
                  placeholderTextColor="rgba(255,255,255,0.8)"
                  keyboardType={'numeric'}
                  returnKeyType='go'
                />

              </View>
            }
            keyExtractor={item => item.index}
            />
            <Text style={styles.errorMessage}>{emptyAmount}</Text>


            <View style={{marginTop: width/9.375, width: width-(width/9.375)}}>
              <ButtonComponent
                text='NEXT'
                onPress={() => this.onSubmitBillSplit()}
                disabled={false}
                primary={true}
              />
            </View>

          </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  errorMessage:{
    color: 'red',
  },
  inputBoxContainer:{
    flex:8,
  },
  flatListContainer:{
    height: width/3.75,
  },
  friendsContainer: {
    flex:1,
    alignItems: 'center',
  },
  searchboxContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'space-between',
    width: width/1.15,
    height: width/9.375,
    borderColor: '#35b0d2',
    backgroundColor: 'rgba(255,255,255, 1)',
    borderWidth: 1,
    borderRadius: width/75,
    flexDirection: 'row',
    marginBottom: width/37.5,
  },
  checkBoxContainer: {
      height: width/2.5,
    justifyContent:'space-between',
  },
  customCheckBoxContainer: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
  },
  circleContainer:{
    height: width/14.42,
    width:width/14.42,
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
    flex: 2,
    width: width,
    padding:width/18.75,
  },
  input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,1)',
    color:'rgba(0,0,0,0.8)',
    marginBottom: width/75,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
  },
  customContainer: {
    width: width / 4,
  },
  inputTitle: {
    color: 'white',
    fontSize: width/18.75,
    fontWeight: 'bold',
    marginBottom: width/75,
    marginTop: width/18.75,
    textAlign: 'left',
  },

  btntext: {
    color: 'white',
    fontSize: width/20.833,
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
    fontSize: width/23.44
  }
});
