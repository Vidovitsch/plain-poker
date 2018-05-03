import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CreateTable.css';

class CreateTable extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createTable = this.createTable.bind(this);
  }

  handleInputChange(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  createTable(e) {
    this.props.onCreate({
      name: this.state.name,
      minBet: this.state.minBet,
      startupAmount: this.state.startupAmount,
    });
    e.preventDefault();
  }

  render() {
    return (
      <div className="CreateTable">
        <h3>Create new table</h3>
        <form onSubmit={this.createTable}>
          <input className="Lobby-input-text" type="text" name="name" placeholder="Name" onChange={this.handleInputChange} /><br />
          <input className="Lobby-input-number" type="number" name="minBet" placeholder="Minimal Bet" onChange={this.handleInputChange} /><br />
          <input className="Lobby-input-number" type="number" name="startupAmount" placeholder="Startup Amount" onChange={this.handleInputChange} /><br /><br />
          <input className="Lobby-button" type="submit" value="Create" />
        </form>
      </div>
    );
  }
}

export default CreateTable;
