import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Header,Left,Right,Icon} from 'native-base'

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
      <Header>
        <Left>
          <Icon name="bars" type="FontAwesome" onPress={()=>this.props.navigation.openDrawer()}/>
        </Left>
      </Header>
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>

      <Text> settingScreen</Text>
      </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
container:{
  flex: 1,

}

});
