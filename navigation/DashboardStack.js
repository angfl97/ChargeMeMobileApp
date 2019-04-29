import React from 'react';
import {createStackNavigator} from 'react-navigation';
import Dashboard from '../screens/DrawerScreens/Dashboard';

const DashboardStack = createStackNavigator({
  Dashboard: {screen: Dashboard, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'Dashboard',
  }
);


export default DashboardStack;
