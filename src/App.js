import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { GameProvider } from './context/context';

const App = () => (
  <GameProvider>
    <Game />
  </GameProvider>
);

export default App;
