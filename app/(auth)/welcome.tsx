import React from "react";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import SwipeToConfirm, { Status } from "@/components/SwipeToConfirm";

const Welcome = () => {
  return (
    <View className="flex-1 overflow-hidden p-5 items-center justify-center">
      <View className="mt-10 ml-10 flex flex-col items-start gap-5">
        <View className="w-20 h-20">
          <Image
            source={require("../../assets/images/iconwhitee.png")}
            className="w-full h-full"
          />
        </View>
        <Text className="font-semibold text-3xl">
          Take Control of Your Money, {"\n"}
          One Step at a Time.
        </Text>
        <Text className="font-medium">
          Easily track expenses, manage debts, and stay in control {"\n"}
          of your finances—all in one app.
        </Text>
      </View>

      <View>
        <Image
          source={require("../../assets/images/moneyai.png")}
          style={{ width: 450, height: 450, resizeMode: "contain" }}
        />
      </View>
      <View className="w-full px-5 mt-5">
        <SwipeToConfirm
          containerStyle="bg-green-500 rounded-full p-2 h-16 flex-row items-center justify-between"
          renderSlider={(status) => (
            <View className="h-14 w-14 bg-black rounded-full flex items-center justify-center">
              {status === Status.Confirmed ? (
                <View className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                  <Text className="text-black text-xl">✔</Text>
                </View>
              ) : (
                <Image
                  source={require("../../assets/images/Piggy Bank Icon (1).png")}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: "contain",
                  }}
                />
              )}
            </View>
          )}
        >
          <View className="flex-row justify-center flex-1">
            <Text className="text-black opacity-100 text-xl mr-2">➤</Text>
            <Text className="text-black opacity-70 text-xl mr-2">➤</Text>
            <Text className="text-black opacity-40 text-xl mr-2">➤</Text>
            <Text className="text-black opacity-20 text-xl">➤</Text>
          </View>
        </SwipeToConfirm>
      </View>
    </View>
  );
};

export default Welcome;
