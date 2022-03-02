import React from "react";
import { StyleSheet, View } from "react-native";

const Circle = () => {
  return <View style={styles.circle} />;
};

const styles = StyleSheet.create({
  circle: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: "white",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Circle;
