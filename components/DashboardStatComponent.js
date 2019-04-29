import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';

const {width} = Dimensions.get('window')

//button component that displays a stat for the dashboard page
class DashboardStatComponent extends Component {
	render() {
		const { text, secondText, onPress, style, textStyle, secondTextStyle } = this.props;
		return (
  		  <TouchableOpacity style={style}
  			   onPress={() => onPress()}
  		  >
  			 <Text style={textStyle}>{text}</Text>
				 <Text style={secondTextStyle}>{secondText}</Text>
  		  </TouchableOpacity>
		);
	}
}

//check the type of the prop and whether or not they are required
DashboardStatComponent.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  secondText: PropTypes.string.isRequired,
  style: PropTypes.object,
	textStyle: PropTypes.object,
	secondTextStyle: PropTypes.object,
};

DashboardStatComponent.defaultProps = {

	textStyle: {
    textAlign: 'center',
    fontSize: width/26.786,
    color: 'white'
  },
  secondTextStyle: {
    marginTop: width/50,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width/18.75,
    color: 'white'
  },
  style: {
    paddingTop: width/40,
    height: width/3.8,
    borderRadius: 100,
    width: width/3.8,
    backgroundColor: 'rgba(225,225,225,0.3)'
  },
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize:width/20.833,
  	color: 'white',
  	textAlign: 'center'
  },

});

export default withNavigation(DashboardStatComponent);
