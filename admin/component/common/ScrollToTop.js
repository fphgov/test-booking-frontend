import React from "react"
import {
  withRouter
} from "react-router"

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo({
        top: document.querySelector('body').offsetTop,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
