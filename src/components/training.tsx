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
import { server_ip } from "../api";

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
    fetch(`${server_ip}:8090/api/collections/words/records/${pair.id}`, {
      method: "PATCH",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(pair),
    });
  }
};

const TrainingC: React.FC = () => {
  const answerInitStyle = "rounded-lg bg-superdarkPC hover:bg-darkPC w-full";
  const [randomItems, setRandomItems] = useState<Array<wordPair>>([]);
  const [randomPositions, setRandomPositions] = useState<Array<number>>([
    0, 1, 2, 3,
  ]);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState<number>(0);
  const [wrongAnswersCounter, setWrongAnswersCounter] = useState<number>(0);
  const [answerStyles, setAnswerStyles] = useState<Array<string>>([
    answerInitStyle,
    answerInitStyle,
    answerInitStyle,
    answerInitStyle,
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
        setAnswerStyles(
          answerStyles.map((e, key) => {
            return randomPositions[key] == 0 && key !== pos
              ? `rounded-lg animate-[bdgb_1500ms]`
              : key == pos //TODO почему [b${color}b_5s] рандомным образом ломает все
              ? randomPositions[pos] == 0
                ? "rounded-lg animate-[bgb_1500ms]"
                : `rounded-lg animate-[brb_1500ms]`
              : e;
          })
        );

        setTimeout(() => {
          setAnswerStyles(
            answerStyles.map((e, key) => {
              return answerInitStyle;
            })
          );

          randomize();
          setUiBloked(false);
        }, 1500);
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

        setColor("dg");
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

        setColor("r");
      }
    }
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <div className="text-starC">
      <div>
        <div className="text-lg rounded-lg bg-superdarkPC text-center my-4 max-w-md h-10 m-auto leading-9 border-2 border-darkPC capitalize">
          {randomItems[0]?.eng.toLowerCase() ?? "-"}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((x, key) => (
            <div
              key={key}
              className={answerStyles[key]}
              onClick={(e) => {
                e.preventDefault();
                checkAnswer(key);
              }}
            >
              <p className="mx-2 hover:text-lightstarC leading-7 ">
                {randomItems[
                  randomPositions[key] as number
                ]?.rus.toLowerCase() ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-4 text-center pt-10">
        Correct: {correctAnswersCounter} / Wrong: {wrongAnswersCounter}
      </div>
    </div>
  );
};

export default Training;
