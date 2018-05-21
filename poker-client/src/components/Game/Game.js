import React from 'react';
import './Game.css';
import GameButton from './GameButton/GameButton';
import Popup from 'react-popup';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.ipcRenderer = ipcRenderer;
    this.state = {
      table: props.location.state.table,
    };
    this.leaveGame = this.leaveGame.bind(this);
  }

  leaveGame() {
    Popup.alert('I am alert, nice to meet you');
    this.ipcRenderer.send('leave-game');
  }

  render() {
    return (
      <div className="Game">
        <Popup />
        <GameButton name="Leave" onClick={this.leaveGame} />
      </div>
    );
  }
}

export default Game;
