import React from "react";
import {
  Link,
} from "react-router-dom";

export default class Footer extends React.Component {
  constructor() {
    super()

    this.state = {};
  }

  render() {
    return (
      <footer>
        <div className="dark-section">
          <div className="container">
            <div className="footer-content">
              <div className="row">
                <div className="col-md-12 col-lg-9 d-lg-flex justify-content-center">
                  <div className="footer-logo-wrapper mb-2">
                    <img src={require('../img/logo-footer-white.png')}></img>
                  </div>
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="footer-text"> Ezt az oldalt a Fővárosi Önkormányzat <a href="https://github.com/fphgov" className="light inline"> nyílt forráskódú szoftverének</a> felhasználásával készítettük </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-3 d-flex align-items-center justify-content-center mb-2">

                  <div className="footer-links">
                    <Link to="/adatvedelmi-tajekoztato" className="light">Adatkezelési tájékoztató</Link>
                    <Link to="/impresszum" className="light">Impresszum</Link>
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
