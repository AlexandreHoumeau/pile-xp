"use client";
import {
  AuthTokenResponsePassword,
  Session,
  User,
} from "@supabase/supabase-js";
import { createContext, useContext, useReducer } from "react";

export const AuthContext = createContext<AuthenticationState & AuthActions>(
  undefined!
);

export const WithAuthenticationContext: React.FC<{
  initialState: AuthenticationState;
  children: any;
}> = ({ initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
  error?: any;
  isLoggedIn: boolean;
}

interface AuthActions {
  setUser: (user: AuthTokenResponsePassword) => void;
  // logout: () => void;
  // user: User | null;
}

// export interface AuthenticationState {
//   user?: User;
//   error?: any;
//   isLoggedIn: boolean;
// }

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
