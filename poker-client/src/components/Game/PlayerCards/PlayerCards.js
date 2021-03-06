import React from 'react';
import PropTypes from 'prop-types';
import './PlayerCards.css';
import Card from './../Card/Card';

/**
 * [CommunityCards description]
 * @extends React
 */
class PlayerCards extends React.Component {
  renderCardsForShowdown() {
    const { player, showdownResults } = this.props;
    const playerCards = showdownResults.playerCards[player.id];
    return playerCards.map(({ card: playerCard }) => {
      const isWinningCard = showdownResults.winData.scoreData.cards.some(({ card }) => card.id === playerCard.id);
      return <Card id={playerCard.id} value={playerCard.wild} hoverable overlap highlight={isWinningCard} />;
    });
  }

  /**
   * [renderCards description]
   * @return {Array} [description]
   */
  renderCards() {
    const {
      session, sessionCards, player, gameRound, status,
    } = this.props;
    if (gameRound === 'showdown') {
      return this.renderCardsForShowdown();
    } else if (sessionCards.length > 0) {
      if (session === player.id) {
        return this.props.sessionCards.map(({ card }) => <Card id={card.id} value={card.wild} hoverable overlap />);
      }
      return [0, 1].map(() => <Card value="As" hidden overlap />);
    }
    return '';
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="PlayerCards">
        {this.renderCards()}
      </div>
    );
  }
}

PlayerCards.propTypes = {
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

PlayerCards.defaultProps = {
  sessionCards: [],
};

export default PlayerCards;
