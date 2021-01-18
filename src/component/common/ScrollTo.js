import React from "react"

class ScrollTo extends React.Component {
  componentDidMount() {
    window.scrollTo({
      top: this.props.element,
      left: 0,
      behavior: 'smooth'
    });
  }

  render() {
    return this.props.children
  }
}

export default ScrollTo
