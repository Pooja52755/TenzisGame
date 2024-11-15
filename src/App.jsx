import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

let count = 0;

export default function App() {
  const [numbers, setNumbers] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [bestCount, setBestCount] = React.useState(1);
  const [leastTime, setLeastTime] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [timeLimit, setTimeLimit] = React.useState(60); // 60 seconds timer

  React.useEffect(() => {
    let timer;
    if (!tenzies && timeLimit > 0) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
        setTimeLimit(prevLimit => prevLimit - 1);
      }, 1000);
    } else if (timeLimit === 0) {
      alert("Time's up! Try again.");
      resetGame();
    }
    return () => clearInterval(timer);
  }, [tenzies, timeLimit]);

  React.useEffect(() => {
    const allHeld = numbers.every(die => die.isHeld);
    const allSameValue = numbers.every(die => die.value === numbers[0].value);

    if (allHeld && allSameValue) {
      setTenzies(true);

      // Update best count and least time
      if (count < bestCount || bestCount === 1) {
        setBestCount(count);
      }
      if (elapsedTime < leastTime || leastTime === 0) {
        setLeastTime(elapsedTime);
      }
    }
  }, [numbers]);

  function allNewDice() {
    return Array.from({ length: 10 }, () => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (!tenzies) {
      setNumbers(oldNumbers =>
        oldNumbers.map(die =>
          die.isHeld
            ? die
            : {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid(),
              }
        )
      );
      count++;
    } else {
      resetGame();
    }
  }

  function holdDice(id) {
    setNumbers(oldNumbers =>
      oldNumbers.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  function resetGame() {
    setTenzies(false);
    setNumbers(allNewDice());
    count = 0;
    setElapsedTime(0);
    setTimeLimit(60); // Reset the timer to 60 seconds
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="header">Tenzies</h1>
      <h3>
        <ul>
          <li>Roll until all dice are the same.</li>
          <li>Click each die to freeze it at its current value.</li>
        </ul>
      </h3>
      <h3 className="bestcount">Best Count: {bestCount}</h3>
      <h3 className="leasttime">Least Time: {leastTime}s</h3>
      <h3 className="count">Roll Count: {count}</h3>
      <h3 className="timer">Time Left: {timeLimit}s</h3>
      <div className="container">
        {numbers.map(die => (
          <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            hold={() => holdDice(die.id)}
          />
        ))}
      </div>
      <button className="roll" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
