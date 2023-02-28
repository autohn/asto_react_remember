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

let objCredential = {
  username: "admin",
  password: "admin",
};
async function loginHandler() {
  await tryLogin(objCredential);
  try {
    if (isLoggedIn.get() && authenticationToken.get()) {
      alert(authenticationToken.get());
      location.replace("/");
    } else {
      alert("Sorry not logged in");
    }
  } catch (e) {
    alert(e);
  }
}

async function singupHandler() {
  await trySingUp(objCredential);
  try {
    if (isLoggedIn.get() && authenticationToken.get()) {
      alert(authenticationToken.get());
      location.replace("/");
    } else {
      alert("Sorry not logged in");
    }
  } catch (e) {
    alert(e);
  }
}

const Login: React.FC = () => {
  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );

  return (
    <>
      <button onClick={loginHandler} className="btn btn-primary">
        Login
      </button>
      <button onClick={singupHandler} className="btn btn-primary">
        Singup
      </button>

      <div className="text-lg rounded-lg bg-cooDarkBlackOlive flex justify-center py-8 flex-wrap">
        {loginOrRegister == "login" ? (
          <>
            <h1 className="w-full text-center">Login</h1>
            <form className="w-full min-w-fit max-w-xs">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary input-sm w-full min-w-xs max-w-xs mt-2  block"
              />

              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary input-sm w-full min-w-xs max-w-xs mt-2  block"
              />
              <div className="flex justify-between items-center">
                <button type="submit" className="btn btn-primary mt-2">
                  Login
                </button>
                <a className="link link-info relative">I'm a simple link</a>
              </div>
            </form>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Login;
