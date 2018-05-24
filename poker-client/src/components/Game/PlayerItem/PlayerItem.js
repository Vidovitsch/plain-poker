import React from 'react';
import PropTypes from 'prop-types';
import playerImage from './images/player.png';
import blackChipImage from './images/black_chip.png';
import './PlayerItem.css';
import PlayerCards from './../PlayerCards/PlayerCards';

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
];

/**
 * [Card description]
 * @extends React
 */
class PlayerItem extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="PlayerItem">
        <PlayerCards cards={cards} />
        <div id="PlayerItem-name">{this.props.player.name}</div>
        <img src={playerImage} />
        <img id="PlayerItem-chip" src={blackChipImage} />
        <div id="PlayerItem-amount">€{this.props.player.amount}</div>
      </div>
    );
  }
}


export default PlayerItem;
