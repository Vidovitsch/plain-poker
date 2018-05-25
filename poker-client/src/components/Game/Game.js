import React from 'react';
import Popup from 'react-popup';
import './Game.css';
import GameMenu from './GameMenu/GameMenu';
import GameTable from './GameTable/GameTable';
import GameConsole from './GameConsole/GameConsole';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.ipcRenderer = ipcRenderer;
    this.state = {
      session: this.props.location.state.session,
      staticTable: this.props.location.state.tableItem,
      variableTable: this.props.location.state.variableTable,
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

  componentWillMount() {
    // Makes sure the GameHandler is started correctly before starting the listener
    setTimeout(() => {
      this.startUpdateListener();
    }, 500);
  }

  startUpdateListener() {
    this.ipcRenderer.send('game-entered', this.state.staticTable.location);
    this.ipcRenderer.on('table-update', (e, data) => {
      this.setState({
        variableTable: data,
      });
    });
  }

  leave() {
    this.ipcRenderer.send('leave-request', this.state.staticTable.location);
    this.ipcRenderer.on('leave-reply', () => {
      this.goToLobbyView();
    });
  }

  start() {
    this.ipcRenderer.send('start-request', this.state.staticTable.location);
  }

  ready() {
    this.ipcRenderer.send('ready-request', this.state.staticTable.location);
  }

  check() {
    this.ipcRenderer.send('check-request', this.state.staticTable.location);
  }

  call() {
    this.ipcRenderer.send('call-request', this.state.staticTable.location);
  }

  bet(amount) {
    this.ipcRenderer.send('bet-request', { location: this.state.staticTable.location, amount });
  }

  raise(amount) {
    this.ipcRenderer.send('raise-request', { location: this.state.staticTable.location, amount });
  }

  fold() {
    this.ipcRenderer.send('fold-request', this.state.staticTable.location);
  }

  goToLobbyView() {
    this.props.history.push({ // eslint-disable-line
      pathname: '/',
    });
  }

  render() {
    return (
      <div className="Game">
        <Popup />
        <GameMenu
          session={this.state.session}
          variableTable={this.state.variableTable}
          staticTable={this.state.staticTable}
          onLeave={this.leave}
          onStart={this.start}
          onReady={this.ready}
        />
        <GameTable
          session={this.state.session}
          communityCards={this.state.variableTable.communityCards}
          players={this.state.variableTable.players}
        />
        <GameConsole
          table={this.state.variableTable}
          onCheck={this.check}
          onCall={this.call}
          onBet={this.bet}
          onRaise={this.raise}
          onFold={this.fold}
        />
      </div>
    );
  }
}

export default Game;
