import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import {activateKeepAwakeAsync,deactivateKeepAwake} from 'expo-keep-awake';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons,Ionicons,MaterialIcons,AntDesign,Fontisto } from '@expo/vector-icons'; 
import { getEpisodeData, getStreams } from "./Renderer/ZoroHome";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import SubtitleView from "./miniview/subtitleView";
import { MaterialIndicator, UIActivityIndicator } from "react-native-indicators";
import { ToastAndroid } from "react-native";
import { FlatList } from "react-native";
import Modelitembox from "./miniview/Modelitembox";
import { ScrollView } from "react-native";
import EpisodeView from "./miniview/EpisodeView";
import Demo from "./miniview/Demo";
import PlayerMiniEpisodeView from "./miniview/PlayerMiniEpisodeView";
import { Downloader } from "./Renderer/DownloadHandler";
import { DataBase } from "./Renderer/UserDataBase";
import { getPlayableSources } from "./Renderer/SourceParser";

const maxwidth= Math.max(Dimensions.get("screen").width,Dimensions.get("screen").height);
const maxheight=Math.min(Dimensions.get("screen").width,Dimensions.get("screen").height);
const urlme='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
let Source, audio, currentAudio,Settings,currentQuality;

export default function Player({navigation, route}) {
  const Episodes=route.params.Episodes;
  const CurrentEpisode=Episodes[route.params.index];
  const resizemodes=[ResizeMode.CONTAIN,ResizeMode.STRETCH];
  let playtime;

  const [control,showcontrol]=useState(true);
  const [vidstatus,setvidstatus]=useState();
  const [sliderValue,setsliderValue]=useState(0);
  const [TotalDuration,setTotalDuration]=useState(1);
  const [subtitleUrl,setSubtitleUrl]=useState();
  const [CurrentUrl,setCurrentUrl]=useState();
  const [isModal,setisModal]=useState(false);
  const [isQualityModal,setisQualityModal]=useState(false);
  const [isSubtitleModal,setisSubtitleModal]=useState(false);
  const [isAudioModal,setisAudioModal]=useState(false);
  const [VidSource,setVidSource]=useState();
  const [SourceData,setSourceData]=useState();
  const [SubtitleSource,setSubtitleSource]=useState([]);
  const [resizemode,setresizemode]=useState(true);
  const [showskipbtn,setshowskiptbtn]=useState({visible:false,totime:null});


  const vid=useRef(null);
  const epiView=useRef(null);
  
  async function loadData() {
    audio=[];currentAudio='sub';Source={};
    try {
      Settings=await DataBase.Settings.getSettings().then((res)=>res.pop());
      currentAudio=Settings.playbackAudio;

      Source = await getPlayableSources(CurrentEpisode.episode_id);
      setSourceData(Source);
      if(Source.sub.length != 0) audio.push('sub');
      if(Source.dub.length != 0) audio.push('dub');
      currentAudio=Source[currentAudio].length==0?(currentAudio=='sub'?'dub':'sub'):currentAudio;
      let vidurl;
      for(let i of Source[currentAudio]){
        if(i.quality.toLowerCase()==Settings.playbackQuality.toLowerCase()){
          vidurl=i.url;
          break;
        }
      }
      if(vidurl==null){vidurl=Source[currentAudio][0].url};
      if(!vidurl){
        vidurl=Source[currentAudio][0]
      }
      setCurrentUrl(vidurl);
      for(i of Source?.subtitles){
        if(i.lang==Settings.playbackSubtitle){
          setSubtitleUrl(i.url);
          break;
        }
      }
      setSubtitleSource(Source?.subtitles);
      setVidSource(Source[currentAudio]);
    } catch (err) {
      console.log('Error in pulling source',err);
      ToastAndroid.show('Error Fetching Playable Sources', ToastAndroid.SHORT);
      navigation.goBack();
    }
  }


  const ActivityIndicator=(<View style={{height:60,padding:30}}><MaterialIndicator size={40} count={8} color="#f00"/></View>);
  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart((event) => {
      const touchX = event.absoluteX;
      let mid = Dimensions.get("screen").width / 2;
      if (touchX < mid) {
        skiptime(-10)
      }else {
        skiptime(10)
      }
    });
  const singleTap = Gesture.Tap().onStart((event) => {
    const W=maxwidth;
    const H=maxheight;
    const X = event.absoluteX;
    const Y = event.absoluteY;
    if(control){
      let a=Y>H/7 && Y<6*H/7;
      let b=X<W/2-W/5.5 || X>W/2+W/5.5 ;
      let c=Y<H/2-H/12 || Y>H/2+H/12
      if(a && (b?b:c)){
        showcontrol(false);
      }
    }else{
      showcontrol(!control);
    }
    });

  function setVideo(url) {
    playtime=vidstatus?.positionMillis;
    setsliderValue(1);
    setCurrentUrl(null);
    setTimeout(() => {
      setCurrentUrl(url);
      vid.current.setPositionAsync(playtime);
      skiptotime(playtime/1000);
    }, 200);
  }
  function loadEssentials(stat) {
    showcontrol(false);
    setvidstatus(stat);
    setTotalDuration(stat?.durationMillis);
    if(route.params.playbackTime){
      skiptotime(route.params.playbackTime/1000);
      route.params.playbackTime=null;
    }
  }
  function setStat(stat) {
    let timeinsec=stat.positionMillis/1000;
    setvidstatus(stat);
    setsliderValue(timeinsec);
    if(stat.didJustFinish){
      if(route.params.index+1<Episodes.length){
        navigation.replace('Player', {Episodes:Episodes,index:route.params.index+1});
      }else{
        ToastAndroid.show('No More Episodes', ToastAndroid.SHORT);
        navigation.goBack();
      }
    }
    if(timeinsec>Source?.intro?.start && timeinsec<Source?.intro?.end){
      setshowskiptbtn({visible:true,totime:Source.intro.end});
    }else if(timeinsec>Source?.outro?.start && timeinsec<Source?.outro?.end){
      setshowskiptbtn({visible:true,totime:Source.outro.end});
    }else{
      setshowskiptbtn({visible:false,totime:null});
    }
    if(TotalDuration>1000){
      if(stat.positionMillis){
        DataBase.WATCHHISTORY.updatePlay(CurrentEpisode,stat.positionMillis);
      }
    }
  }
  function pause_play() {
    if(vidstatus?.isPlaying){
      vid.current.pauseAsync();
      deactivateKeepAwake();
    }else{
      vid.current.playAsync()
      activateKeepAwakeAsync();
    }
  }
  function formatTime(timeInMillis) {
    if (!isNaN(timeInMillis)) {
      const totalSeconds = Math.floor(timeInMillis / 1000);
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const seconds = totalSeconds % 60;
      const hours=  Math.floor((totalSeconds / 60) / 60);
  
      return `${hours?(hours+':'):''}${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
    return "00:00";
  };
  function switchAudio(type) {
    currentAudio=type;
    let vidurl;
    setVidSource(Source[type]);
    for(let i of Source[type]){
      if(i.quality.toLowerCase()==Settings?.playbackQuality.toLowerCase()){
        vidurl=i.url;
        break;
      }
    }
    if(!vidurl){
      vidurl=Source[type][0];
    }
    setVideo(vidurl);
  }
  function lunchEpisode(id) {
    if(id!=route.params.index)
      navigation.replace('Player', {Episodes:Episodes,index:id,title:route.params.title});
  }
  function skiptime(time) {
    time*=1000;
    if(!vid) return;

    let newPosition=0;
    if(time<0){
      newPosition = Math.max(vidstatus?.positionMillis + time, 0);
    }else{
      newPosition = Math.min(vidstatus?.positionMillis + time,vidstatus?.durationMillis);
    }
    vid?.current?.setPositionAsync(newPosition);
  }
  function skiptotime(time) {
    time*=1000;
    if(!vid) return;
    vid.current.setPositionAsync(time);
  }
  function changeQuality(url) {
    for(let i of Source[currentAudio]){
      if(i.url==url){
        Settings.playbackQuality=i.quality;
        setVideo(url);
        break;
      }
    }
  }


  const QualityModal=(<View style={[styles.player,{ flexDirection:'row',justifyContent:'flex-end',position:'absolute'}]}>
    <Pressable onPress={()=> {setisQualityModal(false)}} style={{height:'100%',width:'60%',backgroundColor:'#0005'}}/>
    <View style={{height:'100%',width:'40%',backgroundColor:'#111',alignItems:'center'}}>
      <Text style={[textstyle.white,{fontSize:20,width:'80%',marginVertical:20}]}>Quality</Text>
      <FlatList
        contentContainerStyle={{alignItems:'center'}}
        data={VidSource}
        renderItem={({ item }) => (
          <Modelitembox style={[{width:maxwidth/3},item.url==CurrentUrl?{backgroundColor:'#F00'}:{}]} text={item.quality} url={item.url} callback={changeQuality} />
        )}
      />
    </View>
  </View>);
  const SubtitleModal=(<View style={[styles.player,{ flexDirection:'row',justifyContent:'flex-end',position:'absolute'}]}>
    <Pressable onPress={()=> {setisSubtitleModal(false)}} style={{height:'100%',width:'60%',backgroundColor:'#0005'}}/>
    <View style={{height:'100%',width:'40%',backgroundColor:'#111',alignItems:'center'}}>
      <Text style={[textstyle.white,{fontSize:20,width:'80%',marginVertical:20}]}>Subtitles</Text>
      <FlatList
        contentContainerStyle={{alignItems:'center'}}
        data={[{lang:'None',url:''}].concat(SubtitleSource)}
        renderItem={({ item }) => (
          <Modelitembox style={[{width:maxwidth/3},item.url==subtitleUrl?{backgroundColor:'#F00'}:{}]} text={item.lang} url={item.url} callback={setSubtitleUrl} />
        )}
      />
    </View>
  </View>);
  const AudioModal=(<View style={[styles.player,{ flexDirection:'row',justifyContent:'flex-end',position:'absolute'}]}>
    <Pressable onPress={()=> {setisAudioModal(false)}} style={{height:'100%',width:'60%',backgroundColor:'#0005'}}/>
    <View style={{height:'100%',width:'40%',backgroundColor:'#111',alignItems:'center'}}>
      <Text style={[textstyle.white,{fontSize:20,width:'80%',marginVertical:20}]}>Audio</Text>
      <FlatList      
        contentContainerStyle={{alignItems:'center'}}
        data={audio}
        renderItem={({ item }) => (
          <Modelitembox style={[{width:maxwidth/3},item==currentAudio?{backgroundColor:'#F00'}:{}]} text={item} url={item} callback={switchAudio} />
        )}
      />
    </View>
  </View>);
  const Modal=(<View style={[styles.player,{ flexDirection:'row',justifyContent:'flex-end',position:'absolute'}]}>
  <Pressable onPress={()=> {setisModal(false)}} style={{height:'100%',width:'60%',backgroundColor:'#0005'}}/>
  <View style={{height:'100%',width:'40%',backgroundColor:'#111',alignItems:'center'}}>
    <Text style={[textstyle.white,{fontSize:20,width:'80%',marginVertical:20}]}>Episodes</Text>
    <FlatList
      ref={epiView}
      getItemLayout={(data,index) => ({ length: 48, offset: 48 * index, index })}
      contentContainerStyle={{}}
      numColumns={5}
      data={Episodes}
      renderItem={({ item }) => (
        <PlayerMiniEpisodeView style={[item.number==CurrentEpisode.number?{backgroundColor:'#F00'}:{}]} data={item} callback={lunchEpisode} />
      )}
    />
  </View>
</View>);

  useEffect(()=>{
    loadData();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
    NavigationBar.setBackgroundColorAsync('#FFF0');
    activateKeepAwakeAsync();
    return () =>{
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync('visible');
      //deactivateKeepAwake();
    }
  },[])
  
  useEffect(() => {
    if(isModal && epiView!=null){
      epiView.current?.scrollToIndex({
        index: Math.max(CurrentEpisode.number/5-1,0),
        animated: true,
      });
    }
    }, [isModal])
  
  return (   
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <View style={styles.player}>
        {CurrentUrl!=null?
        <Video
          ref={vid}
          style={[styles.player,{position: "absolute" }]}
          source={{
            uri: CurrentUrl
          }}
          onLoad={(status)=>loadEssentials(status)}
          resizeMode={resizemode?ResizeMode.CONTAIN:ResizeMode.STRETCH}
          useNativeControls={false}
          shouldPlay={true}
          onPlaybackStatusUpdate={(status) => setStat(status)}
        />:<></>}
        <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={Gesture.Exclusive(doubleTap,singleTap)}>

          <Pressable style={{ flex: 1 }}>
            {subtitleUrl!=null?
              <SubtitleView 
                containerStyle={textstyle.subtitle}
                currentTime={vidstatus?.positionMillis}
                source={{url:subtitleUrl}}
                />:<></>
            }
            {control?
            <View style={{ flex: 1, backgroundColor: "#0004"}}>
              <LinearGradient style={{flex:1,paddingVertical:20,paddingHorizontal:10}} colors={['#0009','#0002','#0002','#0002','#0009']}>
              <View style={{flex:1, flexDirection: "row",marginBottom:'auto', transform:[{translateY:0}]}}>
                <View style={{justifyContent:'flex-start',flex:1,flexDirection:'row',alignSelf:'baseline'}}>
                  <Pressable onPress={()=>{navigation.goBack()}} ><Ionicons name="arrow-back" size={35} color="#eee" /></Pressable>
                  <Text style={[textstyle.white,{padding:10,textAlignVertical:'top'}]}>{'Episode: '+CurrentEpisode.number+'  ( '+CurrentEpisode.title+' )'}</Text>
                </View>
                <View style={{justifyContent:'flex-end',flex:1,flexDirection:'row',paddingEnd:10,alignSelf:'baseline',alignItems:'center'}}>
                  <Pressable style={{marginEnd:15}} onPress={()=> setisAudioModal(true)} ><MaterialIcons name="audiotrack" size={28} color="#fff" /></Pressable>
                  <Pressable style={{marginEnd:15}} onPress={()=> setisSubtitleModal(true)} ><MaterialIcons name="subtitles" size={28} color="#fff" /></Pressable>
                  <Pressable style={{marginEnd:15}} onPress={()=> setisQualityModal(true)} ><MaterialIcons name="high-quality" size={28} color="#fff" /></Pressable>
                  <Pressable style={{marginEnd:15}} onPress={()=> setisModal(true)} ><Fontisto name="play-list"  size={22} color="#FFF" /></Pressable>
                </View>
              </View>
              <View style={{flex:1, flexDirection: "row",justifyContent:'center',alignItems:'center'}}>
                <Pressable style={{paddingHorizontal:10,marginHorizontal:20}} onPress={()=>skiptime(-10)} ><MaterialCommunityIcons name="rewind-10" size={50} color="#FFFa" /></Pressable>
                {(vidstatus?.isLoaded && vidstatus?.playableDurationMillis > vidstatus?.positionMillis) ?
                <Pressable style={{paddingHorizontal:10,marginHorizontal:40}} onPress={pause_play} ><MaterialIcons name={vidstatus?.isPlaying?"pause":"play-arrow"} size={50} color="#FFF" /></Pressable>:
                  ActivityIndicator}
                <Pressable style={{paddingHorizontal:10,marginHorizontal:20}} onPress={()=>skiptime(10)} ><MaterialCommunityIcons name="fast-forward-10" size={50} color="#FFFa" /></Pressable>
              </View>
              <View style={{flex:1,marginTop:'auto',overflow:'visible'}}>
              {showskipbtn.visible?
              <Pressable style={{backgroundColor:'#f204',borderRadius:10,alignSelf:'baseline',marginLeft:'auto',marginRight:'3%'}} onPress={()=>skiptotime(showskipbtn.totime)}><Text style={[textstyle.white,{paddingHorizontal:30,paddingVertical:12}]}>Skip OP/ED</Text></Pressable>:<></>}
              <View style={{ flexDirection: "row", paddingHorizontal: 15,marginTop:'auto',width:maxwidth-20,justifyContent:'center'}}>
                <Text style={[textstyle.white]}>{formatTime(sliderValue * 1000)}</Text>
                <View style={{width: "88%",paddingHorizontal: 10}}>
                  <Slider
                    maximumValue={TotalDuration / 1000}
                    minimumValue={0}
                    animateTransitions={true}
                    minimumTrackTintColor="#d33"
                    thumbStyle={iosStyles.thumb}
                    trackStyle={iosStyles.track}
                    value={sliderValue}
                    onValueChange={(o) => {
                      vid?.current?.setPositionAsync(o * 1000);
                      setsliderValue(o);
                    }}
                  />
                </View>
                <Text style={[textstyle.white]}>{formatTime(vidstatus?.durationMillis)}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Pressable style={{marginHorizontal:25,padding:0}} onPress={()=>Downloader.Download(route.params.title,CurrentEpisode?.number,CurrentUrl,subtitleUrl)}><MaterialIcons name="file-download" size={24} color="white" /></Pressable>
                <Pressable style={{marginHorizontal:25,padding:0,marginStart:'auto'}} onPress={()=>setresizemode(!resizemode)}><MaterialCommunityIcons name="stretch-to-page-outline" size={24} color="white" /></Pressable>
              </View>
              </View>
              </LinearGradient>
            </View>:
            <></>}
          </Pressable>
        </GestureDetector>
        </GestureHandlerRootView>
      </View>
      {isModal?Modal:null}
      {isQualityModal?QualityModal:null}
      {isSubtitleModal?SubtitleModal:null}
      {isAudioModal?AudioModal:null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  player:{
    width:maxwidth,
    height:maxheight
  }
});
const textstyle=StyleSheet.create({
  white:{
    textAlignVertical:'center',
    color:'#FFF',
    fontWeight:'bold',
  },
  floatleft:{
    alignSelf:'flex-start',
    textAlign:'left',
    padding:5
  },
  floatright:{
    alignSelf:'flex-end',
    textAlign:'right'
  },
  subtitle:{
    width:Math.max(maxwidth,maxheight),
    justifyContent: 'center',
    position:'absolute',
    bottom:30,
  }
})
const iosStyles = StyleSheet.create({
  thumb: {
      backgroundColor: '#f22',
      borderRadius: 20,
      height: 20,
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.35,
      shadowRadius: 2,
      width: 20,
  },
  track: {
      borderRadius: 1,
      height: 2,
      backgroundColor:'#D335'
  },
});