import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LobbyButtons.css';

class LobbyButtons extends Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable() {
    alert('table created');
  }

  render() {
    return (
      <div className="LobbyButtons">
        <button>Join</button><br />
        <button onClick={this.createTable} >New</button>
      </div>
    );
  }
}

export default LobbyButtons;
