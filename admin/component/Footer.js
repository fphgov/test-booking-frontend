import React from "react"
import Logo from '../img/logo-bp.svg'

export default class Footer extends React.Component {
  constructor() {
    super()

    this.state = {}
  }

  render() {
    return (
      <footer>
        <div className="dark-section">
          <div className="container">
            <div className="footer-content">
              <div className="row">
                <div className="col-md-12">
                  <div className="footer-text">Ez az oldal a Fővárosi Önkormányzat <a href="https://github.com/fphgov" className="light inline">nyílt forráskódú szoftverének</a> felhasználásával készítettük.</div>

                  <div className="footer-logo">
                    <a href="https://budapest.hu" target="_blank" rel="noopener noreferrer">
                      <Logo />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
