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

let totalEmpty = false;
let tempArray = []
let tip = 0

const{width} = Dimensions.get('window')

export default class SplitEvenly extends React.Component {

  constructor(props){
    super(props);

    const { navigation } = this.props;

    this.state = {
      name: '',
      total: 0,
      friends: navigation.getParam('friends'),
      checked10: false,
      checked15: false,
      checked18: false,
      checked20: false,
      checkedCustom: false,
      checkedNo: true,
      disable: true,
    };

  }

  componentDidMount(){
    console.log('SPLIT EVENLY')
    totalEmpty = false;
    nameEmpty = false;
    noFriends = '';
    tempArray = []
    tip = 0

    const {navigation} = this.props
    this.setState({
      name: navigation.getParam('name'),
      friends:navigation.getParam('friends'),
    })
  }

  //update custom tip entered by user
  checkCustom = () => {
    const numericCust = this.tipField.getRawValue();
    tip = numericCust;
  };

  on10Toggle = (checked10) => {
    this.setState(() => ({checked10}));
    if(checked10==true){
      this.setState({
        checked15: false,
        checked18: false,
        checked20: false,
        checkedCustom: false,
        checkedNo: false
      });
    }
    else{
      if (this.state.checked20 == false
          && this.state.checked15 == false
          && this.state.checked18 == false
          && this.state.checkedCustom == false){
            this.setState({checkedNo:true})
          }
    }
  }
  
  on15Toggle = (checked15) => {
    this.setState(() => ({checked15}));
    if(checked15==true){
      this.setState({
        checked10: false,
        checked18: false,
        checked20: false,
        checkedCustom: false,
        checkedNo: false
      });
    }
    else{
      if (this.state.checked10 == false
          && this.state.checked20 == false
          && this.state.checked18 == false
          && this.state.checkedCustom == false){
            this.setState({checkedNo:true})
          }
    }
  }

  on18Toggle = (checked18) => {
    this.setState(() => ({checked18}));
    if(checked18==true){
      this.setState({
        checked10: false,
        checked15: false,
        checked20: false,
        checkedCustom: false,
        checkedNo: false
      });
    }
    else{
      if (this.state.checked10 == false
          && this.state.checked15 == false
          && this.state.checked20 == false
          && this.state.checkedCustom == false){
            this.setState({checkedNo:true})
          }
    }
  }

  on20Toggle = (checked20) => {
    this.setState(() => ({checked20}));
    if(checked20==true){
      this.setState({
        checked10: false,
        checked15: false,
        checked18: false,
        checkedCustom: false,
        checkedNo: false
      });
    }
    else{
      if (this.state.checked10 == false
          && this.state.checked15 == false
          && this.state.checked18 == false
          && this.state.checkedCustom == false){
            this.setState({checkedNo:true})
          }
    }
  }

  onCustomToggle = (checkedCustom) => {
    this.setState(() => ({checkedCustom}));
    if(checkedCustom==true){
      this.setState({
        checked10: false,
        checked15: false,
        checked18: false,
        checked20: false,
        checkedNo: false
      });
    }
    else{
      if (this.state.checked10 == false
          && this.state.checked15 == false
          && this.state.checked18 == false
          && this.state.checked20 == false){
            this.setState({checkedNo:true})
          }
    }
  }

  onNoToggle = (checkedNo) => {
    this.setState(() => ({checkedNo}));
    if(checkedNo==true){
      this.setState({
        checked10: false,
        checked15: false,
        checked18: false,
        checked20: false,
        checkedCustom: false
      });
    }
    else{
      if (this.state.checked10 == false
          && this.state.checked15 == false
          && this.state.checked18 == false
          && this.state.checked20 == false
          && this.state.checkedCustom == false){
            this.setState({checkedNo:true})
          }
    }
  }

  showCustomField = () => {
    if(this.state.checkedCustom == true){
      return(
        <View style={styles.customContainer}>
          <TextInputMask
            type={'money'}
            options={{
              precision: 2,
              separator: '.',
              delimiter: ',',
              unit: '$',
              suffixUnit: ''
            }}
            value={this.state.tip}
            onChangeText={(customTip) => this.checkCustom(customTip)}
            style={[styles.input, {borderColor: '#35b0d2'}]}
            ref={(ref) => this.tipField = ref}
            placeholder="$0"
            placeholderTextColor="rgba(255,255,255,0.8)"
            keyboardType={'numeric'}
            returnKeyType='go'
          />
        </View>
      )
    }
  }

  //update total entered by user
  checkTotal = value =>{

    const numericTotal = this.totalField.getRawValue().toFixed(2);
    if(numericTotal == 0){
      totalEmpty = true;
    }
    else{
      totalEmpty = false;
    }
    this.setState({total: numericTotal, disable: false});
  };

  onSubmitBillSplit = () => {
    console.log("CLICK")
    const { total } = this.state
    if(this.state.checked10){
      tip = (total * 0.10).toFixed(2)
    }
    if(this.state.checked15){
      tip = (total * 0.15).toFixed(2)
    }
    if(this.state.checked18){
      tip = (total * 0.18).toFixed(2)
    }
    if(this.state.checked20){
      tip = (total * 0.20).toFixed(2)
    }
    if(this.state.checkedNo){
      tip = 0
    }

    if(totalEmpty == false ){
      console.log("first total: " + this.state.total);
      console.log("first tip: " + tip)
      console.log('submitting selected friends: ', this.state.selectedFriends)


      this.props.navigation.navigate('SplitEvenlyReview', {
                                                            name: this.state.name,
                                                            total: this.state.total,
                                                            tip: tip,
                                                            friends: this.state.friends
                                                          })
    }
  }

