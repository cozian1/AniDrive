import { Pressable } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function SearchButton(params) {
  const Navigation=useNavigation();
  return (
    <Pressable
      style={{  }}
      onPress={() => Navigation.navigate("Search_page")}>
        <Feather style={{fontWeight:'bold'}} name="search" size={30} color="#FFF" />
      </Pressable>
  );
}
