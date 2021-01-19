import "./App.css";
// import Navbar from "./components/Navbar";
import Map from "./components/map/Map";
import Phases from "./components/phase/Phases";


function App() {

  const currPhase = "1A"
  return (
    <>
      <h1 className="text-4xl text-red-500 font-bold text-center mt-7 mb-20">THIS IS A WIP. ALL DATA IS FAKE AND FOR TESTING PURPOSES.</h1>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center">
          <Map />
          <Phases phase={currPhase}/>
      </div>
    </>
  );
}

export default App;
