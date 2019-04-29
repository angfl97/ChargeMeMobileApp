import React from 'react';
import {createStackNavigator} from 'react-navigation';
import CurrentTransactions from '../screens/DrawerScreens/CurrentTransactions';

const CurrentTransactionsStack = createStackNavigator({
  CurrentTransactions: {screen: CurrentTransactions, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'CurrentTransactions',
  }
);


export default CurrentTransactionsStack;
