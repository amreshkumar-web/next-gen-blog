import { createContext, useContext, useState } from "react";

const UserContext = createContext(); // Context ka naam capitalize kiya

export const UserProvider = ({ children }) => { // Provider ka naam bhi capitalize
  const [profile, setProfile] = useState(null);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext); // Ensure context name is correct
};
