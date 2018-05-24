import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  getCardImgSrc() {
    return require(`./images/${this.props.wildValue}.svg`);
  }

  render() {
    return (
      <img className="Card" src={this.getCardImgSrc()} alt={this.props.wildValue} />
    );
  }
}

Card.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default Card;
