import React from "react"
import Hero from "../Hero"
import Registration from "./Registration"

export default class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div className="home">
        <Hero />

        <Registration />
      </div>
    )
  }
}
