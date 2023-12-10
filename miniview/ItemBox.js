import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { Button, StyleSheet, Text, View } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function ItemBox(props) {
  const Navigation = useNavigation();

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        Navigation.push('Details', {id: props.id,data:props});
      }}
    >
      <ImageBackground source={{ uri: props.src }} style={{ flex: 1 }}>
        <LinearGradient colors={["#0028", "#222"]} style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.insideBox}>
              <Image
                source={{ uri: props.src }}
                style={{ width: 120, height: 160, borderRadius: 20 }}
              />
            </View>
            <View
              style={{
                flex: 5,
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.type}>{props.type}</Text>
              <Text numberOfLines={3} style={styles.title}>
                {props.name}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#036",
    width: "90%",
    height: 180,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  title: {
    marginTop: "auto",
    color: "#fffe",
    width: screenWidth / 2,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  type: {
    color: "#fffe",
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 12,
    backgroundColor: "#f28",
    borderRadius: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
  },
  insideBox: {
    flex: 3,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
