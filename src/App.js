import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import AirTableView from "./pages/AirTableView";
import Footer from "./components/Footer";
import MarkdownFromPath from "./components/MardownFromPath"

import additionalInfoMarkdownPath from "./content/additional-info.md";

function App() {
  return (
    <Router>
      <SiteNavbar />
        <Switch>
          <Route path="/additional-info">
            <div className="container mt-4">
              <MarkdownFromPath markdownPath={additionalInfoMarkdownPath} />
            </div>
          </Route>
          <Route path="/">
            <AirTableView />
          </Route>
        </Switch>
      <Footer />
    </Router>
  );
}

export default App;
