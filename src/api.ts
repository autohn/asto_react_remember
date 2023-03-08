import ky from "ky";
import Surreal from "surrealdb.js";
import { authenticationToken, userName } from "./nanoStore";
import { z } from "zod";

export const server_name = import.meta.env.PUBLIC_DB_SERVER_NAME;

const db = new Surreal(server_name);

try {
  if (authenticationToken.get()) {
    await db.authenticate(authenticationToken.get()); //почему-то не работает если имя пользователя имеет спец символы (в базе хранится в скобках)
    await db.use("my_ns", "my_db");
  }
} catch (e) {
  console.log("authenticate error", e);
}

export const wordPairSchema = z.object({
  eng: z.string(),
  rus: z.string(),
  id: z.string(),
  correctAnswers: z.number(),
  wrongAnswers: z.number(),
});

export type wordPair = z.infer<typeof wordPairSchema>;

export const newWordPairSchema = z.object({ eng: z.string(), rus: z.string() });
export type newWordPair = z.infer<typeof newWordPairSchema>;
/* export type newWordPair = Pick<wordPair, "eng" | "rus">; */

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
};

export const deletePair = async (id: string) => {
  return db.delete(id);
};

export const getAllWords = async (): Promise<wordPair[]> => {
  return db.select("wordPair");
};
