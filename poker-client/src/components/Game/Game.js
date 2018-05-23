import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './Game.css';
import GameButton from './GameButton/GameButton';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class Game extends React.Component {
  static confirm(title, message, callback) {
    confirmAlert({
      title,
      message,
      buttons: [
        {
          label: 'Yes',
          onClick: () => callback(true),
        },
        {
          label: 'No',
          onClick: () => callback(false),
        },
      ],
    });
  }

  constructor(props) {
    super(props);
    this.ipcRenderer = ipcRenderer;
    this.state = {
      table: props.location.state.table,
    };
    this.leaveGame = this.leaveGame.bind(this);
  }

  leaveGame() {
    Game.confirm('Are you sure?', 'Leaving will cause to lose your current bet!', (isConfirmed) => {
      if (isConfirmed) {
        this.ipcRenderer.send('leave-game-request', this.state.table.location);
        this.ipcRenderer.on('leave-game-reply', (e, replyData) => {
          this.goToLobbyView();
        });
      }
    });
  }

  goToLobbyView() {
    this.props.history.push({ // eslint-disable-line
      pathname: '/',
    });
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
