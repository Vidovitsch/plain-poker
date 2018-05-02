
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LobbyConsole.css';

import CreateTable from './../CreateTable/CreateTable';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const { ipcRenderer } = electron;

class LobbyConsole extends Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable(options) {
    this.props.onCreate(options);
  }

  render() {
    return (
      <div className="LobbyConsole">
        <CreateTable onCreate={this.createTable} />
      </div>
    );
  }
}

export default LobbyConsole;
