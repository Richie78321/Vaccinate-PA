import "./App.css";
import Navbar from "./components/Navbar";
import Map from "./components/map/Map";
import Phases from "./components/phase/Phases";
import Alert from "./components/Alert";

function App() {
  const currPhase = "1A";
  return (
    <>
      <Alert />
      <Navbar />
      <div className="flex flex-col items-center">
        <Map />
        <Phases phase={currPhase} />
      </div>
    </>
  );
}

export default App;
