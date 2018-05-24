import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * [Card description]
 * @extends React
 */
class Card extends React.Component {
  /**
   * [getImagePath description]
   * @return {String} [description]
   */
  getImagePath() {
    let { value } = this.props;
    if (this.props.hidden) {
      value = 'back';
    }
    return require(`./images/${value}.svg`); // eslint-disable-line
  }

  /**
   * [getClasses description]
   * @return {String} [description]
   */
  getClasses() {
    return `Card
    ${this.props.hoverable ? 'hoverable' : ''}
    ${this.props.highlight ? 'highlight' : ''}
    ${this.props.overlap ? 'overlap' : ''}`;
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <img className={this.getClasses()} src={this.getImagePath()} alt={this.props.value} />
    );
  }
}

Card.propTypes = {
  value: PropTypes.string.isRequired,
  hoverable: PropTypes.bool,
  highlight: PropTypes.bool,
  hidden: PropTypes.bool,
};

Card.defaultProps = {
  hoverable: false,
  highlight: false,
  hidden: false,
};

export default Card;
