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

  getPreviousPlayer(currentPlayer) {
    let index = this.props.table.players.indexOf(currentPlayer) - 1;
    if (index === -1) {
      index = this.props.table.players.length - 1;
    }
    return this.props.table.players[index];
  }

  validateBet(amount) {
    const { minBet, session, table: { players } } = this.props;
    const self = players.find(p => p.id === session);
    if (amount >= minBet && amount <= self.amount) {
      return true;
    }
    return false;
  }

  check() {
    this.props.onCheck();
  }

  call() {
    this.props.onCall();
  }

  bet() {
    const { minBet } = this.props;
    const title = 'How much do you want to bet?';
    const message = `You have to bet a minimum of €${minBet}.`;
    const placeholder = 'Your bet';
    const initialValue = minBet;
    Popup.prompt(title, message, placeholder, initialValue).then((amount) => {
      if (this.validateBet(amount)) {
        // TODO:
      }
    });
    this.props.onBet();
  }

  raise() {
    const { minRaise } = this.props.table;
    const title = 'How much do you want to raise?';
    const message = `You have to raise a minimum of €${minRaise}.`;
    const placeholder = 'Your raise';
    const initialValue = minRaise;
    Popup.prompt(title, message, placeholder, initialValue).then((amount) => {
      if (this.validateBet(amount)) {
        // TODO:
      }
    });
    this.props.onRaise();
  }

  fold() {
    this.props.onFold();
  }

  renderCheckOrCallButton() {
    const currentPlayer = this.props.table.players.find(p => p.status === 'turn');
    if (currentPlayer) {
      const previousPlayer = this.getPreviousPlayer(currentPlayer);
      if (this.props.table.bets[previousPlayer.id] > this.props.table.bets[this.props.session]) {
        return (<GameButton name="Call" onClick={this.call} />);
      }
    }
    return (<GameButton name="Check" onClick={this.check} />);
  }

  renderBetOrRaiseButton() {
    const betPlayer = this.props.table.players.find(p => p.status === 'bet');
    return (<GameButton name="Raise" onClick={this.raise} />);
  }

  renderFoldButton() {
    return (<GameButton name="Fold" onClick={this.fold} />);
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
