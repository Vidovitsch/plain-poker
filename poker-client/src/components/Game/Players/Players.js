import React from 'react';
import PropTypes from 'prop-types';
import './Players.css';
import PlayerItem from './../PlayerItem/PlayerItem';
import PlayerBet from './../PlayerBet/PlayerBet';

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
    this.playerIndexToClassMap = {
      0: 'self',
      1: 'other1',
      2: 'other2',
      3: 'other3',
      4: 'other4',
    };
    this.betIndexToClassMap = {
      0: 'self-bet',
      1: 'other1-bet',
      2: 'other2-bet',
      3: 'other3-bet',
      4: 'other4-bet',
    };
  }

  /**
   * [orderPlayers description]
   * @return {Array} [description]
   */
  orderPlayers() {
    // const { players } = this.props;
    const orderedPlayers = [];
    const beforeSelf = [];
    let self = null;
    this.props.players.forEach((player) => {
      if (player.id === this.props.session) {
        self = player;
        orderedPlayers.push(self);
      } else if (self) {
        orderedPlayers.push(player);
      } else {
        beforeSelf.push(player);
      }
    });
    return orderedPlayers.concat(beforeSelf);
  }

  syncBetsWithOrderedPlayers() {
    const orderedBets = {};
    this.orderPlayers().forEach((player) => {
      orderedBets[player.id] = this.props.bets[player.id];
    });
    return orderedBets;
  }

  /**
   * [createPlayerItem description]
   * @param  {Player} player [description]
   * @param  {Number} index  [description]
   * @return {JSX}        [description]
   */
  createPlayerItem(player, index) {
    return (
      <div id={this.playerIndexToClassMap[index]} className="PlayerItem-container">
        <PlayerItem
          session={this.props.session}
          sessionCards={this.props.sessionCards}
          player={player}
          currentTurn={this.props.currentTurn}
          gameRound={this.props.gameRound}
          showdownResults={this.props.showdownResults}
        />
      </div>
    );
  }

  createBetItem(amount, index) {
    return (
      <div id={this.betIndexToClassMap[index]} className="bet-container">
        <PlayerBet amount={amount} />
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

  renderBets() {
    const orderedBets = this.syncBetsWithOrderedPlayers();
    return Object.keys(orderedBets).map((key, index) => this.createBetItem(orderedBets[key], index));
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="Players">
        {this.renderPlayerItems()}
        {this.renderBets()}
      </div>
    );
  }
}

Players.propTypes = {
  bets: PropTypes.shape({
    playerId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }),
  session: PropTypes.string.isRequired,
  currentTurn: PropTypes.string.isRequired,
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
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
};

Players.defaultProps = {
  sessionCards: [],
  bets: {},
};

export default Players;
