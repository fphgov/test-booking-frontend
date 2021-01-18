import React from "react"
import Helmet from "react-helmet"
import FaqInfo from "../common/FaqInfo"

export default class Faq extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="faq">
        <Helmet>
          <title>Tudnivalók a koronavírus gyorstesztről</title>
        </Helmet>

        <div className="container">
          <h1 style={{ textAlign: 'center' }}>Legfontosabb tudnivalók az [ Önkormányzat ] ingyenes koronavírus gyorsteszteléséről </h1>

          <FaqInfo />
        </div>
      </div>
    )
  }
}
