import { atom, action, task } from "nanostores";
// Since we need to use "localStorage", we need nanostores persistent
import { persistentAtom } from "@nanostores/persistent";
import Surreal from "surrealdb.js";

const server_name = import.meta.env.PUBLIC_DB_SERVER_NAME;

const db = new Surreal(server_name);
export interface credentials {
  username: string;
  password: string;
}

export const isLoggedIn = atom(false);

export const authenticationToken = persistentAtom<string>(
  "authentication_token",
  ""
);

export const userName = persistentAtom<string>("userName", "");

export const mutateIsLoggedIn = action(
  isLoggedIn,
  "mutateIsLoggedIn",
  (store, payload) => {
    store.set(payload);
    return store.get();
  }
);

export const loginDB = async (objCredential: credentials) => {
  await task(async () => {
    let jwt = await db.signin({
      NS: "my_ns",
      DB: "my_db",
      SC: "allusers",
      user: objCredential.username,
      pass: objCredential.password,
    });

    mutateIsLoggedIn(true);
    authenticationToken.set(jwt);
    userName.set(objCredential.username);
  });
};

export const singUpDB = async (objCredential: credentials) => {
  await task(async () => {
    let jwt = await db.signup({
      NS: "my_ns",
      DB: "my_db",
      SC: "allusers",
      user: objCredential.username,
      pass: objCredential.password,
    });

    mutateIsLoggedIn(true);
    authenticationToken.set(jwt);
    userName.set(objCredential.username);
  });
};

export const tryLogout = async () => {
  await task(async () => {
    authenticationToken.set("");
    mutateIsLoggedIn(false);
  });
};
