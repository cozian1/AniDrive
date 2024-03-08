import { Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Switch, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { MaterialIcons,Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {Picker} from '@react-native-picker/picker';
import { DataBase } from "./Renderer/UserDataBase";


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let Settings;
export default function ProfileScreen({ navigation, route }) {
	const [isPlayerSettings,setIsPlayerSettings]=useState(false);
	const [isDownloaderSettings,setIsDownloaderSettings]=useState(false);
	const [isGeneralSettings,setIsGeneralSettings]=useState(false);
	
	const [pbQuality, setpbQuality] = useState('auto');
	const [pbAudio, setpbAudio] = useState('sub');
	const [pbSubtitle, setpbSubtitle] = useState('English');
	const [dlQuality, setdlQuality] = useState('auto');
	const [dlAudio, setdlAudio] = useState('sub');
	const [dlSubtitle, setdlSubtitle] = useState('English');

	const qualitylist=[{label:'Auto', value:'auto'},{label:'1080P', value:'1080P'},{label:'720P', value:'720P'},{label:'360P', value:'360P'}];
	const subtitlelist=['Arabic','English','French','German','Italian','Portuguese - Portuguese(Brazil)','Russian','Spanish','Spanish - Spanish(Latin_America)'];
	const audiolanguage=[{label:'Sub', value:'sub'},{label:'Dub', value:'dub'}];
	//const [isPlayerSettings,setIsPlayerSettings]=useState(false);
	const [isEnabled, setIsEnabled] = useState(true);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
	const url='https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9';

	const playbackSettings=(
		<View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Playback Quality</Text>
				<Picker style={styles.picker} dropdownIconColor={'#fff'} dropdownIconRippleColor={'#fff6'} prompt="title" mode="dropdown" selectedValue={pbQuality} onValueChange={(itemValue, itemIndex) =>setpbQuality(itemValue)}>
					{qualitylist.map((o)=>(
						<Picker.Item key={o} style={styles.picker} label={o.label} value={o.value}/>
					))}
				</Picker>
			</View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Audio Language</Text>
				<Picker style={styles.picker} dropdownIconColor={'#fff'} dropdownIconRippleColor={'#fff6'} prompt="title" mode="dropdown" selectedValue={pbAudio} onValueChange={(itemValue, itemIndex) =>setpbAudio(itemValue)}>
					{audiolanguage.map((o)=>(
						<Picker.Item key={o} style={styles.picker} label={o.label} value={o.value}/>
					))}
				</Picker>
			</View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Subtitle Language</Text>
				<Picker style={styles.picker} dropdownIconColor={'#fff'} dropdownIconRippleColor={'#fff6'} prompt="title" mode="dropdown" selectedValue={pbSubtitle} onValueChange={(itemValue, itemIndex) =>setpbSubtitle(itemValue)}>
					{subtitlelist.map((o)=>(
						<Picker.Item key={o} style={styles.picker} label={o} value={o}/>
					))}
				</Picker>
			</View>
		</View>
	);
	const downloadSettings=(
		<View>
			<View style={{flexDirection:'row',width:screenWidth,height:50}}>
				<Text style={[styles.text,{marginStart:15}]}>Download With 1DM</Text>
				<Switch
					style={{marginStart:'auto',marginHorizontal:15}}
					trackColor={{false: '#777', true: '#048'}}
					thumbColor={isEnabled ? '#57f' : '#ddd'}
					onValueChange={toggleSwitch}
					value={isEnabled}
				/>
			</View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Media Quality</Text>
				<Picker style={styles.picker} dropdownIconColor={'#fff'} dropdownIconRippleColor={'#fff6'} prompt="title" mode="dropdown" selectedValue={dlQuality} onValueChange={(itemValue, itemIndex) =>setdlQuality(itemValue)}>
					{qualitylist.map((o)=>(
						<Picker.Item key={o} style={styles.picker} label={o.label} value={o.value}/>
					))}
				</Picker>
			</View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Audio Language</Text>
				<Picker style={styles.picker} dropdownIconColor={'#fff'} dropdownIconRippleColor={'#fff6'} prompt="title" mode="dropdown" selectedValue={dlAudio} onValueChange={(itemValue, itemIndex) =>setdlAudio(itemValue)}>
					{audiolanguage.map((o)=>(
						<Picker.Item key={o} style={styles.picker} label={o.label} value={o.value}/>
					))}
				</Picker>
			</View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Subtitle Language</Text>
				<Picker style={styles.picker} dropdownIconColor={'#fff'} dropdownIconRippleColor={'#fff6'} prompt="title" mode="dropdown" selectedValue={dlSubtitle} onValueChange={(itemValue, itemIndex) =>setdlSubtitle(itemValue)}>
					{subtitlelist.map((o)=>(
						<Picker.Item key={o} style={styles.picker} label={o} value={o}/>
					))}
				</Picker>
			</View>
		</View>
	);
	const generalSettings=(
		<View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Fast-forward with double tap</Text>
				<Switch
					style={{marginStart:'auto',marginHorizontal:15}}
					trackColor={{false: '#777', true: '#048'}}
					thumbColor={isEnabled ? '#57f' : '#ddd'}
					onValueChange={toggleSwitch}
					value={isEnabled}
				/>
			</View>
			<View style={{flexDirection:'row',width:screenWidth}}>
				<Text style={[styles.text,{marginStart:15}]}>Download With 1DM</Text>
				<Switch
					style={{marginStart:'auto',marginHorizontal:15}}
					trackColor={{false: '#777', true: '#048'}}
					thumbColor={isEnabled ? '#57f' : '#ddd'}
					onValueChange={toggleSwitch}
					value={isEnabled}
				/>
			</View>
		</View>
	);
	async function saveSettings(){
		await DataBase.Settings.updateSettings(pbQuality,pbAudio,pbSubtitle,dlQuality,dlAudio,dlSubtitle);
		ToastAndroid.show('Saved', ToastAndroid.SHORT);
	}
	useEffect(() => {
		async function load(){
			const Settings=await DataBase.Settings.getSettings().then((res)=>res.pop());
			console.log(Settings);
			setpbAudio(Settings.playbackAudio);
			setpbQuality(Settings.playbackQuality);
			setpbSubtitle(Settings.playbackSubtitle);
			setdlAudio(Settings.downloadAudio);
			setdlQuality(Settings.downloadQuality);
			setdlSubtitle(Settings.downloadSubtitle);
			//console.log(pbQuality,pbAudio,pbSubtitle,dlAudio,dlQuality,dlSubtitle);
		}
		
		load();
	},[]);
	return (
    <View style={styles.container}>
      <View style={{flex:1.3,width:screenWidth,alignItems:'center'}}>
			<Image style={{position:'absolute', height:screenWidth,width:'100%',transform:[{rotate:'90deg'}]}} source={{uri:url}}/>
			</View>
			<View style={{flex:4,borderTopLeftRadius:30,borderTopRightRadius:30,backgroundColor:'#111',paddingTop:10}}>
				<ScrollView contentContainerStyle={{paddingBottom:100}}>
					
					<Text style={[styles.item_text]}>Settings</Text>
					<Pressable onPress={()=>setIsGeneralSettings(previousState => !previousState)} style={styles.items}><Text style={[styles.text,{fontSize:15}]}>General</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: isGeneralSettings?'270deg':'180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					{isGeneralSettings?generalSettings:null}
					<Pressable onPress={()=>setIsPlayerSettings(!isPlayerSettings)} style={styles.items}><Text style={[styles.text,{fontSize:15}]}>Player Settings</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: isPlayerSettings?'270deg':'180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					{isPlayerSettings?playbackSettings:null}
					<Pressable onPress={()=>setIsDownloaderSettings(!isDownloaderSettings)} style={styles.items}><Text style={[styles.text,{fontSize:15}]}>Downloader Settings</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: isDownloaderSettings?'270deg':'180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					{isDownloaderSettings?downloadSettings:null}
					<Text style={[styles.item_text]}>Data Sync</Text>
					<Pressable onPress={()=>null} style={styles.items}><Text style={[styles.text,{fontSize:15}]}>MAL sync</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: '180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					<Pressable onPress={()=>null} style={styles.items}><Text style={[styles.text,{fontSize:15}]}>AniList sync</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: '180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
				</ScrollView>
			</View>
			<TouchableOpacity activeOpacity={0.5} onPress={saveSettings} style={{position:'absolute',bottom:40,right:20,backgroundColor:'#57f',padding:10,borderRadius:10}}><Feather name="save" size={35} color="white" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f93",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
		textAlignVertical:'center',
  },
	items:{
		flexDirection:'row',
		width:screenWidth,
		padding:15,
		marginVertical:1,
		backgroundColor:'#FFF1'
	},
	item_text:{
		color: "#fff",
		textAlignVertical:'center',
		fontSize:15,
		fontWeight:'bold',
		marginTop:10,
		marginStart:15,
		marginBottom:5
	},
	picker:{
		marginStart:'auto',
		color:'#FFF',
		backgroundColor:'#111',
		width:150,

	}
});
