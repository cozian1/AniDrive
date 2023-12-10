import { Dimensions, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ProfileScreen({ navigation, route }) {
	const url='https://img.flawlessfiles.com/_r/800x1200/100/54/90/5490cb32786d4f7fef0f40d7266df532/5490cb32786d4f7fef0f40d7266df532.jpg';
  return (
    <View style={styles.container}>
      <View style={{flex:1}}>
				<ImageBackground  style={{width:screenWidth,height:'100%'}} source={{uri:url}}>
					<LinearGradient style={{flex:1}} colors={['#002','#0020']}></LinearGradient>
				</ImageBackground>
			</View>
			<View style={{flex:4}}>
			<ImageBackground imageStyle={{borderRadius:50}} style={{width:100,height:100, marginTop:-50,marginStart:20}} source={require('./assets/icon.png')}/>
				<ScrollView contentContainerStyle={{flex:1}}>
					<Pressable onPress={()=>null} style={{flexDirection:'row',width:screenWidth,padding:15}}><Text style={[styles.text,{fontSize:15}]}>General</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: '180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					<Pressable onPress={()=>null} style={{flexDirection:'row',width:screenWidth,padding:15}}><Text style={[styles.text,{fontSize:15}]}>Player Settings</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: '180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					<Pressable onPress={()=>null} style={{flexDirection:'row',width:screenWidth,padding:15}}><Text style={[styles.text,{fontSize:15}]}>Downloader Settings</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: '180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
					<Pressable onPress={()=>null} style={{flexDirection:'row',width:screenWidth,padding:15}}><Text style={[styles.text,{fontSize:15}]}>MAL sync</Text><MaterialIcons style={{marginStart:'auto',transform:[{rotate: '180deg'}]}} name="arrow-back-ios" size={20} color="white"/></Pressable>
				</ScrollView>
			</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
		textAlignVertical:'center',
  },
});
