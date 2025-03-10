import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import "../global.css";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/(auth)/welcome");
    }, 2000);
  }, []);
  return (
    <View
      className={"bg-clair w-full h-full flex-1 items-center justify-center"}
    >
      <Image
        source={require("../assets/images/icon.png")}
        alt={"icon"}
        className={"w-full h-1/3"}
      ></Image>
    </View>
  );
};

export default index;
