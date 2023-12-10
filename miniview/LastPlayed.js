import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import ImgBox from "./ImgBox";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DataBase } from "../Renderer/UserDataBase";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("screen").width;

export default function LastPlayed(props) {
	const Navigation=useNavigation();

	async function removeItem(){
		await DataBase.WATCHHISTORY.removeItem(props.id);
		props.LastPlayedRemoved();
	}

  return (
		<Pressable style={[styles.box,props.style]} onPress={()=>{Navigation.push('Details', {id: props.id,data:props,isWatch:true});}}>
			<ImageBackground
        style={styles.img}
        imageStyle={{ borderRadius: 15 }}
        source={{ uri: props.src }}
      >
				<LinearGradient colors={['#000a','#0008','#0000']} style={{flexDirection:'row',padding:2}}>
					<Pressable onPress={()=>Navigation.push('Details', {id: props.id,data:props})} style={{marginEnd:'auto'}}><Ionicons  name="ios-information-circle-outline" size={24} color="white" /></Pressable>
					<Pressable onPress={removeItem} style={{marginStart:'auto'}}><Ionicons  name="md-close-sharp" size={28} color="white"/></Pressable>
				</LinearGradient>
				<Ionicons style={{position:'absolute',top:props.style.height/3,left:props.style.width/2.8}} name="ios-play" size={40} color="red" />
			</ImageBackground>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  box: {
    width: 150,
    height: 200,
    backgroundColor: "#000",
    borderRadius: 15,
    margin: 5,
  },
  img: {
    width: "100%",
    height: "100%",
  },
  typetext:{
    color: "#FFF",
    fontWeight: "600",
    fontSize: 10,
    backgroundColor: "#d22",
    margin: 10,
    borderRadius: 3,
    padding:3,
    paddingHorizontal: 4,
    alignSelf:'baseline'
  }
});

