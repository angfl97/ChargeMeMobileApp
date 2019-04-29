import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ListView,
  Image,
  StyleSheet,
   Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const { width } = Dimensions.get("window");

const DrawerItem = ({ navigation, icon, name, screenName, activeTint }) =>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() =>
      navigation.navigate(`${screenName}`, { isStatusBarHidden: false })}
  >
    <Icon name ={icon} size={width/15} color="#333" style={{margin:width/25}} />
    <Text style={styles.menuItemText}>{name}</Text>
  </TouchableOpacity>


const styles = StyleSheet.create({
  menuItem: {
    flexDirection:'row'
  },
  menuItemText: {
    fontSize:width/25,
    fontWeight:'300',
    margin:width/25,
  }
})

export default DrawerItem
