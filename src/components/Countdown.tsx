import React, { useEffect, useState } from "react";
import NewsList from "./NewsList";
import Poll from "./Poll";

const Countdown: React.FC = () => {
  interface TimeLeft {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  }

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date("2029-01-20") - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const calculatePercentage = (): number => {
    const totalDuration = +new Date("2029-01-20") - +new Date("2025-01-20");
    const elapsed = +new Date() - +new Date("2025-01-20");
    return (elapsed / totalDuration) * 100;
  };

  const milestones = [
    { name: "Inauguration Day", date: new Date("2025-01-20") },
    { name: "First 100 Days", date: new Date("2025-04-30") },
    { name: "First State of the Union Address", date: new Date("2025-02-05") },
    {
      name: "First Annual Joint Session of Congress",
      date: new Date("2025-09-30"),
    },
    { name: "Midterm Elections", date: new Date("2026-11-03") },
    { name: "Election Day", date: new Date("2028-11-07") },
  ];

  const milestoneMarkers = milestones
    .filter((milestone) => +milestone.date > +new Date())
    .map((milestone) => {
      const milestonePercentage =
        ((+milestone.date - +new Date("2025-01-20")) /
          (+new Date("2029-01-20") - +new Date("2025-01-20"))) *
        100;
      return (
        <div
          key={milestone.name}
          className="absolute top-0 h-full flex items-center justify-center border-l-2 border-black milestone-marker"
          style={{ left: `${milestonePercentage}%` }}
        >
          <span className="text-xs text-black bg-white p-1 rounded shadow-lg milestone-label">
            {milestone.name}
          </span>
        </div>
      );
    });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [percentage, setPercentage] = useState(calculatePercentage());
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("politicalMode");
    if (savedMode) {
      return savedMode;
    }
    return Math.random() < 0.5 ? "republican" : "democrat";
  });
  const [showMilestones, setShowMilestones] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setPercentage(calculatePercentage());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("politicalMode", mode);
  }, [mode]);

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof TimeLeft;
    if (!timeLeft[key]) {
      return;
    }

    timerComponents.push(
      <span key={key} className="mx-1">
        {timeLeft[key]} {key}{" "}
      </span>
    );
  });

  const message =
    mode === "republican"
      ? `President Trump has ${timeLeft.days} days left to make America great again!`
      : `${timeLeft.days} days left for Donny to stop "trumping" the country!`;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        mode === "republican" ? "bg-red-500" : "bg-blue-500"
      } p-10`}
    >
      <h1 className="text-5xl font-extrabold mb-6 text-white">
        Countdown to Next President
      </h1>
      <div className="text-3xl text-white mb-4">
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
      <div className="text-xl text-white mb-6">{message}</div>
      <div className="w-full max-w-4xl bg-gray-200 rounded-full h-12 mt-4 overflow-hidden relative shadow-lg">
        <div
          className="bg-green-500 h-12 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <span className="text-black font-bold text-lg">
            {percentage.toFixed(2)}%
          </span>
        </div>
        {showMilestones && milestoneMarkers}
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() =>
            setMode(mode === "republican" ? "democrat" : "republican")
          }
          className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300 transition"
        >
          Switch to {mode === "republican" ? "Democrat" : "Republican"} Mode
        </button>
        <button
          onClick={() => setShowMilestones(!showMilestones)}
          className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300 transition"
        >
          {showMilestones ? "Hide Milestones" : "Show Milestones"}
        </button>
      </div>
      <div className="mt-12 flex flex-col items-center">
        <div className="flex space-x-8">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src="/trump.png"
              alt="Current President"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src="/vance.png"
              alt="Current Vice President"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex space-x-8 mt-4">
          <span className="text-2xl text-white font-bold">
            Current President
          </span>
          <span className="text-2xl text-white font-bold">
            Current Vice President
          </span>
        </div>
      </div>
      <Poll />
      <NewsList mode={mode} />
    </div>
  );
};

export default Countdown;
