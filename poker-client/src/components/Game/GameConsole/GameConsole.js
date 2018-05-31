import React from 'react';
import PropTypes from 'prop-types';
import './GameConsole.css';
import GameButton from './../GameButton/GameButton';
import Popup from './../../../popupProvider';

class GameConsole extends React.Component {
  constructor(props) {
    super(props);
    this.check = this.check.bind(this);
    this.call = this.call.bind(this);
    this.bet = this.bet.bind(this);
    this.raise = this.raise.bind(this);
    this.fold = this.fold.bind(this);
  }

  /**
   * [getPreviousPlayer description]
   * @param  {Player} currentPlayer [description]
   * @return {Player}               [description]
   */
  getPreviousPlayer(currentPlayer) {
    let previousIndex = this.props.table.players.indexOf(currentPlayer) - 1;
    if (previousIndex === -1) {
      previousIndex = this.props.table.players.length - 1;
    }
    return this.props.table.players[previousIndex];
  }

  findCurrentBet(player) {
    const currentBet = this.props.table.bets[player.id];
    return currentBet || 0;
  }

  check() {
    this.props.onCheck();
  }

  call() {
    this.props.onCall();
  }

  bet() {
    const { minBet } = this.props.table;
    const currentPlayer = this.props.table.players.find(p => p.hasTurn);
    const title = 'How much do you want to bet?';
    const message = `You have to bet a minimum of €${minBet}.`;
    const placeholder = 'Your bet';
    const initialValue = minBet;
    Popup.prompt(title, message, placeholder, initialValue).then((amount) => {
      if (amount >= minBet && amount <= currentPlayer.amount) {
        this.props.onBet(amount);
      }
    });
  }

  raise() {
    const { minRaise } = this.props.table;
    const currentPlayer = this.props.table.players.find(p => p.hasTurn);
    const previousPlayer = this.getPreviousPlayer(currentPlayer);
    const betPreviousPlayer = this.findCurrentBet(previousPlayer);
    const betCurrentPlayer = this.findCurrentBet(currentPlayer);
    const minAmountToRaise = minRaise + (betPreviousPlayer - betCurrentPlayer);

    const title = 'How much do you want to raise?';
    const message = `You have to raise a minimum of €${minAmountToRaise}.`;
    const placeholder = 'Your raise';
    const initialValue = minAmountToRaise;
    Popup.prompt(title, message, placeholder, initialValue).then((amount) => {
      if (amount >= minAmountToRaise && minAmountToRaise <= currentPlayer.amount) {
        this.props.onRaise(amount);
      }
    });
  }

  fold() {
    Popup.confirm('Are you sure?', 'You will lose your current bet if you fold!').then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onFold();
      }
    });
  }

  /**
   * [canCheck description]
   * @param  {Player} player [description]
   * @return {Boolean}        [description]
   */
  canCheck(currentPlayer) {
    const previousPlayer = this.getPreviousPlayer(currentPlayer);
    const betPreviousPlayer = this.findCurrentBet(previousPlayer);
    const betCurrentPlayer = this.findCurrentBet(currentPlayer);
    return currentPlayer.status === 'turn' && betPreviousPlayer === betCurrentPlayer;
  }

  /**
   * [canBet description]
   * @param  {Player} player [description]
   * @param  {Number} amount [description]
   * @return {Boolean}        [description]
   */
  canBet(currentPlayer) {
    const hasBets = this.props.table.players.some(p => p.hasBet);
    return currentPlayer.status === 'turn' && !hasBets;
  }

  renderCheckOrCallButton() {
    const currentPlayer = this.props.table.players.find(p => p.hasTurn);
    if (currentPlayer) {
      return this.canCheck(currentPlayer) ?
        (<GameButton name="Check" onClick={this.check} disabled={currentPlayer.id !== this.props.session} />) :
        (<GameButton name="Call" onClick={this.call} disabled={currentPlayer.id !== this.props.session} />);
    }
    return (<GameButton name="Check" disabled />);
  }

  renderBetOrRaiseButton() {
    const currentPlayer = this.props.table.players.find(p => p.hasTurn);
    if (currentPlayer) {
      return this.canBet(currentPlayer) ?
        (<GameButton name="Bet" onClick={this.bet} disabled={currentPlayer.id !== this.props.session} />) :
        (<GameButton name="Raise" onClick={this.raise} disabled={currentPlayer.id !== this.props.session} />);
    }
    return (<GameButton name="Bet" disabled />);
  }

  renderFoldButton() {
    const currentPlayer = this.props.table.players.find(p => p.hasTurn);
    if (currentPlayer) {
      return (<GameButton name="Fold" onClick={this.fold} disabled={currentPlayer.id !== this.props.session} />);
    }
    return (<GameButton name="Fold" disabled />);
  }

  render() {
    return (
      <div className="GameConsole">
        {this.renderCheckOrCallButton()}
        {this.renderBetOrRaiseButton()}
        {this.renderFoldButton()}
      </div>
    );
  }
}

GameConsole.propTypes = {
  onCheck: PropTypes.func.isRequired,
  onCall: PropTypes.func.isRequired,
  onBet: PropTypes.func.isRequired,
  onRaise: PropTypes.func.isRequired,
  onFold: PropTypes.func.isRequired,
};

export default GameConsole;
