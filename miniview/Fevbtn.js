import { Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useState , useEffect } from "react";
import { DataBase } from "../Renderer/UserDataBase";

export default function Fevbtn(props) {
    const [fev,setfev]=useState(false);

    async function ToogleFev() {
      await DataBase.FEVLIST.updateFev(!fev,props.data).then((res)=>setfev(!fev));
    }
    useEffect(() => {
      load=async()=>{
        await DataBase.FEVLIST.contains(props.data.id).then((res)=>setfev(res));
      }
      load();
    }, [])

    return (
      <Pressable
        style={{}}
        onPress={ToogleFev}>
          <AntDesign name={fev?'heart':'hearto'} size={30} color={fev?'red':'white'} />
        </Pressable>
    );
};
