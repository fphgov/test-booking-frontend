import React from "react"

export default class Hero extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  iframe () {
    return {
      __html: '<iframe src="https://www.youtube.com/embed/BggrpKfqh1c" width="100%" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>',
    }
  }

  render() {
    return (
      <div className="hero-wrapper">
        <div className="hero dark">
          <div className="container">
            <div className="row flex-center">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <div className="hero-content">
                  <h2>Megnyílt a regisztráció az [ Önkormányzat ] ingyenes koronavírus gyorstesztelésére</h2>

                  <div>A COVID-19 járvány második hulláma Magyarországon jelenleg is zajlik és a számok, amelyek a koronavírus terjedését jelzik magas értékeket mutatnak. A járvány a közösségi szintű terjedés szakaszában van, bárhol jelen lehet és bármikor fertőzhet. A járvány lassítása közös feladatunk. Segítsen Ön is azzal, hogy részt vesz az [ Önkormányzat ] által biztosított, ingyenes gyorstesztelésen!</div>

                  <div className="hero-btn-wrapper">
                    <div className="btn btn-primary btn-desktop" onClick={() => {
                      window.scrollTo({
                        top: document.querySelector('.registration').offsetTop,
                        left: 0,
                        behavior: 'smooth'
                      })
                    }}>Jelentkezés</div>
                  </div>
                </div>
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <div dangerouslySetInnerHTML={this.iframe()} />
              </div>
            </div>

            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
