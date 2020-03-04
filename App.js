import React, { PureComponent } from 'react';
import {ActivityIndicator, AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

console.disableYellowBox = true;

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      isLoading: false,
      dataSource: '',

      backendURL: '',
    }
  }

  // const createFormData = (photo, body) => {
  //   const data = new FormData();
  //
  //   data.append("photo", {
  //     name: photo.fileName,
  //     type: photo.type,
  //     uri:
  //       photo.uri.replace("file://", "")
  //   });
  //
  //   Object.keys(body).forEach(key => {
  //     data.append(key, body[key]);
  //   });
  //
  //   return data;
  // };
  //
  // handleUploadPhoto = (imageURL) => {
  //   fetch("http://ylambda.io/sortai/classify-url", {
  //     method: "POST",
  //     body: createFormData(imageURL)
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log("upload succes", response);
  //       alert("Upload success!");
  //       this.setState({ photo: null });
  //     })
  //     .catch(error => {
  //       console.log("upload error", error);
  //       alert("Upload failed!");
  //     });
  // };


 doPostCallback(imageURL){
    console.log("\nPost Callback");
    // imageURL =
    console.log(imageURL);

    let body = new FormData();
    body.append('file', {uri: imageURL, name: 'photo.jpg', type: 'image/jpg'});

		fetch("http://ylambda.io/sortai/upload/classify-url",
      { method: 'POST',
        headers:
          {
            'Accept': 'application/json',
            "Content-Type": "multipart/form-data",
          },
        body : body
      })
      .then(response => response.json())
      .then(response => {
        var top_prediction = JSON.stringify(response.predictions);

        console.log("calling set label with", top_prediction);
        this.setState({
          isLoading: false,
          dataSource: top_prediction,
        })


      })
      .catch(error => {
        console.log("upload error", error);

      });

	}


	doGetCallback() {
    var imgUrl = 'https://media4.manhattan-institute.org/sites/cj/files/seattle-trash-crisis.jpg';
		var xmlhttp = new XMLHttpRequest();
		var url = "http:/ylambda.io/sortai/classify-url?url=" + encodeURIComponent(imgUrl);

    console.log("\n\n\nURL");
    console.log(url);

  	xmlhttp.open('GET', url, true);
		xmlhttp.onreadystatechange = function() {
  		if (xmlhttp.readyState == 4) {
  			if(xmlhttp.status == 200) {
  			  var obj = JSON.parse(xmlhttp.responseText);
  			  var top_prediction = obj.predictions[0][0];
  				console.log(obj);
  				console.log("calling set label with", top_prediction);
          this.setState({
            isLoading: false,
            dataSource: top_prediction,
          })
  			 }
  		}
		}.bind(this);

    xmlhttp.send(null);
	}



  componentDidMount(){
    // this.doGetCallback();


  }

  takePicture = async() => {
   if (this.camera) {
     this.setState({
       isLoading: true,
     })
     const options = { quality: 0.5, base64: true };
     const data = await this.camera.takePictureAsync(options);
     console.log(data.uri);

     this.doPostCallback(data.uri);

   }
 };


  render() {
    return (
      <View style={styles.container}>

        <View style={styles.ImageContainer}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}

          />
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.PredictionContainer}>
            {this.showPrediction()}
        </View>

      </View>
    );
  }

  showPrediction = () =>{

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 50}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:50, alignItems: 'center'}}>
        <Text style={{ fontWeight: 'bold', fontSize: 15}}>{this.state.dataSource}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  ImageContainer: {
    flex: 0.6,
    backgroundColor: 'green',
  },
  preview: {
    flex: 1.0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  PredictionContainer: {
    flex: 0.4,
    backgroundColor: 'white',
  },
});
