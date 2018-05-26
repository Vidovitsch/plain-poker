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
   * [createCard description]
   * @param  {Card} card [description]
   * @return {JSX}      [description]
   */
  createCard(card) {
    const { session, player: id } = this.props;
    return session === id ?
      <Card
        id={card.id}
        value={card.wild}
        hoverable
        overlap
      /> :
      <Card
        id={card.id}
        value={card.wild}
        hidden
        overlap
      />;
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
      <div className="PlayerCards">
        {this.renderCards()}
      </div>
    );
  }
}

PlayerCards.propTypes = {
  session: PropTypes.string.isRequired,
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
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
};

PlayerCards.defaultProps = {
  cards: [],
};

export default PlayerCards;
