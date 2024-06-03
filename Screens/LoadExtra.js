import { useEffect, useState } from "react";
import { Animated, Dimensions, FlatList, ScrollView, StyleSheet, View } from "react-native";
import TextBar from "../miniview/TextBar";
import ImgBox from "../miniview/ImgBox";
import { scrapePages } from "../Renderer/ZoroHome";
import { useRef } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
let crpage=1,pvpage=1;
export default function LoadExtra(props) {
  const [dataSet,setDataSet]=useState([]);
  const [scrollY] = useState(new Animated.Value(0));
  const flatListRef = useRef(null);
  const [scrollswitch,setscrollswitch]=useState(false);
  


  async function load() {
    setDataSet(await scrapePages('/completed'));
  }
  useEffect(() => {
    console.log(modalMargin);
  },[modalMargin]);
  useEffect(() => {
    setDataSet(props.route.params.data);
    //load();
  },[]);
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  const modalMargin = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [screenHeight/3, 1],
    extrapolate: 'clamp',
  });
  async function fetchNextPage() {
    if(pvpage==crpage){
      crpage++;
      let data=await scrapePages(props.route.params.path,crpage);
      setDataSet([...dataSet,...data]);
      pvpage=crpage;
    }
  }
  function closeModal() {
    props.navigation.pop();
  }
  return(
    <ScrollView onScroll={handleScroll} contentContainerStyle={{...styles.container}}>
      <Animated.View style={{backgroundColor:'#000',marginTop:modalMargin}}>
        <TextBar icon={'down'} title={props.route.params.path?.replaceAll(/[-/]/g,' ')} onPress={closeModal}/>
        <FlatList
              contentContainerStyle={{alignSelf:'center'}}
              data={dataSet}
              numColumns={3}
              scrollEnabled={false}
              onEndReached={fetchNextPage}
              onEndReachedThreshold={0.8}
              ref={flatListRef}
              renderItem={({ item }) => (
                <ImgBox
                  style={styles.modalBox}
                  id={item.id}
                  src={item.img}
                  name={item.Name}
                  type={item.type}
                  fev={true}
                />
              )}
            />
      </Animated.View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
    container: {
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
    },
  });
    