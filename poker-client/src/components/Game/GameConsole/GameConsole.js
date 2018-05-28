import React from 'react';
import PropTypes from 'prop-types';
import './GameConsole.css';
import GameButton from './../GameButton/GameButton';

class GameConsole extends React.Component {
  constructor(props) {
    super(props);
    this.check = this.check.bind(this);
    this.call = this.call.bind(this);
    this.bet = this.bet.bind(this);
    this.raise = this.raise.bind(this);
    this.fold = this.fold.bind(this);
  }

  check() {
    this.props.onCheck();
  }

  call() {
    this.props.onCall();
  }

  bet() {
    this.props.onBet();
  }

  raise() {
    this.props.onRaise();
  }

  fold() {
    this.props.onFold();
  }

  getPreviousPlayer(currentPlayer) {
    let index = this.props.table.players.indexOf(currentPlayer) - 1;
    if (index === -1) {
      index = this.props.table.players.length - 1;
    }
    return this.props.table.players[index];
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
    const betPlayer = this.props.table.players.find(p => p.startus === 'bet');
    if (betPlayer && betPlayer.id !== this.props.session) {
      return (<GameButton name="Raise" onClick={this.raise} />);
    }
    return (<GameButton name="Bet" onClick={this.bet} />);
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
