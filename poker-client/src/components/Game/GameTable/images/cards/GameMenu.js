port React from 'react';
import PropTypes from 'prop-types';
import Popup from 'react-popup';
import './popup.css';
import './GameMenu.css';
import GameButton from './../GameButton/GameButton';
import Timer from './../Timer/Timer';

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

  renderStatusButton() {
    const btn = this.props.owner === this.props.session ?
      <GameButton name="Start" onClick={this.start} /> :
      <GameButton name="Ready" onClick={this.ready} disabled />;
    return btn;
  }

  render() {
    return (
      <div className="GameMenu">
        <div className="menu-console">
          <GameButton name="Leave" onClick={this.leave} />
          {this.renderStatusButton()}
        </div>
        <Timer turnTime={this.props.staticTable.turnTime} />
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
