import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";

import bg from "./assets/bg.jpeg";
import Colors from "./constants/Colors";
import Circle from "./components/Circle";
import Cross from "./components/Cross";

export default function App() {
  const [gameMap, setGameMap] = useState([
    ["o", "", ""],
    ["", "x", "x"],
    ["o", "", ""],
  ]);

  const cellPressHandler = (rowIndex, colIndex) => {
    if (gameMap[rowIndex][colIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <View style={styles.map}>
          {gameMap.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Pressable
                  key={colIndex}
                  style={styles.cell}
                  onPress={() => cellPressHandler(rowIndex, colIndex)}
                >
                  {cell === "o" && <Circle />}
                  {cell === "x" && <Cross />}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg,
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  map: {
    width: "80%",
    aspectRatio: 1,
    // borderWidth: 1,
    // borderColor: "white",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    width: 100,
    height: 100,
    flex: 1,
    // borderColor: "red",
    // borderWidth: 2,
  },
});
