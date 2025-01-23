import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eallbjehkcalvovxckjm.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Poll {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  votes_a: number;
  votes_b: number;
}

const Poll: React.FC = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchPoll();
    checkIfVoted();
  }, []);

  const fetchPoll = async () => {
    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching poll:", error);
    } else {
      setPoll(data);
      checkIfVoted(data);
    }
  };

  const checkIfVoted = (pollData: Poll | null = poll) => {
    const voted = localStorage.getItem("voted_poll_id");
    if (voted && pollData && voted === pollData.id) {
      setHasVoted(true);
    }
  };

  const handleVote = async (option: "a" | "b") => {
    if (!poll) return;

    const column = option === "a" ? "votes_a" : "votes_b";
    const updatedPoll = { ...poll, [column]: poll[column] + 1 };
    setPoll(updatedPoll);
    setSelectedOption(option);
    setHasVoted(true);
    localStorage.setItem("voted_poll_id", poll.id);

    const { error } = await supabase
      .from("polls")
      .update({ [column]: poll[column] + 1 })
      .eq("id", poll.id)
      .single();

    if (error) {
      console.error("Error updating vote:", error);
    }
  };

  if (!poll) {
    return <div>Loading...</div>;
  }

  const totalVotes = poll.votes_a + poll.votes_b;
  const percentageA = ((poll.votes_a / totalVotes) * 100).toFixed(2);
  const percentageB = ((poll.votes_b / totalVotes) * 100).toFixed(2);

  return (
    <div className="mt-12 text-white w-full max-w-4xl mx-auto px-4">
      <h2 className="text-4xl font-bold mb-6 text-center">Poll of the Day</h2>
      <p className="text-2xl mb-6 font-semibold italic text-center">
        {poll.question}
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => handleVote("a")}
          disabled={hasVoted}
          className={`px-8 py-4 rounded-lg shadow-lg transition ${
            selectedOption === "a"
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          }`}
        >
          {poll.option_a}
        </button>
        <button
          onClick={() => handleVote("b")}
          disabled={hasVoted}
          className={`px-8 py-4 rounded-lg shadow-lg transition ${
            selectedOption === "b"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          {poll.option_b}
        </button>
      </div>
      {hasVoted && (
        <div className="mt-4">
          <p className="text-2xl font-bold mb-4 text-center">Results:</p>
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-10 relative">
              <div
                className="bg-green-500 h-10 rounded-full flex items-center justify-center"
                style={{ width: `${percentageA}%` }}
              >
                <span className="text-white font-bold">
                  {percentageA}% ({poll.votes_a} votes)
                </span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-10 relative">
              <div
                className="bg-blue-500 h-10 rounded-full flex items-center justify-center"
                style={{ width: `${percentageB}%` }}
              >
                <span className="text-white font-bold">
                  {percentageB}% ({poll.votes_b} votes)
                </span>
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold text-center">
            Total Votes: {totalVotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default Poll;
