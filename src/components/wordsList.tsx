import type React from "react";
import { useState, useEffect, useMemo, useContext, createContext } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { wordPair, newWordPair } from "../api";
import { getAllWords, addNewPair, deletePair } from "../api";
import { useStore } from "@nanostores/react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const cacheTime = 1000 * 60 * 60 * 24 * 2;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
      //suspense: true,
    },
  },
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
  const [selectedFile, setSelectedFile] = useState<File>();
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["words"],
    queryFn: getAllWords,
    onSuccess: (e) => {
      console.log(e.length);
      e.forEach((i) => console.log(i));
    },
    //suspense: true,
  });

  const addNewPairMutation = useMutation({
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

  const addFromFile = async () => {
    if (selectedFile?.type == "application/json") {
      JSON.parse(await selectedFile.text()).list.forEach((e: newWordPair) =>
        addNewPairMutation.mutate({ eng: e.eng, rus: e.rus })
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
    <div className="text-starC">
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
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search words"
            required
          ></input>
        </div>
      </form>
      <form onSubmit={handleAddPair}>
        <h3 className="text-green-800">Create new pair</h3>
        <input
          type="text"
          placeholder="eng"
          value={eng}
          onChange={(e) => setEng(e.target.value)}
          required
        ></input>
        <input
          type="text"
          placeholder="rus"
          value={rus}
          onChange={(e) => setRus(e.target.value)}
          required
        ></input>
        <button
          type="submit"
          className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add pair
        </button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addFromFile();
        }}
      >
        <input
          type="file"
          placeholder="file"
          multiple={false}
          name="file"
          required
          onChange={(e) => setSelectedFile(e.target?.files![0])}
        ></input>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add from json
        </button>
      </form>
      <button
        onClick={deleteAll}
        type="submit"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete all
      </button>
      {/*       {status === "error" && <div>{status}</div>}
      {status === "loading" && <div>Loading...</div>} */}
      <>
        {data
          ?.filter((i) => {
            console.log(i);
            return i.eng.includes(search) || i.rus.includes(search);
          })
          ?.map((word: wordPair, key: number) => (
            <p
              className="hover:bg-red-100"
              onClick={() => {
                deletePairMutation.mutate(word.id);
              }}
              key={word.id}
            >
              {word.eng.toLowerCase()} {word.rus.toLowerCase()}
            </p>
          ))}
      </>
    </div>
  );
};

export default WordsList;
