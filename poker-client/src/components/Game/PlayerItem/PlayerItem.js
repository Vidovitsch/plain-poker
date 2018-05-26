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


  getClasses() {
    const { status } = this.props.player;
    return `PlayerItem
    ${status === 'folded' ? 'transparent' : ''}
    ${status === 'turn' ? 'light' : ''}`;
  }

  renderPlayerState() {
    const { status } = this.props.player;
    return state === 'waiting' ? <div id="PlayerItem-state" /> :
    <div id="PlayerItem-state">{status}</div>;
  }

  renderCards() {
    const { session, player } = this.props;
    return (
      <PlayerCards session={session} player={player} />
    );
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className={this.getClasses()}>
        {this.renderCards()}
        <div id="PlayerItem-name">{this.props.player.name}</div>
        <img src={playerImage} />
        {this.renderPlayerState()}
        <img id="PlayerItem-chip" src={blackChipImage} alt="black-poker-chip" />
        <div id="PlayerItem-amount">€{this.props.player.amount}</div>
      </div>
    );
  }
}


export default PlayerItem;
