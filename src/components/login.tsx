import type React from "react";
import { useState, useEffect } from "react";
import type { wordPair } from "../api";
import {
  isLoggedIn,
  authenticationToken,
  tryLogin,
  trySingUp,
  userName,
} from "../nanoStore";

type credentials = {
  username: string;
  password: string;
};
async function loginHandler(objCredential: credentials) {
  objCredential.username = objCredential.username.toLowerCase();
  await tryLogin(objCredential);
  if (isLoggedIn?.get() && authenticationToken?.get()) {
    location.replace("/");
  }
}

async function registerHandler(objCredential: credentials) {
  objCredential.username = objCredential.username.toLowerCase();
  await trySingUp(objCredential);
  if (isLoggedIn?.get() && authenticationToken?.get()) {
    location.replace("/");
  }
}

const Login: React.FC = () => {
  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="flex flex-col items-center text-lg rounded-lg py-8 flex-wrap">
        {loginOrRegister == "login" ? (
          <>
            <div className="px-4 py-2 my-4 rounded-lg bg-cooDarkBlackOlive capitalize">
              Login
            </div>
            <form
              className="w-full min-w-fit max-w-xs"
              onSubmit={() => {
                loginHandler({
                  username: username,
                  password: password,
                });
              }}
            >
              <input
                required
                name="username"
                type="text"
                placeholder="Username"
                value={username}
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />

              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <div className="flex justify-between items-center">
                <button type="submit" className="btn btn-primary mt-2">
                  Login
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginOrRegister("register");
                  }}
                  className="btn btn-primary mt-2"
                >
                  Go to Register
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="px-4 py-2 my-4 rounded-lg bg-cooDarkBlackOlive capitalize">
              Register
            </div>
            <form
              className="w-full min-w-fit max-w-xs"
              onSubmit={() => {
                registerHandler({
                  username: username,
                  password: password,
                });
              }}
            >
              <input
                required
                name="username"
                type="text"
                placeholder="Username"
                value={username}
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />

              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <div className="flex justify-between items-center">
                <button type="submit" className="btn btn-primary mt-2">
                  Register
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginOrRegister("login");
                  }}
                  className="btn btn-primary mt-2"
                >
                  Go to Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0">
        <button
          onClick={() => {
            loginHandler({ username: "admin", password: "admin" });
          }}
          className="btn btn-primary"
        >
          Test Login
        </button>
        <button
          onClick={() => {
            registerHandler({ username: "admin", password: "admin" });
          }}
          className="btn btn-primary mt-20"
        >
          Test Singup
        </button>
      </div>
    </>
  );
};

export default Login;
