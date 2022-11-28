import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import MyRentals from './MyRentals';
import SearchBook from './SearchBook';


function App() {
  return (
    <>
      <Header></Header>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} exact />
          <Route path="/books/search" element={<SearchBook/>} />
          <Route path="/user" element={<MyRentals/>} />
        </Routes>
      </Router>
      <Footer></Footer>
    </>
  );
}

export default App;
