import { StyleSheet, Text, View } from 'react-native';
import { parseSrt } from "../Renderer/SubtitleParser";
import { useEffect } from 'react';
import { useState } from 'react';

export default function SubtitleView({ source, currentTime, containerStyle = {}, textStyle = {}, }) {
  const [Subtitle,setSubtitle]=useState();
  const [text, setText] = useState('');

  async function LoadSub() {
    let s=await parseSrt(source.url).catch((err)=>console.log('Subtile Processing Error: ',err));
    setSubtitle(s);
  }

  useEffect(()=>{
    LoadSub();
  },[source.url]);

  useEffect(()=>{
    if (Subtitle) {
      let start = 0;
      let end = Subtitle.length - 1;
      while (start <= end) {
          const mid = Math.floor((start + end) / 2);
          const sub = Subtitle[mid] || {
              start: 0,
              end: 0,
              part: '',
          };
          if (currentTime >= sub.start && currentTime <= sub.end) {
              setText(sub.part);
              return;
          }
          else if (currentTime < sub.start) {
              end = mid - 1;
          }
          else {
              start = mid + 1;
          }
      }
      return setText('');
    }
    
  },[currentTime,Subtitle])
  return (
    <View style={[styles.container,containerStyle]}>
      <Text style={[styles.text,textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text:{
    fontSize:15,
    textShadowColor: '#000',
    textShadowRadius: 10,
    color:'#fff',
    fontWeight:'400',
    alignSelf:'center',
    marginTop:'auto',
    textAlign:'center'
  }
});
