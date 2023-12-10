import { StatusBar } from 'expo-status-bar';
import {  ScrollView, StyleSheet, Text, View,Pressable, FlatList } from 'react-native';
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import Ionicons from '@expo/vector-icons/Ionicons';
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
import { DataBase } from './Renderer/UserDataBase';
import { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import ImgBox from './miniview/ImgBox';


const url='https://ec.netmagcdn.com:2228/hls-playback/fbb29d5d0bc81d66138fa9d978a30bf7a36af8b507380add5975366485836f3876935c90f0f4206f469a29b540cd4fb7f02f8530fff77b9768d5bbbf60857a97690fa8e07a655263ef330c1284c6e1e3e29cc3808c99bb6854c0a3f3c3edfe735985615f093d49bd772af63c40430a8e99068fdc3e6168a347ca0231cc0b2fc903239f27e8a574ff3d1b638bd49eeae4/master.m3u8';

const db = SQLite.openDatabase("db.db");
export function Button(props) {
  return (
    <Pressable style={props.containerStyle} onPress={props.onClick}>
      <Text style={props.style}>{props.title}</Text>
    </Pressable>
  );
}

export default function Homeo({navigation}) {

  async function createTable() {
    console.log('cd')
    var x= await DataBase.FEVLIST.contains('beyblade-x-18632');
    console.log('dummy',x);
  }
  function openandplay(){
    IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: data.sources[0].url,
      type: 'video/*',
  }).then((r)=>{console.log(r.resultCode)}).catch((e)=>{console.log('ERROR',e)});
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"External lunch"}
        onClick={() => {
          Linking.openURL('www.google.com');
        }}
      /> */}
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"setup Db"}
        onClick={()=>{DataBase.setUpDatabase()}}
      />

      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"create table"}
        onClick={createTable}
      />
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"Drop table"}
        onClick={()=>{DataBase.dropDB();}}
      />
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"clean table"}
        onClick={()=>{DataBase.FEVLIST.cleanTable();}}
      />
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"show fevlist table"}
        onClick={async ()=>{console.log(await DataBase.FEVLIST.getFevList())}}
      />
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"update watchhistory table"}
        onClick={async ()=>{console.log(await DataBase.WATCHHISTORY.updatePlay({"AniId": "151970", "episode_id": "107278", "id": "/watch/shangri-la-frontier-18567?ep=107278", "isFiller": false, "number": 1, "title": "What Do You Play Games For?"}))}}
      />
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={" get watchhistory"}
        onClick={async ()=>{console.log(await DataBase.WATCHHISTORY.getPlaybackData(97940).catch((err)=>console.log(err)))}}
      />
      <Button
        containerStyle={styles.btn}
        style={styles.text}
        title={"show watchhistory"}
        onClick={async ()=>{console.log(await DataBase.WATCHHISTORY.getWatchHistory())}}
      />

      <View>
      {/* <FlatList
          contentContainerStyle={{ paddingHorizontal: 5 }}
          data={require('./assets/popular.json')}
          numColumns={2}
          renderItem={({ item }) => (
            <ImgBox
              id={item.id}
              src={item.img}
              name={item.Name}
              type={item.type}
            />
          )}
        /> */}
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    flexDirection:'row',
    flexWrap:'wrap',
    backgroundColor: '#003',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn:{
    margin:10,
    padding:10,
    backgroundColor:'#08f'
  },
  text:{
    color:'#fff',
    fontWeight:'800',
  }
});
