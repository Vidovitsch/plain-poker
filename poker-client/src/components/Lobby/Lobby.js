import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Lobby.css';
import LobbyHeader from './LobbyHeader/LobbyHeader';
import LobbyFooter from './LobbyFooter/LobbyFooter';
import LobbyControls from './LobbyControls/LobbyControls';
import TableItemList from './TableItemList/TableItemList';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable(options) {
    console.log(options);
  }

  render() {
    return (
      <div className="Lobby">
        <header><LobbyHeader /></header>
        <main>
          <LobbyControls onCreate={this.createTable} />
          <TableItemList />
        </main>
        <footer><LobbyFooter /></footer>
      </div>
    );
  }
}

export default Lobby;
