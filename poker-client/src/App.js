import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import TableItemList from './components/TableItemList/TableItemList';
import LobbyConsole from './components/LobbyConsole/LobbyConsole';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const { ipcRenderer } = electron;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableItems: [],
    };
    this.handleCreateTable = this.handleCreateTable.bind(this);
  }

  componentWillMount() {
    this.getLobby();
  }

  getLobby() {
    ipcRenderer.send('lobby-request', 'request');
    ipcRenderer.on('lobby-reply', (e, data) => {
      this.setState({
        tableItems: data.tableItems,
      });
    });
  }

  handleCreateTable(options) {
    ipcRenderer.send('create-table-request', options);
    ipcRenderer.on('create-table-reply', (e, data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <div className="App">
        <LobbyConsole onCreate={this.handleCreateTable} />
        <TableItemList tableItems={this.state.tableItems} />
      </div>
    );
  }
}

export default App;
