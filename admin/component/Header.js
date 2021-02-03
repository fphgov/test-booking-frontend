import React from "react";
import {
  Link,
} from "react-router-dom";
import StoreContext from '../StoreContext'

const MobileMenu = (props) => {
  return (
    <div className="mobile-menu">
      <div className="container">
        <ul>
          {props.menu.map((menuItem, i) => {
            if (menuItem.onHideLoggedIn === true && localStorage.getItem('auth_token')) return;

            return (
              <li key={i.toString()}>
                <Link to={menuItem.href}>{menuItem.title}</Link>
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
      openMenu: false,
      menu: [
        { title: "Jelentkezettek", href: "/applicants", onHideLoggedOut: true },
        { title: "Időpont ellenőrzés", href: "/checks", onHideLoggedOut: true },
        { title: "Bejelentkezés", href: "/login", onHideLoggedIn: true },
        { title: "Kijelentkezés", href: "/logout", onHideLoggedOut: true },
      ]
    }
  }

  toggleMenu() {
    this.setState({
      openMenu: !this.state.openMenu,
    })
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
                  <a href="/bp-admin">
                    <img src={require('../img/logo-bp-monocrom.png')} />
                  </a>
                </div>
              </div>

              <div className="col-xs-6 col-sm-6 col-md-8">
                <ul className="desktop-menu">
                  {this.state.menu.map((menuItem, i) => {
                    if (
                      menuItem.onHideLoggedIn === true && localStorage.getItem('auth_token') !== null ||
                      menuItem.onHideLoggedOut === true && localStorage.getItem('auth_token') === null
                    ) return;

                    return (
                      <li key={i.toString()}>
                        <Link to={menuItem.href}>{menuItem.title}</Link>
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

        {this.state.openMenu ? <MobileMenu menu={this.state.menu} /> : null}

        { this.props.children}
      </header>
    )
  }
}
