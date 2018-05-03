import React from 'react';
import PropTypes from 'prop-types';
import './TableItemList.css';

class TableItemList extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTableItems() {
    console.log('here');
    console.log(this.props.tableItems);
    // return this.props.tableItems.map(tableItem => (
    //   <span>Hoi</span>
    // ));
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
