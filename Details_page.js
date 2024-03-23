import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImgBox from "./miniview/ImgBox";
import { getAnimeInfo, getadditionals } from "./Renderer/ZoroHome";
import { LinearGradient } from "expo-linear-gradient";
import EpisodeView from "./miniview/EpisodeView";
import EpisodeViewLine from "./miniview/EpisodeViewLine";
import { Modal } from "react-native";
import { BallIndicator } from "react-native-indicators";
import { pullserver } from "./Renderer/demo";
import { FontAwesome,Entypo,Octicons,Ionicons,Fontisto } from '@expo/vector-icons';
import ImageButton from "./miniview/ImageButton";
import { DataBase } from "./Renderer/UserDataBase";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

let AnimeDetails=null;
export default function Details_page({ navigation, route }) {
  const [Details, setDetails] = useState()//require("./assets/zom.json"));
  const [more, setmore] = useState();
  const [currentview, setcurrentview] = useState(true);
  const [storyView, setStoryView] = useState(false);
  const [watchView, setWatchView] = useState(true);
  
  

  function formating(Data) {
    let patch = [];
    if (Data.Premiered != undefined)
      patch.push({ key: "Premiered ", value: Data.Premiered });
    if (Data.Status != undefined)
      patch.push({ key: "Status ", value: Data.Status });
    if (Data.Aired != undefined)
      patch.push({ key: "Aired ", value: Data.Aired });
    if (Data.Studios != undefined)
      patch.push({ key: "Studios ", value: Data.Studios[0] });
    if (Data.Duration != undefined)
      patch.push({ key: "Duration ", value: Data.Duration });
    if (Data.totalEpisodes != undefined)
      patch.push({ key: "Episodes ", value: Data.totalEpisodes });

    setmore(patch);
  }
  async function load() {
    console.log(route.params.id);
    try{
      const Data = await getAnimeInfo(route.params.id);
      AnimeDetails=Data;
      route.params.isWatch?watchClick():null;
      setDetails(Data);
      formating(Data);
      //let cat=await pullserver(Data.episodes[0].episode_id);
    }catch(e){
      console.warn('Error in calling getAnimeInfo');
    }
    
  }
  async function LunchPlayer(index,time=0) {
    route.params.isWatch?null:await DataBase.WATCHHISTORY.addRecord(AnimeDetails?.episodes[index],route.params.data).catch((err)=>{console.log(err)});

    navigation.navigate('Player', {Episodes:AnimeDetails?.episodes,index:index,title:AnimeDetails?.title,playbackTime:time});
  }
  async function watchClick() {
    let lastplayed=await DataBase.WATCHHISTORY.getPlaybackData(AnimeDetails?.alID).catch((err)=>{console.log(err)});
    console.log(lastplayed);
    if(lastplayed.length==0){
      LunchPlayer(0);
    }else{
      LunchPlayer(lastplayed[0].episodeNumber-1,lastplayed[0].playbackTime);
    }
  }

  useEffect(() => {
    load();
  }, []);

  let infoView = (
    <ScrollView
      style={{
        backgroundColor: "#002",
        flex: 1,
        width: screenWidth,
      }}
    >
      <View style={{padding:20}}>
      {/* <Pressable style={styles.watchbtn}  onPress={()=>LunchPlayer(0)}>
        <Text style={textstyle.watch}>Watch</Text>
      </Pressable> */}
      <View
        style={{
          width: "100%",
          paddingVertical: 10,
          backgroundColor: "#fff2",
          borderRadius: 10,
          paddingHorizontal: 10,
        }}
      >
        {more?.map((o)=>{return(
          <View key={o.key} style={{ flexDirection: "row", paddingBottom: 10 }}>
            <Text style={[styles.text,{flex: 1,textAlign: "left",fontWeight: "bold",},]}>
              {o.key}
            </Text>
            <Text style={[styles.text,{ flex: 2, textAlign: "right", color: "#f59" },]}>
              {o.value}
            </Text>
          </View>
          )})}
      </View>
      <Text style={[styles.text,styles.labelText]}>Genres</Text>
      <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
        {Details?.Genres.map((o, i) => (
          <Pressable key={i} onPress={(()=>{
            navigation.push("More", {
            title: o,
            path: '/genre/'+o,
          });})}><Text style={[styles.text,styles.labelBox,]}>
            {o}
          </Text></Pressable>
        ))}
      </View>
      
      <Text style={[styles.text,styles.labelText]}>Story</Text>
      <Pressable onPress={()=>setStoryView(!storyView)}>
        <Text style={[styles.text, { fontWeight: "200",marginTop:10},storyView?{height:'auto'}:{maxHeight:150}]}>
          {Details?.description}
        </Text>
      </Pressable>
      {Details?.Relation.length!=0?
      <Text style={[styles.text,styles.labelText,{paddingBottom:10}]}>Relation</Text>:<></>}
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{justifyContent:'center'}}
        data={Details?.Relation}
        renderItem={({item})=> 
        <Pressable style={[styles.labelBox,{padding:0,width:150},item.id==route.params.id?{borderColor:'#FFF'}:{borderColor:'#002'}]} onPress={(()=>{item.id!=route.params.id ? navigation.push("Details", {id:item.id,data:{id:item.id,name:item.title,src:item.src}}):null})}>
          <ImageBackground blurRadius={1} style={{width:'100%',height:70}} source={{uri: item.src}}>
          <Text style={[styles.text,styles.relationText]}>
          {item.name}
          </Text>
          </ImageBackground>
        </Pressable>}
        horizontal={true}
      />
      <Text style={[styles.text,styles.labelText]}>
        Recomendation
      </Text>
      </View>
      <FlatList
        contentContainerStyle={{paddingHorizontal:15}}
        data={Details?.Recomendation}
        renderItem={({item})=> <ImgBox id={item.id} src={item.img} name={item.name} type={item.type} />}
        horizontal={true}
      />
      <Text style={{ marginBottom: 10 }} />
    </ScrollView>
  );
  let episodeView = (
    <View style={{ flex: 1, width: screenWidth,alignItems:'center' }}>
      <View style={{flexDirection:'row', margin: 7,paddingHorizontal:10,width:'100%'}}>
        <Text style={[styles.text, { fontWeight: "500",textAlignVertical:'center'}]}>Episodes</Text>
        <Pressable style={{marginLeft:'auto'}} onPress={()=>setWatchView(true)}><Entypo  name="list" size={35} color={watchView?"red":'white'} /></Pressable>
        <Pressable style={{marginLeft:5}} onPress={()=>setWatchView(false)}><Entypo  name="grid" size={35} color={watchView?"white":'red'} /></Pressable>
      </View>
      {watchView?
      <FlatList  
        showsVerticalScrollIndicator={false}    
        contentContainerStyle={{alignItems:'center',width:'100%'}}
        data={Details?.episodes}
        renderItem={({ item,index }) => (
          <EpisodeViewLine
            Episodes={Details.episodes}
            title={Details.title}
            img={item?.img}
            index={index}
            lunchPlayer={LunchPlayer}
          />
        )}
      />
      :
      <View style={{flex:1}}>
      <FlatList
        showsVerticalScrollIndicator={false}    
        contentContainerStyle={{paddingBottom:100}}
        data={Details?.episodes}
        numColumns={5}
        renderItem={({ item,index }) => (
          <EpisodeView
            Episodes={Details.episodes}
            index={index}
            lunchPlayer={LunchPlayer}
          />
        )}
      /></View>}
    </View>
  );
    
    return (
      <View style={styles.container}>
        <StatusBar translucent style="auto" />
        <Modal visible={Details} transparent={true} onRequestClose={()=>navigation.goBack()}>
          <View style={{flex:1,backgroundColor:'#000E',justifyContent:'center'}}>
          <View style={{height:100,padding:30}}><BallIndicator size={50} count={8} color="#f00"/></View>
          </View>
        </Modal>
        <View style={{ flex: 5.2 }}>
          <ImageBackground
            style={{ height: (screenHeight * 3) / 8 }}
            source={{ uri: Details?.image.extraLarge }}>
            
            <LinearGradient style={{ flex: 1 }} colors={["#002","#0024","#0027", "#002"]}>
              <View style={{ flexDirection: "row", marginTop: "auto" }}>
                <View style={{ margin: 10 }}>
                  <View style={{ width: 120, height: 180, marginStart: 10 }}>
                    <ImageBackground
                      style={{ width: "100%", height: "100%" }}
                      imageStyle={{ borderRadius: 15 }}
                      source={{ uri: Details?.image.large }}
                    ></ImageBackground>
                  </View>
                </View>
                <View style={{ marginTop: "auto", marginStart: 10 }}>
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 20, width: screenWidth / 2 },
                    ]}
                  >
                    {Details?.title}
                  </Text>
                  <Text style={[styles.text, { marginTop: 10 }]}>
                    {"Status: " + Details?.Status}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.text,textstyle.MAL_Score,]}>
                      {Details?.MAL_Score}
                    </Text>
                    <Text style={[styles.text, { marginTop: "auto" }]}>/10</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          <View style={{flexDirection:'row',justifyContent:'center',paddingTop:5}}>
            <ImageButton Btnstyle={{width:screenWidth/2.5,backgroundColor:'#f23',marginEnd:20}} icon={<Ionicons name="play-outline" size={25} color="white" />} title={"Watch"} onPress={watchClick}/>
            <ImageButton Btnstyle={{width:screenWidth/2.5,backgroundColor:'#fff2'}} icon={currentview?<Entypo name="list" size={25} color="white" />:<Entypo name="houzz" size={25} color="white"/>} title={currentview?"Episodes":"Details"} onPress={()=>{setcurrentview(!currentview)}}/>
          </View>
        </View>
        <View style={{ flex: 7 }}>
          {currentview ? infoView : episodeView}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    overflow: "hidden",
    backgroundColor: "#002",
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
  },
  labelText:{
    marginTop: 20, marginBottom: 5, fontSize: 17 
  },
  labelBox:{
    marginEnd: 5,
    marginVertical: 2,
    backgroundColor: "#fff3",
    borderWidth:2,
    overflow:'hidden',
    padding: 8,
    borderRadius: 10,
    textAlignVertical:'center',
    textAlign:'center'
  },
  relationText:{
    height:70,textAlignVertical:'center',textAlign:'center',backgroundColor:'#0004',paddingHorizontal:3
  },
  box: {
    height: 30,
    width: 50,
    margin: 5,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#fff2",
  },
  floating: {
    resizeMode: "contain",
    flexDirection: "row",
    paddingHorizontal:5,
    backgroundColor: "#f22",
    borderRadius: 10,
    position: "absolute",
    width: 'auto',
    minWidth:100,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 50,
  },
  watchbtn:{
    width:'100%',
    borderRadius:7,
    borderWidth:1,
    borderColor:'red',
    backgroundColor:'#fff2',
    marginBottom:20
  }
});
const textstyle=StyleSheet.create({
  MAL_Score:{
    fontSize: 20,
    width: screenWidth / 2,
    color: "#f22",
    textAlign: "right",
  },
  watch:{
    fontWeight:'600',
    textAlign:'center',
    padding:7,
    color:'#fff',
    fontSize:20
  }
})
