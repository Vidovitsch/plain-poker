import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TableItem.css';

class TableItem extends Component {
  constructor(props) {
    super(props);
    this.setSelectedTableItem = this.setSelectedTableItem.bind(this);
  }

  setSelectedTableItem() {
    this.props.onSelect(this.props.tableItem);
  }

  render() {
    return (
      <div className="TableItem" onClick={this.setSelectedTableItem} onKeyUp={this.setSelectedTableItem} role="button" tabIndex={0}>
        <div className="TableItem-item">
          {this.props.tableItem.name}
        </div>
      </div>
    );
  }
}

// id: PropTypes.string,
// sendTo: PropTypes.string,
// name: PropTypes.string,
// timestamp: PropTypes.string,
// status: PropTypes.string,
// minPlayerNo: PropTypes.number,
// maxPlayerNo: PropTypes.number,
// minBet: PropTypes.number,
// initialAmount: PropTypes.number,

export default TableItem;
