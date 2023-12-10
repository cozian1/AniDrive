import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { AntDesign,Entypo,EvilIcons,Feather,FontAwesome,FontAwesome5,Fontisto,Foundation,Ionicons,MaterialCommunityIcons,MaterialIcons,Octicons,SimpleLineIcons,Zocial } from '@expo/vector-icons';
import { StyleSheet } from "react-native";
import { Text } from "react-native";

export default function ImageButton(props) {
  return (
    <View style={[{justifyContent:'center',alignItems:'center',textAlign:'center'},props.Containerstyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.btnbox,props.Btnstyle]}
        onPress={props.onPress}>
				{props.icon}
				<Text style={[styles.text, { paddingHorizontal: 3 }]}>
					{props.title}
				</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
	btnbox: {
    flexDirection: "row",
    backgroundColor: "#fdd5",
    borderRadius: 10,
    minWidth:100,
		alignSelf:'baseline',
    alignItems: "center",
    justifyContent: "center",
		padding:7,
		paddingVertical:7,
    height:40
  },
	text: {
    color: "#FFF",
		textAlignVertical:'center',
    fontSize:16,
    fontWeight: "400",
  },
});