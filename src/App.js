import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import AirTableView from "./pages/AirTableView";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <SiteNavbar />
      <Switch>
        <Route path="/">
          <AirTableView />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
