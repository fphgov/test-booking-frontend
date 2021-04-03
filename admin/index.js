import React from "react";
import ReactDOM from "react-dom";
import App from "./component/App";
import store from 'store'
import "./index.css";
import "./ie.css";
import "normalize";
import "grid";
import StoreContext from './StoreContext'
import Loading from './component/common/Loading'

class AppWithContext extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      loggedIn: false,
      get: (key) => {
        return typeof store.get('state') !== 'undefined' && typeof store.get('state')[ key ] !== 'undefined' ? store.get('state')[ key ] : this.state[ key ]
      },
      set: (key, value, cb) => {
        const state = this.state
        state[ key ] = value

        if (typeof cb === 'function') {
          this.setState(state, cb)
        } else {
          this.setState(state)
        }
      },
      remove: (key, cb) => {
        const state = this.state
        delete state[ key ]

        if (typeof cb === 'function') {
          this.setState(state, cb)
        } else {
          this.setState(state)
        }
      }
    }
  }

  UNSAFE_componentWillMount() {
    const state = store.get('state')

    this.setState(state)
  }

  render() {
    const { loading } = this.state;

    return (
      <StoreContext.Provider value={this.state}>
        {loading ? <Loading /> : null}

        <App />
      </StoreContext.Provider>
    )
  }
}

ReactDOM.render(<AppWithContext />, document.getElementById("root"));
