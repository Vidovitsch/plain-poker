import React from 'react';
import './GameControls.css';

class GameControls extends React.Component {
  constructor(props) {
    super(props);
  }

  setTable(table) {
    this.setState({
      table,
    });
  }

  render() {
    return (
      <div className="GameControls" />
      </div>
    );
  }
}

export default GameControls;
