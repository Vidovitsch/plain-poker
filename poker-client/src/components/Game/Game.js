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
      sessionCards: [],
      staticTable: this.props.location.state.tableItem,
      variableTable: this.props.location.state.variableTable,
    };
    this.leave = this.leave.bind(this);
    this.start = this.start.bind(this);
    this.ready = this.ready.bind(this);
    this.reset = this.reset.bind(this);
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
      const self = data.players.find(p => p.id === this.state.session);
      if (!self) {
        this.goToLobbyView();
      } else {
        this.setState({
          variableTable: data,
        });
      }
    });
    this.ipcRenderer.on('player-cards', (e, data) => {
      this.setState({
        sessionCards: data,
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
    this.ipcRenderer.send('start-game-request', this.state.staticTable.location);
  }

  ready() {
    this.ipcRenderer.send('ready-game-request', this.state.staticTable.location);
  }

  reset() {
    this.ipcRenderer.send('reset-game-request', this.state.staticTable.location);
  }

  check() {
    this.ipcRenderer.send('check-request', this.state.staticTable.location);
  }

  call() {
    this.ipcRenderer.send('call-request', this.state.staticTable.location);
  }

  bet(amount) {
    this.ipcRenderer.send('bet-request', { tableLocation: this.state.staticTable.location, amount });
  }

  raise(amount) {
    this.ipcRenderer.send('raise-request', { tableLocation: this.state.staticTable.location, amount });
  }

  fold() {
    this.ipcRenderer.send('fold-request', this.state.staticTable.location);
  }

  goToLobbyView() {
    this.props.history.push({ // eslint-disable-line
      pathname: '/',
    });
  }

  renderGameMenu() {
    return (
      <GameMenu
        session={this.state.session}
        minPlayerNo={this.state.staticTable.minPlayerNo}
        turnTime={this.state.staticTable.turnTime}
        table={this.state.variableTable}
        onLeave={this.leave}
        onStart={this.start}
        onReady={this.ready}
        onReset={this.reset}
      />
    );
  }

  render() {
    return (
      <div className="Game">
        <Popup />
        {this.renderGameMenu()}
        <GameTable
          session={this.state.session}
          table={this.state.variableTable}
          sessionCards={this.state.sessionCards}
        />
        <GameConsole
          session={this.state.session}
          table={this.state.variableTable}
          minBet={this.state.staticTable.minBet}
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
