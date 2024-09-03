import React, { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "./context";
import WordDisplay from "./WordDisplay";
import "./Game.css";

const Game = () => {
  const { level, words, guesses, setGuesses, checkWord, isGameComplete } =
    useContext(GameContext);
  const [colors, setColors] = useState(
    words.map((word) => Array(word.length).fill("#384353"))
  );
  const [jumbledWords, setJumbledWords] = useState([]);
  const inputRefs = useRef(words.map((word) => Array(word.length).fill(null)));
  const [wordIdx, setWordIdx] = useState();
  const [letterIdx, setLetterIdx] = useState();
  const initialLastFilledIndexMap = {};
  words.forEach((word, index) => {
    initialLastFilledIndexMap[index] = -1;
  });

  const [lastFilledIndexMap, setLastFilledIndexMap] = useState(
    initialLastFilledIndexMap
  );

  const jumbleWord = (word) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  function setIndexes(wordIndex, letterIndex) {
    setWordIdx(wordIndex);
    setLetterIdx(letterIndex);
  }

  function resetLastFilledIndexMap() {
    const resetMap = {};
    words.forEach((_, index) => {
      resetMap[index] = -1;
    });
    setLastFilledIndexMap(resetMap);
  }

  useEffect(() => {
    setJumbledWords(words.map((word) => jumbleWord(word)));
    setColors(words.map((word) => Array(word.length).fill("#384353")));
    setWordIdx();
    setLetterIdx();
    setTimeout(() => {
      resetLastFilledIndexMap();
    }, 100);
  }, [level]);

  function handleCustomInput(value, wordIndex) {
    if (wordIdx === undefined || letterIdx === undefined) {
      setWordIdx(wordIndex);
      setLetterIdx(0);
      handleInputChange(wordIndex, 0, value);
    } else {
      if (wordIdx === wordIndex) {
        handleInputChange(wordIdx, letterIdx, value);
      } else {
        const lastFilledIndex = lastFilledIndexMap[wordIndex] ?? -1;
        if (lastFilledIndex === words[wordIndex].length-1) {
          console.log("Word Completed!!");
          return;
        }
        const newLetterIndex = lastFilledIndex + 1;
        setWordIdx(wordIndex);
        setLetterIdx(newLetterIndex);
        handleInputChange(wordIndex, newLetterIndex, value);
      }
    }
  }

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
          updatedColors[idx] = Array(currentGuess.length).fill("#FF910E");
        } else {
          updatedColors[idx] = currentGuess.map((letter, i) =>
            guessedWord[i] === words[idx][i] ? "#00D864" : "#384353"
          );
        }
      } else {
        updatedColors[idx] = currentGuess.map(
          (letter, i) => (!letter ? "#384353" : colors[idx][i]) // keep existing color for filled letters
        );
      }
    });

    setColors(updatedColors);
    setLastFilledIndexMap((prevMap) => ({
      ...prevMap,
      [wordIndex]: letterIndex,
    }));

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
          updatedColors[wordIndex] = Array(currentGuess.length).fill("#FF910E");
          setColors(updatedColors);
        } else {
          let updatedColors = [...colors];
          updatedColors[wordIndex] = currentGuess.map((letter, index) =>
            guessedWord[index] === words[wordIndex][index] ? "#00D864" : "#384353"
          );
          setColors(updatedColors);
        }
      }
    });
  }, [guesses]);

  return (
    <div className="G6_h5Game">
      <div className="level-heading">
        <span>Level {level}</span>
      </div>
      <div className="level_word_container_G6">
        {guesses.map((currentGuess, wordIndex) => (
          <div key={wordIndex} className="guess-container">
            <div className="guess-input-container">
              {currentGuess.map((letter, letterIndex) => (
                <input
                  key={letterIndex}
                  type="text"
                  maxLength="1"
                  value={letter}
                  ref={(el) => (inputRefs.current[wordIndex][letterIndex] = el)}
                  onFocus={() => setIndexes(wordIndex, letterIndex)}
                  className="guess-input"
                  style={{ backgroundColor: colors[wordIndex][letterIndex] }}
                />
              ))}
            </div>

            <WordDisplay
              word={jumbledWords[wordIndex]}
              wordIndex={wordIndex}
              onKeyPress={handleCustomInput}
            />
          </div>
        ))}
      </div>
      {isGameComplete && (
        <p className="game-complete-message">
          Congratulations! You've completed the game!
        </p>
      )}
    </div>
  );
};

export default Game;
