import React from 'react';
import PropTypes from 'prop-types';
import './LobbyControls.css';
import JoinTable from './JoinTable/JoinTable';
import CreateTable from './CreateTable/CreateTable';

class LobbyControls extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
    this.joinTable = this.joinTable.bind(this);
  }

  createTable(options) {
    this.props.onCreate(options);
  }

  joinTable(tableId) {
    this.props.onJoin(tableId);
  }

  render() {
    return (
      <div className="LobbyControls">
        <JoinTable onJoin={this.joinTable} selectedTableItem={this.props.selectedTableItem} />
        <div className="divider" />
        <CreateTable onCreate={this.createTable} />
      </div>
    );
  }
}

LobbyControls.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  selectedTableItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.string,
    playerNo: PropTypes.number,
    minPlayerNo: PropTypes.number,
    maxPlayerNo: PropTypes.number,
    minBet: PropTypes.number,
    startupAmount: PropTypes.number,
  }),
};

LobbyControls.defaultProps = {
  selectedTableItem: {},
};

export default LobbyControls;
