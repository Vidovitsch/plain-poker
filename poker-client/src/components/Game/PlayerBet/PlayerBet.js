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
    const { amount } = this.props;
    if (amount) {
      return (<span id="PlayerBet-amount">€{amount}</span>);
    }
    return '';
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <span className="PlayerBet">
        {this.renderAmount()}
      </span>
    );
  }
}

export default PlayerBet;
