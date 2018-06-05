import React from 'react';
import PropTypes from 'prop-types';
import './GameTable.css';
import gameTableImg from './images/gametable.png';
import CommunityCards from './../CommunityCards/CommunityCards';
import Players from './../Players/Players';


/* eslint-disable react/prefer-stateless-function */
/**
 * [GameTable description]
 * @extends React
 */
class GameTable extends React.Component {
  renderGamePot() {
    const { pot } = this.props.table;
    return pot > 0 ? (<span id="GameTable-pot">€{pot}</span>) : '';
  }
  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    const {
      sessionCards, session, table: {
        communityCards, players, bets, pot,
      },
    } = this.props;
    return (
      <div className="GameTable">
        <img
          id="GameTable-img"
          src={gameTableImg}
          alt="gametable"
        />
        {this.renderGamePot()}
        <CommunityCards
          cards={communityCards}
        />
        <Players
          session={session}
          sessionCards={sessionCards}
          bets={bets}
          players={players}
        />
      </div>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

GameTable.propTypes = {
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
  table: PropTypes.shape({
    status: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })).isRequired,
    bets: PropTypes.shape({
      playerId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
    smallBlind: PropTypes.string,
    bigBlind: PropTypes.string,
    communityCards: PropTypes.arrayOf(PropTypes.shape({
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
    totalBet: PropTypes.number,
  }).isRequired,
};

GameTable.defaultProps = {
  sessionCards: [],
};

export default GameTable;
