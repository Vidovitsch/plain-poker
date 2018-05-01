import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Ta extends Component {
  render() {
    let tableItems;
    if (this.props.tables) {
      tableItems = this.props.tables.map(table => (
        <h3>test</h3>
      ));
    }
    return (

    );
  }
}

export default Lobby;
