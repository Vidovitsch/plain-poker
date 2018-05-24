import React from 'react';
import PropTypes from 'prop-types';
import './GameTable.css';
import gameTableImg from './images/gametable.png';
import Card from './../Card/Card';

class GameTable extends React.Component {
  constructor(props) {
    super(props);
  }

  getNumberOfReadyPlayers() {
    // <div>{this.props.turnTime}</div>
    const { players } = this.props.table;
    return players.filter(player => player.status === 'ready').length;
  }

  render() {
    return (
      <div className="GameTable">
        <img id="gameTableImg" src={gameTableImg} alt="gametable" />
        <Card wildValue="2c" />
      </div>
    );
  }
}

GameTable.propTypes = {

};

export default GameTable;
