import React from 'react';
import './Game.css';

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

  render() {
    return (
      <div className="Game">
        <h3>Game</h3>
      </div>
    );
  }
}

export default Game;
