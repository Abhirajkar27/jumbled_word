import React from 'react';

const JumbledLetters = ({ letters, onClickLetter }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      {letters.map((letter, index) => (
        <button
          key={index}
          onClick={() => onClickLetter(index)}
          style={{
            backgroundColor: 'brown',
            color: 'white',
            border: 'none',
            margin: '5px',
            padding: '10px',
            fontSize: '18px',
            cursor: 'pointer',
            visibility: letter ? 'visible' : 'hidden'  // Hide the letter after it has been used
          }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default JumbledLetters;
