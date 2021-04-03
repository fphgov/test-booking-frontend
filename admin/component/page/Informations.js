import axios from "../assets/axios"
import React from "react"
import {
  Redirect,
} from "react-router-dom"
import StoreContext from '../../StoreContext'

export default class Informations extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      error: null,
      redirect: false,
      redirectLogin: false,
      appointments: [],
    }

    this.context.set('loading', true, () => {
      this.getApplicantData()
    })
  }

  componentDidMount() {
    if (localStorage.getItem('auth_token') === null) {
      this.setState({
        redirectLogin: true
      })
    }

    document.body.classList.add('page-new-informations')
  }

  componentWillUnmount() {
    document.body.classList.remove('page-new-informations')
  }

  getApplicantData() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    }

    axios.get(process.env.REACT_APP_API_ADMIN_SERVER + process.env.REACT_APP_API_ADMIN_REQ_INFORMATIONS, config)
    .then(response => {
      if (response.data) {
        this.setState({
          appointments: response.data.infos && response.data.infos.appointments ? response.data.infos.appointments : [],
        })

        this.context.set('loading', false)
      }
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        this.setState({
          error: error.response.data.message
        })
      }

      this.context.set('loading', false)
    })
  }

  ErrorMini(props) {
    if (typeof props.error === 'object') {
      return Object.values(props.error).map((e, i) => {
        return (<div key={i} className="error-message-inline">{e}</div>)
      })
    } else {
      return (<div key={props.increment} className="error-message-inline">{props.error}</div>)
    }
  }

  groupBy(list, props) {
    return list.reduce((a, b) => {
      (a[ b[ props ] ] = a[ b[ props ] ] || []).push(b);
      return a;
    }, {});
  }

  render() {
    const { redirect, redirectLogin } = this.state

    if (redirect) {
      return <Redirect to='/checks' />
    }

    if (redirectLogin) {
      return <Redirect to='/login' />
    }

    return (
      <div className="proposal">
        <div className="container">
          <h1>Napi jelenlét</h1>

          <div className="stat-wrappers">
            {Object.entries(this.groupBy(this.state.appointments, 'pId')).map((pApp, pI) => {
              return <div className="stat-places" key={pI}>
                <div className="stat-place">{pApp[0]}</div>

                {Object.entries(this.groupBy(pApp[1], 'date')).map((app, i) => {
                  return <div className="stat-wrapper" key={i}>
                    <div className="stat-day">{app[0]}</div>
                    <div className="stats">
                      {app[1].map((stat, x) => {
                        return <div className="stat-row" key={x}><div className="stat-elem stat-hour">{stat.hour}</div><div className="stat-elem stat-attended">{stat.allApplicant}</div><div className={`stat-elem stat-sum stat-eq-${stat.allApplicant - stat.attended}`}>{stat.attended}</div></div>
                      })}
                    </div>
                  </div>;
                })}
              </div>
            })}

            {this.state.appointments.length === 0 ? <div>Nincs elérhető információ</div> : null }
          </div>
        </div>
      </div>
    )
  }
}
