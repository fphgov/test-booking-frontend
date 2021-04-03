import React from "react";
import {
  Route,
  Switch,
  HashRouter
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Page from "./Page";
import NotFound from "./page/NotFound";
import Dashboard from "./page/Dashboard";
import Login from "./page/Login";
import Logout from "./page/Logout";
import Applicants from "./page/Applicants";
import Informations from "./page/Informations";
import Check from "./page/Check";
import Checks from "./page/Checks";
import Applicant from "./page/Applicant";
import ScrollToTop from "./common/ScrollToTop";

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <HashRouter>
          <ScrollToTop>
            <Header />

            <Page>
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/applicants" component={Applicants} />
                <Route exact path="/applicants/:id" component={Applicant} />
                <Route exact path="/checks" component={Checks} />
                <Route exact path="/checks/:id" component={Check} />
                <Route exact path="/informations" component={Informations} />

                <Route exact path="*" component={NotFound} />
              </Switch>
            </Page>

            <Footer />
          </ScrollToTop>
        </HashRouter>
      </div>
    );
  }
}