  render(){
    const { disable } = this.state;
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

        <KeyboardAwareScrollView keyboardShouldPersistTaps='always' extraScrollHeight={130}>
          <View style={styles.infoContainer}>

          <Text style={styles.inputTitle}>Total (including tax)</Text>
          <TextInputMask
            type={'money'}
            options={{
              precision: 2,
              separator: '.',
              delimiter: ',',
              unit: '$',
              suffixUnit: ''
            }}
            value={this.state.total}
            onChangeText={(total) => this.checkTotal(total)}
            style={[styles.input,{
              borderColor: totalEmpty == true
                ? 'red'
                : '#35b0d2',
            }]}
            ref={(ref) => this.totalField = ref}
            placeholder="$0"
            placeholderTextColor="rgba(255,255,255,0.8)"
            keyboardType={'numeric'}
            returnKeyType='go'
          />

          <View style={styles.receiptScannerContainer}>
            <ButtonComponent
              text='RECEIPT SCANNER'
              onPress={() => this.props.navigation.navigate('ReceiptScanner')}
              disabled={false}
              primary={false}
              redButton= {styles.redButton}
              textStyle={styles.redbtntext}
            />
          </View>

          <Text style={styles.inputTitle}>Tip:</Text>

          <View style={styles.customCheckBoxContainer}>
            <View style = {styles.checkBoxContainer}>
              <View style={styles.optionContainer}>
                <View style={styles.circleContainer}>
                  <CircleCheckBox
                    checked={this.state.checked10}
                    onToggle={this.on10Toggle}
                    outerColor='#35b0d2'
                    innerColor='#35b0d2'
                    filterSize= {20}
                    innerSize= {15}
                  />
                </View>
                <Text style={styles.btntext}>  10% </Text>
                <Text style={styles.tipText}>(${(this.state.total * 0.10).toFixed(2)})</Text>
              </View>

              <View style={styles.optionContainer}>
                <View style={styles.circleContainer}>
                  <CircleCheckBox
                    checked={this.state.checked18}
                    onToggle={this.on18Toggle}
                    outerColor='#35b0d2'
                    innerColor='#35b0d2'
                    filterSize= {20}
                    innerSize= {15}
                  />
                </View>
                <Text style={styles.btntext}>  18% </Text>
                <Text style={styles.tipText}>(${(this.state.total * 0.18).toFixed(2)})</Text>
              </View>

              <View style={styles.optionContainer}>
                <View style={styles.circleContainer}>
                  <CircleCheckBox
                    checked={this.state.checkedNo}
                    onToggle={this.onNoToggle}
                    outerColor='#35b0d2'
                    innerColor='#35b0d2'
                    filterSize= {20}
                    innerSize= {15}
                  />
                </View>
                <Text style={styles.btntext}>  No Tip </Text>
              </View>

            </View>

            <View style={styles.checkBoxContainer}>

              <View style={styles.optionContainer}>
                <View style={styles.circleContainer}>
                  <CircleCheckBox
                    checked={this.state.checked15}
                    onToggle={this.on15Toggle}
                    outerColor='#35b0d2'
                    innerColor='#35b0d2'
                    filterSize= {20}
                    innerSize= {15}
                  />
                </View>
                <Text style={styles.btntext}>  15% </Text>
                <Text style={styles.tipText}>(${(this.state.total * 0.15).toFixed(2)})</Text>
              </View>

              <View style={styles.optionContainer}>
                <View style={styles.circleContainer}>
                  <CircleCheckBox
                    checked={this.state.checked20}
                    onToggle={this.on20Toggle}
                    outerColor='#35b0d2'
                    innerColor='#35b0d2'
                    filterSize= {20}
                    innerSize= {15}
                  />
                </View>
                <Text style={styles.btntext}>  20% </Text>
                <Text style={styles.tipText}>(${(this.state.total * 0.20).toFixed(2)})</Text>
              </View>

              <View style={styles.optionContainer}>
                <View style={styles.circleContainer}>
                  <CircleCheckBox
                    checked={this.state.checkedCustom}
                    onToggle={this.onCustomToggle}
                    outerColor='#35b0d2'
                    innerColor='#35b0d2'
                    filterSize= {20}
                    innerSize= {15}
                  />
                </View>
                <Text style={styles.btntext}>  Custom: </Text>
                {this.showCustomField()}
              </View>
            </View>
          </View>

          <View style={{marginTop: width/18.75, width: width-(width/9.375)}}>
            <ButtonComponent
              text='NEXT'
              onPress={() => this.onSubmitBillSplit()}
              disabled={disable}
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
    backgroundColor: 'rgba(255,255,255, 0.8)',
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
  optionContainer:{
    flexDirection:'row',
    alignItems: 'center'
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
  receiptScannerContainer: {
    width: width/2,
    justifyContent: 'flex-end'
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
  tipText:{
    color: 'white',
    fontSize: width/25,
    opacity: 0.8,
  },
  btntext: {
    color: 'white',
    fontSize: width/20.83,
  },
  redbtntext: {
    color: 'white',
    fontSize: width/28.85,
    textAlign: 'center'
  },
  redButton: {
    padding: width/46.88,
    flex: 1,
  	backgroundColor: '#202646',
    borderRadius:width/37.5,
    borderWidth: 1,
    borderColor: 'coral',
    backgroundColor: 'coral',
	},
  receiptScannerContainer: {
    marginTop: width/37.5,
    width: width/2.5,
    height: width/10.7,
    flex: 1,
    justifyContent: 'flex-end'
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
    fontSize: width/23.4
  }
});
