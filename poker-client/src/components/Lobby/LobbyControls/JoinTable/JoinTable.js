import React from 'react';
import PropTypes from 'prop-types';
import './JoinTable.css';

class JoinTable extends React.Component {
  constructor(props) {
    super(props);
    this.joinTable = this.joinTable.bind(this);
    this.getDetailValue = this.getDetailValue.bind(this);
  }

  joinTable(data) {
    this.props.onJoin(data);
  }

  getDetailValue(prop) {
    if (this.props.selectedTableItem) {
      return this.props.selectedTableItem[prop] || '-';
    } else if (prop === 'name') {
      return 'No table selected';
    }
    return '-';
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
            <td className="JoinTable-label">Created at:</td>
            <td>{this.getDetailValue('timestamp')}</td>
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
            <td className="JoinTable-label">Min. player amount:</td>
            <td>{this.getDetailValue('minPlayerNo')}</td>
          </tr>
          <tr>
            <td className="JoinTable-label">Max. player amount:</td>
            <td>{this.getDetailValue('maxPlayerNo')}</td>
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
