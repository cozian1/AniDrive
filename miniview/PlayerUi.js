import { StyleSheet, Text, View } from 'react-native';

export default function PlayerUi({navigation, route}) {
  return (
    <View style={styles.container}>
      <Text>{route.params.name} is In Fev screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
