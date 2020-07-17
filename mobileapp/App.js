    import React, {Component} from 'react';
    import {
        View,
        Text,
        TouchableOpacity,
        Platform,
        SafeAreaView,
        StyleSheet,
        TextInput,
        Alert,
        Image,
        Button
    } from 'react-native';
    navigator.geolocation = require('@react-native-community/geolocation');
    import NfcManager, { NfcTech, nfcManager } from 'react-native-nfc-manager';
    import axios from 'axios';
    import { Pages } from 'react-native-pages';
    import ImagePicker from 'react-native-image-picker';
    import defaultPrefences from './controller/preferenceContoller';
    import imgNoAvatar from './public/noavatar.png';
    import {Bars} from 'react-native-loader';


    let url = "http://192.168.0.106:3000";
    const options = {
        title: 'Select Avatar',
        storageOptions: {
        skipBackup: true,
        path: 'images',
        },
    };


    class App extends Component {
        constructor(props){
            super(props);
            this.state = {
                log: "",
                text: "",
                tagInfo: "",
                isScanned: 'notloaded',
                name:"",
                photo:"",
                permission:"",
                status: '',
                editing: false,
                location: null,
                scanButtonStatus:"Press to scan"
            }
        }

        componentDidMount() {
            NfcManager.start();
        }

        componentWillUnmount() {
            this._cleanUp();
        }

        _cleanUp = () => {
            NfcManager.cancelTechnologyRequest().catch(() => 0);
        }

        sendData = async(data)=>{
            this.setState({isScanned:'loading'})
            let geoCoords = await this.findCoordinates();
            let author = await defaultPrefences.get('key');
            // console.warn(geoCoords);
            await axios.post(`${url}/event/registertag`,{author: author, payload:{name:this.state.log, tagInfo: this.state.tagInfo, coords: geoCoords.coords}})
            .then(respond=>{
                this.setState({isScanned: 'loaded'});
                this.setState({
                    status:respond.data.status,
                    name:respond.data.payload.name,
                    permission:respond.data.payload.permission,
                });
                console.log(respond.data);
                if(respond.data.payload.photo){
                    this.setState({
                        photo:`${url}/uploads/${respond.data.payload.photo}`,
                    })
                }else{
                    this.setState({
                        photo:''
                    })
                }
            })
            .catch(err=>{
                this.setState({
                    text:'Error with remote server',
                })
            })
        }

        readData = async () => {
            this.setState({
                scanButtonStatus:'Waiting for tag...'
            })
            try {
                let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
                let resp = await NfcManager.requestTechnology(tech, {
                    alertMessage: 'Ready to do some custom Mifare cmd!'
                }); 
                let tag = await NfcManager.getTag();
                this.setState({
                    tagInfo: tag,
                })
                let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;

                resp = await cmd([0x3A, 4, 4]);
                let maxsixe = await NfcManager.getMaxTransceiveLength();
                // console.warn("max size: ", maxsixe);

                let payloadLength = parseInt(resp.toString().split(",")[1]);
                let payloadPages = Math.ceil(payloadLength / 4);
                let startPage = 5;
                let endPage = startPage + payloadPages - 1;

                resp = await cmd([0x3A, startPage, endPage]);
                bytes = resp.toString().split(",");
                let text = "";
                // console.warn('resp: ',resp)
                for(let i=0; i<bytes.length; i++){
                    if (i < 5){
                        continue;
                    }

                    if (parseInt(bytes[i]) === 254){
                        break;
                    }

                    text = text + String.fromCharCode(parseInt(bytes[i]));

                }
                // console.warn('text:',text);
                this.setState({
                    log: text
                })
                await this.sendData();
                this.setState({
                    scanButtonStatus:"Click to scan"
                })
                this._cleanUp();
            } catch (ex) {
                console.log('test',ex) 
                console.warn('text123:',ex.toString());
                this.setState({
                    log: ex.toString()
                })
                this._cleanUp();
            }
        }
    
        writeData = async () => {
            if (!this.state.text){
                Alert.alert("Nothing to write");
                return;
            }
            try {
                let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
                let resp = await NfcManager.requestTechnology(tech, {
                    alertMessage: 'Ready to do some custom Mifare cmd!'
                });

                let text = this.state.text;
                let fullLength = text.length + 7;
                let payloadLength = text.length + 3;
                let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;

                // resp = await cmd([0xA2, 0x04, 0x03, fullLength, 0xD1, 0x01]); // 0x0C is the length of the entry with all the fluff (bytes + 7)
                // resp = await cmd([0xA2, 0x05, payloadLength, 0x54, 0x02, 0x65]); // 0x54 = T = Text block, 0x08 = length of string in bytes + 3

                let currentPage = 6;
                let currentPayload = [0xA2, currentPage, 0x6E];

                for(let i=0; i<text.length; i++){
                    currentPayload.push(text.charCodeAt(i));
                    if (currentPayload.length == 6){
                        resp = await cmd(currentPayload);
                        currentPage += 1;
                        currentPayload = [0xA2, currentPage];
                    }
                }   

                // close the string and fill the current payload
                currentPayload.push(254);
                while(currentPayload.length < 6){
                    currentPayload.push(0);
                }

                resp = await cmd(currentPayload);

                this.setState({
                    log: resp.toString()
                })

                this._cleanUp();
            } catch (ex) {
                this.setState({
                    log: ex.toString()
                })
                this._cleanUp();
            }
        }

        findCoordinates =() => {
            return new Promise((resolve, reject) => { 
                navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy: false, timeout: 20000})
        });
        }

        testAuth = async()=>{ 
            try{
                let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
                let resp = await NfcManager.requestTechnology(tech, {
                    alertMessage: 'Ready to do some custom Mifare cmd!'
                }); 
                let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;
                resp = await cmd([0x1B,0xFF]); 
                // console.warn(resp);
            }catch(err){
                // if(err) console.warn(err)   ;
            }
        }
        
        uploadPhoto = async(tagInfo,img)=>{
            // console.warn('req',tagInfo)
            let formData = new FormData();
            let author = await defaultPrefences.get('key');
            formData.append('tagInfo',JSON.stringify(tagInfo));
            formData.append('photo',{
                uri: img.uri,
                type: 'image/jpeg',
                name: img.fileName});
            formData.append('author',author);
            axios.post(`${url}/event/addImage`,formData)
            .then(respond=>{
                // console.warn(respond);
            })
            .catch((err)=>{
                console.warn(err);
            })
            
        }

        setupPhoto = ()=>{
            ImagePicker.showImagePicker(options, async(response) => {
                // console.warn('Response = ', response);

                if (response.didCancel) {
                // console.warn('User cancelled image picker');
                } else if (response.error) {
                // console.warn('ImagePicker Error: ', response.error);
                } else {
                    await this.uploadPhoto(this.state.tagInfo,response);
                    this.setState({
                        photo: response.uri,
                    });
                    this.imgUploadAlert();
                }
            });
        }
        onChangeText = (text) => {
            this.setState({
                text
            })
        }
        imgUploadAlert(){
            Alert.alert('Image successfully uploaded!')
        }

        render() {
            return (
                <Pages startPage={1}>
                    <View style={styles.fullScreen}>
                        <Text style={{fontSize:25}}>Quality Assurance page</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={this.onChangeText}
                            autoCompleteType="off"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#888888"
                            placeholder="Enter text here" />
                        <TextInput/>
                        <TouchableOpacity
                            style={styles.buttonWrite}
                            onPress={this.writeData}>
                            <Text style={styles.buttonText}>Write</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.isScanned == 'loaded' ? 
                        <View  style={styles.fullScreen}>
                            {this.state.photo ? 
                                <Image
                                    style={styles.avatarBox}
                                    resizeMode="contain"
                                    source={{uri: this.state.photo}}
                                    /> 
                                :<View style={styles.avatarBox}>
                                    <Image
                                        style={{width: "60%", height: 200}}
                                        resizeMode="contain"
                                        source={imgNoAvatar}
                                        />  
                                    <Button onPress={()=>{this.setupPhoto()}} title="Upload image"/>
                                </View >}
                            
                            <View style={styles.infoBox}>
                                <Text style={styles.titleText}>IS REGISTERED:</Text>
                                <View style={this.state.status =='notregistered' ? styles.valueBoxAlert : styles.valueBox}>
                                    {this.state.status =="registered" ?  <Text style={styles.valueText}>Registered</Text> 
                                        :<Text style={styles.valueText}>This visitor not registered in system</Text>
                                    }
                                </View>
                                <Text style={styles.titleText}>NAME:</Text>
                                <View style={styles.valueBox}>
                                    <Text style={styles.valueText}>{this.state.name}</Text>
                                </View>
                                <Text style={styles.titleText}>PERMISSIONS:</Text>
                                <View style={this.state.permission ? styles.valueBox : styles.valueBoxAlert}>
                                    {this.state.permission ?  <Text style={styles.valueText}>{this.state.permission}</Text> 
                                        :<Text style={styles.valueText}>None</Text>
                                    }
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonSend}
                                onPress={this.readData}> 
                                <Text style={styles.buttonText}>{this.state.scanButtonStatus}</Text>
                            </TouchableOpacity>
                        </View> 
                        : this.state.isScanned == "loading" ?
                        <View  style={styles.fullScreen}>
                            <Text style={{fontSize:20,color:"#81b4f0"}}>Retrieving data from server</Text>
                            <Bars size={40} color="#81b4f0" />
                        </View>
                        : this.state.isScanned == "notloaded" ?
                        <View style={styles.fullScreen}>
                            <Text style={{fontSize:40, fontWeight:'bold', color:'#217eeb'}}>NFCreader</Text>
                            <TouchableOpacity
                                style={styles.buttonSend}
                                onPress={this.readData}> 
                                <Text style={styles.buttonText}>{this.state.scanButtonStatus}</Text>
                            </TouchableOpacity>
                            <View style={styles.log}>
                                <Text>{this.state.log}</Text>
                            </View>
                        </View>
                        : <View></View>
                    }
        </Pages>
            )
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
        },
        contentBox:{
        },
        fullScreen:{
            backgroundColor: "#fefdff",
            flex: 1,
            width: "100%",
            height: "100%",
            justifyContent: 'center',
            alignItems: 'center',
            overflow:'hidden',
        },
        textInput: {
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 10,
            height: 50,
            textAlign: 'center',
            color: 'black'
        },
        buttonWrite: {
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 10,
            height: 50,
            width: "90%",
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#9D2235'
        },
        buttonRead: {
            marginLeft: 20,
            marginRight: 20,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#006C5B'
        },
        buttonSend:{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 15,
            height: 50,
            width: "90%",
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#c9cdd4'
        },
        buttonText: {
            color: '#ffffff',
            fontSize:22
        },
        log: {
            marginTop: 30,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarBox:{
            width: "80%", 
            height: 240, 
            backgroundColor: "#fdeecc",
            alignItems:"center",
            borderRadius: 10,
        },
        infoBox:{
            width: "80%",
            paddingTop:10,
            backgroundColor: "#8dbbf2",
            borderRadius: 10,
            marginTop: 10,
            alignItems:'center'
            
        },
        titleText:{
            color:"white",
            fontWeight:"bold",
            fontSize:17
        },
        valueBox:{
            width: "100%", 
            padding:0, 
            backgroundColor:'#81b4f0',
            marginBottom:10,
            alignItems:'center'
        },
        valueText:{
            color:"white",
            fontSize:22
        },
        valueBoxAlert:{
            backgroundColor:'#f09181',
            width: "100%", 
            padding:0, 
            marginBottom:10,
            alignItems:'center'
        }
    })

    export default App;
