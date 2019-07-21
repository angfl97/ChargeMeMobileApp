import React from 'react';
import {createDrawerNavigator} from 'react-navigation';
import * as firebase from 'firebase';
import PastTransactionsStack from './PastTransactionsStack';
import MyModal from '../screens/DrawerScreens/MyModal';
import Gallery from '../screens/DrawerScreens/Gallery';
import CurrentTransactionsStack from './CurrentTransactionsStack';
import BillSplitStackScreen from './BillSplitStackScreen';
import FriendsStack from './FriendsStack';
import SettingsStackScreen from './SettingsStackScreen';
import DashboardStack from './DashboardStack';
import DrawerMenu from "./DrawerMenu";

const AppDrawerNavigator = createDrawerNavigator({
    DashboardStack: {screen: DashboardStack},
    BillSplitStackScreen: {screen: BillSplitStackScreen},
    FriendsStack: {screen: FriendsStack},
    PastTransactionsStack: {screen:  PastTransactionsStack},
    CurrentTransactionsStack: {screen: CurrentTransactionsStack},
    SettingsStackScreen: {screen: SettingsStackScreen},
    MyModal: {screen: MyModal},
    Gallery: {screen: Gallery},
  },
  {
    initialRouteName: 'DashboardStack',
    contentComponent: DrawerMenu,
    contentOptions: {
    activeTintColor: '#35b0d2'
  }
});

export default AppDrawerNavigator;
