import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key,value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('Unable to store ERROR:'+e);
    }
};

export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log('Unable to retrive ERROR:'+e);
    }
};