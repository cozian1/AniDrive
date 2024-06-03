import {  StyleSheet,  Text,  View,  ScrollView,  Dimensions,  ImageBackground,  Image,  TouchableOpacity,  StatusBar,  ActivityIndicator,  Modal,  RefreshControl,  SafeAreaView,  Pressable,  FlatList, Animated,} from "react-native";
import ImgBox from "../miniview/ImgBox";
import { useEffect, useState } from "react";
import {  scrapePages,  getPaths,  scrapeSlider,  allscraper,} from "../Renderer/ZoroHome";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import LastPlayed from "../miniview/LastPlayed";
import { DataBase } from "../Renderer/UserDataBase";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import LineActivityIndicator from "../miniview/LineActivityIndicator";
import TextBar from "../miniview/TextBar";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const colcount=Math.abs(screenWidth/120);
let modalData={
  path:'',
  header:''
},pvpage=1,crpage=1;

export default function AnimeHome(props) {
  const [refresh, setRefresh] = useState(false);
  const [lastPlayed, setLastPlayed] = useState();
  const [catalog,setCatalog]=useState({});
  const [paths,setPaths]=useState({});
  const [modalVisible,setModalVisible]=useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [modalDataList,setModalDataList]=useState([]);

  async function loadData(refresh = false) {
    try {
      setRefresh(true);
      const homedata = await allscraper();
      //console.log(homedata);
      homedata.set=true;
      setCatalog(homedata);
      await loadLastPlayed();
      setPaths(getPaths());
    } catch (e) {
      console.log("Error in loadData " + e);
    }
    setRefresh(false);
  }
  async function loadLastPlayed() {
    setLastPlayed(await DataBase.WATCHHISTORY.getWatchHistory());
  }
  function lunchMore(path){
    console.log('got clicked');
    // modalData={
    //   path:path,
    //   header:path?.replaceAll(/[-/]/g,' '),
    // }
    // console.log(modalData.header);
    // setModalDataList(catalog[modalData.path.replaceAll('/','')]);
    // setModalVisible(true);
    props.navigation.push('LoadExtra',{path:path,data:catalog[path.replaceAll('/','')]});
  }
  function closeModal() {
    setModalVisible(false);
    setModalDataList([]);
    crpage=pvpage=1;
  }
  async function fetchNextPage() {

    console.log(pvpage+'called me'+crpage);
    if(pvpage==crpage){
      crpage++;
      let data=await scrapePages(modalData.path,crpage);
      console.log('got data for'+crpage);
      setModalDataList([...modalDataList,...data]);
      pvpage=crpage;
    }
  }

  // const handleScroll = (event) => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   console.log('offset:',offsetY);
  //   console.log('margin:',modalMargin);
  //   scrollY.setValue(offsetY);
  // };
  // const handleScroll = (event) => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   if (offsetY === 0) {
  //     setMarginEnabled(true);
  //   } else if (marginEnabled) {
  //     setMarginEnabled(false);
  //   }
  //   if (marginEnabled) {
  //     scrollY.setValue(offsetY);
  //   }
  // };
  // const modalMargin = scrollY.interpolate({
  //   inputRange: [0, screenHeight/3], // Adjust 100 based on your preference
  //   outputRange: [screenHeight/3, 0],
  //   extrapolate: 'clamp',
  // });

  useEffect(() => {
    StackActions.pop();
    if(!catalog.set) loadData();
  }, []);

  useEffect(() => {
    loadLastPlayed();
  }, [useIsFocused()]);

  return (
    <View style={{backgroundColor:'#000',paddingTop:60}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
          <View style={{backgroundColor:'#000',marginBottom:20}}>
            <TextBar icon={'down'} title={modalData.header.trim()} onPress={closeModal}/>
            {crpage!=pvpage?<LineActivityIndicator/>:null}
            <FlatList
              contentContainerStyle={{alignSelf:'center',paddingBottom:50}}
              data={modalDataList}
              numColumns={3}
              key={3}
              onEndReached={fetchNextPage}
              onEndReachedThreshold={0.8}
              renderItem={({ item }) => (
                <ImgBox
                  style={styles.modalBox}
                  id={item.id}
                  src={item.img}
                  name={item.Name}
                  type={item.type}
                  fev={true}
                />
              )}
            />
          </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{...styles.container }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => loadData(true)} colors={["#f44", "#2f4", "#42f"]} progressBackgroundColor={"#000"} progressViewOffset={20}/>
        }>
        {!catalog.set?<LineActivityIndicator/>:null}
        {lastPlayed && lastPlayed.length > 0 ? (<Text style={styles.headings}>Continue Watching</Text>) : null}
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
        {Object.values(paths).map(path => <View key={path}>
          {catalog[path.replaceAll('/','')] && catalog[path.replaceAll('/','')].length > 0 ? (
          <TextBar icon={'right'} title={path.replaceAll(/[-/]/g,' ')} onPress={()=>{lunchMore(path)}}/>
          ):null}
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 15,flexGrow:1 }}
            data={catalog[path.replaceAll('/','')]}
            renderItem={({ item }) => (
              <ImgBox
                style={styles.imgBox}
                id={item.id}
                src={item.img}
                name={item.Name}
                type={item.type}
              />
            )}
            horizontal={true}
          />
        </View>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#100'
  },
  headings: {
    padding: 10,
    fontWeight: "600",
    fontSize: 18,
    textAlign: "left",
    color: "#fff",
    marginVertical:5,
    paddingStart: 20,
  },
  more: {
    padding: 10,
    paddingHorizontal:20,
    marginVertical:5,
  },
  imgBox: {
    borderRadius:10,
    marginEnd:15,
    height:screenHeight/4.5,
    width:screenWidth/3
  },
  modalBox: {
    marginVertical:7,
    borderRadius:10,
    width:screenWidth/3-10,
    height:(screenWidth/3-5)*1.5
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
