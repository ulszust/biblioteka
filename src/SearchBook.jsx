import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "./Firebase";

const SearchBook = () => {
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [matchedBooks, setMatchedBooks] = useState([]);

  function onBookCardClick(bookId) {
    window.location = "/books/" + bookId;
  }

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      setAllBooks(books);
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
            onChange={(e) => setQuery(e.target.value?.toLowerCase())}
          />
          <Button variant="outline-secondary">Search</Button>
        </InputGroup>
      </div>
      <div className="book-search-result">
        {matchedBooks.map((book) => {
          return (
            <div className="book-search-item">
              <Card body onClick={() => onBookCardClick(book.id)} key={book.id}>
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
  const collectionRef = collection(db, "books");

  const booksCollection = await getDocs(collectionRef);

  booksCollection.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });

  return booksCollection.docs.map((it) => ({ id: it.id, ...it.data() }));
}

export default SearchBook;
