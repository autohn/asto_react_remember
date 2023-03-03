import type React from "react";
import { useState, useEffect } from "react";
import type { wordPair } from "../api";
import {
  isLoggedIn,
  authenticationToken,
  loginDB,
  singUpDB,
  userName,
} from "../nanoStore";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is too short")
      .max(100)
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore")
      .trim(),
    email: z.string().email("Invalid email").min(1, "Email is too short"),
    password: z
      .string()
      .min(1, "Password must have more than 8 characters")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is "),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterSchemaType = z.infer<typeof registerSchema>;

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is too short")
    .max(100)
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters and underscore"),
  password: z
    .string()
    .min(1, "Password must have more than 8 characters")
    .min(8, "Password must have more than 8 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );

  const {
    setError: setLoginError,
    register: registerInputForLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginIsSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const {
    setError: setRegisterError,
    register: registerInputForRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: registerIsSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const loginHandler: SubmitHandler<LoginSchemaType> = async (credentials) => {
    credentials.username = credentials.username.toLowerCase();
    try {
      await loginDB(credentials);
      if (isLoggedIn?.get() && authenticationToken?.get()) {
        location.replace("/");
      }
    } catch (e) {
      setLoginError("root", {
        type: "server",
        message: `Can't login, something went wrong: ${e}`,
      });
    }
  };

  const registerHandler: SubmitHandler<RegisterSchemaType> = async (
    credentials
  ) => {
    credentials.username = credentials.username.toLowerCase();
    try {
      await singUpDB(credentials);
      if (isLoggedIn?.get() && authenticationToken?.get()) {
        location.replace("/");
      }
    } catch (e) {
      setRegisterError("root", {
        type: "server",
        message: `Can't register, something went wrong: ${e}`,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-lg rounded-lg py-8 flex-wrap">
        {loginOrRegister == "login" ? (
          <>
            <div className="px-4 py-2 my-4 rounded-lg bg-cooDarkBlackOlive capitalize">
              Login
            </div>
            {loginErrors.root && (
              <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                {loginErrors.root?.message}
              </div>
            )}
            <form
              className="w-full min-w-fit max-w-xs"
              onSubmit={handleLoginSubmit(loginHandler)}
            >
              <input
                autoComplete="username"
                id="username"
                type="text"
                placeholder="Username"
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                {...registerInputForLogin("username")}
              />
              {loginErrors.username && (
                <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                  {loginErrors.username?.message}
                </div>
              )}
              <input
                autoComplete="password"
                id="password"
                type="password"
                placeholder="Password"
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                {...registerInputForLogin("password")}
              />
              {loginErrors.password && (
                <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                  {loginErrors.password?.message}
                </div>
              )}
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="btn btn-primary mt-2"
                  disabled={loginIsSubmitting}
                >
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
            {registerErrors.root && (
              <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                {registerErrors.root?.message}
              </div>
            )}
            <form
              className="w-full min-w-fit max-w-xs"
              onSubmit={handleRegisterSubmit(registerHandler)}
            >
              <input
                autoComplete="username"
                id="username"
                type="text"
                placeholder="Username"
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                {...registerInputForRegister("username")}
              />
              {registerErrors.username && (
                <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                  {registerErrors.username?.message}
                </div>
              )}
              <input
                autoComplete="email"
                id="email"
                type="email"
                placeholder="Email"
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                {...registerInputForRegister("email")}
              />
              {registerErrors.email && (
                <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                  {registerErrors.email?.message}
                </div>
              )}
              <input
                autoComplete="off"
                id="password"
                type="password"
                placeholder="Password"
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                {...registerInputForRegister("password")}
              />
              {registerErrors.password && (
                <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                  {registerErrors.password?.message}
                </div>
              )}
              <input
                autoComplete="off"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="input-sm w-full min-w-xs max-w-xs mt-2 block rounded-lg bg-cooFeldgrau border border-cooBlackOlive focus:border-cooDrabDarkBrown focus:outline-none"
                {...registerInputForRegister("confirmPassword")}
              />
              {registerErrors.confirmPassword && (
                <div className="text-error px-4 py-2 my-2 rounded-lg bg-cooDarkBlackOlive text-sm">
                  {registerErrors.confirmPassword?.message}
                </div>
              )}
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="btn btn-primary mt-2"
                  disabled={registerIsSubmitting}
                >
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
            registerHandler({
              username: "admin",
              email: "a@a.ru",
              password: "admin",
              confirmPassword: "admin",
            });
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
