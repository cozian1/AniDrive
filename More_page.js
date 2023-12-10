import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ImgBox from "./miniview/ImgBox";
import { scrapePages } from "./Renderer/ZoroHome";



const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function More_page({ navigation, route }) {
  const [Data, setData] = useState();
  const [Spinner,setSpinner]=useState(true);
  const [page,setpage]=useState(2);

  async function Load() {
    setData(await scrapePages(route.params.path));
    setSpinner(false);
  }
  async function loadMore() {
    setSpinner(true);
    let more=(await scrapePages(route.params.path,page));
    setpage(page+1);
    setData([...Data,...more]);
    setSpinner(false);

  }
  
  useEffect(() => {
    Load();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
          <View style={styles.scroll}>
            {Data?.map((o, i) => (
              <ImgBox style={styles.box} key={i} id={o.id} src={o.img} name={o.name} type={o.type} />
            ))}
            {Spinner 
              ?<ActivityIndicator style={styles.more} size="large" color="#ddd" />
              :<Pressable onPress={loadMore}><Text style={{color:'#F55'}}>Load More</Text></Pressable>
            }
          </View>
      </ScrollView>
    </View>
      
  );
}

const styles = StyleSheet.create({
  container: {
    width:screenWidth,
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
