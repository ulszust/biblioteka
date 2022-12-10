
import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MOCK_BOOK } from "./BookDetails";
import { MOCK_BOOK_2 } from "./MyRentals";
import Card from 'react-bootstrap/Card';

const SearchBook = () => {
  const books = [MOCK_BOOK, MOCK_BOOK_2, MOCK_BOOK, MOCK_BOOK_2]
  return (
    <div>
      <div className="book-search-input">
        <InputGroup>
          <Form.Control
            placeholder="Wyszukaj książkę"
          />
          <Button variant="outline-secondary">
            Search
          </Button>
        </InputGroup>
      </div>
      <div className="book-search-result">
        {books.map(book => {
          return <div className="book-search-item">
            <Card body>
              <div className="book-search-item-body">
                <div className="book-search-item-title">{book.title}</div>
                <div className="book-search-item-authors">{book.authors.join(", ")}</div>
              </div>
            </Card>
          </div>
        })
        }

      </div>
    </div>
  );
}

export default SearchBook;
