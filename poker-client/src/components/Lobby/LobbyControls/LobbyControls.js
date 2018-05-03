import React from 'react';
import PropTypes from 'prop-types';
import './LobbyControls.css';
import JoinTable from './JoinTable/JoinTable';
import CreateTable from './CreateTable/CreateTable';

class LobbyControls extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable(options) {
    this.props.onCreate(options);
  }

  render() {
    return (
      <div className="LobbyControls">
        <JoinTable />
        <div className="divider" />
        <CreateTable onCreate={this.createTable} />
      </div>
    );
  }
}

LobbyControls.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default LobbyControls;
