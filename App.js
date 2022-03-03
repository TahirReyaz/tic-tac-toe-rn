import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";

import bg from "./assets/bg.jpeg";
import Colors from "./constants/Colors";
import Cell from "./src/components/Cell";

const initialMap = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export default function App() {
  const [gameMap, setGameMap] = useState(initialMap);
  const [currentTurn, setCurrentTurn] = useState("x");

  useEffect(() => {
    if (currentTurn === "o") {
      botTurn();
    }
  }, [currentTurn, botTurn]);

  const cellPressHandler = (rowIndex, colIndex) => {
    if (gameMap[rowIndex][colIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setGameMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][colIndex] = currentTurn;
      return updatedMap;
    });
    setCurrentTurn((prevTurn) => (prevTurn === "x" ? "o" : "x"));

    const winner = getWinner();
    if (winner) {
      gameOver(winner);
    } else {
      checkTie();
    }
  };

  const botTurn = () => {
    // Get all available positions
    const availableCells = [];
    gameMap.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          availableCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    // Select a random position
    const selectedCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    if (selectedCell) cellPressHandler(selectedCell.row, selectedCell.col);
  };

  const getWinner = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const didXWonRow = gameMap[i].every((cell) => cell === "x");
      const didOWonRow = gameMap[i].every((cell) => cell === "o");

      if (didOWonRow) {
        return "o";
      } else if (didXWonRow) {
        return "x";
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      let didXWonCol = true;
      let didOWonCol = true;

      for (let j = 0; j < 3; j++) {
        if (gameMap[j][i] !== "x") didXWonCol = false;
        if (gameMap[j][i] !== "o") didOWonCol = false;
      }

      if (didOWonCol) {
        return "o";
      } else if (didXWonCol) {
        return "x";
      }
    }

    // Check diagonals
    let didXWonLeftDiagonal = true;
    let didOWonLeftDiagonal = true;
    let didXWonRightDiagonal = true;
    let didOWonRightDiagonal = true;

    for (let i = 0; i < 3; i++) {
      // Left Diagonal
      if (gameMap[i][i] !== "x") {
        didXWonLeftDiagonal = false;
      }
      if (gameMap[i][i] !== "o") {
        didOWonLeftDiagonal = false;
      }

      // Right Diagonal
      if (gameMap[i][2 - i] !== "x") {
        didXWonRightDiagonal = false;
      }
      if (gameMap[i][2 - i] !== "o") {
        didOWonRightDiagonal = false;
      }
    }
    // declare diagonal winner
    if (didOWonRightDiagonal || didOWonLeftDiagonal) {
      return "o";
    } else if (didXWonRightDiagonal || didXWonLeftDiagonal) {
      return "x";
    }
  };

  const checkTie = () => {
    let tie = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameMap[i][j] === "") tie = false;
      }
    }
    if (tie) {
      Alert.alert("Meh", "It was a Tie", [
        { text: "Restart", onPress: resetGame },
      ]);
    }
  };

  const gameOver = (player) => {
    Alert.alert("Hooray!!", `${player} won`, [
      { text: "Restart", onPress: resetGame },
    ]);
  };

  const resetGame = () => {
    setGameMap([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setCurrentTurn("x");
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <Text style={styles.topText}>
          Current Turn: {currentTurn.toUpperCase()}
        </Text>
        <View style={styles.map}>
          {gameMap.map((row, rowIndex) => (
            <View style={styles.row} key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={`row-${rowIndex}-col-${colIndex}`}
                  cell={cell}
                  onPress={() => cellPressHandler(rowIndex, colIndex)}
                />
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
  topText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    top: 50,
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
});
