import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  FlatList,
  Picker
} from 'react-native';
import UIStepper from 'react-native-ui-stepper';
import TextInputComponent from '../../../components/TextInputComponent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ButtonComponent from '../../../components/ButtonComponent'
import SearchableDropdown from "react-native-searchable-dropdown";
import * as firebase from "firebase";
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';
import {TextInputMask} from 'react-native-masked-text';
import {
  ListItem,
  CheckBox,
} from 'react-native-elements';

let nameEmpty = false
let itemNameEmpty = false
let itemPriceEmpty = false
let noFriends = '';
let noItems= '';
let tempArray = [];
let tempItemArray = [];
let itemTotal = 0;

const{width} = Dimensions.get('window')

export default class SplitByItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      items: [],
      friends: [],
      selectedFriends: [],
      selectedFlat: [],
      first:'',
      disable: true,
      itemName: '',
      itemPrice: 0,
      quantity: 1,
    };

  }

  //run when page first loads
  componentDidMount() {
    nameEmpty = false;
    itemNameEmpty = false;
    itemPriceEmpty = false
    noFriends = '';
    noItems = '';
    tempArray = [];
    itemTotal = 0;

    this.generateTempItemArray()
    const { selectedFriends } = this.state;
    this.generateSelectedFlat(selectedFriends)
    // console.log('getting data from database')
    //get current logged in user
    var uid = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref("users/" + uid)
      .once("value", snapshot => {
        const nameUser = snapshot.val().firstName;
        this.setState({
          first: nameUser
        });
        // console.log('got users name')
      });

    //get users friends
    firebase
      .database()
      .ref("friendslist/" + uid)
      .child("currentFriends")
      .once("value")
      .then((snapshot) => {

        var friendsArray = []
        // for each friend
        snapshot.forEach((childSnapShot) => {
          //save their first name, last name, user id, and username
          friendsArray.push({
                              key: childSnapShot.key,
                              firstName: childSnapShot.val().firstName,
                              lastName: childSnapShot.val().lastName,
                              username: childSnapShot.val().username,
                            })

        });
        this.setState({friends: friendsArray})
      })
  }

  generateTempItemArray = () => {

    const { items } = this.state;
    tempItemArray = []
    var z;
    for (z in items) {
      tempItemArray[z] = { id: z, name: items[z].name, price: items[z].price };
    }
    //console.log('temp item array: ', tempItemArray)

    this.forceUpdate();
  }

  generateSelectedFlat = (selectedFriends) => {
    let selectedFlat = this.state;

    selectedFlat = []
    var y;
    for (y in selectedFriends) {
      var name = selectedFriends[y].firstName + " " + selectedFriends[y].lastName
      selectedFlat[y] = { id: y, name: name };
    }
    this.setState({selectedFlat: selectedFlat});
    this.forceUpdate();

  }

  addFriend = item => {
    index = eval(JSON.stringify(item.id))
    item.name = "",
    noFriends = ''
    this.forceUpdate();
    const { selectedFriends, friends } = this.state;

    // And put friend in selectedFriends
    selectedFriends.push(friends[index]);

    // Pull friend out of friends
    friends.splice(index, 1);
    tempArray.splice(index, 1);

    // Finally, update our app state
    this.generateSelectedFlat(selectedFriends)
    this.setState({
      friends: friends,
      selectedFriends: selectedFriends
    });
  };

  removeFriend = index => {
    const { friends, selectedFriends } = this.state;

    // And put friend in friends
    friends.push(selectedFriends[index]);

    // Pull friend out of selectedFriends
    selectedFriends.splice(index, 1);

    // Finally, update our app state
    this.generateSelectedFlat(selectedFriends)
    this.setState({
      friends: friends,
      selectedFriends: selectedFriends
    });
  };

  //function to handle pressing remove item button
  removeItem = (index) => {
    //console.log('removing ')
    //console.log('index: ', index)
    const{ items } = this.state;

    //console.log(items[index].price)

    items.splice(index,1);

    this.generateTempItemArray()

    this.setState({items: items})
  }

  //function to handle pressing add item icon
  addItem = () => {
    noItems = ''
    this.forceUpdate();
    //console.log('quantity: ', this.state.quantity)
    if(this.state.itemName == ''){
      itemNameEmpty = true
    }
    const numericPrice = this.itemPriceField.getRawValue().toFixed(2);
    if(numericPrice == '0.00'){
      itemPriceEmpty = true
    }

    this.forceUpdate();

    if(itemNameEmpty == false && itemPriceEmpty == false){

      for(let x = 0; x < this.state.quantity; x++){
        this.state.items.push({name: this.state.itemName, price: parseFloat(this.state.itemPrice)})
      }

      this.generateTempItemArray()

      this.setState({itemName: '', itemPrice: 0, quantity: 1})
      //console.log('items: ', this.state.items)
    }
  }

  //update bill split name entered by user
  updateName = value =>{
    if(value == ''){
      nameEmpty = true;
    }
    else{
      nameEmpty = false;
    }
    this.setState({name: value, disable: false})
  };

  //update item name entered by user
  checkItemName = value => {
    itemNameEmpty = false;
    this.setState({itemName: value})
  }

  //update item price entered by user
  checkItemPrice = value => {
    itemPriceEmpty = false;
    const numericPrice = this.itemPriceField.getRawValue().toFixed(2);
    this.setState({itemPrice: numericPrice})
  }

  //function to handle when user clicks review button
  onSubmitBillSplit = () => {
    if(this.state.name == ''){
      nameEmpty = true;
    }
    if(this.state.selectedFriends.length == 0){
      noFriends = 'Add Some Friends!';
    }
    if(this.state.selectedFriends.length > 0){
      noFriends = '';
    }
    if(this.state.items.length == 0){
      noItems = 'Add Some Items!';
    }
    if(this.state.items.length > 0){
      noItems = '';
    }

    this.forceUpdate();

    if(nameEmpty == false && noFriends == '' && noItems == ''){
      var y;
      for (y in this.state.items){
        itemTotal += this.state.items[y].price
      }
      console.log('SUBMITTING')
      console.log("item total", itemTotal)
      console.log('submitting selected friends: ', this.state.selectedFriends)
      console.log('submitting items: ', this.state.items)
      this.props.navigation.navigate('SplitByItemAssociate', {
                                                            name: this.state.name,
                                                            selectedFriends: this.state.selectedFriends,
                                                            items: this.state.items,
                                                            itemTotal: itemTotal
                                                          })
    }
  }

  render() {
    const { disable, selectedFriends, selectedFlat, items } = this.state;
    var x;
    for (x in this.state.friends) {
      var name1 = this.state.friends[x].firstName + " " + this.state.friends[x].lastName
      tempArray[x] = { id: x, name: name1};
    }
    // console.log('temp array: ', tempArray)
    var y;
    for (y in selectedFriends) {
      var name = selectedFriends[y].firstName + " " + selectedFriends[y].lastName
      this.state.selectedFlat[y] = { id: y, name: name };
    }
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../assets/group-dinner.jpg')} style={styles.imageContainer}>
        <View style={styles.overlay} />
          <View style={{ width: width, padding:width/18.75, paddingBottom: 0}}>

            <View style = {{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', marginLeft: (width-(width/1.5))/2 - (width/18.75),width: width/1.5,}}>

              <TouchableOpacity style = {styles.progressButton}
                disabled = {true}
                >
                <Text style={styles.stepLabel}>1</Text>
              </TouchableOpacity>

              <View style={[styles.line, {backgroundColor: 'rgba(225,225,225,0.2)'}]}/>

              <TouchableOpacity style = {[styles.progressButton, {backgroundColor: 'rgba(225,225,225,0.2)'}]}
                disabled = {true}
                >
                <Text style={[styles.stepLabel, {color: 'rgba(225,225,225,0.2)'}]}>2</Text>
              </TouchableOpacity>

              <View style={[styles.line, {backgroundColor: 'rgba(225,225,225,0.2)'}]}/>

              <TouchableOpacity style = {[styles.progressButton, {backgroundColor: 'rgba(225,225,225,0.2)'}]}
                disabled = {true}
                >
                <Text style={[styles.stepLabel, {color: 'rgba(225,225,225,0.2)'}]}>3</Text>
              </TouchableOpacity>

              <View style={[styles.line, {backgroundColor: 'rgba(225,225,225,0.2)'}]}/>

              <TouchableOpacity style = {[styles.progressButton, {backgroundColor: 'rgba(225,225,225,0.2)'}]}
                disabled = {true}
                >
                <Text style={[styles.stepLabel, {color: 'rgba(225,225,225,0.2)'}]}>4</Text>
              </TouchableOpacity>
            </View>

            <View style = {{flexDirection: 'row', alignItems: 'center',marginLeft: width/10,width: width/1.2,}}>
              <Text style={{marginLeft: width/30, marginRight: width/11, color: 'white', fontSize: width/25}}>Info</Text>
              <Text style={{marginRight: width/16, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Assign</Text>
              <Text style={{marginRight: width/15, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Tip/Tax</Text>
              <Text style={{color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Review</Text>
            </View>
          </View>

            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' extraScrollHeight={130}>
              <View style={styles.infoContainer}>


            <View style= {{alignContent:'flex-start'}}>
              <Text style={[styles.inputTitle, {marginTop: width/37.5}]}>Title</Text>
            </View>

            <TextInputComponent
              empty = {nameEmpty}
              style = {styles.input}
              placeholder="'Sunday Brunch'"
              placeholderTextColor="rgba(0,0,0,0.5)"
              onChangeText={(name) => this.updateName(name)}
              returnKeyType='next'
            />

            <Text style={[styles.inputTitle,{marginBottom: 0}]}>Friends</Text>

            <View>
              <FlatList
                data={this.state.selectedFlat}
                extraData={this.state}
                renderItem={({item}) =>
                  <View style={styles.searchboxContainer}>
                  <Text style={{marginLeft: width/15,marginTop: width/41.66,color: 'rgba(0,0,0,0.6)', fontWeight: 'bold',fontSize: width/25, textAlign: 'center'}}>{item.name}</Text>
                  <CheckBox
                    right={true}
                    iconRight
                    iconType='material'
                    containerStyle={{
                                      paddingTop: width/53.57,
                                      backgroundColor: 'transparent',
                                      height: width/9.375,
                                      margin: 0,
                                      borderColor: 'transparent'}}
                    textStyle={{color: 'rgba(0,0,0,0.6)', fontWeight: 'normal', fontSize: width/31.25}}
                    uncheckedIcon='clear'
                    size= {width/17}
                    uncheckedColor='coral'
                    checked={false}
                    onIconPress={() => this.removeFriend(eval(JSON.stringify(item.id)))}
                  />

                  </View>
                }
                keyExtractor={item => item.id}
              />
            </View>

            <SearchableDropdown
              // onTextChange={(value) => this.searchFriends(value)}
              onItemSelect={item => this.addFriend(item)}

              textInputStyle={{
                fontSize: width/25,
                color:'white',
                textAlign: 'center',
                height: width/9.375,
                width: width-(width/9.375),
                borderWidth: 2,
                borderColor: '#35b0d2',
                borderRadius: width/18.75,
                backgroundColor: '#35b0d2',

              }}
              itemStyle={{
                padding: width/37.5,
                marginTop: 2,
                marginLeft: width/18.75,
                marginRight: width/18.75,
                backgroundColor: 'rgba(255,255,255,0.4)',
                borderColor: 'rgba(255,255,255,0.4)',
                borderWidth: 1,
                borderRadius: width/75
              }}
              itemTextStyle={{ color: "white", textAlign: 'center', fontSize: width/25,}}
              itemsContainerStyle={{ maxHeight: width/2.5 }}
              items={tempArray}
              placeholder="Search friends"
              placeholderTextColor="white"
              autoCorrect= {false}
              resetValue={false}
              underlineColorAndroid="transparent"
            />

            <Text style={styles.errorMessage}>{noFriends}</Text>

            <Text style={[styles.inputTitle,{marginTop: 0}]}>Items</Text>

            <View>
              <FlatList
                data={tempItemArray}
                extraData={this.state}
                renderItem={({item}) =>
                  <View style={styles.searchboxContainer}>
                    <Text style={{marginLeft: width/15,marginTop: width/41.66,color: 'rgba(0,0,0,0.6)', fontWeight: 'bold',fontSize: width/25, textAlign: 'center'}}>{item.name}</Text>

                    <View style={{flexDirection: 'row'}}>
                      <Text style={{marginRight: width/75, marginTop: width/37.5,color: 'rgba(0,0,0,0.6)',fontSize: width/28.85, textAlign: 'center'}}>${(item.price).toFixed(2)}</Text>
                      <CheckBox
                        right={true}
                        iconRight
                        iconType='material'
                        containerStyle={{
                                          backgroundColor: 'transparent',
                                          paddingTop: width/53.57,
                                          height: width/9.375,
                                          margin: 0,
                                          borderColor: 'transparent'}}
                        textStyle={{color: 'rgba(0,0,0,0.6)', fontWeight: 'normal', fontSize: width/31.25}}
                        uncheckedIcon='clear'
                        size= {width/17}
                        uncheckedColor='coral'
                        checked={false}
                        onIconPress={() => this.removeItem(eval(JSON.stringify(item.id)))}
                      />
                    </View>

                  </View>
                }
                keyExtractor={item => item.id}
              />
            </View>

            <View style={styles.itemContainer}>
              <View style={{flexDirection: 'row', backgroundColor: '#35b0d2', borderRadius: width/18.75, height: width/9.375, alignItems: 'center', borderColor: '#35b0d2', borderWidth: 2}}>
                <View style={{width: width/2.5, marginLeft: width/75, marginRight: width/75, marginTop: width/93.75}}>
                  <TextInput
                    style={[styles.input,{height: width/12.5, borderRadius: width/37.5, borderWidth: 1, color: 'white',margin: 0, backgroundColor: '#35b0d2',
                      borderColor: itemNameEmpty == true
                        ? 'red'
                        : 'transparent',
                    }]}
                    placeholder="Item Name"
                    placeholderTextColor="white"
                    onChangeText= {(value) => this.checkItemName(value)}
                    returnKeyType='next'
                    defaultValue={this.state.itemName}
                  />
                </View>

                <View style={{width: width/5, marginTop: width/93.75, marginRight: width/75}}>
                  <TextInputMask
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: '.',
                      delimiter: ',',
                      unit: '$',
                      suffixUnit: ''
                    }}
                    value={this.state.itemPrice}
                    onChangeText={(total) => this.checkItemPrice(total)}
                    style={[styles.input,{height: width/12.5,width: width/5,  color: 'white',borderWidth: 1,borderRadius: width/37.5, margin: 0, backgroundColor:'#35b0d2',
                      borderColor: itemPriceEmpty == true
                        ? 'red'
                        : 'transparent',
                    }]}
                    ref={(ref) => this.itemPriceField = ref}
                    placeholder="Price"
                    placeholderTextColor="white"
                    keyboardType={'numeric'}
                    returnKeyType='go'
                  />
                </View>

                <View style={{backgroundColor: '#35b0d2', borderRadius: width/37.5, height: width/12.5}}>
                  <UIStepper
                    onValueChange={(value) => { this.setState({quantity: value}) }}
                    initialValue={1}
                    value={this.state.quantity}
                    minimumValue={1}
                    maximumValue={10}
                    displayValue = {true}
                    wraps={true}
                    tintColor="white"
                    borderColor='transparent'
                    borderWidth={2}
                    textColor="white"
                    fontSize={width/26.8}
                    width={width/6}
                    height= {width/12.5}
                  />
                </View>

              </View>

              <CheckBox
                center
                containerStyle={{marginLeft: 2, padding: 0,height: width/9.375}}
                iconType='material'
                size= {width/12.5}
                uncheckedIcon='add-circle'
                uncheckedColor='#35b0d2'
                checked={false}
                onIconPress={() => this.addItem()}
              />


            </View>

            <Text style={styles.errorMessage}>{noItems}</Text>

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

            <View style={{marginTop: width/6.25, width: width-(width/9.375)}}>
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
  searchboxContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'space-between',
    width: width/1.15,
    height: width/9.375,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255, 1)',
    borderWidth: 1,
    borderRadius: width/75,
    flexDirection: 'row',
    marginBottom: width/75,
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
    marginTop: width/37.5,
    width: width/2.5,
    height: width/10.71,
    flex: 1,
    justifyContent: 'flex-end'
  },
  itemContainer: {
    flexDirection: 'row',
    height: width/9.375,
  },
  input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,1)',
    color:'rgba(0,0,0,0.5)',
    marginBottom: width/75,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
    fontSize: width/31.25,
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
    padding: width/46.875,
    flex: 1,
  	backgroundColor: '#202646',
    borderRadius:width/3.75,
    borderWidth: 1,
    borderColor: 'coral',
    backgroundColor: 'coral',
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
