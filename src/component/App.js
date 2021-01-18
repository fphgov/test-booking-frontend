import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Page from "./Page";
import NotFound from "./page/NotFound";
import Home from "./page/Home";
import Contacts from "./page/Contacts";
import Impressum from "./page/Impressum";
import Cancellation from "./page/Cancellation";
import Faq from "./page/Faq";
import Privacy from "./page/Privacy";
import PrivacyPolicies from "./page/PrivacyPolicies";
import SEO from "./common/SEO";
import CookieNotice from "./common/CookieNotice";
import ScrollToTop from "./common/ScrollToTop";
import PageWrapper from "./common/PageWrapper";

export default function App() {
  return (
    <div className="app">
      <SEO />

      <Router basename={process.env.REACT_APP_BASENAME}>
        {(process.env.GA_ID || process.env.GTM_ID) ? <CookieNotice /> : ''}

        <ScrollToTop>
          <PageWrapper>
            <Header />

            <Page>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/elerhetosegek" component={Contacts} />
                <Route exact path="/impresszum" component={Impressum} />
                <Route exact path="/adatvedelmi-tajekoztato" component={Privacy} />
                <Route exact path="/adatvedelmi-iranyelvek" component={PrivacyPolicies} />
                <Route exact path="/tudnivalok" component={Faq} />
                <Route exact path="/lemondas/:cancelHash" component={Cancellation} />

                <Route exact path="*" component={NotFound} />
              </Switch>
            </Page>

            <Footer />
          </PageWrapper>
        </ScrollToTop>
      </Router>
    </div>
  )
}
