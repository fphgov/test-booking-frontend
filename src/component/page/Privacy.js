import React from "react"
import Helmet from "react-helmet"

export default class Privacy extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="privacy">
        <Helmet>
          <title>Tájékoztató a koronavírus gyorstesztről</title>
        </Helmet>

        <div className="container">
          <h1 style={{ textAlign: 'center' }}>Tájékoztató</h1>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>

          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        </div>
      </div>
    )
  }
}
