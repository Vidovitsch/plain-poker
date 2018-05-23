import React from 'react';
import PropTypes from 'prop-types';
import './GameMenu.css';
import GameButton from './../GameButton/GameButton';

class GameMenu extends React.Component {
  constructor(props) {
    super(props);
    this.leave = this.leave.bind(this);
    this.start = this.start.bind(this);
    this.ready = this.ready.bind(this);
  }

  leave() {
    this.props.onLeave();
  }

  start() {
    this.props.onStart();
  }

  ready() {
    this.props.onReady();
  }

  render() {
    if (this.props.table.ownerId === this.props.session) {
      return (
        <div className="GameMenu">
          <GameButton name="start" onClick={this.start} />
          <GameButton name="leave" onClick={this.leave} />
        </div>
      );
    }
    return (
      <div className="GameMenu">
        <GameButton name="ready" onClick={this.ready} />
        <GameButton name="leave" onClick={this.leave} />
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
