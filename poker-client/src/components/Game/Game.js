import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './Game.css';
import GameButton from './GameButton/GameButton';
import GameConsole from './GameConsole/GameConsole';

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
      table: {},
    };
    this.leave = this.leave.bind(this);
    this.start = this.start.bind(this);
    this.ready = this.ready.bind(this);
    this.check = this.check.bind(this);
    this.call = this.call.bind(this);
    this.bet = this.bet.bind(this);
    this.raise = this.raise.bind(this);
    this.fold = this.fold.bind(this);
  }

  leave() {
    Game.confirm('Are you sure?', 'Leaving will cause to lose your current bet!', (isConfirmed) => {
      if (isConfirmed) {
        this.ipcRenderer.send('leave-request', this.state.table.location);
        this.ipcRenderer.on('leave-reply', () => {
          this.goToLobbyView();
        });
      }
    });
  }

  start() {
    this.ipcRenderer.send('start-request', this.state.table.location);
    this.ipcRenderer.on('leave-game-reply', () => {
    });
  }

  ready() {
    this.ipcRenderer.send('ready-request', this.state.table.location);
    this.ipcRenderer.on('leave-game-reply', () => {
    });
  }

  check() {
    this.ipcRenderer.send('check-request', this.state.table.location);
    this.ipcRenderer.on('check-reply', () => {
    });
  }

  call() {
    this.ipcRenderer.send('call-request', this.state.table.location);
    this.ipcRenderer.on('call-reply', () => {
    });
  }

  bet(amount) {
    this.ipcRenderer.send('bet-request', { location: this.state.table.location, amount });
    this.ipcRenderer.on('bet-reply', () => {
    });
  }

  raise(amount) {
    this.ipcRenderer.send('raise-request', { location: this.state.table.location, amount });
    this.ipcRenderer.on('raise-reply', () => {
    });
  }

  fold() {
    this.ipcRenderer.send('fold-request', this.state.table.location);
    this.ipcRenderer.on('fold-reply', () => {
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
        <GameButton name="Leave" onClick={this.leave} />
        <GameConsole
          table={this.state.table}
          onCheck={this.check}
          onCall={this.call}
          onBet={this.bet}
          onRaise={this.raise}
          fold={this.fold}
        />
      </div>
    );
  }
}

export default Game;
