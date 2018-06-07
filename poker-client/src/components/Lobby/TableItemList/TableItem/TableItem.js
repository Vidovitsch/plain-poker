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
          {this.props.tableItem.staticTable.name}
        </div>
      </div>
    );
  }
}

TableItem.propTypes = {
  tableItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.string,
    playerNo: PropTypes.number,
    minPlayerNo: PropTypes.number,
    maxPlayerNo: PropTypes.number,
    minBet: PropTypes.number,
    startupAmount: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TableItem;
