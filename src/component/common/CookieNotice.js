import React from "react"
import {
  Link,
} from "react-router-dom"
import loadGA from './loadGA.js'
import loadGTM from './loadGTM.js'
import docCookies from '../lib/docCookies.js'

export default function CookieNotice() {
  const cookieName = 'cookie-notice'
  const [ accepted, setAccepted ] = React.useState(true)
  const [ open, setOpen ] = React.useState(true)

  React.useEffect(() => {
    const cookieValue = docCookies.getItem(cookieName)

    if (cookieValue) {
      setAccepted(!! cookieValue)

      if (accepted) {
        setOpen(false)
      }
    }
  })

  function handlerAccept(e) {
    e.preventDefault()

    setAccepted(true)
    docCookies.setItem(cookieName, true)
    loadGA(() => {
      window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
      ga('create', process.env.GA_ID, 'auto');
      ga('send', 'pageview');

      setOpen(false)
    })

    loadGTM(() => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

      setOpen(false)
    })
  }

  function handlerRefuse(e) {
    e.preventDefault()

    setOpen(false)
    docCookies.setItem(cookieName, false)
  }

  return (
    <div className="cookie-notice cookie-notice-visible" style={{ display: open ? 'block' : 'none' }}>
      <div className="cookie-notice-container">
        <div className="cookie-notice-text">Kedves Látogató! Tájékoztatjuk, hogy a honlap felhasználói élmény fokozásának érdekében sütiket alkalmazunk. A honlapunk használatával ön a tájékoztatásunkat tudomásul veszi.</div>
        <div className="cookie-notice-buttons">
          <a className="cookie-notice-accept" onClick={handlerAccept}>Elfogadom</a>
          <a className="cookie-notice-refuse" onClick={handlerRefuse}>Elutasítom</a>

          <Link to="/adatvedelmi-iranyelvek" className="cookie-notice-info">Adatvédelmi</Link>
        </div>
      </div>
    </div>
  )
}
