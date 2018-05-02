import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TableItemList.css';

import TableItem from './../TableItem/TableItem';

class TableItemList extends Component {
  constructor(props) {
    super(props);
  }

  renderTableItems() {
    console.log('here');
    console.log(this.props.tableItems);
    return this.props.tableItems.map(tableItem => (
      <TableItem key={tableItem.id} tableItem={tableItem} />
    ));
  }

  render() {
    return (
      <div className="TableItemList">
        {this.renderTableItems()}
      </div>
    );
  }
}

TableItemList.propTypes = {
  tableItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    sendTo: PropTypes.string,
    name: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.string,
    minPlayerNo: PropTypes.number,
    maxPlayerNo: PropTypes.number,
    minBet: PropTypes.number,
    initialAmount: PropTypes.number,
  })).isRequired,
};

export default TableItemList;
