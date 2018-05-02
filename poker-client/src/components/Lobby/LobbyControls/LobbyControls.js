import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LobbyControls.css';
import TableItemDetails from './TableItemDetails/TableItemDetails';
import LobbyButtons from './LobbyButtons/LobbyButtons';

class LobbyControls extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="LobbyControls">
        <TableItemDetails />
        <LobbyButtons />
      </div>
    );
  }
}

export default LobbyControls;
