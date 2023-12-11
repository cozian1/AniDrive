import { useEffect, useState } from "react";
import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { getEpisodeData, getStreams } from "../Renderer/ZoroHome";
import * as IntentLauncher from "expo-intent-launcher";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialIndicator } from "react-native-indicators";
import { Downloader } from "../Renderer/DownloadHandler";

const scrwidth=Dimensions.get('screen').width;
export default function EpisodeViewLine(props) {
  const Episodes=props.Episodes;
  const CurrentEpisode=Episodes[props.index];
  const [status,setStatus]=useState(false);

  async function downloader() {
    setStatus(true);
    Downloader.addItem(CurrentEpisode.episode_id,CurrentEpisode,props.title);
    const intervalId=setInterval(() => {
      if(!Downloader.isProcessing(CurrentEpisode.episode_id)){
        clearInterval(intervalId);
        setStatus(false);
      }
    }, 500);
  }

  useEffect(() => {}, []);
  return (
    <View style={styles.box}>
      <Pressable style={styles.details} onPress={()=>props.lunchPlayer(props.index)}>
        <ImageBackground blurRadius={5} source={{uri : props.img}} style={{flex:1}}>
            <View style={styles.inner1}>
                <Image source={{uri:props.img}} style={styles.innerimg}/>
                <Text numberOfLines={3} style={[styles.text,styles.title]}>{CurrentEpisode.title}</Text>
            </View>
            <Text style={styles.epno}>{CurrentEpisode.number}</Text>
        </ImageBackground>
      </Pressable>
      <Pressable style={styles.download} onPress={()=>!status? downloader() : null}>
        {
          status ?
            <MaterialIndicator size={30} count={8} color="#fff"/> :
            <MaterialIcons style={{alignSelf:'center'}} name="file-download" size={30} color="#fff" />
        }
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#FFF",
    fontWeight: "bold",
  },
  box: {
    height:Dimensions.get('window').height/10, 
    width: '85%',
    borderRadius: 15,
    justifyContent:'center',
    overflow:'hidden',
    backgroundColor:'#fff',
    marginVertical:10,
    flexDirection:'row'
  },
  details:{
    width:'80%',
    height:'100%',
  },
  download:{
    flex:1,
    height:'100%',
    backgroundColor:'#333',
    justifyContent:'center',
  },
  inner1:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#0004',
    paddingVertical:10
  },
  title:{
    marginTop:'auto',
    width:scrwidth/3
  },
  epno:{
    position:'absolute',
    backgroundColor:'#FFF',
    paddingHorizontal:5,
    fontSize:20,
    fontWeight:'bold',
    borderBottomRightRadius:10
  },
  innerimg:{
    width:100,
    height:'100%',
    marginHorizontal:10,
    borderRadius:10
  }
});
