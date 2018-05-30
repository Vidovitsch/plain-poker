import React from 'react';

class Prompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue,
    };
    this.onChange = e => this._onChange(e);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onChange(this.state.value);
    }
  }

  _onChange(e) {
    const value = e.target.value;

    this.setState({ value });
  }

  render() {
    return (
      <div className="Prompt">
        <input
          type="text"
          placeholder={this.props.placeholder}
          className="mm-popup__input"
          value={this.state.value}
          onChange={this.onChange}
        />
        <span>{this.props.message}</span>
      </div>
    );
  }
}

export default Prompt;
