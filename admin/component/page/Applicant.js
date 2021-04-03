import axios from "../assets/axios"
import React from "react"
import {
  Redirect,
} from "react-router-dom"
import StoreContext from '../../StoreContext'
import Loader from '../assets/Loader'

export default class Applicant extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      error: null,
      redirect: false,
      redirectLogin: false,
      lastname: '',
      firstname: '',
      email: '',
      humanId: '',
      phone: '',
      address: '',
      appointment: '',
      notified: '',
      attended: false,
      reNotified: false
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

    document.body.classList.add('page-new-applicant')
  }

  componentWillUnmount() {
    document.body.classList.remove('page-new-applicant')
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

    this.context.set('loading', true)

    const link = process.env.REACT_APP_API_ADMIN_REQ_APPLICANT.toString().replace(':id', this.props.match.params.id)

    axios.get(process.env.REACT_APP_API_ADMIN_SERVER + link, config)
      .then(response => {
        if (response.data) {
          this.setState({
            lastname: response.data.data.lastname,
            firstname: response.data.data.firstname,
            humanId: response.data.data.humanId,
            email: response.data.data.email,
            phone: response.data.data.phone,
            address: response.data.data.address,
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

        this.context.set('loading', false)
      })
  }

  submitApplicant(e) {
    e.preventDefault();

    this.context.set('loading', true)

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }

    var data = new FormData();
    data.append("lastname", this.state.lastname);
    data.append("firstname", this.state.firstname);
    data.append("email", this.state.email);
    data.append("phone", this.state.phone);
    data.append("reNotified", this.state.reNotified);

    const link = process.env.REACT_APP_API_ADMIN_REQ_APPLICANT.toString().replace(':id', this.props.match.params.id)

    axios.post(
      process.env.REACT_APP_API_ADMIN_SERVER + link,
      data,
      config
    )
      .then(response => {
        if (response.data) {
          this.setState({
            lastname: response.data.data.lastname,
            firstname: response.data.data.firstname,
            humanId: response.data.data.humanId,
            email: response.data.data.email,
            phone: response.data.data.phone,
            appointment: response.data.data.appointment,
            notified: response.data.data.notified,
            attended: response.data.data.attended,
            reNotified: false
          })
        }

        this.context.set('loading', false)
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

  removeApplicant(e) {
    e.preventDefault();

    this.context.set('loading', true)

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }

    const link = process.env.REACT_APP_API_ADMIN_REQ_APPLICANT.toString().replace(':id', this.props.match.params.id)

    axios.delete(
      process.env.REACT_APP_API_ADMIN_SERVER + link,
      config
    )
      .then(response => {
        if (response.data) {
          this.setState({
            redirect: true
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
    const { redirect, redirectLogin } = this.state

    if (redirect) {
      return <Redirect to='/applicants' />
    }

    if (redirectLogin) {
      return <Redirect to='/login' />
    }

    return (
      <div className="proposal">
        <div className="container">
          <h1>{this.state.humanId ?? 'Jelentkező'}</h1>

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
                  <input type="text" name="lastname" id="lastname" value={this.state.lastname} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.lastname ? Object.values(this.state.error.lastname).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`lastname-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="humanId">Utónév</label>
                  <input type="text" name="firstname" id="firstname" value={this.state.firstname} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.firstname ? Object.values(this.state.error.firstname).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`firstname-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="email">E-mail</label>
                  <input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.email ? Object.values(this.state.error.email).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`email-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="phone">Telefonszám</label>
                  <input type="text" name="phone" id="phone" value={this.state.phone} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.phone ? Object.values(this.state.error.phone).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`phone-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-sm-12 col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="appointment">Időpont</label>
                  <input type="text" disabled name="appointment" id="appointment" value={this.state.appointment.date ? this.state.appointment.date.date : ''} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.appointment ? Object.values(this.state.error.appointment).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`appointment-${i}`} />
                  }) : null}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <div className="input-wrapper">
                  <label htmlFor="status">
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
                  <label htmlFor="status">
                    Értesítő újraküldés
                    <Loader onClick={() => { this.setState({ reNotified: !this.state.reNotified }) }} style={{ width: 16, height: 16, marginLeft: 6, cursor: 'pointer' }} />
                  </label>
                  <div>
                    {this.state.reNotified ? 'Igen' : 'Nem'}
                  </div>

                  {this.state.error && this.state.error.reNotified ? Object.values(this.state.error.reNotified).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`reNotified-${i}`} />
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
              <input type="submit" value="Mentés" className="btn btn-primary" onClick={this.submitApplicant.bind(this)} />

              {! this.state.attended ? <input type="submit" value="Törlés" className="btn btn-danger" onClick={this.removeApplicant.bind(this)} /> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
