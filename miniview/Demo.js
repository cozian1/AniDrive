import { StyleSheet, Text, View } from "react-native";

export default function Demo(props) {
  return(
    <View style={{width:100,height:40,backgroundColor:'#f00',borderRadius:10,justifyContent:'center',marginHorizontal:10}}>
      <Text style={[textstyle.white,{fontSize:20,textAlign:'center'}]}>{props.lang}</Text>
    </View>
  )
};
const textstyle=StyleSheet.create({
  white:{
    textAlignVertical:'center',
    color:'#FFF',
    fontWeight:'bold',
  },
});