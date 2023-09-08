import React, { useState } from "react";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import MyRentals from "./MyRentals";
import SearchBook from "./SearchBook";
import BookDetails from "./BookDetails";
import AddBook from "./AddBook";
import img from "./images/img.png";
import LoginPage from "./LoginPage";
import { useAuth } from "./AuthProvider";

function App() {
  const [user, setUser] = useLocalStorage("user", "user");
  const { credentials } = useAuth();
  return (
    <>
      {!!credentials && (
        <Router>
          <Header user={user} setUser={setUser}></Header>
          <img src={img} className="background-image" />

          <div className="padding-container">
            <Routes>
              <Route path="/" element={<Home user={user} />} exact />
              <Route path="/books/search" element={<SearchBook />} />
              <Route
                path="/user"
                element={
                  (isUser(user) && <MyRentals />) || <Navigate to="/" replace />
                }
              />
              <Route
                path="/books/:bookId"
                element={<BookDetails user={user} />}
              />
              <Route
                path="/books/add"
                element={
                  (isAdmin(user) && <AddBook />) || <Navigate to="/" replace />
                }
              />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer></Footer>
        </Router>
      )}
      {!credentials && (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;

export function isUser(user) {
  return user === "user";
}

export function isAdmin(user) {
  return user === "admin";
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
