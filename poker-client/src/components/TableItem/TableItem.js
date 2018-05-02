import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TableItem.css';

class TableItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="TableItem">
        <span>{this.props.tableItem.name}</span>
      </li>
    );
  }
}

TableItem.propTypes = {
  tableItem: PropTypes.shape({
    id: PropTypes.string,
    sendTo: PropTypes.string,
    name: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.string,
    minPlayerNo: PropTypes.number,
    maxPlayerNo: PropTypes.number,
    minBet: PropTypes.number,
    initialAmount: PropTypes.number,
  }).isRequired,
};

export default TableItem;
