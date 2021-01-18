import React from "react"
import {
  Link,
} from "react-router-dom"
import StoreContext from '../StoreContext'

const MobileMenu = (props) => {
  return (
    <div className="mobile-menu">
      <div className="container">
        <ul>
          {props.menu.map((menuItem, i) => {
            return (
              <li key={i.toString()}>
                <Link to={menuItem.href} onClick={props.onClick}>{menuItem.title}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default class Header extends React.Component {
  static contextType = StoreContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      pathname: '/',
      openMenu: false,
      menu: [
        { title: "Tudnivalók", href: "/tudnivalok" },
        { title: "Kapcsolat", href: "/elerhetosegek" },
      ]
    }
  }

  toggleMenu() {
    this.setState({
      openMenu: ! this.state.openMenu,
    })
  }

  componentDidMount() {
    this.setState({
      pathname: window.location.pathname,
    })
  }

  componentDidUpdate() {
    if (window.location.pathname !== this.state.pathname) {
      this.setState({
        pathname: window.location.pathname,
      })
    }
  }

  render() {
    return (
      <header>
        <div className="main-navigation-top">
          <div className="container">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-4">
                <a href="https://sample.hu">Vissza a [ sample.hu ] főoldalára</a>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-8 col-right">
                <a href="https://sample.hu" target="_blank">sample.hu</a>
              </div>
            </div>
          </div>
        </div>

        <nav className="main-navigation">
          <div className="container">
            <div className="row flex-center">
              <div className="col-xs-6 col-sm-6 col-md-4">
                <div className="logo-wrapper">
                  <a href="/">
                    <img src={require('../img/lipsum.png')} />
                  </a>
                </div>
              </div>

              <div className="col-xs-6 col-sm-6 col-md-8">
                <ul className="desktop-menu">
                  {this.state.menu.map((menuItem, i) => {
                    if (
                      menuItem.onHideLoggedIn === true && this.context.get('loggedIn') ||
                      ! this.context.get('loggedIn') && menuItem.onHideLoggedIn === false
                    ) return;

                    return (
                      <li key={i.toString()}>
                        <Link to={menuItem.href} className={menuItem.href === this.state.pathname ? 'active': ''}>{menuItem.title}</Link>
                      </li>
                    )
                  })}
                </ul>

                <div className="hamburger-menu-wrapper">
                  <div className="hamburger-menu" onClick={() => { this.toggleMenu() }}>
                    <div className="hamburger-menu-elem"></div>
                    <div className="hamburger-menu-elem"></div>
                    <div className="hamburger-menu-elem"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {this.state.openMenu ? <MobileMenu menu={this.state.menu} onClick={() => { this.toggleMenu() }} /> : null}

        { this.props.children }
      </header>
    )
  }
}
