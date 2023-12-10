import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { DataBase } from "../Renderer/UserDataBase";
import { useEffect } from "react";


export default function ImgBox(props) {
  const [fev, setfev] = useState(false);
  const Navigation=useNavigation();

  async function ToogleFev() {
    await DataBase.FEVLIST.updateFev(!fev,props).then((res)=>{setfev(!fev)});
  }
  useEffect(() => {
    load=async()=>{
      await DataBase.FEVLIST.contains(props.id).then((res)=>setfev(res)).catch((err)=>{console.log(err)});
    }
    load();
  }, [useIsFocused()])
  
  return (
    <Pressable style={[styles.box,props.style]} onPress={()=>{Navigation.push('Details', {id: props.id,data:props});}}>
      <ImageBackground
        style={styles.img}
        imageStyle={{ borderRadius: 15 }}
        source={{ uri: props.src }}
      >
        <View style={{ flexDirection: "row" }}>
          {props.type ? (
            <Text
              style={styles.typetext}
            >
              {props.type}
            </Text>
            ) : (
              <></>
            )}
            {!props.fev?
            <TouchableOpacity
              onPress={ToogleFev}
              style={{ marginLeft: "auto" }}
            >
              <AntDesign name={fev?"heart":'hearto'} size={25} color={fev?"#d22":'#fff'} style={{margin:8}}/>
            </TouchableOpacity>:<></>}
          </View>
        
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 140,
    height: 180,
    backgroundColor: "#000",
    borderRadius: 15,
    margin: 5,
  },
  img: {
    width: "100%",
    height: "100%",
  },
  typetext:{
    color: "#FFF",
    fontWeight: "600",
    fontSize: 10,
    backgroundColor: "#d22",
    margin: 10,
    borderRadius: 3,
    padding:3,
    paddingHorizontal: 4,
    alignSelf:'baseline'
  }
});
