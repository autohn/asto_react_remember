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

/* type credentials = {
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
 */
const Login: React.FC = () => {
  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );

  const {
    register: registerInputForRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: registerIsSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerInputForLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginIsSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const loginHandler: SubmitHandler<LoginSchemaType> = async (credentials) => {
    console.log(credentials);
    credentials.username = credentials.username.toLowerCase();
    await tryLogin(credentials);
    if (isLoggedIn?.get() && authenticationToken?.get()) {
      location.replace("/");
    }
  };

  const registerHandler: SubmitHandler<RegisterSchemaType> = async (
    credentials
  ) => {
    console.log(credentials);
    credentials.username = credentials.username.toLowerCase();
    await trySingUp(credentials);
    if (isLoggedIn?.get() && authenticationToken?.get()) {
      location.replace("/");
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
            <form
              className="w-full min-w-fit max-w-xs"
              onSubmit={handleLoginSubmit(loginHandler)}
            >
              <input
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
            <form
              className="w-full min-w-fit max-w-xs"
              onSubmit={handleRegisterSubmit(registerHandler)}
            >
              <input
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
                id="password"
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
                id="confirmPassword"
                type="confirmPassword"
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
            //loginHandler({ username: "admin", password: "admin" });
          }}
          className="btn btn-primary"
        >
          Test Login
        </button>
        <button
          onClick={() => {
            //registerHandler({ username: "admin", password: "admin" });
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
