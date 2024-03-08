import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  RefreshControl,
  SafeAreaView,
  Pressable,
  FlatList,
} from "react-native";
import ImgBox from "./miniview/ImgBox";
import { useEffect, useState } from "react";
import { scrapePages, getPaths, scrapeSlider, allscraper } from "./Renderer/ZoroHome";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { StackActions } from '@react-navigation/native';
import LastPlayed from "./miniview/LastPlayed";
import { DataBase } from "./Renderer/UserDataBase";
import { useIsFocused, useNavigation } from "@react-navigation/native";



const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("screen").width;


export default function Home({ navigation, route }) {
  const [Movies, setMovies] = useState();
  const [lastPlayed, setLastPlayed] = useState();
  const [popular, setpopular] = useState();
  const [recent, setrecent] = useState();
  const [airing, setairing] = useState();
  const [slider, setSlider] = useState();
  const [refresh, setRefresh] = useState(false);
  const paths = getPaths();

  async function loadData(refresh=false) {
    try{
      if(refresh){
        setRefresh(true);
        setSlider(await scrapeSlider());
        const homedata= await allscraper();
        setrecent(homedata?.['recently-updated']);
        setpopular(homedata?.['most-popular']);
        setairing(homedata?.['top-airing']);
        setMovies(homedata?.['movie']);
      }else{
        const { data } = route.params;
        setSlider(data?.slider);
        setrecent(data?.data?.['recently-updated']);
        setpopular(data?.data?.['most-popular']);
        setairing(data?.data?.['top-airing']);
        setMovies(data?.data?.['movie']);
      }
      await loadLastPlayed();
    }catch(e){ console.log('Error in loadData '+refresh)}
    setRefresh(false);
  }
  async function loadLastPlayed(){
    setLastPlayed(await DataBase.WATCHHISTORY.getWatchHistory());
  }

  function Sliderview(o){
    return (
    <ImageBackground
      style={[styles.imgBox]}
      source={{ uri: o.src }}>
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#000019", "#00001950", "#00001930", "#00001950", "#000019"]}
            style={{ flex: 1 }}>
              <View style={{ marginTop: "auto" }}>
                <Text numberOfLines={1} style={{fontSize: 20,fontWeight: "bold",color: "#fff",width: "80%",marginStart: 20,}}>
                  {o.name}
                </Text>
                <Text style={{fontSize: 13,fontWeight: "600",marginStart: 20,color: "#fff",alignSelf:'baseline',padding:2,marginVertical:10,borderRadius:3}}>
                  {o.type+"         "+o.date}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={[styles.btnStyle,{backgroundColor:'#d22'}]}
                    onPress={() => {
                      navigation.navigate("Details", { id: o.id,data:o });
                    }}>
                    <AntDesign name="playcircleo"size={20}  color="white"/>
                    <Text style={styles.btnText}>Watch</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </LinearGradient>
        </View>
    </ImageBackground>
  )};

  useEffect(() => {
    StackActions.pop();
    loadData();
  }, []);

  useEffect(()=>{
    loadLastPlayed();
  },[useIsFocused()])
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <StatusBar
        animated={true}
        backgroundColor="#00001955"
        barStyle="light-content" //'default', 'dark-content', 'light-content'
      />
      <ScrollView
        style={[styles.container,{backgroundColor:'#000019'}]}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={()=>loadData(true)} colors={['#f44','#2f4','#42f']} progressBackgroundColor={'#000'} progressViewOffset={20}/>
        }
      >
        <View>
          <ScrollView
            style={[styles.imgBox]}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
          >
            {slider ? slider?.map((o, i) => {
              return (
                <Sliderview 
                key={i}
                id={o.id}
                type={o.type}
                name={o.name}
                date={o.date}
                src={o.src} />
              );
            }):<></>}
          </ScrollView>
        </View>
        {lastPlayed && lastPlayed.length>0?<Text style={styles.headings}>Continue Watching</Text>:null}
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={lastPlayed}
          renderItem={({ item }) => (
            <LastPlayed
              style={{ width: screenWidth / 2.8, height: screenHeight / 6 }}
              id={item.animeId}
              src={item.src}
              name={item.name}
              type={item.type}
              LastPlayedRemoved={loadLastPlayed}
            />
          )}
          horizontal={true}
        />
        {recent ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headings}>Recent Releases</Text>
            <Pressable
              onPress={() => {
                navigation.navigate("More", {
                  title: "Recent Releases",
                  path: paths.recently_updated,
                });
              }}
            >
              <Text style={styles.more}>See all</Text>
            </Pressable>
          </View>
        ) : (
          <></>
        )}
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={recent}
          renderItem={({ item }) => (
            <ImgBox
              id={item.id}
              src={item.img}
              name={item.Name}
              type={item.type}
            />
          )}
          horizontal={true}
        />
        {popular ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headings}>Popular Anime</Text>
            <Pressable
              onPress={() => {
                navigation.navigate("More", {
                  title: "Popular Anime",
                  path: paths.most_popular,
                });
              }}
            >
              <Text style={styles.more}>See all</Text>
            </Pressable>
          </View>
        ) : (
          <></>
        )}
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={popular}
          renderItem={({ item }) => (
            <ImgBox
              id={item.id}
              src={item.img}
              name={item.Name}
              type={item.type}
            />
          )}
          horizontal={true}
        />
        {airing ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headings}>Top Airing</Text>
            <Pressable
              onPress={() => {
                navigation.navigate("More", {
                  title: "Top Airing",
                  path: paths.top_airing,
                });
              }}
            >
              <Text style={styles.more}>See all</Text>
            </Pressable>
          </View>
        ) : (
          <></>
        )}
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={airing}
          renderItem={({ item }) => (
            <ImgBox
              id={item.id}
              src={item.img}
              name={item.Name}
              type={item.type}
            />
          )}
          horizontal={true}
        />
        {Movies ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headings}>Movies</Text>
            <Pressable
              onPress={() => {
                navigation.navigate("More", {
                  title: "Movies",
                  path: paths.movie,
                });
              }}
            >
              <Text style={styles.more}>See all</Text>
            </Pressable>
          </View>
        ) : (
          <></>
        )}
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={Movies}
          renderItem={({ item }) => (
            <ImgBox
              id={item.id}
              src={item.img}
              name={item.Name}
              type={item.type}
            />
          )}
          horizontal={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor:'#000',
  },
  headings: {
    flex: 1,
    padding: 10,
    fontWeight: "600",
    fontSize: 18,
    textAlign: "left",
    color: "#fff",
    paddingStart: 20,
  },
  more: {
    flex: 1,
    marginEnd: 10,
    fontWeight: "600",
    color: "#f22",
    textAlign: "right",
    textAlignVertical: "center",
    marginEnd: 15,
  },
  imgBox: {
    height: 300,
    width: screenWidth,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "600",
    paddingHorizontal: 5,
    color: "#FFF",
  },
  btnStyle: {
    marginStart: 20,
    marginTop: "auto",
    marginBottom: 20,
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f22",
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
});
