import React from 'react';
import PropTypes from 'prop-types';
import './Players.css';
import PlayerItem from './../PlayerItem/PlayerItem';

/**
 * [Card description]
 * @extends React
 */
class Players extends React.Component {
  /**
   * [constructor description]
   * @param {Object} props [description]
   */
  constructor(props) {
    super(props);
    // Every index of players has a unique class
    // that places the player in the correct position
    this.indexToClassMap = {
      0: 'self',
      1: 'other1',
      2: 'other2',
      3: 'other3',
      4: 'other4',
    };
  }

  /**
   * [orderPlayers description]
   * @return {Array} [description]
   */
  orderPlayers() {
    let indexSelf = 0;
    this.props.players.forEach((player, index) => {
      if (player.id === this.props.session) {
        indexSelf = index;
      }
    });
    return this.props.players.concat(this.props.players.splice(0, indexSelf));
  }

  /**
   * [createPlayerItem description]
   * @param  {Player} player [description]
   * @param  {Number} index  [description]
   * @return {JSX}        [description]
   */
  createPlayerItem(player, index) {
    return (
      <div id={this.indexToClassMap[index]} className="PlayerItem-container">
        <PlayerItem
          session={this.props.session}
          cards={this.props.cards}
          player={player}
          currentTurn={this.props.currentTurn}
        />
      </div>
    );
  }

  /**
   * [renderPlayerItems description]
   * @return {Array} [description]
   */
  renderPlayerItems() {
    let index = 0;
    return this.orderPlayers().map((player) => {
      const element = this.createPlayerItem(player, index);
      index += 1;
      return element;
    });
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="Players">
        {this.renderPlayerItems()}
      </div>
    );
  }
}

Players.propTypes = {
  session: PropTypes.string.isRequired,
  currentTurn: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
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
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
};

Players.defaultProps = {
  cards: [],
};

export default Players;
