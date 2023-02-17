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

  if (isLoggedIn.get() && authenticationToken.get()) {
    alert(authenticationToken.get());
    location.replace("/");
  } else {
    alert("Sorry not logged in");
  }
}

async function singupHandler() {
  await trySingUp(objCredential);

  if (isLoggedIn.get() && authenticationToken.get()) {
    alert(authenticationToken.get());
    location.replace("/");
  } else {
    alert("Sorry not logged in");
  }
}

const Login: React.FC = () => {
  return (
    <>
      <button onClick={loginHandler} className="btn">
        Login
      </button>
      <button onClick={singupHandler} className="btn">
        Singup
      </button>
    </>
  );
};

export default Login;
