import axios from "../assets/axios"
import React from "react"
import {
  Redirect,
  Link,
} from "react-router-dom"
import StoreContext from '../../StoreContext'
import tokenParser from '../assets/tokenParser'

export default class Check extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      error: null,
      redirect: false,
      redirectLogin: false,
      id: null,
      humanId: '',
      location: '',
      appointment: '',
      notified: '',
      attended: false
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

    document.body.classList.add('page-new-check')
  }

  componentWillUnmount() {
    document.body.classList.remove('page-new-check')
  }

  handleChangeInput(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [ e.target.name ]: e.target.checked })
    } else {
      this.setState({ [ e.target.name ]: e.target.value })
    }
  }

  handleOnlyNumberChangeInput(e) {
    const numberRegex = /[^0-9]+/g

    let value = e.target.value

    if (numberRegex.test(value)) {
      value = value.replace(numberRegex, '')
    }

    this.setState({ error: '', [ e.target.name ]: e.target.value.replace(numberRegex, '') || "" })
  }

  getApplicantData() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    }

    const link = process.env.REACT_APP_API_ADMIN_REQ_CHECK.toString().replace(':id', this.props.match.params.id)

    axios.get(process.env.REACT_APP_API_ADMIN_SERVER + link, config)
    .then(response => {
      if (response.data) {
        this.setState({
          id: response.data.data.id,
          humanId: response.data.data.humanId,
          firstname: response.data.data.firstname,
          lastname: response.data.data.lastname,
          location: response.data.data.location,
          appointment: response.data.data.appointment,
          notified: response.data.data.notified,
          attended: response.data.data.attended,
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

  submitApplicant(e) {
    e.preventDefault();

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }

    var data = new FormData();
    data.append("attended", true);

    const link = process.env.REACT_APP_API_ADMIN_REQ_CHECK.toString().replace(':id', this.props.match.params.id)

    axios.post(
      process.env.REACT_APP_API_ADMIN_SERVER + link,
      data,
      config
    )
    .then(response => {
      if (response.data) {
        this.setState({
          id: response.data.data.id,
          humanId: response.data.data.humanId,
          firstname: response.data.data.firstname,
          lastname: response.data.data.lastname,
          location: response.data.data.location,
          appointment: response.data.data.appointment,
          notified: response.data.data.notified,
          attended: response.data.data.attended
        })
      }
    })
    .catch(error => {
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
    const { redirect, redirectLogin, humanId } = this.state

    if (redirect) {
      return <Redirect to='/checks' />
    }

    if (redirectLogin) {
      return <Redirect to='/login' />
    }

    if (! humanId) {
      return null
    }

    return (
      <div className="proposal">
        <div className="container">
          <h1>{humanId}</h1>

          <div className="error-wrapper">
            {this.state.error && this.state.error.applicant ? Object.values(this.state.error.applicant).map((err, i) => {
              return <this.ErrorMini key={i} error={err} increment={`applicant-${i}`} />
            }) : null}
          </div>

          <div className="form-wrapper">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="lastname">Családnév</label>
                  <input type="text" disabled name="lastname" id="lastname" value={this.state.lastname} />

                  {this.state.error && this.state.error.lastname ? Object.values(this.state.error.lastname).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`lastname-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="humanId">Utónév</label>
                  <input type="text" disabled name="firstname" id="firstname" value={this.state.firstname} />

                  {this.state.error && this.state.error.firstname ? Object.values(this.state.error.firstname).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`firstname-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="appointment">Időpont</label>
                  <input type="text" disabled name="appointment" id="appointment" value={this.state.appointment} />

                  {this.state.error && this.state.error.appointment ? Object.values(this.state.error.appointment).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`appointment-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="location">Helyszín</label>
                  <input type="text" disabled name="location" id="location" value={this.state.location} />

                  {this.state.error && this.state.error.location ? Object.values(this.state.error.location).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`location-${i}`} />
                  }) : null}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <div className="input-wrapper">
                  <label>
                    Értesítő
                  </label>
                  <div>
                    {this.state.notified ? 'Kiküldve' : '-'}
                  </div>

                  {this.state.error && this.state.error.notified ? Object.values(this.state.error.notified).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`notified-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-md-3">
                <div className="input-wrapper">
                  <label>
                    Résztvett
                  </label>
                  <div>
                    {this.state.attended ? 'Igen' : 'Nem'}
                  </div>

                  {this.state.error && this.state.error.attended ? Object.values(this.state.error.attended).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`attended-${i}`} />
                  }) : null}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {! this.state.attended ? <input type="submit" value="Részt vett" className="btn btn-primary" onClick={this.submitApplicant.bind(this)} /> : <div />}

              {['developer', 'admin', 'cs'].includes(tokenParser('user.role')) ? <Link to={`/applicants/${this.state.id}`} className="btn btn-info">Szerkesztés</Link> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
