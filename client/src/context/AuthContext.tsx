import React, { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

interface AuthContextData {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextData>({
  authenticated: false,
  setAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const jwtFuncDecode: () =>
  | { id: string; loggedIn: string }
  | boolean = () => {
  try {
    return jwtDecode(localStorage.getItem("access") as string);
  } catch (e) {
    return false;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const decode = jwtFuncDecode();
    if (decode) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [authenticated]);
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
