import axios from "axios"
import qs from 'querystring'
import React from "react"
import Helmet from "react-helmet"
import {
  Redirect,
  useParams
} from "react-router-dom";
import StoreContext from '../../StoreContext'
import ScrollTo from "../common/ScrollTo"

export default function Cancellation() {
  const { cancelHash } = useParams()
  const context = React.useContext(StoreContext)
  const [ error, setError ] = React.useState()
  const [ redirect, setRedirect ] = React.useState(false)
  const [ success, setSuccess ] = React.useState(false)

  const submitCancel = (e) => {
    e.preventDefault()

    const config = {
      headers: {
        'Accept': 'application/json',
      }
    }

    const data = {
      cancelHash,
    }

    axios.post(
      process.env.REACT_APP_API_SERVER + process.env.REACT_APP_API_REQ_CANCELLATION,
      qs.stringify(data),
      config
    )
      .then(response => {
        if (response.data) {
          setSuccess(true)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          context.set('loading', false)

          return
        }

        if (error.response && error.response.data && error.response.data.errors) {
          setError(error.response.data.errors)
        }

        context.set('loading', false)
      })
  }

  const Error = (props) => {
    if (typeof props.message === 'object') {
      return Object.values(props.message).map((e, i) => {
        return (<div key={i} className="error-message-inline">{e}</div>)
      })
    } else {
      return (<div key={props.increment} className="error-message-inline">{props.message}</div>)
    }
  }

  const Success = () => {
    setTimeout(() => {
      setRedirect(true)
    }, 4000)

    return (<div className="success-message-inline">A gyorsteszt időpontját sikeresen töröltük.</div>)
  }

  return (
    <div className="faq">
      <Helmet>
        <title>Koronavírus gyorsteszt lemondás</title>
      </Helmet>

      { redirect ? <Redirect to='/' /> : null }

      <div className="container">
        <h1>Ingyenes koronavírus gyorsteszt jelentkezés lemondása</h1>

        <p>A "Lemondás" gombbal a jelentkezése véglegesen lemondásra kerül.</p>

        <div className="form-scroll"></div>

        {error ? <ScrollTo element={document.querySelector('.form-scroll').offsetTop}><Error message={error} /></ScrollTo> : null}
        {success ? <Success /> : null}

        <input type="submit" value="Lemondás" className="btn btn-primary" onClick={submitCancel} />
      </div>
    </div>
  )
}
