import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { MOCK_BOOK } from "./BookDetails";
import { MOCK_BOOK_2 } from "./MyRentals";
import Card from "react-bootstrap/Card";
import { collection, getDocs } from "firebase/firestore";
import db from "./Firebase";

const SearchBook = () => {
  const books = [MOCK_BOOK, MOCK_BOOK_2, MOCK_BOOK, MOCK_BOOK_2];
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [matchedBooks, setMatchedBooks] = useState([]);

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      setAllBooks(books);
      console.log("pobrane książki", books);
    });
  }, []);

  useEffect(() => {
    if (!query) {
      setMatchedBooks([]);
    } else {
      setMatchedBooks(
        allBooks.filter((book) => {
          return (
            book.title?.toLowerCase().includes(query) ||
            book.authors?.join(",").toLowerCase().includes(query)
          );
        })
      );
    }
  }, [query]);

  return (
    <div>
      <div className="book-search-input">
        <InputGroup>
          <Form.Control
            placeholder="Wyszukaj książkę"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="outline-secondary">Search</Button>
        </InputGroup>
      </div>
      <div className="book-search-result">
        {matchedBooks.map((book) => {
          return (
            <div className="book-search-item">
              <Card body>
                <div className="book-search-item-body">
                  <div className="book-search-item-title">{book.title}</div>
                  <div className="book-search-item-authors">
                    {book.authors.join(", ")}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
async function getAllBooksFromDB() {
  const querySnapshot = await getDocs(collection(db, "books"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
  return querySnapshot.docs.map((it) => it.data());
}

export default SearchBook;

const string = "tekst tekst abc";

console.log(string.includes("abc"));
