import React, {Component} from 'react';
import {StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    Dimensions,
    FlatList,
    Button,
    TouchableHighlight} from 'react-native';
import Modal from "react-native-modal";
import ButtonComponent from '../../components/ButtonComponent'
const { width } = Dimensions.get("window");

export default class MyModal extends Component {
    render() {
      return (
          <View>
              <Modal
              backdropColor={'white'}
          backdropOpacity={1}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
              visible={this.props.modalVisible}
              onRequestClose={() => { this.props.onDismiss() }}
              >
                  <View style={styles.container}>
                  <View style={styles.innerContainer}>
                        <Text style={styles.title}>Item Detail</Text>
                        <Text style={styles.nameDescription}>{this.props.selectedItem.name}</Text>
                        <Text style={styles.dateDescription}>{this.props.selectedItem.date}</Text>
                        <Text style={styles.amountDescription}>{'$'+this.props.selectedItem.amount.toFixed(2)}</Text>

                        <TouchableHighlight
                            style={styles.blueButton}
                            >
                        <Text style={styles.buttonText}>Pay</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.buttonContainer}
                            onPress={this.props.hideModal}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
          </View>
      );
    }
  }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: width/18.75,
            backgroundColor: 'transparent',
        },
        innerContainer: {
            borderRadius: width/37.5,
            alignItems: 'center',
            backgroundColor: '#ecf0f1',
        },
        title: {
            color: '#35b0d2',
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
        },
        nameDescription: {
            color: '#12728d',
            fontWeight: 'bold',
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
        },
        dateDescription: {
            color: '#808080',
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
        },
        amountDescription: {
            color: '#12728d',
            fontSize: width/37.5,
            height:width/9.375,
            paddingTop: width/37.5,
            paddingBottom: width/37.5,
            marginBottom:width/15,
        },
        buttonContainer: {
            paddingVertical: width/75,
            width: width/3.75,
            backgroundColor: '#2c3e50',
            borderRadius: width/37.5,
            marginTop: width/18.75,
            marginBottom: width/18.75,
        },
        buttonText: {
            textAlign: 'center',
            color: '#ecf0f1',
            fontWeight: '700'
        },
        blueButton: {
            padding:width/25,
            backgroundColor: '#202646',
          borderRadius:width/37.5,
          borderWidth: 1,
          borderColor: '#35b0d2',
          backgroundColor: '#35b0d2',
          marginTop:width/37.5,
          marginBottom: width/37.5,
        },
    });
