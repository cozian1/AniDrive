import { useEffect } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";

export default function FilterPage({ navigation, route }) {
  useEffect(() => {}, []);
  return(
    <View style={style.container}>
      <View style={style.scrollBase}>
        <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
          <Text></Text>
        </ScrollView>
      </View>
      <View style={style.submitBase}>
        <View style={{flex:1}}></View>
        <View style={{flex:2.5}}></View>
      </View>
    </View>
  );
}
const style=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#002",
  },scrollBase:{
    flex:9,
    paddingHorizontal:20,
  },submitBase:{
    flex:1.3,
    backgroundColor:'#002',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    overflow:'hidden',
    borderColor:'#fff4',
    borderBottomWidth:0,
    borderWidth:2,
  },
})