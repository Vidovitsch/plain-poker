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

  render() {
    return (
      <div className="GameConsole">
        <GameButton name="check" onClick={this.check} />
        <GameButton name="call" onClick={this.call} />
        <GameButton name="bet" onClick={this.bet} />
        <GameButton name="raise" onClick={this.raise} />
        <GameButton name="fold" onClick={this.fold} />
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
