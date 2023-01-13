import type React from "react";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

export interface wordPair {
  eng: string;
  rus: string;
  id: string;
  correctAnswers: number;
  wrongAnswers: number;
}

type newWrdPair = Pick<wordPair, "eng" | "rus">;

export const getAllWords = async () => {
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
      console.log(e);
      items = items.concat(e.items);
    });
  }

  console.log("загружено ", items.length, " слов");

  return items;
};

const WordsList: React.FC = () => {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Array<wordPair>>([]);
  const [eng, setEng] = useState<string>("");
  const [rus, setRus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  //const [list, setList] = useState<typeof listi>(listi);
  useEffect(() => {
    getAllWords()
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
      });
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
    if (selectedFile.type == "application/json") {
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
      <form
        onSubmit={(e) => {
          handleAddPair(e);
        }}
      >
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
        onClick={() => deleteAll()}
        type="submit"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete all
      </button>
      {error?.message}
      {isLoading && <div>Loading...</div>}

      <>
        {items?.map((word: wordPair, key: number) => (
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
    </>
  );
};

export default WordsList;
