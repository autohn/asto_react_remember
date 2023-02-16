import type React from "react";
import { useEffect, useState } from "react";
import { getAllWords } from "../api";

export const tw_test: React.FC = () => {
  const [cls, setCls] = useState<string>("bg-red-500 rounded");
  const [timeas, setTimeas] = useState<any>("");

  /*   const [test, setTest] = useState<any>(1); */

  getAllWords();
  /*   localStorage.setItem(
    "Remember", //TODO в зод проверке форм приводить к нижнему регистру
    JSON.stringify({})
  ); */

  for (let i in localStorage) {
    console.log(i);
  }
  //console.log(localStorage.hasOwnProperty("Remember"));

  useEffect(() => {
    /*     setTest((e: number) => {
      return e + 1;
    });

    setTest((e: number) => {
      console.log(e);
      return e + 1;
    });
    console.log("123"); */
    const timeau = Date.now();
    setTimeas(timeau);
  }, []);
  const timea = Date.now();

  //console.log("log серверный внутри", timea);

  function findLocalItems(query = "") {
    let results: any = [];
    for (let i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.includes("Remember")) {
          results.push(JSON.parse(localStorage.getItem(i)!));
        }
      }
    }
    return results;
  }

  return (
    <>
      <button onClick={(e) => findLocalItems()} type="submit" className={cls}>
        Delete all
        <div className="text-white">html серверный {timeas}</div>
      </button>
    </>
  );
};

export default tw_test;
