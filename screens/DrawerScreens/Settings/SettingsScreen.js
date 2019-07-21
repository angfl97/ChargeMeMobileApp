import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import {Header,Left,Icon} from 'native-base'

const {width} = Dimensions.get('window')

export default class SettingsScreen extends React.Component {

  render() {
    return (

      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

      <View style={styles.container}>

      <Header style={{borderBottomWidth:0,backgroundColor:'transparent', zIndex:100, top: 0, left:0, right:0}}>
          <Left>
            <Icon name="bars" type="FontAwesome" style={{color:'white' }} onPress={()=>this.props.navigation.openDrawer()}/>
          </Left>
        </Header>

        <View style={{flex:1}}>
          <ScrollView>

            <Text style={styles.heading}> PREFERENCES </Text>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('UserProfile')}>
                <Text style={styles.btntext}>EDIT PROFILE </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('PaymentMethods')}>
                <Text style={styles.btntext}>PAYMENT METHODS </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('NotificationSettings')}>
                <Text style={styles.btntext}>NOTIFICATIONS </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>


            <Text style={styles.heading}> SECURITY </Text>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('ChangePassword')}>
                <Text style={styles.btntext}>CHANGE PASSWORD </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>


            <Text style={styles.heading}> INFORMATION </Text>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('UserManual')}>
                <Text style={styles.btntext}>USER MANUAL </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('DeveloperGuide')}>
                <Text style={styles.btntext}>DEVELOPER GUIDE </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('FAQs')}>
                <Text style={styles.btntext}>FAQS </Text>
                <Icon name="angle-right" type="FontAwesome" style={styles.icon}/>
            </TouchableOpacity>


            <Text style={styles.heading}> CONTACT </Text>
            <Text style={styles.hyperlink} onPress={() => Linking.openURL('mailto:ChargeMeHelp@gmail.com')}>
                ChargeMeHelp@gmail.com
            </Text>

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
  heading:{
    fontSize:width/17,
    fontWeight: 'bold',
    color: "white",
    paddingTop: width/18.75,
    paddingBottom: width/37.5,
    paddingLeft: width/37.5,
  },
  textinput: {
    alignSelf: 'stretch',
    alignItems: 'center',
    height: width/9.375,
    marginBottom: width/12.5,
    color: "#000",
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
    color: 'white',
  },
  icon:{
    fontSize:width/13.39,
    color: 'white',
  },
  hyperlink:{
    color: '#34c6de',
    fontSize: width/18.75,
    textAlign:'left',
    marginBottom: width/18.75,
    marginLeft: width/18.75,
    marginRight: width/18.75,
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  }
});
