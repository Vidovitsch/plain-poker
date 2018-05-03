import React from 'react';
import PropTypes from 'prop-types';
import './JoinTable.css';

class JoinTable extends React.Component {
  constructor(props) {
    super(props);
    this.joinTable = this.joinTable.bind(this);
  }

  joinTable(data) {
    this.props.onJoin(data);
  }

  render() {
    return (
      <div className="JoinTable">
        <h3>No table selected</h3>
        <table>
          <tr>
            <td className="JoinTable-label">Status:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Created at:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Startup amount:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Min. bet:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Min. player amount:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Max. player amount:</td>
            <td>-</td>
          </tr>
        </table>
        <br />
        <button className="Lobby-button" onClick={this.joinTable}>Join</button>
      </div>
    );
  }
}

JoinTable.propTypes = {
  onJoin: PropTypes.func.isRequired,
};

export default JoinTable;
