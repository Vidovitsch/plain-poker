import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableItem from 'TableItem';

class Lobby extends Component {
  render() {
    let tableItems;
    if (this.props.tables) {
      tableItems = this.props.tables.map(table => (
        <h3>test</h3>
      ));
    }
    return (
      { tableItems }
    );
  }
}

export default Lobby;
