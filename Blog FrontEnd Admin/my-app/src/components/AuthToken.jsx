import { createContext, useContext, useState } from "react";

const AuthContext = createContext(); // ✅ Context create kiya

const TokenProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null); // ✅ Token store karne ka state

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // ✅ Custom Hook

export default TokenProvider;
