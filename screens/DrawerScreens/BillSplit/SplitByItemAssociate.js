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
  Picker,
  SectionList
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ButtonComponent from '../../../components/ButtonComponent'
import { MaterialIcons } from '@expo/vector-icons';
import {
  ListItem,
  CheckBox,
  Icon
} from 'react-native-elements';

//get dimensions of screen
const{width, } = Dimensions.get('window')

let tempItemArray = [];
let unassocItems =[];
let items = [];
let count = 0;
let friendItems = [{title: 'Me', data: []}];
let looseItems = ''
let emptyFriend = ''
let friendSimple = []

export default class SplitByItemAssociate extends React.Component{
  constructor(props){
    super(props);

    const { navigation } = this.props;

    this.state = {
       name: navigation.getParam('name'),
       friends: navigation.getParam('selectedFriends'),
       value: ''
    };
  }

  componentDidMount(){
    console.log("MOUNTED")
    const { navigation } = this.props;

    console.log('items in associate screen: ', navigation.getParam('items'))
    unassocItems= []
    unassocItems.push(...navigation.getParam('items'));
    items.push(...unassocItems);
    count = 0;
    looseItems = ''
    emptyFriend = ''
    tempItemArray = [];
    friendItems = [{title: 'Me', data: []}];
    var y
    for (y in this.state.friends){
      var name = this.state.friends[y].firstName + " " + this.state.friends[y].lastName
      friendItems.push({title: name, data: []})
    }

    this.generateTempItemArray()

    this.forceUpdate();
    console.log(friendItems)
  }

  generateTempItemArray = () => {
    tempItemArray = []
    var z;
    for (z in unassocItems) {
      tempItemArray[z] = { id: z, name: unassocItems[z].name, price: unassocItems[z].price };
    }
    console.log('temp item array: ', tempItemArray)

    this.forceUpdate();
  }

  associate = (value, index, selected) =>{
    emptyFriend = ''
    looseItems = ''
    friendSimple[index].value=''
    console.log('friend name: ',value)
    console.log('friend index: ', index)
    console.log('item index: ', selected)

    friendItems[index].data.push({name: unassocItems[selected].name, price: unassocItems[selected].price, section: index, key: (friendItems[index].data).length })
    console.log('friends items: ', friendItems)

    unassocItems.splice(selected,1);
    this.generateTempItemArray()
    this.forceUpdate();
  }

  unassociate = (item) =>{

    emptyFriend = ''
    looseItems = ''
    console.log('UNASSOCIATING')
    console.log('unassociate value: ', item)
    console.log('key: ', item.key)
    console.log('friends items: ', friendItems)

    unassocItems.push({name: item.name, price: item.price})
    this.generateTempItemArray()
    friendItems[item.section].data.splice(friendItems[item.section].data.map((el) => el.key).indexOf(item.key),1)

    console.log('friendItems: ', friendItems )

    this.forceUpdate();

  }


  //function to handle when user clicks review button
  onSubmitBillSplit = () => {
    if(unassocItems.length != 0){
      looseItems = 'Assign Items!';
    }

    var y
    for (y in friendItems){
      if(friendItems[y].data.length == 0){
        emptyFriend = 'Assign each friend at least one item!'
      }
    }

    this.forceUpdate();

    if(looseItems == '' && emptyFriend == ''){

      const { navigation } = this.props;

      console.log('associate items: ', navigation.getParam('items'))

      this.props.navigation.navigate('SplitByItemPricing', {
                                                            name: this.state.name,
                                                            friends: this.state.friends,
                                                            friendItems: friendItems,
                                                            items: items,
                                                            itemTotal: navigation.getParam('itemTotal'),
                                                          })
    }
  }

  //  const payEach = parseFloat(((tip + tax)/(selectedFriends.length + 1)).toFixed(2))
  //  const today = moment().format("MMM Do YY");

