import { Pressable, StyleSheet } from "react-native";
import React from "react";

import Circle from "./Circle";
import Cross from "./Cross";

const Cell = (props) => {
  return (
    <Pressable style={styles.cell} onPress={() => props.onPress()}>
      {props.cell === "o" && <Circle />}
      {props.cell === "x" && <Cross />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    flex: 1,
  },
});

export default Cell;
