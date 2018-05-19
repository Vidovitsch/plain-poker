import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);
    console.log(props.location);
  }

  render() {
    return (
      <div className="Game">
        <h3>Game</h3>
      </div>
    );
  }
}

export default Game;
