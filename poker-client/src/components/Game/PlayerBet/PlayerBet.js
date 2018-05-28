import React from 'react';
import PropTypes from 'prop-types';
import redChipImage from './images/black_chip.png';
import './PlayerBet.css';

/**
 * [PlayerItem description]
 * @extends React
 */
class PlayerBet extends React.Component {
  /**
   * [renderAmount description]
   * @return {JSX} [description]
   */
  renderAmount() {
    const { amount } = this.props.amount;
    return (
      <div id="PlayerItem-amount">€{amount}</div>
    );
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <span className="PlayerBet">
        <span id="PlayerBet-amount">€{this.props.amount}</span>
      </span>
    );
  }
}

export default PlayerBet;
