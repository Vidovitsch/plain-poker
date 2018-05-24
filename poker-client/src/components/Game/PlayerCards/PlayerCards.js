import React from 'react';
import PropTypes from 'prop-types';
import './PlayerCards.css';
import Card from './../Card/Card';

/**
 * [CommunityCards description]
 * @extends React
 */
class PlayerCards extends React.Component {
  /**
   * [renderCards description]
   * @return {Array} [description]
   */
  renderCards() {
    return this.props.cards.map(({ card }) => (
      <Card id={card.id} value={card.wild} hoverable overlap />
    ));
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

PlayerCards.defaultProps = {
  cards: [],
};

export default PlayerCards;
