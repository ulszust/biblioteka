import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { useLocalStorage } from "./App";

const AuthContext = React.createContext(null);
export const useAuth = () => {
  return React.useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);

  const handleLogin = (login, password) => {
    signInWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user", user);
        setToken(userCredential);
        // window.location = "/";
      })
      .catch((error) => {
        console.log("error", error);

        window.alert(
          "Logowanie się nie powiodło. Upewnij się, że podano poprawne dane."
        );
      });
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
