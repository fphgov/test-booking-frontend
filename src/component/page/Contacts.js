import React from "react"

export default class Contacts extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page-contacts-section">
        <div className="container">
          <h1>Elérhetőségek</h1>

          <p><strong> [ Önkormányzat ] Ügyfélszolgálati Iroda</strong></p>

          <p>
            Amennyiben kérdése van, vagy segítségre van szüksége a regisztrációhoz, vagy időpontot mondana le, kérjük, hogy elsősorban e-mailt írjon nekünk. Időpont lemondásánál mindenképpen adja meg a kapott azonosítószámot.
          </p>

          <p>
            <b>E-mail</b><br />
            <a href="mailto:sample@sample.hu" target="_blank">sample@sample.hu</a>
          </p>

          <p>
            Telefonon a <a href="tel:+361234567" target="_blank">06 1 123 4567</a> számon tud segítséget kérni hétfő-csütörtök 8.00-16.30 között, pénteken 8.00-18.00-ig. Egyéb időpontokban pedig a 06 1 987 6543-es számon érdeklődhet.
          </p>
        </div>
      </div>
    )
  }
}
