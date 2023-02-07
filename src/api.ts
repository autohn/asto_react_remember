export const server_name = import.meta.env.PUBLIC_SERVER_NAME;

export interface wordPair {
  eng: string;
  rus: string;
  id: string;
  correctAnswers: number;
  wrongAnswers: number;
}

export type newWordPair = Pick<wordPair, "eng" | "rus">;

export const editPair = async (pair?: wordPair) => {
  if (pair) {
    if (import.meta.env.PUBLIC_STORAGE_TYPE === "localStorage") {
      localStorage.setItem(pair.eng + "Remember", JSON.stringify(pair));
      return Promise.resolve(pair);
    } else {
      return fetch(`${server_name}api/collections/words/records/${pair.id}`, {
        method: "PATCH",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(pair),
      });
    }
  } else {
    return Promise.reject("");
  }
};

export const addNewPair = async ({ eng, rus }: newWordPair) => {
  if (import.meta.env.PUBLIC_STORAGE_TYPE === "localStorage") {
    const newItem = {
      eng: eng,
      rus: rus,
      id: eng,
      correctAnswers: 0,
      wrongAnswers: 0,
    };

    localStorage.setItem(
      eng + "Remember", //TODO в зод проверке форм приводить к нижнему регистру
      JSON.stringify(newItem)
    );
    return Promise.resolve(newItem);
  } else {
    return fetch(`${server_name}api/collections/words/records/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eng: eng,
        rus: rus,
        correctAnswers: 0,
        wrongAnswers: 0,
      }),
    });
  }
};

export const deletePair = async (id: string) => {
  if (import.meta.env.PUBLIC_STORAGE_TYPE === "localStorage") {
    localStorage.removeItem(id + "Remember");
    return Promise.resolve({});
  } else {
    return fetch(`${server_name}api/collections/words/records/${id}`, {
      method: "DELETE",
    });
  }
};

export const getAllWords = async (): Promise<wordPair[]> => {
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
      const firstItems = await (
        await fetch(`${server_name}api/collections/words/records/?perPage=500`)
      ).json();

      items = firstItems.items;

      if (firstItems.totalPages > 1) {
        let additionalItems = await Promise.all(
          [...Array(firstItems.totalPages - 1)].map(async (e, key) => {
            return await (
              await fetch(
                `${server_name}api/collections/words/records/?perPage=500&page=${
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
  }
};
