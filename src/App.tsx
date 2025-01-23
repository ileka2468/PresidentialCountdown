import React from "react";
import Countdown from "./components/Countdown";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-0 2xl:p-10">
      <Countdown />
    </div>
  );
};

export default App;
