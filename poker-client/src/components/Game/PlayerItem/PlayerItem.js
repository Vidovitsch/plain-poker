import React from 'react';
import PropTypes from 'prop-types';
import playerImage from './images/player.png';
import blackChipImage from './images/black_chip.png';
import './PlayerItem.css';
import PlayerCards from './../PlayerCards/PlayerCards';

/**
 * [PlayerItem description]
 * @extends React
 */
class PlayerItem extends React.Component {
  /**
   * [getClasses description]
   * @return {String} [description]
   */
  getClasses() {
    const { status } = this.props.player;
    return `PlayerItem
    ${status === 'folded' ? 'transparent' : ''}
    ${status === 'turn' ? 'light' : ''}`;
  }

  /**
   * [renderrState description]
   * @return {JSX} [description]
   */
  renderState() {
    const { status } = this.props.player;
    return status === 'waiting' ? <div id="PlayerItem-state" /> :
    <div id="PlayerItem-state">{status}</div>;
  }

  /**
   * [renderName description]
   * @return {JSX} [description]
   */
  renderName() {
    const { name } = this.props.player;
    return (
      <div id="PlayerItem-name">{name}</div>
    );
  }

  /**
   * [renderCards description]
   * @return {JSX} [description]
   */
  renderCards() {
    const { session, player, sessionCards } = this.props;
    return (
      <PlayerCards
        session={session}
        sessionCards={sessionCards}
        player={player}
      />
    );
  }

  /**
   * [renderAmount description]
   * @return {JSX} [description]
   */
  renderAmount() {
    const { amount } = this.props.player;
    return (
      <div id="PlayerItem-amount">€{amount}</div>
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
        {this.renderName()}
        <img src={playerImage} alt="profile" />
        {this.renderState()}
        <img
          id="PlayerItem-chip"
          src={blackChipImage}
          alt="black-poker-chip"
        />
        {this.renderAmount()}
      </div>
    );
  }
}

PlayerItem.propTypes = {
  session: PropTypes.string.isRequired,
  sessionCards: PropTypes.arrayOf(PropTypes.shape({
    card: PropTypes.shape({
      id: PropTypes.string.isRequired,
      deckId: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      suit: PropTypes.string.isRequired,
      wild: PropTypes.string.isRequired,
      points: PropTypes.number.isRequired,
    }).isRequired,
    dealerId: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
  })),
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
};

PlayerItem.defaultProps = {
  sessionCards: [],
};

export default PlayerItem;
