import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TableItemDetails.css';

class TableItemDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="TableItemDetails">
        <h3>No table selected</h3>
        <table>
          <tr>
            <td className="TableItemDetails-label">Status:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="TableItemDetails-label">Created at:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="TableItemDetails-label">Startup amount:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="TableItemDetails-label">Min. bet:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="TableItemDetails-label">Min. player amount:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="TableItemDetails-label">Max. player amount:</td>
            <td>-</td>
          </tr>
        </table>
      </div>
    );
  }
}

export default TableItemDetails;
