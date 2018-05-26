import React from 'react';
import PropTypes from 'prop-types';
import './Timer.css';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      timeRemaining: 30,
    };
  }

  componentWillUpdate({ status }) {
    if (status === 'starting' && !this.timer) {
      this.startTimer();
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.state.timeRemaining === 0) {
        this.stopTimer();
      } else {
        this.setState({
          timeRemaining: this.state.timeRemaining - 1,
        });
      }
    }, 1000);
  }

  render() {
    return (
      <div className="Timer">
        <div>{this.state.timeRemaining}</div>
      </div>
    );
  }
}

Timer.propTypes = {

};

export default Timer;
