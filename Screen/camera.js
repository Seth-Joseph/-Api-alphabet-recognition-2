import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { View, Button, Platform } from "react-native";

export default class PickImage extends React.Component {
  state = {
    image: null,
  };

  getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status !== "granted") {
        alert("We Need Camera Permissions To Make This Work");
      }
    }
  };

  pickImage = async () => {
    try {
      var result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          image: result.data,
        });
        this.uploadImage(result.uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1];
    let type = `image/${uri.split(".")[uri.split(".").length - 1]}`;
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type,
    };
    data.append("alpha", fileToUpload);

    fetch("https://18eb46de98ba.ngrok.io/predict-alpha", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  componentDidMount = () => {
    this.getPermission();
  };

  render() {
    let { image } = this.state;
    return (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center"}}>
        <Button  style={{background: "black"}} title="Select Image" onPress={this.pickImage}/>
      </View>
    );
  }
}