import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
function App() {
  const [user, setUser] = useLocalStorage("user", "user");
  return (
    <>
      <Header user={user} setUser={setUser}></Header>
      <img src={img} className="background-image" />

      <div className="padding-container">
        <Router>
          <Routes>
            <Route path="/" element={<Home user={user} />} exact />
            <Route path="/books/search" element={<SearchBook />} />
            <Route path="/user" element={<MyRentals />} />
            <Route
              path="/books/:bookId"
              element={<BookDetails user={user} />}
            />
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </div>
      <Footer></Footer>
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

//todo:change this code
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
