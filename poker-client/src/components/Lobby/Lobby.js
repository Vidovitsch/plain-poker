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
      session: '',
      tableItems: [],
      selectedTableItem: null,
    };
  }

  componentWillMount() {
    this.getSession();
    this.getLobby();
  }

  getSession() {
    this.ipcRenderer.send('session-request');
    this.ipcRenderer.on('session-reply', (e, sessionId) => {
      this.setState({
        session: sessionId,
      });
    });
  }

  getLobby() {
    this.ipcRenderer.send('lobby-request');
    this.ipcRenderer.on('lobby-reply', (e, data) => {
      this.setTableItems(data);
    });
    this.ipcRenderer.on('lobby-update', (e, data) => {
      this.handleLobbyUpdate(data);
    });
  }

  setTableItems(tableItems) {
    this.setState({
      tableItems,
    });
  }

  setSelectedTableItem(tableItem) {
    this.setState({
      selectedTableItem: tableItem,
    });
  }

  handleLobbyUpdate(tableData) {
    const { selectedTableItem } = this.state;
    this.setTableItems(tableData);
    if (selectedTableItem) {
      const updatedTableItem = tableData.find(t => t.staticTable.id === selectedTableItem.staticTable.id);
      this.setSelectedTableItem(updatedTableItem || null);
    }
  }

  createTable(options) {
    this.ipcRenderer.send('create-table-request', options);
    this.ipcRenderer.on('create-table-reply', (e, { tableItem, variableTable }) => {
      this.goToGameView({
        session: this.state.session,
        tableItem,
        variableTable,
      });
    });
  }

  joinTable(tableId) {
    this.ipcRenderer.send('join-table-request', tableId);
    this.ipcRenderer.on('join-table-reply', (e, { tableItem, variableTable }) => {
      this.goToGameView({
        session: this.state.session,
        tableItem,
        variableTable,
      });
    });
  }

  goToGameView(data) {
    this.props.history.push({ // eslint-disable-line
      pathname: '/game',
      state: data,
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
