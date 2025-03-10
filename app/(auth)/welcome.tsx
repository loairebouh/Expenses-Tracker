import React from "react";
import { View, Text, Image } from "react-native";

const welcome = () => {
  return (
    <View>
      <Image
        source={require("../.././assets/images/iconwhitee.png")}
        alt="welcome"
        className={""}
      />
      <Text>hello</Text>
    </View>
  );
};

export default welcome;
