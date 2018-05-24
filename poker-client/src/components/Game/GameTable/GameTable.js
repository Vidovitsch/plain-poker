import React from 'react';
import PropTypes from 'prop-types';
import './GameTable.css';
import gameTableImg from './images/gametable.png';
import CommunityCards from './../CommunityCards/CommunityCards';
import Players from './../Players/Players';

class GameTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="GameTable">
        <img id="gameTableImg" src={gameTableImg} alt="gametable" />
        <CommunityCards cards={this.props.communityCards} />
        <Players session={this.props.session} players={this.props.players} />
      </div>
    );
  }
}

GameTable.propTypes = {

};

export default GameTable;
