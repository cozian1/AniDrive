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
		<Pressable onLongPress={()=>Navigation.push('Details', {id: props.id,data:props})} style={[styles.box,props.style]} onPress={()=>{Navigation.push('Details', {id: props.id,data:props,isWatch:true});}}>
			<ImageBackground
        style={styles.img}
        imageStyle={{ borderRadius: 15 }}
        source={{ uri: props.src }}
      >
				<View style={{flexDirection:'row',padding:2}}>
					<View style={{marginEnd:'auto'}}><Text style={[styles.typetext]}>{props.type}</Text></View>
					<Pressable onPress={removeItem} style={{marginStart:'auto'}}><Ionicons style={{backgroundColor:'#0007',borderRadius:50,margin:5}}  name="md-close" size={25} color="white"/></Pressable>
				</View>
				<Ionicons style={{position:'absolute',top:props.style.height/3,left:props.style.width/2.8,backgroundColor:'#0003',borderRadius:50}} name="play-circle-outline" size={50} color="#fff" />
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

