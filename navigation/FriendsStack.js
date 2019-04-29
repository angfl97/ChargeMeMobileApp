import React from 'react';
import {createStackNavigator} from 'react-navigation';
import FriendsList from '../screens/DrawerScreens/FriendsList';

const FriendsStack = createStackNavigator({
  FriendsList: {screen: FriendsList, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'FriendsList',
  }
);


export default FriendsStack;
