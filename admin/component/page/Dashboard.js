import axios from "../assets/axios"
import qs from 'querystring'
import React from "react"
import {
  Redirect,
} from "react-router-dom"
import StoreContext from '../../StoreContext'

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
    }

    this.context.set('loading', true, () => {
      this.getSettingsData()
    })
  }

  getSettingsData() {
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
    })
  }

  componentDidMount() {
    this.context.set('loading', false)

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
      [e.target.name]: value
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
        'Accept': 'text/csv',
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
      link.setAttribute('download', `export-${(new Date()) - 0}.csv`);

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

  ErrorMini(props) {
    if (typeof props.error === 'object') {
      return Object.values(props.error).map((e, i) => {
        return (<div key={i} className="error-message-inline">{e}</div>)
      })
    } else {
      return (<div key={props.increment} className="error-message-inline">{props.error}</div>)
    }
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

          <div className="box-wrapper">
            <div className="box-left">
              <div className="box">Elérhető helyek száma<br /><span>{this.state.available}</span></div>
              <div className="box">Jelentkezettek száma<br /><span>{this.state.reserved}</span></div>
              <div className="box">Letiltott helyek száma<br /><span>{this.state.banned}</span></div>
            </div>

            <div className="box-right">
              {['developer', 'admin'].includes(this.context.get('role')) ? (
                <div className="box box-button" onClick={this.handleExport.bind(this)}>Jelentkezők exportálása</div>
               ) : null}
            </div>
          </div>

          <div className="section"></div>

          {['developer', 'admin'].includes(this.context.get('role')) ? (
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

              <input type="submit" value="Beállítások mentése" className="btn btn-primary" onClick={this.submitForm.bind(this)} />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
