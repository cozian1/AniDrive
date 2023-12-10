import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";


const screenWidth = Dimensions.get("window").width;

export default function Header(props) {
  const Navigation=useNavigation();
  return (
    <View style={{ justifyContent: "center", marginStart:-15,}}>      
      <View
        style={{
          width: screenWidth,
          flexDirection: "row",
          height: 50,
          marginVertical: 20,
          padding: 5,
          paddingHorizontal:30
        }}
      >
        <Pressable onPress={()=>{Navigation.navigate('Profile')}}>
          <Image
            style={{ width: 35, height: 35, borderRadius: 5 }}
            source={require("../assets/icon-orange.png")}
          />
        </Pressable>
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            width: "90%",
          }}
        >
          <Pressable onPress={()=>{Navigation.navigate('Search_page', {search:'bow'})}}>
            <Image
              style={{
                width: 25,
                height: 25,
                marginVertical: 5,
                marginEnd: 20,
              }}
              resizeMode="cover"
              source={require("../assets/search.png")}
            />
          </Pressable>
          <Pressable onPress={()=>{Navigation.navigate('fev', {name:'bow'})}}>
            <Image
              style={{ width: 35, height: 35 }}
              source={require("../assets/list.png")}
            />
          </Pressable>
        </View>
        
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
