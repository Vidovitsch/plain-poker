import React from 'react';
import PropTypes from 'prop-types';
import './GameTable.css';
import gameTableImg from './images/gametable.png';
import CommunityCards from './../CommunityCards/CommunityCards';
import Players from './../Players/Players';

const cards = [
  {
    card: {
      wild: '2s',
    },
  },
  {
    card: {
      wild: '3h',
    },
  },
  {
    card: {
      wild: '4c',
    },
  },
  {
    card: {
      wild: '4c',
    },
  },
  {
    card: {
      wild: '4c',
    },
  },
];

const players = [
  {
    id: 'Test1',
    name: 'Test1',
    amount: 2000,
  },
  {
    id: 'Test2',
    name: 'Test2',
    amount: 2000,
  },
  {
    id: 'Test3',
    name: 'Test3',
    amount: 2000,
  },
];
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
        <CommunityCards cards={cards} />
        <Players session="Test1" players={players} />
      </div>
    );
  }
}

GameTable.propTypes = {

};

export default GameTable;
