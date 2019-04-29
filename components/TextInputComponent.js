import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TextInput, Dimensions} from 'react-native';

const{width} = Dimensions.get('window')
//text input component that makes the border red if there is an error
class TextInputComponent extends Component {
	render() {
    const {
      empty,
      error,
      placeholder,
      defaultValue,
      onChangeText,
      returnKeyType,
      inputRef,
      autoCorrect,
      autoCapitalize,
      secureTextEntry,
      onSubmitEditing,
			style,
			placeholderTextColor,
    } = this.props;
    return(
      <TextInput
        style={[style ,{
          borderColor: empty == true || error != ''
            ? 'red'
            : '#35b0d2',
        }]}
        placeholder={placeholder}
        defaultValue={defaultValue}
        placeholderTextColor= {placeholderTextColor}
        onChangeText={(text) => onChangeText(text)}
        returnKeyType={returnKeyType}
        ref={inputRef}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={()=> onSubmitEditing()}
      />
    );
  }
}

//check the type of the props and if they are required
TextInputComponent.propTypes = {
  empty: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  returnKeyType: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	style: PropTypes.object,
  error: PropTypes.string,
  autoCapitalize: PropTypes.string,
  autoCorrect: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  onSubmitEditing:PropTypes.func,
};

//set default values for props that are not required and not provided
TextInputComponent.defaultProps = {
  error: '',
  autoCapitalize: 'words',
  autoCorrect: false,
  secureTextEntry: false,
  onSubmitEditing: () => {},
	style: {
    height:40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color:'#fff',
    marginBottom: 5,
    paddingHorizontal:10,
    borderWidth: 2,
    borderRadius: 20,
  },
	placeholderTextColor: "rgba(255,255,255,0.8)",
}

const styles = StyleSheet.create({
	input: {
    height:width/9.375,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color:'#fff',
    marginBottom: width/75,
    paddingHorizontal:width/37.5,
    borderWidth: 2,
    borderRadius: width/18.75,
  },
});

export default TextInputComponent;
