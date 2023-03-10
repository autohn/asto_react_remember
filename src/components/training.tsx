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
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const cacheTime = 1000 * 60 * 60 * 24 * 2;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
      //suspense: true,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
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
  const answerInitStyle =
    "rounded-lg bg-cooBlackOlive hover:bg-cooDrabDarkBrown hover:text-shadow shadow-cooTimberWolf w-full";
  const [randomItems, setRandomItems] = useState<Array<wordPair>>([]);
  const [randomPositions, setRandomPositions] = useState<Array<number>>([
    0, 1, 2, 3,
  ]);

  const [sortedItems, setSortedItems] = useState<Array<wordPair>>([]);
  const [trainingPosition, setTrainingPosition] = useState<number>(0);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState<number>(0);
  const [wrongAnswersCounter, setWrongAnswersCounter] = useState<number>(0);
  const [answerStyles, setAnswerStyles] = useState<Array<string>>([
    answerInitStyle,
    answerInitStyle,
    answerInitStyle,
    answerInitStyle,
  ]);

  const [uiBloked, setUiBloked] = useState<boolean>(false);
  //const queryClient = useQueryClient();

  function fisherYatesShuffleWithOrder<T>(list: T[]): T[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const prob = Math.random() + i / (list.length - 1) / 1.2;

      if (prob > 1) {
        [list[i], list[j]] = [list[j]!, list[i]!];
      }
    }
    return list;
  }

  //fisher Yates Shuffle for array of objects

  const randomize = (ldata: wordPair[]) => {
    console.log(trainingPosition);
    let shuffled = [...ldata];
    shuffled.splice(trainingPosition, 1); //TODO ???????????????? ???? ???????????? ????

    /*     console.table(ldata);
    console.table(shuffled); */

    shuffled.sort(() => {
      return 0.5 - Math.random();
    });

    //console.table(shuffled);

    setRandomItems([
      ldata[trainingPosition]!,
      shuffled[0]!,
      shuffled[1]!,
      shuffled[2]!,
    ]);

    setRandomPositions(
      [0, 1, 2, 3].sort(() => {
        return 0.5 - Math.random();
      })
    );

    setTrainingPosition((p) => {
      if (p < ldata.length) {
        return ++p;
      } else {
        alert("End of training");
        location.replace("/");
        return 0;
      }
    });
  };
  const { data } = useQuery({
    queryKey: ["words"],
    queryFn: getAllWords,
    //suspense: true,
    //refetchOnMount: false, ???????????? persistQueryClient
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess: (d) => {
      if (d.length < 4) {
        alert("Must be minimum 4 words in the list");
        location.replace("/");
      }

      d.sort((a, b) => {
        return a.correctAnswers - b.correctAnswers;
      });

      fisherYatesShuffleWithOrder(d);
      setSortedItems(d);
      randomize(d);
    },
  });

  const editPairMutation = useMutation({
    mutationFn: editPair,
    onSuccess: () => {}, //?????? ???? ???????????? invalidate ?????????? ???? ?????????????? api, ???? ???????? ???? ???????????? ???????? ?????????????? ???????????? ?????? ?????? ???????????????????? ???????????????????? ???????????????????? ?????????????? ?????? ?????????? ???????????????????? randomitems
  });

  const checkAnswer = (pos: number) => {
    /*     console.log(randomItems);
    console.log(sortedItems);
    console.log(trainingPosition); */
    if (!uiBloked) {
      setUiBloked(true);

      const setColor = () => {
        setAnswerStyles(
          answerStyles.map((e, key) => {
            return randomPositions[key] == 0 && key !== pos
              ? `rounded-lg animate-[bdgb_1500ms]`
              : key == pos //TODO ???????????? [b${color}b_5s] ?????????????????? ?????????????? ???????????? ??????
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

          randomize(sortedItems);
          setUiBloked(false);
        }, 1500);
      };

      if (randomPositions[pos] == 0) {
        setCorrectAnswersCounter((c) => {
          return ++c;
        });

        let updatedItem = {
          ...randomItems[0]!,
          correctAnswers: randomItems[0]!.correctAnswers + 1,
        };
        editPairMutation.mutate(updatedItem);

        setColor();
      } else {
        //TODO ???????????????????????? ?????????? ???????????? ???????????????????????? ?? ?????????? ?????? ?????????????? ????????????????????, ?? ???? ?????????????? ??????????????
        setWrongAnswersCounter((c) => {
          return ++c;
        });

        let updatedItem = {
          ...randomItems[0]!,
          wrongAnswers: randomItems[0]!.wrongAnswers + 1,
        };
        editPairMutation.mutate(updatedItem);

        setColor();
      }
    }
  };

  useEffect(() => {
    //randomize();
  }, []);

  return (
    <div>
      <div>
        <div className="text-lg rounded-lg bg-cooDarkBlackOlive text-center my-4 max-w-md h-10 m-auto leading-9 capitalize">
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
              <p className="mx-2 leading-7 overflow-auto">
                {randomItems[
                  randomPositions[key] as number
                ]?.rus.toLowerCase() ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex center">
        <div className="p-2 my-4 rounded-lg bg-cooDarkBlackOlive m-auto capitalize">
          Correct: {correctAnswersCounter} | Wrong: {wrongAnswersCounter}
        </div>
      </div>
    </div>
  );
};

export default Training;
