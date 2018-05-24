import React from 'react';
import PropTypes from 'prop-types';
import './CommunityCards.css';
import Card from './../Card/Card';

class CommunityCards extends React.Component {
  constructor(props) {
    super(props);
  }

  renderCards() {
    return this.props.cards.map(({ card }) => (
      <Card id={card.id} value={card.wild} hoverable hidden />
    ));
  }

  render() {
    return (
      <div className="CommunityCards">
        {this.renderCards()}
      </div>
    );
  }
}

CommunityCards.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default CommunityCards;
