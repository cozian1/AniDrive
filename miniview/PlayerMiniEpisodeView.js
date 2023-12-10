import { StyleSheet,Text,View,Pressable } from "react-native";

export default function PlayerMiniEpisodeView(props) {
	const episode=props.data;
  return (
    <View>
      <Pressable style={[styles.container,props.style]} onPress={()=>props.callback(episode.number-1)}>
				<Text numberOfLines={1} style={[styles.text]}>{episode.number}</Text>
			</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#aaf4",
    width: 50,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    margin: 4,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: 400,
    fontSize: 15,
  },
});
