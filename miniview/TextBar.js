import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";


export default function TextBar(props) {
    return(
      <TouchableOpacity style={{flexDirection:'row'}} onPress={props.onPress}>
        <Text style={styles.headings}>{props.title}</Text>
        <AntDesign style={styles.iconStyle} name={props.icon} size={25} color="#FFF"/>
      </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
    headings: {
        flex:1,
        padding: 10,
        fontWeight: "600",
        fontSize: 18,
        textAlign: "left",
        color: "#fff",
        marginVertical:5,
        paddingStart: 20,
    },
    iconStyle:{
        alignSelf:'center',
        paddingHorizontal:10
    }
});