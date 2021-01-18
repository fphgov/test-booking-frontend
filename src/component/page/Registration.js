import "flatpickr/dist/themes/material_green.css"

import axios from "axios"
import React from "react"
import qs from 'querystring'
import Helmet from "react-helmet"
import {
  Redirect,
  Link
} from "react-router-dom"
import InputMask from "react-input-mask"
import Flatpickr from "react-flatpickr";
import { Hungarian } from "flatpickr/dist/l10n/hu.js"
import StoreContext from '../../StoreContext'
import RegistrationInfo from '../common/RegistrationInfo'
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3'
import { rmAllCharForAddress, rmAllCharForEmail, rmAllCharForName } from '../lib/removeSpecialCharacters'
import FaqInfo from "../common/FaqInfo"
import ScrollTo from "../common/ScrollTo"
import randomString from "../common/randomString"
import Block from '../../img/block.svg'

export default class Registration extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      error: '',
      redirect: false,
      miniLoading: false,
      miniCalanedarLoading: false,
      success: false,
      pressedFilling: false,
      rcptch: '',
      options: null,
      places: [],
      appointments: [],
      flatpickrDates: [],
      resHumanId: null,
      reservedAppointment: null,

      privacy: false,
      lastname: '',
      address: '',
      firstname: '',
      email: '',
      birthday: '',
      birthdayPlace: '',
      phone: '',
      taj: '',
      place: 0,
      appointment: null,
      date: null,
      recaptcha: null
    }

    this.context.set('loading', true, () => {
      this.getSettingsData()

      if (localStorage.getItem('appointment')) {
        this.setState({
          appointment: localStorage.getItem('appointment') - 0
        })
      }
    })
  }

  getSettingsData() {
    const link = process.env.REACT_APP_API_REQ_OPTIONS.toString()

    axios.get(process.env.REACT_APP_API_SERVER + link)
    .then(response => {
      if (response.data) {
        this.setState({
          options: response.data.options,
          places: response.data.places,
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

  getPlacesData(value) {
    const link = process.env.REACT_APP_API_REQ_APPOINTMENT_TIME.toString()

    axios.get(process.env.REACT_APP_API_SERVER + link + '/' + value)
      .then(response => {
        if (response.data) {
          this.setState({
            miniCalanedarLoading: false,
            flatpickrDates: response.data.data
          })
        }
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.errors) {
          this.setState({
            miniCalanedarLoading: false,
            error: error.response.data.errors
          })
        }
      })
  }

  getTimesData(date) {
    const link = process.env.REACT_APP_API_REQ_APPOINTMENT.toString()
    const _dateTime = new Date(date)
    const _date = `${_dateTime.getFullYear()}-${(_dateTime.getMonth() + 1).toString().padStart(2, '0')}-${(_dateTime.getDate()).toString().padStart(2, '0')}`

    axios.get(process.env.REACT_APP_API_SERVER + link + '/' + this.state.place + '/' + _date)
      .then(response => {
        if (response.data && response.data.data) {
          this.setState({
            appointments: response.data.data,
          })

          this.setState({
            miniLoading: false
          })
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

  getSessionKey()
  {
    if (! localStorage.getItem('sessionId')) {
      localStorage.setItem('sessionId', randomString())
    }

    return localStorage.getItem('sessionId')
  }

  pushReservationData(sessionId) {
    const link = process.env.REACT_APP_API_REQ_APPOINTMENT_RESERVATION.toString()
    const data = {
      appointment: this.state.appointment,
      sessionId: sessionId
    }
    const config = {
      headers: {
        'Accept': 'application/json',
      }
    }

    axios.post(process.env.REACT_APP_API_SERVER + link, qs.stringify(data), config)
      .then(response => {
        if (response.data) {
          this.setState({
            miniCalanedarLoading: false,
            reservedAppointment: response.data.exp.date
          })
        }

        localStorage.setItem('appointment', this.state.appointment)
        this.getTimesData(this.state.date)
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.errors) {
          this.setState({
            miniCalanedarLoading: false,
            error: error.response.data.errors
          })
        }

        this.getTimesData(this.state.date)
      })
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
    document.body.classList.add('page-new-registration')

    loadReCaptcha(process.env.SITE_KEY, this.verifyCallback)
  }

  componentWillUnmount() {
    document.body.classList.remove('page-new-registration')
  }

  getIsEnabledSubmit() {
    return false
  }

  handleChangeInput(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : rmAllCharForName(e.target.value)

    this.setState({
      [ e.target.name ]: value
    })
  }

  handleChangeAddressInput(e) {
    this.setState({
      [ e.target.name ]: rmAllCharForAddress(e.target.value)
    })
  }

  handleChangeEmailInput(e) {
    this.setState({
      [ e.target.name ]: rmAllCharForEmail(e.target.value)
    })
  }

  handleChangePlace(e) {
    this.setState({
      [ e.target.name ]: e.target.value,
      miniCalanedarLoading: true
    })

    this.getPlacesData(e.target.value)
  }

  handleOnlyNumberChangeInput(e) {
    const numberRegex = /[^0-9]+/g

    let value = e.target.value

    if (numberRegex.test(value)) {
      value = value.replace(numberRegex, '')
    }

    this.setState({ error: '', [ e.target.name ]: e.target.value.replace(numberRegex, '') || "" })
  }

  handleTimeReservation(appointment) {
    if (appointment.expiry !== null) {
      return
    }

    this.setState({
      appointment: appointment.id,
      miniCalanedarLoading: true
    }, () => {
        const sessionId = this.getSessionKey()

        this.pushReservationData(sessionId)
    })
  }

  submitRegistration() {
    this.context.set('loading', true)

    const config = {
      headers: {
        'Accept': 'application/json',
      }
    }

    const data = {
      rcptch: this.state.rcptch,
      privacy: this.state.privacy,
      lastname: this.state.lastname,
      firstname: this.state.firstname,
      email: this.state.email,
      birthday: this.state.birthday,
      birthdayPlace: this.state.birthdayPlace,
      phone: this.state.phone,
      address: this.state.address,
      taj: this.state.taj,
      place: this.state.place,
      appointment: this.state.appointment,
      'g-recaptcha-response': this.state.recaptcha,
      sessionId: this.getSessionKey(),
    }

    axios.post(
      process.env.REACT_APP_API_SERVER + process.env.REACT_APP_API_REQ_NEW_REGISTER,
      qs.stringify(data),
      config
    )
      .then(response => {
        if (response.data) {
          this.setState({
            success: true,
            resHumanId: response.data.data.humanId,
            resPlace: response.data.data.place,
            resDate: response.data.data.date
          })
        }

        this.context.set('loading', false)

        localStorage.removeItem('sessionId')
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.errors) {
          this.setState({
            error: error.response.data.errors
          })

          if (error.response.data.errors.appointment && error.response.data.errors.appointment.reserved) {
            this.getTimesData(this.state.date)
            this.setState({
              appointment: null,
            })
          }
        }

        this.updateToken()
        this.context.set('loading', false)
      })
  }

  Error(props) {
    return (
      <div className="error-message">
        {props.message && props.message.error && props.message.error.map((error, i) => {
          return (
            <div key={i}>{error}</div>
          )
        })}
      </div>
    )
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
    const { redirect, success, options, date } = this.state

    const flatpickrOptions = {
      inline: true,
      enableTime: false,
      allowInput: false,
      locale: Hungarian,
    }

    if (redirect) {
      return <Redirect to='/' />
    }

    if (options && options.close) {
      return (
        <div>
          <div className="registration">
            <Helmet>
              <title>Jelentkezés koronavírus gyorstesztre</title>
            </Helmet>

            <ScrollTo element={document.querySelector('.registration').offsetTop}>
              <div className="container">
                <h1>Sajnáljuk, az ingyenes gyorstesztre elfogytak a helyek.</h1>

                <p>Sajnos a  [ Önkormányzat ] csak korlátozott mennyiségben tud gyorsteszteket biztosítani, de vizsgáljuk az ingyenes tesztelés bővítésének lehetőségét.</p>

                <p>Kérjük, látogasson vissza később, amennyiben bővül a helyek száma, vagy felszabadul egy már lefoglalt hely, a jelentkezést újra megnyitjuk.</p>

                <br />

                <p>Kövesse nyomon híreinket a <a href="https://sample.hu" target="_blank">sample.hu</a> oldalon.</p>
              </div>
            </ScrollTo>
          </div>
        </div>
      )
    }

    if (success) {
      return (
        <div>
          <div className="registration">
            <Helmet>
              <title>Jelentkezés koronavírus gyorstesztre</title>
            </Helmet>

            <ScrollTo element={document.querySelector('.registration').offsetTop}>
              <div className="container">
                <h1>Sikeresen jelentkezett az ingyenes koronavírus gyorstesztelésre!</h1>

                {this.state.resHumanId ? <p>Az Ön azonosítója:<br /><b style={{ fontSize: 26 }}>{this.state.resHumanId}</b></p> : null }
                {this.state.resPlace ? <p>Az esemény helyszíne:<br /><b style={{ fontSize: 26 }}>{this.state.resPlace}</b></p> : null }
                {this.state.resDate ? <p>Az esemény időpontja:<br /><b style={{ fontSize: 26 }}>{this.state.resDate}</b></p> : null }

                <p><b>Köszönjük, hogy regisztrált. Kérjük, hogy az azonosítószámát és az időpontját mindenképpen jegyezze fel.</b></p>

                <p>A nagy érdeklődés miatt előfordulhat, hogy a rendszerünk egy kicsit lassabban küldi ki az e-maileket. Kérjük, mielőtt felhívja az ügyfélszolgálatot, győződjön meg róla, hogy biztosan nem kapott e-mailes visszaigazolást.</p>

                <p><b>Hol tudok kérdezni vagy segítséget kérni?</b></p>
                <p>Amennyiben kérdése van, vagy segítségre van szüksége a regisztrációhoz vagy időpontot mondana le, kérjük, hogy elsősorban e-mailt írjon nekünk. Időpont lemondásánál mindenképpen adja meg a kapott azonosítószámot.</p>

                <p>E-mail: <a href="mailto:sample@sample.hu">sample@sample.hu</a></p>

                <p>Telefonon a <a href="tel:3612345678">06 1 234 4567</a> számon tud segítséget kérni hétfő-csütörtök 8.00-16.30 között, pénteken 8.00-18.00-ig. Egyéb időpontokban pedig a 06 1 876 5432-es számon érdeklődhet.</p>

                <br />

                <h3><b>Fontos tudnivalók</b></h3>
                <FaqInfo />
              </div>
            </ScrollTo>
          </div>
        </div>
      )
    }

    if (! this.state.pressedFilling) {
      return (
        <div className="registration">
          <Helmet>
            <title>Jelentkezés koronavírus gyorstesztre</title>
          </Helmet>

          <div className="container">
            <RegistrationInfo />

            <div className="registration registration-initial">
              <button className="btn btn-primary" onClick={() => this.setState({ pressedFilling: true })}>Jelentkezem!</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="registration">
        <Helmet>
          <title>Jelentkezés koronavírus gyorstesztre</title>
        </Helmet>

        <div className="container">
          <RegistrationInfo />

          <div className="form-scroll"></div>

          {this.state.error ? <ScrollTo element={document.querySelector('.form-scroll').offsetTop}><this.Error message={this.state.error} /></ScrollTo> : null}

          <h3>(1) Helyszín és időpontfoglalás</h3>

          <p>Válasszon helyszínt, hogy lássa az elérhető időpontokat.</p>

          <div className="form-wrapper">
            <div className="row">
              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="place">Választható helyszínek</label>
                  <select name="place" id="place" value={this.state.place} onChange={this.handleChangePlace.bind(this)}>
                    <option value="0" disabled>Kérjük válasszon egy helyszínt</option>

                    {this.state.places && this.state.places.map((item, i) => {
                      return (<option key={i} value={item.id} disabled={!item.active}>{item.description}</option>)
                    })}
                  </select>

                  {this.state.error && this.state.error.place ? Object.values(this.state.error.place).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`place-${i}`} />
                  }) : null}
                </div>
              </div>
            </div>

            {this.state.place && !this.state.miniCalanedarLoading && this.state.flatpickrDates.length === 0 ? <p className="info">Nincs elérhető szabad időpont</p> : null}
            {this.state.place && !this.state.miniCalanedarLoading && this.state.flatpickrDates.length > 0 ?
              <div className="row">
                <div className="col-md-12">
                  <div className="input-wrapper">
                    <label htmlFor="appointment">Választható időpontok</label>
                    <p className="tipp">Önnel egyidőben többen is böngésznek az oldalon. Ha az ön által kiválasztott időpontot valaki időközben más már lefoglalta, kérjük, próbálkozzon újra!</p>

                    <div className="appointment-wrapper">
                      <Flatpickr
                        id="appointment"
                        name="appointment"
                        options={{
                          ...flatpickrOptions,
                          enable: this.state.flatpickrDates
                        }}
                        value={date}
                        render={({ defaultValue }, ref) => {
                          if (this.state.date === null) {
                            return (
                              <div>
                                <input defaultValue={defaultValue} ref={ref} />

                                <div className="flatpickr-extend">
                                  Válasszon az elérhető napok közül, hogy láthassa az elérhető időpontokat
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div>
                              <input defaultValue={defaultValue} ref={ref} />

                              <div className="flatpickr-extend">
                                {Array.isArray(this.state.appointments) && this.state.appointments.length === 0 && !this.state.miniLoading ? 'Nincs elérhető időpont' : null}
                                {Array.isArray(this.state.appointments) ? this.state.appointments.map((appointment, i) => {
                                  const date = new Date(appointment.date.date.replace(/ /g, 'T'))
                                  const plusDate = new Date(date.getTime() + 10 * 60000)

                                  return (
                                    <a key={i} className={`appointment-elem${this.state.appointment === appointment.id ? ' active' : ''}${appointment.expiry ? ' locked' : ''}`} onClick={() => this.handleTimeReservation(appointment)}>
                                      <div className="appointment-elem-name">Gyorsteszt {appointment.expiry !== null ? (<div className="lock"><Block /></div>) : null}</div>
                                      <div className="appointment-elem-time">{date.getHours()}.{date.getMinutes().toString().padStart(2, '0')} - {plusDate.getHours().toString().padStart(2, '0')}.{(plusDate.getMinutes()).toString().padStart(2, '0')}</div>
                                      <div className="appointment-elem-date">{date.getFullYear()}.{(date.getMonth() + 1).toString().padStart(2, '0')}.{date.getDate().toString().padStart(2, '0')}</div>
                                    </a>
                                  )
                                }) : null}
                              </div>
                            </div>
                          )
                        }}
                        onChange={date => {
                          this.setState({
                            date,
                            miniLoading: true
                          }, () => {
                            this.getTimesData(this.state.date);
                          })
                        }} />
                    </div>

                    {this.state.error && this.state.error.appointment ? Object.values(this.state.error.appointment).map((err, i) => {
                      return <this.ErrorMini key={i} error={err} increment={`appointment-${i}`} />
                    }) : null}
                  </div>
                </div>
              </div>
              : null}
          </div>

          <h3>(2) Személyes adatok</h3>

          <p>Minden adat kitöltése kötelező</p>

          <div className="form-wrapper">
            <div className="input-wrapper" style={{ display: 'none' }}>
              <label htmlFor="rcptch">
                <label htmlFor="rcptch">Rcptch</label>
                <input type="text" placeholder="Rcptch" name="rcptch" id="rcptch" value={this.state.rcptch} onChange={this.handleChangeInput.bind(this)} />
              </label>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="lastname">Vezetéknév</label>
                  <input type="text" placeholder="Vezetéknév" name="lastname" id="lastname" value={this.state.lastname} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.lastname ? Object.values(this.state.error.lastname).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`lastname-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="firstname">Utónév</label>
                  <input type="text" placeholder="Utónév" name="firstname" id="firstname" value={this.state.firstname} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.firstname ? Object.values(this.state.error.firstname).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`firstname-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="email">E-mail cím</label>
                  <input type="email" autoCapitalize="none" placeholder="E-mail cím" name="email" id="email" value={this.state.email} onChange={this.handleChangeEmailInput.bind(this)} />

                  {this.state.error && this.state.error.email ? Object.values(this.state.error.email).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`email-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="phone">Mobil telefonszám</label>
                  <InputMask mask="+36 99 999 9999" autoComplete="chrome-off" placeholder="+36 20 111 2222" name="phone" id="phone" value={this.state.phone} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.phone ? Object.values(this.state.error.phone).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`phone-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="birthdayPlace">Születés helye</label>
                  <input type="text" autoComplete="chrome-off" placeholder="Születési helye" name="birthdayPlace" id="birthdayPlace" value={this.state.birthdayPlace} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.birthdayPlace ? Object.values(this.state.error.birthdayPlace).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`birthdayPlace-${i}`} />
                  }) : null}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="birthday">Születés ideje</label>
                  <InputMask mask="9999.99.99" autoComplete="chrome-off" placeholder="1950.01.01" name="birthday" id="birthday" value={this.state.birthday} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.birthday ? Object.values(this.state.error.birthday).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`birthday-${i}`} />
                  }) : null}
                </div>
              </div>
            </div>
          </div>

          <h3>(3) Jelentkezéshez tartozó adatok</h3>

          <p>Ezekre a részletekre azért van szükség, hogy biztosíthassuk a jogosultak körét. Csak [ kerületi ] lakcímmel rendelkezőket tudjuk fogadni, ez a helyszínen kerül ellenőrzésre.</p>

          <div className="form-wrapper">
            <div className="row">
              <div className="col-md-8">
                <div className="input-wrapper">
                  <label htmlFor="address">Lakcím kártyán szerepelő lakóhely vagy tartózkodási hely</label>
                  <input type="text" autoComplete="chrome-off" placeholder="1052 Budapest, Deák Ferenc tér 1." name="address" id="address" value={this.state.address} onChange={this.handleChangeAddressInput.bind(this)} />

                  {this.state.error && this.state.error.address ? Object.values(this.state.error.address).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`address-${i}`} />
                  }) : null}
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-wrapper">
                  <label htmlFor="taj">TAJ-szám</label>
                  <InputMask mask="999 999 999" autoComplete="chrome-off" placeholder="000 000 000" name="taj" id="taj" value={this.state.taj} onChange={this.handleChangeInput.bind(this)} />

                  {this.state.error && this.state.error.taj ? Object.values(this.state.error.taj).map((err, i) => {
                    return <this.ErrorMini key={i} error={err} increment={`taj-${i}`} />
                  }) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="form-wrapper">
            <div className="input-wrapper">
              <label htmlFor="privacy">
                <input type="checkbox" name="privacy" id="privacy" value={this.state.privacy} onChange={this.handleChangeInput.bind(this)} />
                Az <Link to="/adatvedelmi-tajekoztato" target="_blank">Adatkezelési tájékoztatót</Link> megismertem, és a személyes adataim annak megfelelő kezeléséhez hozzájárulok.
              </label>

              {this.state.error && this.state.error.privacy ? Object.values(this.state.error.privacy).map((err, i) => {
                return <this.ErrorMini key={i} error={err} increment={i} />
              }) : null}
            </div>

            <ReCaptcha
              ref={ref => this.recaptcha = ref}
              sitekey={process.env.SITE_KEY}
              action='submit'
              verifyCallback={this.verifyCallback}
            />

            <input type="submit" value="Jelentkezem" className="btn btn-primary" disabled={this.getIsEnabledSubmit()} onClick={this.submitRegistration.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
