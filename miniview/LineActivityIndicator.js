import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function LineActivityIndicator() {
  const animation = new Animated.Value(0); // Animation value

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000, // Adjust duration as needed
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start(); // Start the animation loop
    return () => {
      console.log('unmounting');
      loop.stop();
    };
  }, []);


  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth], // Adjust the distance of movement
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.line, { transform: [{ translateX }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth:0,
    height: 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  line: {
    flex:1,
    backgroundColor: '#F45', // Adjust color of the line
  },
});