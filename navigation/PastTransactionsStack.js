import React from 'react';
import {createStackNavigator} from 'react-navigation';
import PastTransactions from '../screens/DrawerScreens/PastTransactions';

const PastTransactionsStack = createStackNavigator({
  PastTransactions: {screen: PastTransactions, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'PastTransactions',
  }
);


export default PastTransactionsStack;
