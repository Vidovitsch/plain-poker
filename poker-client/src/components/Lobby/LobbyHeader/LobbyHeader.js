import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LobbyHeader.css';

class LobbyHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="LobbyHeader">Plain Poker</div>
    );
  }
}

export default LobbyHeader;
