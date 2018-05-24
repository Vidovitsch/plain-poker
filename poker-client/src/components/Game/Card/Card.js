import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  getImagePath() {
    if (this.props.hidden) {
      return require(`./images/back.svg`); // eslint-disable-line
    }
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
  hoverable: PropTypes.bool,
  highlight: PropTypes.bool,
};

Card.defaultProps = {
  hoverable: false,
  highlight: false,
};

export default Card;
