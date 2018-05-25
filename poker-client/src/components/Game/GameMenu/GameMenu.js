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
    Popup.confirm('Are you sure?', 'Every player gets 30 seconds to get ready!').then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onStart();
      }
    });
  }

  ready() {
    this.props.onReady();
  }

  renderStatusButton() {
    const { minPlayerNo } = this.props.staticTable;
    const { ownerId, players, status } = this.props.variableTable;
    const btn = ownerId === this.props.session ?
      <GameButton name="Start" onClick={this.start} disabled={minPlayerNo > players.length} /> :
      <GameButton name="Ready" onClick={this.ready} disabled={status !== 'starting'} />;
    return btn;
  }

  render() {
    return (
      <div className="GameMenu">
        <div className="menu-console">
          <GameButton
            name="Leave"
            onClick={this.leave}
            disabled={this.props.variableTable.status === 'starting'}
          />
          {this.renderStatusButton()}
        </div>
        <Timer turnTime={this.props.staticTable.turnTime} />
      </div>
    );
  }
}

GameMenu.propTypes = {
  onLeave: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default GameMenu;
