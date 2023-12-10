import { index } from "cheerio/lib/api/traversing";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EpisodeView(props) {

  const CurrentEpisode=props.Episodes[props.index];

  return (
    <Pressable
      style={styles.container}
      onPress={() => {props.lunchPlayer(props.index)}}>
      <Text style={styles.text}>
        {CurrentEpisode.number}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4ad5",
    width: 60,
    height: 40,
    borderRadius: 7,
    justifyContent: "center",
    margin:2,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight:'600',
    fontSize: 18,

  },
});
