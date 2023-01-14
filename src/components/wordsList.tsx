import type React from "react";
import { useState, useEffect, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  useObservable,
  useObservableState,
  useSubscription,
} from "observable-hooks";
import {
  BehaviorSubject,
  from,
  distinctUntilChanged,
  filter,
  delay,
  debounceTime,
  mergeMap,
  shareReplay,
  switchMap,
  interval,
  map,
} from "rxjs";

export interface wordPair {
  eng: string;
  rus: string;
  id: string;
  correctAnswers: number;
  wrongAnswers: number;
}

type newWrdPair = Pick<wordPair, "eng" | "rus">;

export const getAllWords = async (): Promise<wordPair[]> => {
  let items: any;
  const firstItems = await (
    await fetch(
      "http://127.0.0.1:8090/api/collections/words/records/?perPage=500"
    )
  ).json();

  items = firstItems.items;

  if (firstItems.totalPages > 1) {
    let additionalItems = await Promise.all(
      [...Array(firstItems.totalPages - 1)].map(async (e, key) => {
        return await (
          await fetch(
            `http://127.0.0.1:8090/api/collections/words/records/?perPage=500&page=${
              key + 2
            }`
          )
        ).json();
      })
    );
    additionalItems.forEach((e) => {
      //console.log(e);
      items = items.concat(e.items);
    });
  }

  console.log("загружено ", items.length, " слов");

  /*   await setTimeout(() => {
    console.log("Delayed for 1 second.");
  }, 3000); */

  return items;
};

/* let seaarchSubject = new BehaviorSubject<string>("");
let bh = new BehaviorSubject<wordPair[]>([]);
let data = await getAllWords();
bh.next(data); */

/*
let searchResult$ = seaarchSubject.pipe(
  //filter((val) => val.length > 1),
  shareReplay(1, 3000),
  debounceTime(400),
  distinctUntilChanged(),
  mergeMap((val) => from(getAllWords()))
); */

let sub = new BehaviorSubject<Array<wordPair>>(await getAllWords());
/* let obs = from(getAllWords());

sub.subscribe(obs);

sub.next([]); */

const WordsList: React.FC = () => {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Array<wordPair>>([]);
  const [eng, setEng] = useState<string>("");
  const [rus, setRus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [search, setSearch] = useState<string>("");
  //const [items2, setItems2] = useState<Array<wordPair>>([]);

  /*   const itemss = useMemo(() => getAllWords(), []);

  const filterWords = async (filter: string) => {
    return (await itemss).filter(
      (item: wordPair) => item.eng.includes(filter) || item.rus.includes(filter)
    );
  };
 */
  //console.log(filterWords("chug"));

  /*   const [items2, setA] = useObservableState<Array<wordPair>>(
    (a$) =>
      a$.pipe(
        //filter((val) => val.length > 1),
        //shareReplay(1, 3000),
        //debounceTime(400),
        distinctUntilChanged(),
        switchMap((val) => getAllWords())
      ),
    []
  ); */

  /*  const [items2, setItems2] = useObservableState<wordPair[], wordPair[]>(
    ini,
    []
  );
 */
  //const subscription = useSubscription(obs, sub);
  //console.log(items2);
  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    setSearch(newValue);
    console.log("handler");
    //seaarchSubject.next(newValue);
    sub.next([
      { eng: "a", rus: "a", id: "a", correctAnswers: 1, wrongAnswers: 1 },
    ]);
  };

  const items2 = useObservableState(sub, []);
  /*   const items3 = useObservableState(
    sub.pipe(map((pokemon) => pokemon.filter((p) => p.eng.includes("chu")))),
    []
  ); */
  //const [list, setList] = useState<typeof listi>(listi);
  useEffect(() => {
    /* getAllWords()
      .then((e) => {
        setItems(e);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (typeof e === "string") {
          console.log(e.toUpperCase());
        } else if (e instanceof Error) {
          setError(e);
        }
      });*/
  }, []);

  const addNewPair = async ({ eng, rus }: newWrdPair) => {
    return fetch("http://127.0.0.1:8090/api/collections/words/records/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eng: eng,
        rus: rus,
        correctAnswers: 0,
        wrongAnswers: 0,
      }),
    }).then((response) => {
      if (!response.ok) {
        console.log("err");
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    });
  };

  //[].forEach((e) => addNewPair(e));
  const deletePair = async (id: string) => {
    fetch(`http://127.0.0.1:8090/api/collections/words/records/${id}`, {
      method: "DELETE",
    });

    setItems(
      items.filter((e) => {
        return e.id !== id;
      })
    );
  };

  const addFromFile = async () => {
    if (selectedFile?.type == "application/json") {
      JSON.parse(await selectedFile.text()).list.forEach((e: newWrdPair) =>
        addNewPair({ eng: e.eng, rus: e.rus }).then((data) =>
          setItems((e) => e.concat([data]))
        )
      );
    }
  };

  const deleteAll = async () => {
    items.forEach((e) => {
      deletePair(e.id);
    });
    setItems([]);
  };

  const handleAddPair = async (e: FormEvent) => {
    e.preventDefault();
    addNewPair({ rus, eng })
      .then((result: wordPair) => {
        setItems(items.concat([result]));
      })
      .catch((error) => {
        console.log(error);
      });
    setEng("");
    setRus("");
    //console.log(Object.keys(items[0]));
  };

  return (
    <>
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
      {error?.message}
      {isLoading && <div>Loading...</div>}
      <>
        {items2?.map((word: wordPair, key: number) => (
          <p
            className="hover:bg-red-100"
            onClick={() => {
              deletePair(word.id);
            }}
            key={word.id}
          >
            {word.eng} {word.rus}
          </p>
        ))}
      </>

      {/*       <>
        {items2?.map((word: wordPair, key: number) => (
          <p
            className="hover:bg-red-100"
            onClick={() => {
              deletePair(word.id);
            }}
            key={word.id}
          >
            {word.eng} {word.rus}
          </p>
        ))}
      </> */}
    </>
  );
};

export default WordsList;
