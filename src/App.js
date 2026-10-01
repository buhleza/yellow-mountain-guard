import { useState } from "react";

import Navigation from "./components/Navigation";
import Calculator from "./components/Calculator";
import WasteChart from "./components/WasteChart";
import DroneDashboard from "./components/DroneDashboard";
import CommunityDashboard from "./components/CommunityDashboard";
import "./App.css";

function App() {

  const [activeDashboard, setActiveDashboard] = useState("drone");

  function renderDashboard() {

    if (activeDashboard === "drone") {
      return <DroneDashboard />;
    }

    if (activeDashboard === "recycling") {
      return (
        <div>
          <h1>Recycling Value</h1>
          <p>Economic case for waste reprocessing</p>

          <Calculator />

          <hr />

          <WasteChart />
        </div>
      );
    }

    if (activeDashboard === "community") {
      return (
        <div>
          <h1>Community Monitor</h1>
          <p>Air quality & alerts</p>

          <CommunityDashboard />
        </div>
      );
    }
  }

  return (
    <div className="app">

      <Navigation
        activeDashboard={activeDashboard}
        onNavigate={setActiveDashboard}
      />

      <main className="main-content">
        {renderDashboard()}
      </main>

    </div>
  );
}

export default App;
