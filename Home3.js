import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import Home2 from './Home2';
import { Text } from 'react-native-elements';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import Home from './Home';
import AnimeHome from './Screens/AnimeHome';
import Details_page from './Details_page';
import Fevbtn from './miniview/Fevbtn';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from './miniview/Header';
import NewHeader from './miniview/NewHeader';

const Tab = createBottomTabNavigator();


export default function Home3() {
  return (
      <Tab.Navigator initialRouteName='Anime'
        sceneContainerStyle={styles.container}
        screenOptions={(props) => ({
          tabBarShowLabel:false,
          tabBarActiveTintColor:'#f00',
          tabBarStyle:(styles.barStyle),
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (props.route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (props.route.name === 'Anime') {
              iconName = focused ? 'person' : 'person-outline';
            }
            // You can return any component that you like here!
            //return <Ionicons name={iconName} size={size} color={color} />;
            return <Text style={{fontSize:20,color:color,fontWeight:'800'}}>{props.route.name}</Text>
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Discover"
          component={Home2}
          options={{
            header:(props)=><NewHeader {...props}/>,
            tabBarButton:(props)=><Pressable {...props} style={{top:-30,height:60,backgroundColor:'#fff',borderRadius:45,padding:5}}><AntDesign name="find" size={50} color="red" /></Pressable>,
            tabBarLabel: 'cat',
          }}
        />
        <Tab.Screen
          name="Anime"
          component={AnimeHome}
          options={({ route }) => ({
            header:(props)=><NewHeader {...props}/>,
            headerShown:true,
          })}
        />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  barStyle:{
    backgroundColor:'#102',
    marginHorizontal:70,
    height:50,
    marginBottom:30,
    position:'absolute',
    borderRadius:25,
    borderBlockColor:'#000'
  }

});
