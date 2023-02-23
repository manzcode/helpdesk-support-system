import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface UserContextData {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextData>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
