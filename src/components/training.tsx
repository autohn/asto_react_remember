import type React from "react";
import { useState, useEffect } from "react";
import { getAllWords, wordPair } from "./wordsList";

const editPair = async (pair: wordPair) => {
  fetch(`http://127.0.0.1:8090/api/collections/words/records/${pair.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pair),
  });
};

const Training: React.FC = () => {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Array<wordPair>>([]);
  const [randomItems, setRandomItems] = useState<Array<wordPair>>([]);
  const [randomPositions, setRandomPositions] = useState<Array<number>>([]);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState<number>(0);
  const [wrongAnswersCounter, setWrongAnswersCounter] = useState<number>(0);
  const [answerStyles, setAnswerStyles] = useState<Array<string>>([
    "rounded-lg bg-blue-100",
    "rounded-lg bg-blue-100",
    "rounded-lg bg-blue-100",
    "rounded-lg bg-blue-100",
  ]);
  const [uiBloked, setUiBloked] = useState<boolean>(false);

  const randomize = (items: Array<wordPair>) => {
    setRandomItems(
      [...items].sort(() => {
        return 0.5 - Math.random();
      })
    );

    setRandomPositions(
      //TODO как-то красивее?
      [0, 1, 2, 3].sort(() => {
        return 0.5 - Math.random();
      })
    );
    setUiBloked(false);
  };

  const checkAnswer = (pos: number) => {
    if (!uiBloked) {
      setUiBloked(true);
      const setColor = (color: string) => {
        setAnswerStyles((styles) => {
          return styles.map((e, key) => {
            console.log(key, pos, randomPositions[0]);
            let st =
              randomPositions[key] == 0 && key !== pos
                ? `rounded-lg transition duration-500 bg-green-500`
                : key == pos //TODO работает ненадежно (иногда под курсором белой становится, хотя строка правильная)
                ? `rounded-lg transition duration-500 bg-${color}-100`
                : e;
            console.log(st);
            return st;
          });
        });

        //e.currentTarget.className = "transition duration-2000 bg-blue-100";
        setTimeout(() => {
          setAnswerStyles((styles) => {
            return styles.map((e, key) => {
              return "rounded-lg transition duration-500 bg-blue-100";
            });
          });
          setTimeout(() => {
            randomize(items);
          }, 500);
        }, 500);
      };

      if (randomPositions[pos] == 0) {
        setCorrectAnswersCounter((c) => {
          return ++c;
        });

        const udatedRandomItems = randomItems.map((e, key) => {
          return key == randomPositions[pos]
            ? { ...e, correctAnswers: ++e.correctAnswers }
            : e;
        });

        setRandomItems(udatedRandomItems);

        editPair(udatedRandomItems[randomPositions[pos]]);

        setColor("green");
      } else {
        setWrongAnswersCounter((c) => {
          return ++c;
        });

        const udatedRandomItems = randomItems.map((e, key) => {
          return key == randomPositions[pos]
            ? { ...e, wrongAnswers: ++e.wrongAnswers }
            : e;
        });

        setRandomItems(udatedRandomItems);

        editPair(udatedRandomItems[randomPositions[pos]]);

        setColor("red");
      }
    }
  };

  useEffect(() => {
    getAllWords()
      .then((e) => {
        setItems(e);
        randomize(e);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (typeof e === "string") {
          console.log(e.toUpperCase());
        } else if (e instanceof Error) {
          setError(e);
        }
      });
  }, []);

  return (
    <>
      <div>
        {error?.message}
        {isLoading && <div>Loading...</div>}
        <div className="rounded-lg bg-orange-100 text-center my-4">
          {randomItems[0]?.eng}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((x, key) => (
            <div
              key={key}
              className={answerStyles[key]}
              onClick={() => {
                checkAnswer(key);
              }}
            >
              <p className="mx-2">{randomItems[randomPositions[key]]?.rus}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-4">
        Correct: {correctAnswersCounter} / Wrong: {wrongAnswersCounter}
      </div>
    </>
  );
};

export default Training;
