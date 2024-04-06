import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { ScrollView } from "react-native";
import { Button, StyleSheet, Text, View, StatusBar } from "react-native";
import ItemBox from "./miniview/ItemBox";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons,FontAwesome5 } from '@expo/vector-icons';
import { scrapeSearch } from "./Renderer/ZoroHome";
import { FlatList } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
let timeoutsearchcall;
export default function Search_page({ navigation, route }) {
  const [results, setresults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [Spinner, setSpinner] = useState(false);

  //console.log(route.params.search);

  async function load() {
    setSpinner(true);
    scrapeSearch(searchText)
      .then((res)=>{
        setresults(res);
        setSpinner(false);
      })
      .catch( (e) => {console.warn("Error in search call", e);});
  }
  useEffect(() => {
    load();
  }, [searchText]);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "height" : "padding"}
      enabled={false}
    >
      <StatusBar
        animated={true}
        backgroundColor="#002"
        barStyle="light-content" //'default', 'dark-content', 'light-content'
      />
      <View
        style={{ flex:1,flexDirection:'row',marginTop:35,alignItems:'center'}}
      >
        <SearchBar
          style={{color:'#fff'}}
          containerStyle={{ backgroundColor: "#0000", borderColor: "#0000",paddingHorizontal:10,width:screenWidth/1.3}}
          placeholder="Type Here..."
          onChangeText={(s) => {
            setSearchText(s);
          }}
          onEndEditing={load}
          enterKeyHint="search"
          round={true}
          showLoading={Spinner}
          value={searchText}
        />
        <Pressable onPress={()=>navigation.navigate("Filter")}>
          <Ionicons name="ios-filter" size={35} color="#F33" style={{height:'70%',paddingVertical:3,marginLeft:10,paddingHorizontal:5}} />
        </Pressable>
      </View>
      <View style={{width: screenWidth,flex:10,}}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={results}
          renderItem={({ item }) => (
            <ItemBox
              id={item.id}
              src={item.img}
              name={item.Name}
              type={item.type}
            />
          )}
        />
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#002',
    alignItems: "center",
    justifyContent: "center",
  },
});
