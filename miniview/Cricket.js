import { View } from "react-native";
import { Text } from "react-native";
import { Image } from "react-native";

export default function Cricket(props) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Image style={{}} source={require("../assets/cricket.png")} />
      <Text style={{ fontWeight: "500", color: "#Fff", fontSize: 15 }}>
        Nothing But Crickets
      </Text>
    </View>
  );
}
