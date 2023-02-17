import type React from "react";
import { useState, useEffect } from "react";
import type { wordPair } from "../api";
import { isLoggedIn, authenticationToken, tryLogout } from "../nanoStore";

async function buttonLogoutHandler() {
  await tryLogout();
  location.replace("/login");
}

const LogoutButton: React.FC = () => {
  return (
    <button onClick={buttonLogoutHandler} className="btn">
      Logout
    </button>
  );
};

export default LogoutButton;
