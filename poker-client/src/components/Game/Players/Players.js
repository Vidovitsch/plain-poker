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
    console.log(props);
    // this.orderedPlayers = this.orderPlayers();
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
    let indexSelf = 0;
    this.props.players.forEach((player, index) => {
      if (player.id === this.props.session) {
        indexSelf = index;
      }
    });
    return this.props.players.concat(this.props.players.splice(0, indexSelf));
  }

  /**
   * [createPlayerItem description]
   * @param  {Player} player [description]
   * @param  {Number} index  [description]
   * @return {JSX}        [description]
   */
  createPlayerElement(player, index) {
    return (
      <div id={this.indexToClassMap[index]} className="PlayerItem-container">
        <PlayerItem
          session={this.props.session}
          player={player}
          highlight={player.status === 'ready' || player.status === 'on'}
          self={this.props.session === player.id}
        />
      </div>
    );
  }

  /**
   * [renderPlayerItems description]
   * @return {Array} [description]
   */
  renderPlayerElements() {
    let index = 0;
    return this.orderPlayers().map((player) => {
      const element = this.createPlayerElement(player, index);
      index += 1;
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
        {this.renderPlayerElements()}
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
