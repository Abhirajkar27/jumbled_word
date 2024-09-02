import React from 'react';
import './WordDisplay.css'; // Make sure to create this CSS file for styling

const WordDisplay = ({ word }) => {
  return (
    <div className="word-display">
      {word.split('').map((letter, index) => (
        <div key={index} className="letter-box">
          {letter}
        </div>
      ))}
    </div>
  );
};

export default WordDisplay;
