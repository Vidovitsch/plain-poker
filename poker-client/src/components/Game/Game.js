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
  }

  setTable(table) {
    this.setState({
      table,
    });
  }

  leaveGame() {
    // this.ipcRenderer.send('leave-game');
    // this.ipcRenderer.on('lobby-reply', (e, data) => {
    //   this.setState({
    //     tableItems: data,
    //   });
    // });
  }

  render() {
    return (
      <div className="Game">
        <GameButton name="Leave" onClick={this.leaveGame} />
      </div>
    );
  }
}

export default Game;
