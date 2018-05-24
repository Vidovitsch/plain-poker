import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  getImagePath() {
    return require(`./images/${this.props.value}.svg`); // eslint-disable-line
  }

  getClasses() {
    return `Card
    ${this.props.hoverable ? 'hoverable' : ''} 
    ${this.props.highlight ? 'highlight' : ''}`;
  }

  render() {
    return (
      <img className={this.getClasses()} src={this.getImagePath()} alt={this.props.value} />
    );
  }
}

Card.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Card;
