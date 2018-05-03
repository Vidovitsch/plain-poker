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
    this.setSelectedTableItem = this.setSelectedTableItem.bind(this);
  }

  componentWillMount() {
    this.state = {
      tableItems: [
        {
          name: 'Test',
        },
        {
          name: 'Test',
        },
      ],
    };
  }

  setSelectedTableItem(tableItem) {
    this.setState({
      selectedTableItem: tableItem,
    });
  }

  createTable(options) {
    this.ipcRenderer.send('create-table-request', options);
    this.ipcRenderer.on('create-table-reply', (e, data) => {
      this.props.history.push(`/game/${data.tableId}/${data.sessionId}`); // eslint-disable-line
    });
  }

  render() {
    return (
      <div className="Lobby">
        <header><LobbyHeader /></header>
        <main>
          <LobbyControls onCreate={this.createTable} selectedTableItem={this.state.selectedTableItem} />
          <TableItemList onSelect={this.setSelectedTableItem} tableItems={this.state.tableItems} />
        </main>
        <footer><LobbyFooter /></footer>
      </div>
    );
  }
}

export default Lobby;
