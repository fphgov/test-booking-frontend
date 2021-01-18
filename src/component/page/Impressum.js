import React from "react"

export default class Impressum extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="impressum">
        <div className="container">
          <h1>Impresszum</h1>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br />
            Felelős kiadó: Ut enim ad minim veniam
          </p>
        </div>
      </div>
    )
  }
}
