import React from 'react';
import PropTypes from 'prop-types';
import './Timer.css';
import GameButton from './../GameButton/GameButton';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  getNumberOfReadyPlayers() {
    // <div>{this.props.turnTime}</div>
    const { players } = this.props.table;
    return players.filter(player => player.status === 'ready').length;
  }

  render() {
    return (
      <div className="Timer">
        <div>30</div>
      </div>
    );
  }
}

Timer.propTypes = {

};

export default Timer;
