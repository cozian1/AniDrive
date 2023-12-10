import { StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

export default function Modelitembox(props) {
  return (
    <View>
      <Pressable style={[styles.container,props.style,props.current==props.url?{backgroundColor:'#f33'}:{}]} onPress={()=>props.callback(props.url)}>
				<Text numberOfLines={1} style={[styles.text]}>{props.text}</Text>
			</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#aaf4",
		width:'80%',
		height:40,
    borderRadius:10,
    justifyContent:'center',
    paddingHorizontal:30,
    marginVertical:7
  },
  text:{
		color:'#fff',
		textAlign:'center',
		textAlignVertical:'center',
    fontWeight:'400',
		fontSize:20,
	}
});
