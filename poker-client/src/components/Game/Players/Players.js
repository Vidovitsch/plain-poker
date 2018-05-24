import React from 'react';
import PropTypes from 'prop-types';
import './Players.css';
import PlayerItem from './../PlayerItem/PlayerItem';

const players = [
  {
    name: 'Test',
    amount: '5000',
  },
  {
    name: 'Test1',
    amount: '5001',
  },
  {
    name: 'Test2',
    amount: '5002',
  },
  {
    name: 'Test3',
    amount: '5003',
  },
  {
    name: 'Test4',
    amount: '5004',
  },
];

/**
 * [Card description]
 * @extends React
 */
class Players extends React.Component {
  constructor(props) {
    super(props);
    this.playerIndexMap = {
      0: 'self',
      1: 'other1',
      2: 'other2',
      3: 'other3',
      4: 'other4',
    };
  }

  renderPlayerItems() {
    let count = 0;
    return players.map((player) => {
      const element = (
        <div id={this.playerIndexMap[count]} className="PlayerItem-container">
          <PlayerItem player={player} />
        </div>
      );
      count += 1;
      return element;
    });
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="Players">
        {this.renderPlayerItems()}
      </div>
    );
  }
}


export default Players;
