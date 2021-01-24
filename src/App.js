import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import AirTableView from "./pages/AirTableView";
import Footer from "./components/Footer";
import MarkdownFromPath from "./components/MardownFromPath";

import additionalResourcesMarkdownPath from "./content/additional-resources.md";
import aboutUsMarkdownPath from "./content/about-us.md";

function App() {
  return (
    <Router>
      <main className="d-flex flex-column h-100">
        <div className="flex-grow-1">
          <SiteNavbar />
          <Switch>
            <Route path="/additional-resources">
              <div className="container-lg mt-4">
                <MarkdownFromPath
                  markdownPath={additionalResourcesMarkdownPath}
                />
              </div>
            </Route>
            <Route path="/about-us">
              <div className="container-lg mt-4">
                <MarkdownFromPath markdownPath={aboutUsMarkdownPath} />
              </div>
            </Route>
            <Route path="/">
              <AirTableView />
            </Route>
          </Switch>
        </div>
        <Footer />
      </main>
    </Router>
  );
}

export default App;
