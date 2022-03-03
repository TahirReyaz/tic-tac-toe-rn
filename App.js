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

const copyArray = (original) => {
  const copy = JSON.parse(JSON.stringify(original));
  return copy;
};

export default function App() {
  const [gameMap, setGameMap] = useState(initialMap);
  const [currentTurn, setCurrentTurn] = useState("x");
  const [gameMode, setGameMode] = useState("BOT_MEDIUM");

  useEffect(() => {
    if (currentTurn === "o" && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [currentTurn, botTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(gameMap);
    if (winner) {
      gameOver(winner);
    } else {
      checkTie();
    }
  }, [gameMap]);

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
  };

  const botTurn = () => {
    // Get all available positions
    const availableCells = [];
    let selectedCell;
    gameMap.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          availableCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (gameMode === "BOT_MEDIUM") {
      // Attac
      // Check possible cells for player to win
      availableCells.forEach((availableCell) => {
        const mapCopy = copyArray(gameMap);
        mapCopy[availableCell.row][availableCell.col] = "o";

        const winner = getWinner(mapCopy);
        if (winner === "o") {
          // Attac that cell
          selectedCell = availableCell;
        }
      });

      // Defend if no cell is available for attac
      if (!selectedCell) {
        // Check possible cells for player to win
        availableCells.forEach((availableCell) => {
          const mapCopy = copyArray(gameMap);
          mapCopy[availableCell.row][availableCell.col] = "x";

          const winner = getWinner(mapCopy);
          if (winner === "x") {
            // Defend that cell
            selectedCell = availableCell;
          }
        });
      }
    }
    // Select a random position
    if (!selectedCell) {
      selectedCell =
        availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    if (selectedCell) cellPressHandler(selectedCell.row, selectedCell.col);
  };

  const getWinner = (mapToCheck) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const didXWonRow = mapToCheck[i].every((cell) => cell === "x");
      const didOWonRow = mapToCheck[i].every((cell) => cell === "o");

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
        if (mapToCheck[j][i] !== "x") didXWonCol = false;
        if (mapToCheck[j][i] !== "o") didOWonCol = false;
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
      if (mapToCheck[i][i] !== "x") {
        didXWonLeftDiagonal = false;
      }
      if (mapToCheck[i][i] !== "o") {
        didOWonLeftDiagonal = false;
      }

      // Right Diagonal
      if (mapToCheck[i][2 - i] !== "x") {
        didXWonRightDiagonal = false;
      }
      if (mapToCheck[i][2 - i] !== "o") {
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
    let title = "Hooray!!",
      msg = `Player ${player.toUpperCase()} won`;
    if (gameMode !== "LOCAL") {
      if (player === "x") {
        title += " You won";
        msg = `Defeated the ${
          gameMode === "BOT_EASY" ? "Easy bot" : "Medium bot"
        }🔥`;
      } else {
        title = "Try Harder💪";
        msg = `You lost to the ${
          gameMode === "BOT_EASY" ? "Easy bot" : "Medium bot"
        }🙁`;
      }
    }
    Alert.alert(title, msg, [{ text: "New Game", onPress: resetGame }]);
  };

  const resetGame = () => {
    const updatedMap = copyArray(initialMap);
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

        <View style={styles.buttonContainer}>
          <Text
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "LOCAL" ? Colors.btnActiveBg : Colors.btnBg,
              },
            ]}
            onPress={() => setGameMode("LOCAL")}
          >
            LOCAL
          </Text>
          <Text
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? Colors.btnActiveBg : Colors.btnBg,
              },
            ]}
            onPress={() => setGameMode("BOT_EASY")}
          >
            EASY BOT
          </Text>
          <Text
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_MEDIUM" ? Colors.btnActiveBg : Colors.btnBg,
              },
            ]}
            onPress={() => setGameMode("BOT_MEDIUM")}
          >
            MEDIUM BOT
          </Text>
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

  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  button: {
    color: "white",
    fontSize: 18,
    margin: 10,
    backgroundColor: Colors.btnBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
