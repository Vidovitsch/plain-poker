import React from 'react';
import PropTypes from 'prop-types';
import './GameMenu.css';
import GameButton from './../GameButton/GameButton';
import Timer from './../Timer/Timer';
import Popup from './../../../popupProvider';

class GameMenu extends React.Component {
  constructor(props) {
    super(props);
    this.leave = this.leave.bind(this);
    this.start = this.start.bind(this);
    this.ready = this.ready.bind(this);
  }

  leave() {
    Popup.confirm('Are you sure?', 'Leaving will cause to lose your current bet!').then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onLeave();
      }
    });
  }

  start() {
    const { turnTime } = this.props;
    Popup.confirm('Are you sure?', `Every player gets ${turnTime} seconds to get ready!`).then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onStart();
      }
    });
  }

  ready() {
    this.props.onReady();
  }

  renderStartButton() {
    const { minPlayerNo, playerNo } = this.props;
    return (
      <GameButton name="Start" onClick={this.start} disabled={minPlayerNo > playerNo} />
    );
  }

  renderReadyButton() {
    const { status } = this.props;
    return (
      <GameButton name="Ready" onClick={this.ready} disabled={status !== 'starting'} />
    );
  }

  renderLeaveButton() {
    const { status } = this.props;
    return (
      <GameButton name="Leave" onClick={this.leave} disabled={status === 'starting'} />
    );
  }

  renderTimer() {
    const { turnTime } = this.props;
    return (
      <Timer turnTime={turnTime} />
    );
  }

  render() {
    const { gameOwner, session } = this.props;
    return (
      <div className="GameMenu">
        <div className="menu-console">
          {gameOwner === session ? this.renderStartButton() : ''}
          {this.renderLeaveButton()}
        </div>
        {this.renderTimer()};
      </div>
    );
  }
}

GameMenu.propTypes = {
  session: PropTypes.string.isRequired,
  minPlayerNo: PropTypes.number.isRequired,
  turnTime: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  gameOwner: PropTypes.string.isRequired,
  playerNo: PropTypes.number.isRequired,
  onLeave: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default GameMenu;
