import type React from "react";
import { useState, useEffect } from "react";
import type { wordPair } from "../nanoStore";
import { getAllWords } from "../nanoStore";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

type newWrdPair = Pick<wordPair, "eng" | "rus">;

const cacheTime = 1000 * 60 * 60 * 24 * 2;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
      suspense: true,
    },
  },
});

const Training: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TrainingC />
      </QueryClientProvider>
    </>
  );
};

const editPair = async (pair?: wordPair) => {
  if (pair) {
    fetch(`http://127.0.0.1:8090/api/collections/words/records/${pair.id}`, {
      method: "PATCH",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(pair),
    });
  }
};

const TrainingC: React.FC = () => {
  const [randomItems, setRandomItems] = useState<Array<wordPair>>([]);
  const [randomPositions, setRandomPositions] = useState<Array<number>>([
    0, 1, 2, 3,
  ]);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState<number>(0);
  const [wrongAnswersCounter, setWrongAnswersCounter] = useState<number>(0);
  const [answerStyles, setAnswerStyles] = useState<Array<string>>([
    "rounded-lg bg-blue-100",
    "rounded-lg bg-blue-100",
    "rounded-lg bg-blue-100",
    "rounded-lg bg-blue-100",
  ]);

  const [uiBloked, setUiBloked] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["words"],
    queryFn: getAllWords,
    suspense: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const editPairMutation = useMutation({
    mutationFn: editPair,
    onSuccess: () => {}, //тут не делаем invalidate чтобы не дергать api, по идее не должно быть проблем потому что для обновления количества правильных ответов для слова используем randomitems
  });

  const randomize = () => {
    //в случае с suspense не требуется  if (typeof data !== "undefined"), срабатывает только после окончания fetch
    setRandomItems(
      [...data!].sort(() => {
        return 0.5 - Math.random();
      })
    );

    setRandomPositions(
      //TODO как-то красивее?

      [0, 1, 2, 3].sort(() => {
        return 0.5 - Math.random();
      })
    );
  };

  const checkAnswer = (pos: number) => {
    if (!uiBloked) {
      setUiBloked(true);

      const setColor = (color: string) => {
        setAnswerStyles((styles) => {
          return styles.map((e, key) => {
            //console.log(key, pos, randomPositions[0]);
            let st =
              randomPositions[key] == 0 && key !== pos
                ? `rounded-lg transition duration-500 bg-green-500`
                : key == pos //TODO работает ненадежно (иногда под курсором белой становится, хотя строка правильная)
                ? `rounded-lg transition duration-500 bg-${color}-100`
                : e;
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
            randomize();
            setUiBloked(false);
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

        editPairMutation.mutate(
          udatedRandomItems[randomPositions[pos] as number]
        );

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

        editPairMutation.mutate(
          udatedRandomItems[randomPositions[pos] as number]
        );

        setColor("red");
      }
    }
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <>
      <div>
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
              <p className="mx-2">
                {randomItems[randomPositions[key] as number]?.rus}
              </p>
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
