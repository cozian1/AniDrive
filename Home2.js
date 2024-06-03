import React, { useState } from 'react';
import { Animated, ScrollView,StyleSheet, Text, View } from 'react-native';
import ImgBox from './miniview/ImgBox';
import ItemBox from './miniview/ItemBox';

export default function Home2({navigation}) {
    const [scrollY] = useState(new Animated.Value(0));
    const Data= require('./assets/recent.json');

  // Function to handle scroll events
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  // Calculate the header's opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 400], // Adjust 100 based on your preference
    outputRange: [-400, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1,marginTop:60 }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          marginTop: headerOpacity,
          zIndex: 2,
          // Add other styles as needed for your header
        }}
      >
        {/* Your header content */}
        <Text style={{ fontSize: 20, textAlign: 'center', padding: 10,marginTop:25 }}>
          Header
        </Text>
      </Animated.View>
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Your scrollable content */}
        {Data?.map((o, i) => (
                <ItemBox key={i} id={o.animeId} src={o.animeImg} name={o.animeTitle} type={o.subOrDub}/>
            ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    box:{
      margin:5,
      width:170,
      height:213
    },
  });