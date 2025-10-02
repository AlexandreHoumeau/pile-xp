"use client";
import { supabase } from "@/utils/supabaseClient";
import {
  AuthTokenResponsePassword,
  Session,
  User,
} from "@supabase/supabase-js";
import Error from "next/error";
import { createContext, useContext, useEffect, useReducer } from "react";

export const AuthContext = createContext<AuthenticationState & AuthActions>(
  undefined!
);

export const WithAuthenticationContext: React.FC<{
  initialState: AuthenticationState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        dispatch({
          action: Actions.Login,
          payload: {
            user: data.session.user,
            session: data.session,
          },
        });
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event: unknown, session: unknown) => {
      if (session && typeof session === "object" && "user" in session) {
        dispatch({
          action: Actions.Login,
          payload: { user: session?.user, session },
        });
      } else {
        dispatch({ action: Actions.Logout });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const storedState = localStorage.getItem("authState");
    if (storedState) {
      dispatch({
        action: Actions.Login,
        payload: JSON.parse(storedState),
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(state));
  }, [state]);

  const setUser = async (data: AuthTokenResponsePassword) => {
    dispatch({ action: Actions.Login, payload: data });
  };

  return (
    <AuthContext.Provider value={{ setUser, ...state }}>
      {children}
    </AuthContext.Provider>
  );
};

const reducer = (
  state: AuthenticationState,
  { action, payload = {} }: AuthenticationAction
): AuthenticationState => {
  switch (action) {
    case Actions.Login:
      return { ...state, ...payload, isLoggedIn: true };
    case Actions.Logout:
      return { isLoggedIn: false };
    case Actions.LoggingIn:
    case Actions.LoggingOut:
      return { isLoggedIn: false };
    default:
      return state;
  }
};

export interface AuthenticationState {
  user?: User;
  session?: Session;
  error?: Error;
  isLoggedIn: boolean;
}

interface AuthActions {
  setUser: (user: AuthTokenResponsePassword) => void;
}

type AuthenticationAction = {
  action: Actions;
  payload?: Record<string, unknown>;
};

enum Actions {
  Logout = "LOGOUT",
  Login = "LOGIN",
  LoggingIn = "LOGGING_IN",
  LoggingOut = "LOGGING_OUT",
}

export const useAuth = () => useContext(AuthContext);
