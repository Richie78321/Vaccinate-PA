import Navbar from "./components/Navbar";
import Map from "./components/map/Map";
import Phases from "./components/phase/Phases";
import Alert from "./components/Alert";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const currPhase = "1A";
  return (
    <Router>
      <Navbar />
      <Route
        exact path="/"
      >

      </Route>
      <Route 
        path="/experimental"
      >
        <div className="flex flex-col items-center">
          <Alert />
          <Map />
          <Phases phase={currPhase} />
        </div>
      </Route>
    </Router>
  );
}

export default App;
