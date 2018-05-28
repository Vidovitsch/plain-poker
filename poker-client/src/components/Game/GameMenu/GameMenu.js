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
    const { minPlayerNo, table: { status, playerNo } } = this.props;
    return (
      <GameButton name="Start" onClick={this.start} disabled={minPlayerNo > playerNo || status === 'starting'} />
    );
  }

  renderReadyButton() {
    const { status } = this.props.table;
    return (
      <GameButton name="Ready" onClick={this.ready} disabled={status !== 'starting'} />
    );
  }

  renderLeaveButton() {
    const { status } = this.props.table;
    return (
      <GameButton name="Leave" onClick={this.leave} disabled={status === 'starting'} />
    );
  }

  renderTimer() {
    const { table: { status }, turnTime } = this.props;
    return (
      <Timer status={status} turnTime={turnTime} />
    );
  }

  render() {
    const { table: { ownerId }, session } = this.props;
    return (
      <div className="GameMenu">
        <div className="menu-console">
          {ownerId === session ? this.renderStartButton() : this.renderReadyButton()}
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
  onLeave: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  table: PropTypes.shape({
    status: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })).isRequired,
    bets: PropTypes.shape({
      playerId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
    smallBlind: PropTypes.string,
    bigBlind: PropTypes.string,
    communityCards: PropTypes.arrayOf(PropTypes.shape({
      card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        deckId: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        suit: PropTypes.string.isRequired,
        wild: PropTypes.string.isRequired,
        points: PropTypes.number.isRequired,
      }).isRequired,
      dealerId: PropTypes.string.isRequired,
      ownerId: PropTypes.string.isRequired,
    })),
    totalBet: PropTypes.number,
  }).isRequired,
};

export default GameMenu;
