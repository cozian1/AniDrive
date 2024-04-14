import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { Animated,Easing,Text,View } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
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
import { allscraper, scrapeSlider } from "./Renderer/ZoroHome";
import { DataBase } from "./Renderer/UserDataBase";
import { pullserver } from "./Renderer/SourceParser";

const maxwidth=Dimensions.get("screen").width;
const maxheight=Dimensions.get("screen").height;

export default function SplashScreen({navigation,route}) {
  async function prepare() {
    await pullserver(109143);
    let Data={};
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
      try {
        DataBase.setUpDatabase();
        Data={
          slider:await scrapeSlider(),
          data: await allscraper(),
        }
        let settings=await DataBase.Settings.getSettings();
        if(settings.length==0){
          console.log('updated');
          DataBase.Settings.updateSettings('auto','sub','English','auto','sub','English');
        }
        //await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('Error in Prepair',e);
      } finally {
        navigation.replace('Home',{data:Data,name:'vat'});
      }
    }
  useEffect(() => {
    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground imageStyle={{resizeMode:'cover'}} style={{width:maxwidth,height:maxheight}} source={require('./assets/splash.png')}>
      <View style={styles.bar}><BarIndicator size={50} count={8} color="#f00"/></View>
      </ImageBackground>
    </View>
  );
}
const styles=StyleSheet.create({
  container:{
    flex: 1, alignItems: 'center',backgroundColor:'#000'
  },
  devtext:{
    color:'#fff',
    fontSize:15,
    fontWeight:'bold',
  },
  bar:{
    height:100,
    marginTop:'auto',
    marginBottom:100
  },
  
})




/*
let spinValue = new Animated.Value(0);
Animated.loop(
  Animated.sequence([
    Animated.delay(10000),
Animated.timing(
    spinValue,
  {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear, // Easing is an additional import from react-native
    useNativeDriver: true  // To make use of native driver for performance
  }
)])
).start()
const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg']
});
*/