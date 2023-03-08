import type React from "react";
import { useState, useEffect, useMemo, useContext, createContext } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { wordPair } from "../api";
import { getAllWords, addNewPair, deletePair, newWordPairSchema } from "../api";
import { useStore } from "@nanostores/react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { z } from "zod";
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

const WordsList: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WordsListC />
      </QueryClientProvider>
    </>
  );
};

export const WordsListC: React.FC = () => {
  //const [error, setError] = useState<Error>();
  //const [isLoading, setIsLoading] = useState(true);
  //const [items, setItems] = useState<Array<wordPair>>([]);
  /*   const { wordsList, setWordsList, fetchWords } = useStore();
  const [items, setItems] = [wordsList, setWordsList]; */
  const [eng, setEng] = useState<string>("");
  const [rus, setRus] = useState<string>("");
  //const [selectedFile, setSelectedFile] = useState<File>();
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["words"],
    queryFn: getAllWords,
    onSuccess: (e) => {
      //console.log(e.length);
      //e.forEach((i) => console.log(i));
    },
    onError: (e) => {
      location.replace("/login");
      console.log("errrorr", e);
    },
    //suspense: true,
  });

  const addNewPairMutation = useMutation({
    mutationFn: addNewPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
    },
  });

  const addNewPairFromFileMutation = useMutation({
    mutationFn: addNewPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
    },
  });

  //[].forEach((e) => addNewPair(e));

  const deletePairMutation = useMutation({
    mutationFn: deletePair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
    },
  });

  const deleteAll = async () => {
    //TODO оптимизировать массовые действия
    data?.forEach((e) => {
      deletePairMutation.mutate(e.id);
    });
  };

  const addFromFile = async (selectedFile: File) => {
    if (selectedFile?.type == "application/json") {
      const rawItem = JSON.parse(await selectedFile.text());
      const newWordPairListSchema = z.object({
        list: z.array(newWordPairSchema),
      });
      const parsedItem = newWordPairListSchema.parse(rawItem);

      parsedItem.list.forEach((e) =>
        addNewPairFromFileMutation.mutate({ eng: e.eng, rus: e.rus })
      );
    }
  };

  useEffect(() => {}, []);

  const handleAddPair = async (e: FormEvent) => {
    e.preventDefault();
    addNewPairMutation.mutate({ rus, eng });

    setEng("");
    setRus("");
    //console.log(Object.keys(items[0]));
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    setSearch(newValue);
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <img
              className="object-contain h-6 w-6"
              src="icons8-search.svg"
            ></img>
          </div>
          <input
            onChange={handleSearch}
            value={search}
            type="search"
            id="default-search"
            className="block p-4 pl-10 text-sm w-full my-2 rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
            placeholder="Search words"
            required
          ></input>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-x-2">
        <form className="flex flex-col " onSubmit={handleAddPair}>
          <input
            className="input-xs max-w-xs rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
            type="text"
            placeholder="eng"
            value={eng}
            onChange={(e) => setEng(e.target.value)}
            required
          ></input>
          <input
            className="input-xs max-w-xs rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
            type="text"
            placeholder="rus"
            value={rus}
            onChange={(e) => setRus(e.target.value)}
            required
          ></input>
          <button type="submit" className="btn btn-primary my-2">
            Add pair
          </button>
        </form>
        <div className="flex flex-col">
          <form
            className=""
            /*         onSubmit={(e) => {
          e.preventDefault();
          addFromFile();
        }} */
          >
            <input
              className={`${
                addNewPairFromFileMutation.status === "loading"
                  ? "file-input-warning"
                  : addNewPairFromFileMutation.status === "success"
                  ? "file-input-success"
                  : "file-input-primary"
              }
            file-input file-input-bordered file-input-primary w-full max-w-xs hover:bg-cooDrabDarkBrown`}
              type="file"
              accept=".json"
              placeholder="file"
              multiple={false}
              name="file"
              required
              onChange={(e) => {
                e.preventDefault();
                if (e.target?.files?.[0]) {
                  addFromFile(e.target.files[0]);
                }
                //setSelectedFile(e.target?.files![0]);
              }}
            ></input>
          </form>

          <button type="submit" className="btn btn-primary my-2">
            <a href="/MATranslations.json" download>
              Take Мискин list
            </a>
          </button>

          <button
            onClick={deleteAll}
            type="submit"
            className="hidden ml-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete all
          </button>
        </div>
      </div>
      {/*       {status === "error" && <div>{status}</div>}
      {status === "loading" && <div>Loading...</div>} */}
      <>
        {data
          ?.filter((i) => {
            //console.log(i);
            return i.eng.includes(search) || i.rus.includes(search);
          })
          ?.map((word: wordPair, key: number) => (
            <div
              className="flex justify-between border-solid border-collapse border border-cooFeldgrau rounded-lg bg-cooBlackOlive hover:bg-cooDrabDarkBrown "
              key={word.id}
            >
              <div className="ml-2 truncate">
                {word.eng.toLowerCase()} - {word.rus.toLowerCase()}
              </div>
              <div className="flex flex-nowrap">
                <div className="whitespace-nowrap">
                  {word.correctAnswers} / {word.wrongAnswers}
                </div>

                <button
                  onClick={() => {
                    deletePairMutation.mutate(word.id);
                  }}
                  className="ml-2 inline relative bottom-px btn btn-outline btn-error btn-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </>
    </div>
  );
};

export default WordsList;
