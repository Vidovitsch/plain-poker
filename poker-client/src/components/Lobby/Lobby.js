import React from 'react';
import './Lobby.css';
import LobbyHeader from './LobbyHeader/LobbyHeader';
import LobbyFooter from './LobbyFooter/LobbyFooter';
import LobbyControls from './LobbyControls/LobbyControls';
import TableItemList from './TableItemList/TableItemList';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.ipcRenderer = ipcRenderer;
    this.createTable = this.createTable.bind(this);
    this.joinTable = this.joinTable.bind(this);
    this.setSelectedTableItem = this.setSelectedTableItem.bind(this);
    this.state = {
      tableItems: [],
      selectedTableItem: null,
    };
  }

  componentWillMount() {
    this.getLobby();
  }

  getLobby() {
    this.ipcRenderer.send('lobby-request');
    this.ipcRenderer.on('lobby-reply', (e, data) => {
      this.setState({
        tableItems: data,
      });
    });
    this.ipcRenderer.on('lobby-update', (e, data) => {
      this.setState({
        tableItems: data,
      });
      const updatedTableItem = data.find(t => t.id === this.state.selectedTableItem.id);
      this.setSelectedTableItem(updatedTableItem);
    });
  }

  setSelectedTableItem(tableItem) {
    this.setState({
      selectedTableItem: tableItem,
    });
  }

  createTable(options) {
    this.ipcRenderer.send('create-table-request', options);
    this.ipcRenderer.on('create-table-reply', (e, data) => {
      this.goToGameView(data);
    });
  }

  joinTable(tableId) {
    this.ipcRenderer.send('join-table-request', tableId);
    this.ipcRenderer.on('join-table-reply', (e, data) => {
      this.goToGameView(data);
    });
  }

  goToGameView(table) {
    this.props.history.push({ // eslint-disable-line
      pathname: '/game',
      state: { table },
    });
  }

  render() {
    return (
      <div className="Lobby">
        <header><LobbyHeader /></header>
        <main>
          <LobbyControls
            onCreate={this.createTable}
            onJoin={this.joinTable}
            selectedTableItem={this.state.selectedTableItem}
          />
          <TableItemList onSelect={this.setSelectedTableItem} tableItems={this.state.tableItems} />
        </main>
        <footer><LobbyFooter /></footer>
      </div>
    );
  }
}

export default Lobby;
