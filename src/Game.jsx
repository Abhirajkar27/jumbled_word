import React, { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "./context";
import WordDisplay from "./WordDisplay";

const Game = () => {
  const { level, words, guesses, setGuesses, checkWord, isGameComplete } =
    useContext(GameContext);
  const [colors, setColors] = useState(
    words.map((word) => Array(word.length).fill("white"))
  );
  const [jumbledWords, setJumbledWords] = useState([]);
  const inputRefs = useRef(words.map((word) => Array(word.length).fill(null)));

  const jumbleWord = (word) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  useEffect(() => {
    // Generate jumbled words for the current level once
    setJumbledWords(words.map((word) => jumbleWord(word)));
    // Reset colors to white when changing levels
    setColors(words.map((word) => Array(word.length).fill("white")));
  }, [level]);

  const handleInputChange = (wordIndex, letterIndex, value) => {
    let updatedGuesses = [...guesses];
    updatedGuesses[wordIndex][letterIndex] = value.toUpperCase();
    setGuesses(updatedGuesses);

    // Recalculate colors for all words
    let updatedColors = [...colors];

    updatedGuesses.forEach((currentGuess, idx) => {
      if (
        !currentGuess.includes("") &&
        currentGuess.every((letter) => letter !== "")
      ) {
        const guessedWord = currentGuess.join("");
        if (checkWord(guessedWord, idx)) {
          updatedColors[idx] = Array(currentGuess.length).fill("blue");
        } else {
          updatedColors[idx] = currentGuess.map((letter, i) =>
            guessedWord[i] === words[idx][i] ? "green" : "red"
          );
        }
      } else {
        updatedColors[idx] = currentGuess.map(
          (letter, i) => (!letter ? "white" : colors[idx][i]) // keep existing color for filled letters
        );
      }
    });

    setColors(updatedColors);

    if (value) {
      // Move to the next input box if the current one is filled
      if (
        inputRefs.current[wordIndex] &&
        inputRefs.current[wordIndex][letterIndex + 1]
      ) {
        inputRefs.current[wordIndex][letterIndex + 1].focus();
      }
    } else {
      // Move to the previous input box if backspacing
      if (
        letterIndex > 0 &&
        inputRefs.current[wordIndex] &&
        inputRefs.current[wordIndex][letterIndex - 1]
      ) {
        inputRefs.current[wordIndex][letterIndex - 1].focus();
      }
    }
  };

  useEffect(() => {
    guesses.forEach((currentGuess, wordIndex) => {
      if (
        !currentGuess.includes("") &&
        currentGuess.every((letter) => letter !== "")
      ) {
        const guessedWord = currentGuess.join("");
        if (checkWord(guessedWord, wordIndex)) {
          let updatedColors = [...colors];
          updatedColors[wordIndex] = Array(currentGuess.length).fill("blue");
          setColors(updatedColors);
        } else {
          let updatedColors = [...colors];
          updatedColors[wordIndex] = currentGuess.map((letter, index) =>
            guessedWord[index] === words[wordIndex][index] ? "green" : "red"
          );
          setColors(updatedColors);
        }
      }
    });
  }, [guesses]);

  return (
    <div>
      <h2>Level {level}</h2>
      {guesses.map((currentGuess, wordIndex) => (
        <div key={wordIndex} style={{ marginBottom: "20px" }}>
          <div style={{ marginTop: "10px" }}>
            {currentGuess.map((letter, letterIndex) => (
              <input
                key={letterIndex}
                type="text"
                maxLength="1"
                value={letter}
                readOnly
                ref={(el) => (inputRefs.current[wordIndex][letterIndex] = el)}
                onChange={(e) =>
                  handleInputChange(wordIndex, letterIndex, e.target.value)
                }
                style={{
                  backgroundColor: colors[wordIndex][letterIndex],
                  width: "30px",
                  height: "30px",
                  textAlign: "center",
                  margin: "0 2px",
                }}
              />
            ))}
          </div>
          <div>
            <WordDisplay word={jumbledWords[wordIndex]} />
          </div>
        </div>
      ))}
      {isGameComplete && <p>Congratulations! You've completed the game!</p>}
    </div>
  );
};

export default Game;
