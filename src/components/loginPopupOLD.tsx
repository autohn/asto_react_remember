import type React from "react";
import { useState, useEffect } from "react";
import type { wordPair } from "../api";
import { getAllWords, editPair } from "../api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const LoginPopup: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setShowModal((e) => !e)}
      >
        Login
      </button>

      {showModal ? (
        <div className="absolute top-0 m-auto left-0 right-0">
          <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
              <button
                className="float-right btn btn-active btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                Sign in
              </h1>
              <form className="mt-6">
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Password
                  </label>
                  <input
                    type="password"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                <a href="#" className="text-xs text-purple-600 hover:underline">
                  Forget Password?
                </a>
                <div className="mt-6">
                  <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                    Login
                  </button>
                </div>
              </form>

              <p className="mt-8 text-xs font-light text-center text-gray-700">
                {" "}
                Don't have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LoginPopup;
