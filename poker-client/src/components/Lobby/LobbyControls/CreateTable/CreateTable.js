import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CreateTable.css';

class CreateTable extends Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable() {
    alert('table created');
  }

  render() {
    return (
      <div className="CreateTable">
        <h3>Create new table</h3>
        <form onSubmit={this.createTable}>
          <input className="Lobby-input-text" type="text" placeholder="Name" ref="createTable-name" /><br />
          <input className="Lobby-input-number" type="number" placeholder="Minimal Bet" ref="createTable-minBet" /><br />
          <input className="Lobby-input-number" type="number" placeholder="Startup Amount" ref="createTable-startupAmount" /><br /><br />
          <input className="Lobby-button" type="submit" value="Create" />
          <br />
        </form>
      </div>
    );
  }
}

export default CreateTable;
