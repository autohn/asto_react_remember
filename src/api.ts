import ky from "ky";
import Surreal from "surrealdb.js";
import { authenticationToken, userName } from "./nanoStore";

export const server_name = import.meta.env.PUBLIC_DB_SERVER_NAME;

const db = new Surreal(server_name);

try {
  if (authenticationToken.get()) {
    await db.authenticate(authenticationToken.get()); //почему-то не работает если имя пользователя имеет спец символы (в базе хранится в скобках)
    await db.use("my_ns", "my_db");
  }
} catch (e) {
  //console.log("authenticate", e);
}

/* try {
  if (authenticationToken.get()) {

    await db.authenticate(authenticationToken.get());
    await db.use("my_ns", "my_db");
  } else {
    alert("Ошибка подключения к базе");
    if (!localStorage.getItem("authentication_token")) {
      location.replace("/");
    }
  }
} catch (e) {
  console.log("authenticate", e);
}
 */
export interface wordPair {
  eng: string;
  rus: string;
  id: string;
  correctAnswers: number;
  wrongAnswers: number;
}

export type newWordPair = Pick<wordPair, "eng" | "rus">;

export const editPair = async (pair: wordPair) => {
  let res = db.update(pair.id, {
    user: `user:${userName.get()}`,
    ...pair,
  });
  console.log(res);
  return 0;
};

export const addNewPair = async ({ eng, rus }: newWordPair) => {
  return db.create("wordPair", {
    user: `user:${userName.get()}`,
    eng: eng,
    rus: rus,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  //TODO переделать без sql

  /*   let word = await db.query(`SELECT * FROM user`, {
    tb: "person",
  }); */
  /* 
  let word = await db.query(`CREATE wordPair SET eng='${eng}', rus='${rus}'`, {
    tb: "person",
  }); 
  console.log(word);*/
  /*   await db.create("wordPair", {
    eng: eng,
    rus: rus,
    correctAnswers: "0",
    wrongAnswers: "0",
  });
 */
  /*   await db.query(`UPDATE user:${userName.get()} SET words += ['${word}']`);

  await db.query(` UPDATE ${word} SET owner = user:user:${userName.get()}`); */

  /* await db.create("wordPair", {
    eng: eng,
    rus: rus,
    correctAnswers: "0",
    wrongAnswers: "0",
  }); */
};

export const deletePair = async (id: string) => {
  return db.delete(id);
};

interface wordPairsLit {
  items: wordPair[];
  totalPages: number;
}

export const getAllWords = async (): Promise<wordPair[]> => {
  return db.select("wordPair");
  /*   console.log(sel);

  if (import.meta.env.PUBLIC_STORAGE_TYPE === "localStorage") {
    let results: wordPair[] = [];
    for (let i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.includes("Remember")) {
          results.push(JSON.parse(localStorage.getItem(i)!));
        }
      }
    }
    return Promise.resolve(results);
  } else {
    try {
      let items: any;
      const firstItems: wordPairsLit = await ky
        .get(`${server_name}api/collections/words/records/?perPage=500`)
        .json();

      items = firstItems.items;

      if (firstItems.totalPages > 1) {
        let additionalItems: wordPairsLit[] = await Promise.all(
          [...Array(firstItems.totalPages - 1)].map(async (e, key) => {
            return await ky
              .get(
                `${server_name}api/collections/words/records/?perPage=500&page=${
                  key + 2
                }`
              )
              .json();
          })
        );
        additionalItems.forEach((e) => {
          //console.log(e);
          items = items.concat(e.items);
        });
      }

      console.log("загружено ", items.length, " слов");

      return Promise.resolve(items);
    } catch (error) {
      return Promise.reject(error);
    }
  } */
};
