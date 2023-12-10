import { StatusBar } from "expo-status-bar";
import { ResizeMode,Video } from 'expo-av';
import { useState,useRef } from "react";
import {StyleSheet, Text, View , Dimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import {activateKeepAwakeAsync,deactivateKeepAwake} from 'expo-keep-awake';
import { useEffect } from "react";

const maxwidth=Dimensions.get("screen").width;
const maxheight=Dimensions.get("screen").height;

export default function VideoPlayer({ navigation, route }) {
  const [stat,setStat]=useState();
  const vid=useRef(null);


  useEffect(()=>{
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
    activateKeepAwakeAsync();
    return () =>{
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync('visible');
      deactivateKeepAwake();
    }
  },[])
  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <Video
          ref={vid}
          style={[styles.player,{position: "absolute" }]}
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'//'https://ec.netmagcdn.com:2228/hls-playback/8748119a394c2ea0b619a87570c45f6f86a67f9f2ee3b01fbd62451c6d92ed23aeffe4989fe31b9cedda27755ee8b2bc9e965d466f8489911499c6125decc45ece80390f375b43083d5d0a3979cf03db2d51a23cd05892caf50c46dbd4f495a85d3932221f634ff6ab2f547a56a909674cd27445f9a5d9248d20886ceee193f9abeb1063093a74262b0c4a00dd0003b3/index-f3-v1-a1.m3u8'//'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'//data.sources[0].url,
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          shouldPlay={true}
          onPlaybackStatusUpdate={(status) => setStat(status)}
        />
        <Text style={textstyle.white}>{stat?.positionMillis/1000}</Text>
      <StatusBar style="auto" />
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
    width:Math.max(maxheight,maxwidth),
    height:Math.min(maxheight,maxwidth)
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
    backgroundColor:'#000'
  }
})
const iosStyles = StyleSheet.create({
  thumb: {
      backgroundColor: '#f82',
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
      backgroundColor:'#f825'
  },
});
