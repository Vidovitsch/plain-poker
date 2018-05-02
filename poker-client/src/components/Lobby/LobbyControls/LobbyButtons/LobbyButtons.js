import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LobbyButtons.css';

class LobbyButtons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="LobbyButtons">
        <button>Join</button><br />
        <button>New</button>
      </div>
    );
  }
}

export default LobbyButtons;
