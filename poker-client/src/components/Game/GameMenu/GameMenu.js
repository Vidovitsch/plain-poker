import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'react-popup';
import './popup.css';
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
    Popup.plugins().confirm('Are you sure?', 'Leaving will cause to lose your current bet!', (isConfirmed) => {
      if (isConfirmed) {
        this.props.onLeave();
      }
    });
  }

  start() {
    Popup.plugins().confirm('Are you sure?', 'Every player gets 60 seconds to get ready after starting!', (isConfirmed) => {
      if (isConfirmed) {
        this.props.onStart();
      }
    });
  }

  ready() {
    this.props.onReady();
  }

  render() {
    if (this.props.table.ownerId === this.props.session) {
      return (
        <div className="GameMenu">
          <Popup />
          <GameButton name="start" onClick={this.start} />
          <GameButton name="leave" onClick={this.leave} />
        </div>
      );
    }
    return (
      <div className="GameMenu">
        <GameButton name="ready" onClick={this.ready} disabled />
        <GameButton name="leave" onClick={this.leave} />
      </div>
    );
  }
}

/* eslint-disable func-names */
Popup.registerPlugin('confirm', function (title, content, callback) {
  this.create({
    title,
    content,
    buttons: {
      left: [{
        text: 'Cancel',
        action() {
          callback(false);
          Popup.close();
        },
      }],
      right: [{
        text: 'Ok',
        className: 'danger',
        action() {
          callback(true);
          Popup.close();
        },
      }],
    },
  });
});
/* eslint-enable func-names */

GameMenu.propTypes = {
  onLeave: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default GameMenu;
