import type React from "react";
import { useState, useEffect } from "react";

//export const prerender = true;
/* 
const words = (
  await fetch("http://127.0.0.1:8090/api/collections/words/records/").then(
    (response) => response.json()
  )
).items;
 */
//console.log("hidration test");

const WordsList: React.FC = () => {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Array<any>>([]);
  const [eng, setEng] = useState<string>("");
  const [rus, setRus] = useState<string>("");

  //const [list, setList] = useState<typeof listi>(listi);
  useEffect(() => {
    fetch("http://127.0.0.1:8090/api/collections/words/records/")
      .then((res) => res.json())
      .then((result) => {
        setIsLoading(false);
        setItems(result.items);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
      });
  }, []);

  const addNewPair = async () => {
    fetch("http://127.0.0.1:8090/api/collections/words/records/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eng: eng, rus: rus }),
    });
  };
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

  return (
    <>
      {error?.message}
      {isLoading && <div>Loading...</div>}

      <>
        {items?.map((word: any, key: number) => (
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
      <form onSubmit={addNewPair}>
        <h3 className="text-green-800">Create new pair</h3>
        <input
          type="text"
          placeholder="eng"
          value={eng}
          onChange={(e) => setEng(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="rus"
          value={rus}
          onChange={(e) => setRus(e.target.value)}
        ></input>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Button
        </button>
      </form>
    </>
  );
};

export default WordsList;
