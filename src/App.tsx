import React from "react";
import Countdown from "./components/Countdown";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Countdown />
    </div>
  );
};

export default App;
