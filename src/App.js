import Calculator from "./components/Calculator";
import WasteChart from "./components/WasteChart";

function App() {
  return (
    <div style={{ fontFamily: "Arial", maxWidth: "900px", margin: "0 auto" }}>
      <Calculator />
      <hr />
      <WasteChart />
    </div>
  );
}

export default App;