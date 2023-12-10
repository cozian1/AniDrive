import { StyleSheet, Text, View } from "react-native";

export default function StatPic(params) {
  const data=params.data;
  return (
  <View>
    <Text>data.name</Text>
  </View>
  );
}

const styles=StyleSheet.create({
  container:{
    width:70,
    height:40,
    justifyContent:'center'
  },text:{
    color:'#FFF',
    fontWeight:'bold',
    textAlign:'center'
  }
})
