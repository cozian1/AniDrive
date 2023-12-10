import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { DataBase } from "./Renderer/UserDataBase";
import ImgBox from "./miniview/ImgBox";
import { FlatList } from "react-native";
import { BallIndicator } from "react-native-indicators";
import { Modal } from "react-native";
import Cricket from "./miniview/Cricket";
import { useIsFocused } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function Fev({ navigation, route }) {
  const [Data, setData] = useState([]);
  const [Spinner,setSpinner]=useState(true);

  useEffect(() => {
    async function load(){
      await DataBase.FEVLIST.getFevList()
      .then((res)=>{
        setSpinner(false);
        setData(res);
      })
      .catch((err)=>{console.log(err)});
    }
    load();
    console.log('called');
  }, [useIsFocused()])
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Modal visible={Spinner} transparent={true} onRequestClose={()=>navigation.goBack()}>
        <View style={{flex:1,backgroundColor:'#000E',justifyContent:'center'}}>
          <View style={{height:100,padding:30}}><BallIndicator size={50} count={8} color="#f00"/></View>
        </View>
      </Modal>
      {(Data.length==0)?<Cricket/>:<></>}
      <FlatList
        contentContainerStyle={{  }}
        data={Data}
        numColumns={2}
        renderItem={({ item }) => (
          <ImgBox
            style={{margin:10,marginVertical:10,width:screenWidth/2.4}}
            id={item.anime_id}
            src={item.src}
            name={item.name}
            type={item.type}
            fev={1}
          />
        )}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:screenWidth,
    alignItems:'center',
    flex: 1,
    backgroundColor: "#002",
    
  },
  scroll: {
    marginVertical:20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center',
  },
  box:{
    margin:5,
    width:170,
    height:213
  },
  more:{
    width:screenWidth,
    marginVertical:5
  }
});
