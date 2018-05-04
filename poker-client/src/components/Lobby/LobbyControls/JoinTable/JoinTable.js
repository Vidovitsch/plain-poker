import React from 'react';
import PropTypes from 'prop-types';
import './JoinTable.css';

class JoinTable extends React.Component {
  constructor(props) {
    super(props);
    this.joinTable = this.joinTable.bind(this);
    this.getDetailValue = this.getDetailValue.bind(this);
  }

  getDetailValue(prop) {
    if (this.props.selectedTableItem) {
      return this.props.selectedTableItem[prop] || '-';
    } else if (prop === 'name') {
      return 'No table selected';
    }
    return '-';
  }

  joinTable() {
    if (this.props.selectedTableItem) {
      this.props.onJoin(this.props.selectedTableItem.id);
    }
  }

  render() {
    return (
      <div className="JoinTable">
        <h3>{this.getDetailValue('name')}</h3>
        <table>
          <tr>
            <td className="JoinTable-label">Status:</td>
            <td>{this.getDetailValue('status')}</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Startup amount:</td>
            <td>{this.getDetailValue('startupAmount')}</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Min. bet:</td>
            <td>{this.getDetailValue('minBet')}</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Number of players:</td>
            <td>{this.getDetailValue('playerNo')}</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Min. player amount:</td>
            <td>{this.getDetailValue('minPlayerNo')}</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Max. player amount:</td>
            <td>{this.getDetailValue('maxPlayerNo')}</td>
          </tr>
        </table>
        <br />
        <button id="joinTable-button" className="Lobby-button" onClick={this.joinTable}>Join</button>
      </div>
    );
  }
}

JoinTable.propTypes = {
  onJoin: PropTypes.func.isRequired,
  selectedTableItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.string,
    playerNo: PropTypes.number,
    minPlayerNo: PropTypes.number,
    maxPlayerNo: PropTypes.number,
    minBet: PropTypes.number,
    startupAmount: PropTypes.number,
  }),
};

JoinTable.defaultProps = {
  selectedTableItem: {},
};

export default JoinTable;
