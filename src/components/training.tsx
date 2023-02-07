import type React from "react";
import { useState, useEffect } from "react";
import type { wordPair } from "../api";
import { getAllWords, editPair } from "../api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "../styles/training.scss";

const cacheTime = 1000 * 60 * 60 * 24 * 2;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
      //suspense: true,
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

const TrainingC: React.FC = () => {
  const [randomItems, setRandomItems] = useState<Array<wordPair>>([]);
  const [randomPositions, setRandomPositions] = useState<Array<number>>([
    0, 1, 2, 3,
  ]);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState<number>(0);
  const [wrongAnswersCounter, setWrongAnswersCounter] = useState<number>(0);
  const [answerStyles, setAnswerStyles] = useState<Array<string>>([
    "answer",
    "answer",
    "answer",
    "answer",
  ]);

  const [uiBloked, setUiBloked] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["words"],
    queryFn: getAllWords,
    //suspense: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: (d) => {
      randomize(d);
    },
  });

  const editPairMutation = useMutation({
    mutationFn: editPair,
    onSuccess: () => {}, //тут не делаем invalidate чтобы не дергать api, по идее не должно быть проблем потому что для обновления количества правильных ответов для слова используем randomitems
  });

  const randomize = (ldata: wordPair[]) => {
    //в случае с suspense не требуется проверок, срабатывает только после окончания fetch
    //без suspense вызывается в onSuccess
    setRandomItems(
      [...ldata!].sort(() => {
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
              ? "answer_other_correct"
              : key == pos //TODO почему [b${color}b_5s] рандомным образом ломает все
              ? randomPositions[pos] == 0
                ? "answer_correct"
                : "answer_wrong"
              : e;
            /*             return randomPositions[key] == 0 && key !== pos
              ? `rounded-lg animate-[bdgb_1500ms]`
              : key == pos //TODO почему [b${color}b_5s] рандомным образом ломает все
              ? randomPositions[pos] == 0
                ? "rounded-lg animate-[bgb_1500ms]"
                : `rounded-lg animate-[brb_1500ms]`
              : e; */
          })
        );

        setTimeout(() => {
          setAnswerStyles(
            answerStyles.map((e, key) => {
              return "answer";
            })
          );

          randomize(data ?? []);
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
    //randomize();
  }, []);

  return (
    <div className="">
      <div>
        <div className="question">
          {randomItems[0]?.eng.toLowerCase() ?? "-"}
        </div>

        <div className="answer-grid">
          {[...Array(4)].map((x, key) => (
            <div
              key={key}
              className={answerStyles[key]}
              onClick={(e) => {
                e.preventDefault();
                checkAnswer(key);
              }}
            >
              <p className="">
                {randomItems[
                  randomPositions[key] as number
                ]?.rus.toLowerCase() ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="correct-wrong">
        Correct: {correctAnswersCounter} / Wrong: {wrongAnswersCounter}
      </div>
    </div>
  );
};

export default Training;
