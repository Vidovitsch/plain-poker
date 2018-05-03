import React from 'react';
import PropTypes from 'prop-types';
import './TableItemList.css';
import TableItem from './TableItem/TableItem';

class TableItemList extends React.Component {
  constructor(props) {
    super(props);
    this.setSelectedTableItem = this.setSelectedTableItem.bind(this);
  }

  setSelectedTableItem(tableItem) {
    this.props.onSelect(tableItem);
  }

  renderTableItems() {
    return this.props.tableItems.map(tableItem => (
      <TableItem onSelect={this.setSelectedTableItem} tableItem={tableItem} />
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
