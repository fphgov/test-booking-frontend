import axios from "axios"
import React from "react"
import {
  Link,
  Redirect
} from "react-router-dom"
import { DebounceInput } from 'react-debounce-input'
import StoreContext from '../../StoreContext'

export default class Applicants extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      redirectLogin: false,
      applicants: [],
      search: ''
    }

    this.ApplicantsWrapper = this.ApplicantsWrapper.bind(this)
    this.onHandleRemove = this.onHandleRemove.bind(this)
  }

  componentDidMount() {
    this.context.set('loading', false)

    if (localStorage.getItem('auth_token') === null) {
      this.setState({
        redirectLogin: true
      })
    }

    document.body.classList.add('page-applicants')
  }

  componentWillUnmount() {
    document.body.classList.remove('page-applicants')
  }

  handleChangeInput(e) {
    this.setState({ search: e.target.value }, () => {
      if (this.state.search === '') {
        this.setState({
          applicants: []
        })
      } else {
        this.getApplicantsData()
      }
    })
  }

  getApplicantsData() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    }

    const link = '/' + this.state.search;

    this.context.set('loading', true)

    axios.get(process.env.REACT_APP_API_ADMIN_SERVER + process.env.REACT_APP_API_ADMIN_REQ_APPLICANTS + link, config)
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          this.setState({
            applicants: response.data.data
          })
        }

        this.context.set('loading', false)
      })
      .catch(error => {
        this.context.set('loading', false)

        if (error.response && error.response.data && error.response.data.message) {
          this.setState({
            error: error.response.data.message
          })
        }
      })
  }

  onHandleRemove(e) {
    const id = e.target.getAttribute('data-id')

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    }

    const link = process.env.REACT_APP_API_ADMIN_REQ_APPLICANT.toString().replace(':id', id)

    axios.delete(process.env.REACT_APP_API_ADMIN_SERVER + link, config)
      .then(response => {
        if (response.data && response.data.success) {
          this.context.set('loading', false)

          this.getApplicantsData()
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

  ApplicantsWrapper(props) {
    return (
      <div className="col-md-12">
        <div className="applicants-wrapper">
            <div className="applicants-inner">
              <div className="article-content">
                <Link to={`/applicants/${props.applicants.id}`} className="article-flex">
                  <div className="article-title">
                    {props.applicants.humanId} | {props.applicants.lastname} {props.applicants.firstname}
                    </div>
                </Link>
              </div>
            </div>
        </div>
      </div>
    )
  }

  render() {
    const { redirectLogin } = this.state

    if (redirectLogin) {
      return <Redirect to='/login' />
    }

    return (
      <div className="applicants">
        <div className="container">
          <h1>Jelentkezettek</h1>

          <DebounceInput
            autoComplete="chrome-off"
            name="search"
            minLength={2}
            debounceTimeout={300}
            value={this.state.search}
            onChange={this.handleChangeInput.bind(this)} />

          <div className="row">
            {this.state.applicants.map((applicants, i) => <this.ApplicantsWrapper key={i} applicants={applicants} />)}
          </div>
        </div>
      </div>
    )
  }
}
