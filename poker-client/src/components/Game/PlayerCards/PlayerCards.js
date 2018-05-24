import React from 'react';
import PropTypes from 'prop-types';
import './PlayerCards.css';
import Card from './../Card/Card';

/**
 * [CommunityCards description]
 * @extends React
 */
class PlayerCards extends React.Component {
  createCardElement(card) {
    if (this.props.self) {
      return (<Card id={card.id} value={card.wild} hoverable overlap />);
    }
    return (<Card id={card.id} value={card.wild} overlap hidden />);
  }

  /**
   * [renderCards description]
   * @return {Array} [description]
   */
  renderCardElements() {
    return this.props.cards.map(({ card }) => this.createCardElement(card));
  }
  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="PlayerCards">
        {this.renderCardElements()}
      </div>
    );
  }
}

PlayerCards.propTypes = {
  self: PropTypes.bool,
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
  self: false,
  cards: [],
};

export default PlayerCards;
