import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './PlainPoker.css';
import Game from './components/Game/Game';
import Lobby from './components/Lobby/Lobby';

// const electron = window.require('electron');
// const fs = electron.remote.require('fs');
// const { ipcRenderer } = electron;

class PlainPoker extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   tableItems: [],
    // };
    // this.handleCreateTable = this.handleCreateTable.bind(this);
  }

  // componentWillMount() {
  //   this.getLobby();
  // }
  //
  // getLobby() {
  //   ipcRenderer.send('lobby-request', 'request');
  //   ipcRenderer.on('lobby-reply', (e, data) => {
  //     this.setState({
  //       tableItems: data.tableItems,
  //     });
  //   });
  // }
  //
  // handleCreateTable(options) {
  //   ipcRenderer.send('create-table-request', options);
  //   ipcRenderer.on('create-table-reply', (e, data) => {
  //     console.log(data);
  //   });
  // }

  render() {
    return (
      <Switch className="PlainPoker">
        <Route exact path="/" component={Lobby} />
        <Route path="/game/:id/:sessionId" component={Game} />
      </Switch>
    );
  }
}

export default PlainPoker;
