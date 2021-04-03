import axios from "../assets/axios"
import qs from 'querystring'
import React from "react"
import {
  Redirect,
} from "react-router-dom"
import StoreContext from '../../StoreContext'
import tokenParser from '../assets/tokenParser'

export default class Dashboard extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      redirectLogin: false,
      close: false,
      reserved: 'N/A',
      available: 'N/A',
      banned: 'N/A',
      appointments: [],
    }

    this.context.set('loading', true, () => {
      this.getSettingsData()
    })
  }

  getSettingsData() {
    if (! ['developer', 'admin'].includes(tokenParser('user.role'))) {
      this.context.set('loading', false)

      return
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    }

    const link = process.env.REACT_APP_API_ADMIN_REQ_OPTIONS.toString()

    axios.get(process.env.REACT_APP_API_ADMIN_SERVER + link, config)
      .then(response => {
        if (response.data) {
          this.setState({
            close: response.data.settings && response.data.settings.close ? response.data.settings.close : false,
            reserved: response.data.infos && response.data.infos.reserved ? response.data.infos.reserved : 'N/A',
            available: response.data.infos && response.data.infos.available ? response.data.infos.available : 'N/A',
            banned: response.data.infos && response.data.infos.banned ? response.data.infos.banned : 'N/A',
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

  componentDidMount() {
    if (localStorage.getItem('auth_token') === null) {
      this.setState({
        redirectLogin: true
      })
    } else {
      this.context.set('token', localStorage.getItem('auth_token'))
      this.context.set('loggedIn', true)

      this.setState({
        redirect: true
      })
    }

    document.body.classList.add('page-dashboard')
  }

  componentWillUnmount() {
    document.body.classList.remove('page-dashboard')
  }

  handleChangeInput(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

    this.setState({
      [ e.target.name ]: value
    })
  }

  submitForm() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    }

    const data = {
      close: this.state.close,
    }

    axios.post(
      process.env.REACT_APP_API_ADMIN_SERVER + process.env.REACT_APP_API_ADMIN_REQ_OPTIONS,
      qs.stringify(data),
      config
    )
      .then(response => {
        if (response.data) {
          this.setState({
            success: true
          })
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          this.setState({
            redirectLogin: true
          })

          this.context.set('loading', false)

          return
        }

        if (error.response && error.response.data && error.response.data.errors) {
          this.setState({
            error: error.response.data.errors
          })
        }

        this.context.set('loading', false)
      })
  }

  handleExport() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: 'blob'
    }

    this.context.set('loading', true)

    axios.get(
      process.env.REACT_APP_API_ADMIN_SERVER + process.env.REACT_APP_API_ADMIN_REQ_EXPORT,
      config
    )
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([ response.data ]));
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', `export-${(new Date()) - 0}.xlsx`);

        document.body.appendChild(link);

        link.click();

        this.context.set('loading', false)
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          this.setState({
            redirectLogin: true
          })

          this.context.set('loading', false)

          return
        }

        if (error.response && error.response.data && error.response.data.errors) {
          this.setState({
            error: error.response.data.errors
          })
        }

        this.context.set('loading', false)
      })
  }

  handleCacheClear() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    }

    this.context.set('loading', true)

    axios.get(
      process.env.REACT_APP_API_ADMIN_SERVER + process.env.REACT_APP_API_ADMIN_REQ_CACHE_CLEAR,
      config
    )
      .then(() => {
        this.context.set('loading', false)
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          this.setState({
            redirectLogin: true
          })

          this.context.set('loading', false)

          return
        }

        if (error.response && error.response.data && error.response.data.errors) {
          this.setState({
            error: error.response.data.errors
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
    const { redirectLogin } = this.state

    if (redirectLogin) {
      return <Redirect to='/login' />
    }

    return (
      <div className="dashboard">
        <div className="container">
          <h1>Irányítópult</h1>

          {['developer', 'admin'].includes(tokenParser('user.role')) ? (
            <>
              <div className="box-wrapper">
                <div className="box-left">
                  <div className="box">Elérhető helyek száma<br /><span>{this.state.available}</span></div>
                  <div className="box">Jelentkezettek száma<br /><span>{this.state.reserved}</span></div>
                  <div className="box">Letiltott helyek száma<br /><span>{this.state.banned}</span></div>
                </div>

                <div className="box-right">
                  <div className="input-wrapper">
                    <div className="box box-button" onClick={this.handleCacheClear.bind(this)}>Gyorsítótár ürítés</div>
                  </div>

                  <div className="input-wrapper">
                    <div className="box box-button" onClick={this.handleExport.bind(this)}>Jelentkezők exportálása</div>
                  </div>
                </div>
              </div>

              <div className="section"></div>

              <div className="stat-wrappers">
                {Object.entries(this.groupBy(this.state.appointments, 'date')).map((app, i) => {
                  return <div className="stat-wrapper" key={i}>
                    <div className="stat-day">{app[ 0 ]}</div>
                    <div className="stats">
                      {app[ 1 ].map((stat, x) => {
                        return <div className="stat-row" key={x}><div className="stat-elem stat-hour">{stat.hour}</div><div className="stat-elem stat-attended">{stat.allApplicant}</div><div className={`stat-elem stat-sum stat-eq-${stat.allApplicant - stat.attended}`}>{stat.attended}</div></div>
                      })}
                    </div>
                  </div>;
                })}
              </div>

              <div className="section"></div>

              <div style={{ marginBottom: 40 }}>
                <div className="form">
                  <div className="input-wrapper">
                    <label htmlFor="close">
                      <input type="checkbox" name="close" id="close" checked={this.state.close} onChange={this.handleChangeInput.bind(this)} />

                      A jelentkezés lezárása
                  </label>

                    {this.state.error && this.state.error.close ? Object.values(this.state.error.close).map((err, i) => {
                      return <this.ErrorMini error={err} increment={i} />
                    }) : null}
                  </div>
                </div>

                <input type="submit" value="Beállítások mentése" className="btn btn-primary" onClick={this.submitForm.bind(this)} />
              </div>
            </>
          ) : <div>Válasszon a menüpontok közül.</div>}
        </div>
      </div>
    )
  }
}
