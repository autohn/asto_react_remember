import { atom } from "nanostores";

export interface wordPair {
  eng: string;
  rus: string;
  id: string;
  correctAnswers: number;
  wrongAnswers: number;
}

export const getAllWords = async (): Promise<wordPair[]> => {
  try {
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

    return Promise.resolve(items);
  } catch (error) {
    return Promise.reject(error);
  }
};
