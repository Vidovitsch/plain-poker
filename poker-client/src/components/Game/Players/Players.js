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
  }

  /**
   * [render description]
   * @return {JSX} [description]
   */
  render() {
    return (
      <div className="Players">
        <PlayerItem />
      </div>
    );
  }
}


export default Players;