  render(){
    const { friends } = this.state;


    friendSimple = [{value: 'Me'}]
    var x;
    for (x in friends){
      var name = friends[x].firstName + " " + friends[x].lastName
      friendSimple.push({value: name})
    }
    console.log('friends simple', friendSimple)

    const data = [
      { value: 'Upgrade' },
      { value: 'Settings' },
      { value: 'About' },
      { value: 'Sign out' }
    ];

    return(
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../assets/group-dinner.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

          <View style={{ width: width, padding:18.75, paddingBottom: 0}}>

          <View style = {{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', marginLeft: (width-(width/1.5))/2 - (width/18.75),width: width/1.5,}}>

            <TouchableOpacity style = {styles.progressButton}
              disabled = {true}
              >
              <Icon name = 'check' color='white' size = {24}/>
            </TouchableOpacity>

            <View style={styles.line}/>

            <TouchableOpacity style = {styles.progressButton}
              disabled = {true}
              >
              <Text style={styles.stepLabel}>2</Text>
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
            <Text style={{marginLeft: width/30, marginRight: width/11, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Info</Text>
            <Text style={{marginRight: width/16, color: 'white', fontSize: width/25}}>Assign</Text>
            <Text style={{marginRight: width/15, color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Tip/Tax</Text>
            <Text style={{color: 'rgba(225,225,225,0.2)', fontSize: width/25}}>Review</Text>
          </View>
          </View>

          <KeyboardAwareScrollView keyboardShouldPersistTaps='always'contentContainerStyle={styles.contentContainer}>
          <View style={{ width: width, padding:width/18.75, paddingBottom: 0}}>

          <Text style={[styles.inputTitle, {marginTop:width/37.5}]}>Unassigned Items:</Text>


            <FlatList
              data={tempItemArray}
              extraData={unassocItems}
              renderItem={({item}) =>
              <Dropdown
                data={friendSimple}
                renderBase={() => (

                    <View style = {{
                                    flexDirection: 'row',
                                    height: width/9.375,
                                    borderColor: 'transparent',
                                    justifyContent: 'space-between',
                                    backgroundColor: 'rgba(255,255,255, 1)',
                                    borderWidth: 2,
                                    borderRadius: width/75,
                                    paddingLeft: width/20,
                                    marginTop: width/75
                                  }}>
                      <Text style={{marginTop: width/41.66,color: 'rgba(0,0,0,0.6)', fontWeight: 'bold',fontSize: width/25}}>{item.name}</Text>
                      <Text style={{marginTop: width/37.5, marginRight: width/15, color: 'rgba(0,0,0,0.6)',fontSize: width/28.85,}}>${item.price}</Text>
                    </View>
                )}

                rippleInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
                containerStyle={{height: width/8.33}}
                overlayStyle={{backgroundColor: 'rgba(1,1,1,0.4)'}}
                dropdownPosition={1}
                itemColor="rgba(0, 0, 0, .87)"
                onChangeText = {(value, index, selected) => this.associate(value, index, eval(JSON.stringify(item.id)))}
                pickerStyle={{
                  width: width/2.93,
                  left: null,
                  right: 0,
                  marginRight: width/46.88,
                  marginTop: width/15.625
                }}
              />
              }
              keyExtractor={item => item.id}
            />
            <Text style={styles.errorMessage}>{looseItems}</Text>


          <Text style={styles.inputTitle}>Who's Paying What:</Text>
          </View>

          <View style={{marginLeft: width/18.75, marginRight:width/18.75 }}>
            <SectionList
              sections={friendItems}
              renderSectionHeader={({ section }) => (
                <View style={[styles.SectionHeaderStyle, {backgroundColor: section.title == 'Me'? 'coral' : '#35b0d2' , borderColor: section.title == 'Me'? 'coral' : '#35b0d2' }]}>
                  <Text style={{color: 'white', fontWeight: 'bold'}} > {section.title} </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <View style= {styles.SectionListItemStyle}>
                  <View>
                    <Text style={{color: 'rgba(0,0,0,0.6)', fontWeight: 'bold',marginTop: width/53.57 }}>{item.name}</Text>
                  </View>

                  <View style={{ flexDirection: 'row',}}>
                    <Text style={{color: 'rgba(0,0,0,0.6)', marginTop: width/53.57}}>${(item.price).toFixed(2)}</Text>
                    <CheckBox
                      right={true}
                      iconRight
                      iconType='material'
                      containerStyle={{
                                        paddingTop: width/93.75,
                                        paddingBottom: 0,
                                        height: width/12.5,
                                        margin: 0
                                      }}
                      uncheckedIcon='clear'
                      size= {20}
                      uncheckedColor='coral'
                      checked={false}
                      onIconPress={this.unassociate.bind(this, item)}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
            <Text style={styles.errorMessage}>{emptyFriend}</Text>


          <View style={{marginTop: width/9.375}}>
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
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  errorMessage:{
    color: 'red',
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
    paddingLeft: width/15,
    justifyContent: 'space-between',
    height: width/9.375,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255, 1)',
    borderWidth: 2,
    borderRadius: width/75,
    flexDirection: 'row',
    marginBottom: width/75,
  },
  valueContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    height: width/9.375,
    borderColor: '#35b0d2',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderRadius: width/75,
    margin: width/37.5,
    width: width/2.5,
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
    marginTop: width/9.375,
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
  inputTitle: {
    color: 'white',
    fontSize: width/18.75,
    fontWeight: 'bold',
    marginBottom: width/75,
    marginTop: width/18.75,
    textAlign: 'left',
  },
  SectionHeaderStyle: {
    backgroundColor:'#35b0d2',
    borderColor: '#35b0d2',
    borderWidth: 2,
    borderRadius: width/75,
    height: width/9.375,
    fontSize: width/25,
    padding: width/46.88,
    marginTop: width/75,
  },
  SectionListItemStyle: {
    borderColor:'transparent',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,1)',
    borderWidth: 2,
    borderRadius: width/75,
    flexDirection: 'row',
    marginBottom: width/75,
    width: width/1.5,
    fontSize: width/25,
    paddingLeft: width/22,
    height: width/11,
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
