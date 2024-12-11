import React from "react";
import TicketsDisplay from "./components/TicketsDisplay";
import LogDisplay from "./components/LogDisplay";
import ControlPanel from "./components/ControlPanel";
import ConfigForm from "./components/ConfigForm";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Ticketing System</h1>
      <TicketsDisplay />
      <LogDisplay />
      <ControlPanel />
      <ConfigForm />
    </div>
  );
}

export default App;
