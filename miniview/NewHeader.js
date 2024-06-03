import { Dimensions, StyleSheet, View } from "react-native";
import { Image, SearchBar } from "react-native-elements";

const screenWidth = Dimensions.get("window").width;

export default function NewHeader(props) {
  return (
    <View style={styles.container}>
      <Image 
        style={{ width: 45, height: 45, borderRadius: 40,}} 
        source={require("../assets/icon.png")}
      />
      <View style={{alignItems:'flex-end',flex:1}}>
        <SearchBar 
          inputContainerStyle={{height:40,}} 
          containerStyle={{padding:0,borderRadius:12,overflow:'hidden',width:'95%'}}
          placeholder="Search Anime"
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
    minHeight:60,
    paddingHorizontal:10,
    marginTop:25,
    backgroundColor:'#111',
  },
});
  