import React from 'react';
import PropTypes from 'prop-types';
import './GameButton.css';

class GameButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick();
  }

  render() {
    return (
      <button className="GameButton" onClick={this.handleClick()}>{this.props.name}</button>
    );
  }
}

GameButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default GameButton;
