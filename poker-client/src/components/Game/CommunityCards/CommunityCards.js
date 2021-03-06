import React from 'react';
import PropTypes from 'prop-types';
import './CommunityCards.css';
import Card from './../Card/Card';

/**
 * [CommunityCards description]
 * @extends React
 */
class CommunityCards extends React.Component {
  createCard(communityCard) {
    const { gameRound, showdownResults } = this.props;
    if (gameRound === 'showdown') {
      const winningCommunityCard = showdownResults.winData.scoreData.cards.find(({ card }) => card.id === communityCard.id);
      if (winningCommunityCard) {
        return (<Card id={communityCard.id} value={communityCard.wild} hoverable highlight />);
      }
    }
    return (<Card id={communityCard.id} value={communityCard.wild} hoverable />);
  }

  /**
   * [renderCards description]
   * @return {Array} [description]
   */
  renderCards() {
    return this.props.cards.map(({ card }) => this.createCard(card));
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="CommunityCards">
        {this.renderCards()}
      </div>
    );
  }
}

CommunityCards.propTypes = {
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
};

CommunityCards.defaultProps = {
  cards: [],
};

export default CommunityCards;
