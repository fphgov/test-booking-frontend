import axios from "../assets/axios"
import React from "react"
import qs from 'querystring'
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3'
import {
  Redirect,
} from "react-router-dom"
import StoreContext from '../../StoreContext'

export default class Login extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      email: '',
      password: '',
      error: '',
      redirect: false,
      recaptcha: null,
    }
  }

  verifyCallback = (recaptchaToken) => {
    this.setState({
      recaptcha: recaptchaToken,
    })
  }

  updateToken = () => {
    this.recaptcha.execute();
  }

  componentDidMount() {
    this.context.set('loading', false)

    document.body.classList.add('page-login')

    loadReCaptcha(process.env.SITE_KEY, this.verifyCallback)
  }

  componentWillUnmount() {
    document.body.classList.remove('page-login')
  }

  handleChangeInput(e) {
    this.setState({ error: '', [ e.target.name ]: e.target.value })
  }

  submitLogin() {
    const data = {
      email: this.state.email,
      password: this.state.password,
      'g-recaptcha-response': this.state.recaptcha,
    }

    this.context.set('loading', true)

    axios.post(process.env.REACT_APP_API_ADMIN_SERVER + process.env.REACT_APP_API_ADMIN_REQ_LOGIN, qs.stringify(data))
      .then(response => {
        if (response.data && response.data.token) {
          localStorage.setItem('auth_token', response.data.token)

          this.context.set('token', localStorage.getItem('auth_token') || '')

          this.forceUpdate()

          setTimeout(() => {
            this.setState({
              redirect: true
            })

            this.context.set('loading', false)
          }, 1000)

          if (response.status !== 200 && response.data && response.data.message) {
            this.setState({
              error: response.data.message
            })

            localStorage.removeItem('auth_token')
          }

          this.context.set('loading', false)
        }
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          this.setState({
            error: error.response.data.message
          })
        }

        localStorage.removeItem('auth_token')

        this.context.set('loading', false)
      })
  }

  Error(props) {
    return (
      <div className="error-message">
        {props.message}
      </div>
    )
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to='/' />
    }

    return (
      <div className="page-login-section">
        <div className="container">
          {this.state.error ? <this.Error message={this.state.error} /> : null}

          <div className="form-wrapper">
            <div className="input-wrapper">
              <label htmlFor="email">E-mail cím</label>
              <input type="text" placeholder="E-mail cím" name="email" id="email" value={this.state.email} onChange={this.handleChangeInput.bind(this)} />
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Jelszó</label>
              <input type="password" placeholder="Jelszó" name="password" id="password" value={this.state.password} onChange={this.handleChangeInput.bind(this)} />
            </div>

            <ReCaptcha
              ref={ref => this.recaptcha = ref}
              sitekey={process.env.SITE_KEY}
              action='submit'
              verifyCallback={this.verifyCallback}
            />

            <input type="submit" value="Bejelentkezés" className="btn btn-primary" onClick={this.submitLogin.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
