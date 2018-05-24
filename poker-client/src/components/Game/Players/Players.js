import React from 'react';
import PropTypes from 'prop-types';
import './Players.css';
import PlayerItem from './../PlayerItem/PlayerItem';

/**
 * [Card description]
 * @extends React
 */
class Players extends React.Component {
  constructor(props) {
    super(props);
    this.orderedPlayers = this.orderPlayers();
    // Every index of players has a unique class
    // that places the player on the correct position
    this.indexToClassMap = {
      0: 'self',
      1: 'other1',
      2: 'other2',
      3: 'other3',
      4: 'other4',
    };
  }

  /**
   * [orderPlayers description]
   * @return {Array} [description]
   */
  orderPlayers() {
    const { players, session } = this.props;
    let indexSelf = 0;
    players.forEach((player, index) => {
      if (player.id === session) {
        indexSelf = index;
      }
    });
    return players.concat(players.splice(0, indexSelf));
  }

  /**
   * [renderPlayerItems description]
   * @return {Array} [description]
   */
  renderPlayerItems() {
    let count = 0;
    return this.orderedPlayers.map((player) => {
      const element = (
        <div id={this.indexToClassMap[count]} className="PlayerItem-container">
          <PlayerItem session={this.props.session} player={player} />
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

Players.propTypes = {
  session: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
};

export default Players;
