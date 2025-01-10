import React, { useState, useEffect, useCallback} from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList ({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getJokes = useCallback(async () => {
    try {
      const jokes = [];
      const seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        const joke = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        }
      }

      setJokes(jokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [numJokesToGet]);

  useEffect(() => {
    getJokes();
  }, [getJokes]);

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map(j => (
        <Joke
          key={j.id}
          id={j.id}
          text={j.joke}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;
