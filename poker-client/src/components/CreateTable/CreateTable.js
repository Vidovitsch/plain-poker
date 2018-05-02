
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CreateTable.css';

class CreateTable extends Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  createTable() {
    this.props.onCreate({
      name: this.state.name,
      minPlayerNo: this.state.minPlayerNo,
      maxPlayerNo: this.state.maxPlayerNo,
      minBet: this.state.minBet,
      initialAmount: this.state.initialAmount,
    });
  }

  handleInputChange(e) {
    const { target, name } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="CreateTable">
        <form onSubmit={this.createTable}>
          <label htmlFor="CreateTable-name">Name:
            <input id="CreateTable-name" name="name" type="text" onChange={this.handleInputChange} />
          </label>
          <br />
          <label htmlFor="CreateTable-minPlayerNo">Minimal player amount:
              <input id="CreateTable-minPlayerNo" name="minPlayerNo" type="number" onChange={this.handleInputChange} />
          </label>
          <br />
          <label htmlFor="CreateTable-maxPlayerNo">Maximum player amount:
              <input id="CreateTable-maxPlayerNo" name="maxPlayerNo" type="number" onChange={this.handleInputChange} />
          </label>
          <br />
          <label htmlFor="CreateTable-minBet">Minimal bet:
              <input id="CreateTable-minBet" name="minBet" type="number" onChange={this.handleInputChange} />
          </label>
          <br />
          <label htmlFor="CreateTable-initialAmount">Startup amount:
              <input id="CreateTable-initialAmount" name="initialAmount" type="number" onChange={this.handleInputChange} />
          </label>
          <br />
          <input type="submit" value="Create Table" />
        </form>
      </div>
    );
  }
}

export default CreateTable;
