import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';

const{width} = Dimensions.get('window')

//button component that incorporates making the button dim when it is disabled
class ButtonComponent extends Component {
	render() {
		const { text, onPress, disabled, primary, blueButton, redButton, textStyle } = this.props;
		return (
      <View style={disabled?styles.disabled:styles.enabled}>
  		  <TouchableOpacity style={primary? blueButton: redButton}
  			   onPress={() => onPress()}
           disabled={disabled}
  		  >
  			 <Text style={textStyle}>{text}</Text>
  		  </TouchableOpacity>
      </View>
		);
	}
}

//check the type of the prop and whether or not they are required
ButtonComponent.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
	primary: PropTypes.bool.isRequired,
	blueButton: PropTypes.object,
	redButton: PropTypes.object,
	secondText: PropTypes.string,
	textStyle: PropTypes.object,
	secondTextStyle: PropTypes.object,
};

ButtonComponent.defaultProps = {
 blueButton: {
	 padding:width/25,
	 backgroundColor: '#202646',
	 borderRadius:width/37.5,
	 borderWidth: 1,
	 borderColor: '#35b0d2',
	 backgroundColor: '#35b0d2',
 },
	redButton: {
		padding:width/25,
  	backgroundColor: '#202646',
    borderRadius:width/37.5,
    borderWidth: 1,
    borderColor: 'coral',
    backgroundColor: 'coral',
	},
	textStyle: {
    fontSize:width/20.833,
  	color: 'white',
  	textAlign: 'center'
  },
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize:width/20.833,
  	color: 'white',
  	textAlign: 'center'
  },
  blueButton: {
  	padding:width/25,
    borderRadius:width/37.5,
    borderWidth: 1,
    borderColor: '#35b0d2',
    backgroundColor: '#35b0d2',
  },
	redButton: {
		padding:width/25,
    borderRadius:width/37.5,
    borderWidth: 1,
    borderColor: 'coral',
    backgroundColor: 'coral',
	},
  disabled: {
    flex:1,
    opacity: 0.3,
  },
  enabled: {
    flex:1,
    opacity: 1,
  },
});

export default withNavigation(ButtonComponent);
