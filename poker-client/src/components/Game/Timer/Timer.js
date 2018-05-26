import React from 'react';
import './Timer.css';

class Timer extends React.Component {
  /**
   * [constructor description]
   * @param {Object} props [description]
   */
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      timeRemaining: 30,
    };
  }

  /**
   * [stopTimer description]
   */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * [startTimer description]
   */
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

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="Timer">
        <div>{this.state.timeRemaining}</div>
      </div>
    );
  }
}

export default Timer;
