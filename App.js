import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Player from "./Player";
import Home from "./Home";
import Homeo from "./Homeo";
import Details_page from "./Details_page";
import Search_page from "./Search_page";
import Header from "./miniview/Header";
import Fev from "./Fev";
import More_page from "./More_page";
import VideoPlayer from "./VideoPlayer";
import { Pressable } from "react-native";
import SearchButton from "./miniview/SearchButton";
import FilterPage from "./FilterPage";
import SplashScreen from "./SplashScreen";
import TestView from "./Renderer/TestView";
import Fevbtn from "./miniview/Fevbtn";
import ProfileScreen from "./ProfileScreen";
import Home3 from "./Home3";
import LoadExtra from "./Screens/LoadExtra";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Root"
          component={Home3}
          options={{ headerShown: false, animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false, animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="LoadExtra"
          component={LoadExtra}
          options={{ headerShown: false, animation: "slide_from_bottom",presentation:'containedTransparentModal' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTransparent: true,
            headerTitle: () => <Header name="Home"/>,
            headerStyle: {
              height: 120,
            },
            headerBackVisible: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="Search_page"
          component={Search_page}
          options={{
            title: "Search_page",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="Details"
          component={Details_page}
          options={({ route }) => ({
            title: "",
            headerTransparent: true,
            headerTintColor: "#fff",
            animation: "slide_from_right",
            headerRight: () => <Fevbtn data={route.params.data}/>,
          })}
        />
        <Stack.Screen
          name="Player"
          component={Player}
          options={{ title: "Player", headerShown: false, animation: "fade" }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile", headerTransparent: true, headerTintColor: "#fff", animation: "slide_from_left" }}
        />
        <Stack.Screen
          name="fev"
          component={Fev}
          options={{
            title: "Favourite",
            headerStyle: { backgroundColor: "#003" },
            animation: "slide_from_right",
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#FFF", fontWeight: "bold" },
            headerRight: () => <SearchButton />,
          }}
        />
        <Stack.Screen
          name="More"
          component={More_page}
          options={({ route }) => ({
            title: route.params.title,
            headerStyle: { backgroundColor: "#003" },
            animation: "slide_from_right",
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#FFF", fontWeight: "bold" },
            headerRight: () => <SearchButton />,
          })}
        />
        <Stack.Screen
          name="Filter"
          component={FilterPage}
          options={{
            headerStyle: { backgroundColor: "#003" },
            animation: "slide_from_right",
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#FFF", fontWeight: "bold" },
            headerRight: () => <SearchButton />,
          }}
        />
        <Stack.Screen
          name="Homeo"
          component={Homeo}
          options={{
            title: "Testing Home",
            headerStyle: { backgroundColor: "#005" },
            headerTitleStyle: {
              color: "#FFF",
              fontWeight: "bold",
              fontSize: 25,
            },
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="Test"
          component={TestView}
          options={{
            title: "Testing",
            headerStyle: { backgroundColor: "#005" },
            headerTitleStyle: {
              color: "#FFF",
              fontWeight: "bold",
              fontSize: 25,
            },
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
      <StatusBar translucent style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002",
    alignItems: "center",
    justifyContent: "center",
  },
});
