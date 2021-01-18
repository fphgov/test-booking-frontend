import React from "react";

export default class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    return (
      <div className="page">
        {this.props.children}
      </div>
    )
  }
}
