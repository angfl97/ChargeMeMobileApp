import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ListView,
  FlatList,
  Dimensions,
  ImageBackground
} from "react-native";
import { Header, Left, Right, Icon } from "native-base";
import { Camera, Permissions } from "expo";
// import RNTextDetector from "react-native-text-detector";
import ButtonComponent from "../../../components/ButtonComponent";

let { width, height } = Dimensions.get("window");

export default class ReceiptScanner extends React.Component {
  static navigationOptions = {
    drawerIcon: tintColor => (
      <Icon
        name="camera"
        type="FontAwesome"
        style={{ fontSize: width/15.625, color: tintColor }}
      />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      path: null,
      imageProperties: null,
      data: null,
    };
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  press = async () => {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      console.log(data);
      this.setState({
        path: data.uri,
        data: data,
        imageProperties: {height: data.height, width: data.width},
      });
    }
  };

  processImage =async() =>{
  //   console.log("did we get here?");
  //  const{data} =this.state;
  //  console.log("1");
  //   const visionResp = await RNTextDetector.detectFromUri(data);
  //   console.log("2");
  //   console.log('visionResp',visionResp);
  //   if(!(visionResp && visionResp.length >0)){
  //     throw "unmatched";
  //   }
    // this.setState({
    //   visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
    // });
  };
  renderImage() {
    return (
      <View>
        <Image source={{ uri: this.state.path }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <ButtonComponent
            style={styles.cancel}
            onPress={() => this.setState({ path: null })}
            text="Cancel"
            disabled={false}
            primary={true}
          />
           <ButtonComponent
            style={styles.cancel}
            // onPress={this.processImage.bind(this)}
            text="Scan Receipt"
            disabled={false}
            primary={true}
          />
        </View>
      </View>
    );
  }


  renderCamera() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -width / 2 + (width/12.5),
                  left: -width / 2 + (width/5),
                  right: -width / 2 + (width/5),
                  bottom: -width / 2 + (width/37.5),

                  borderWidth: width / 2,
                  borderColor: "rgb(32,53,70)",
                  opacity: 0.9
                }}
              />
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={this.press.bind(this)}
              >
                <Image
                  style={{ width: width/6.25, height: width/6.25, marginBottom: width/37.5 }}
                  source={require("../../../assets/capture.png")}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.path ? this.renderImage() : this.renderCamera()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#000"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: width/75,
    color: "#000",
    padding: width/37.5,
    margin: width/9.375
  },
  cancel: {
    position: "absolute",
    left: width/75,
    top: width/75,
    backgroundColor: "transparent",
    color: "#FFF",
    fontWeight: "600",
    fontSize: width/22.0588
  },
  imageContainer: {
    resizeMode: "cover",
    flex: 1
  },
  buttonContainer: {
    width: width / 3,
    flex: 0,
    backgroundColor: "transparent",
    position: "absolute"
  }
});
