import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db from './Firebase';
import { doc, getDoc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner';
import { Card } from 'react-bootstrap';
import BookCover from './images/ksiazka6.jpg'
import Button from 'react-bootstrap/Button';

export const MOCK_BOOK = { title: 'Bezpieczeństwo Aplikacji Webowych', authors: ['pierwszy', 'drugi', 'trzeci'], publisher: 'Securitum', year: 2019 }

function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true)

  //ensure code is run only once (componentWillMount equivalent) (read below)
  useEffect(() => {
    getBook(bookId)
      .then(it => setBook(it))
      .finally(() => setLoading(false))
  }, [bookId]) //dont forget this array - this is list of dependencies.
  //if empty - means never reload, if not empty will reload upon any of these dependencies changed
  //if undefined (e.g. you forgot to write that []) will load on every re-render (may cause infinite loop!)

  return (
    <>
      <h1>BookId is {bookId}</h1>
      {
        !!loading &&
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
      {!loading &&
        <BookDetailsCard book={book}></BookDetailsCard>
      }
    </>
  );
}

async function getBook(bookId) {
  try {
    const bookRef = doc(db, "books", bookId);
    const bookSnap = await getDoc(bookRef)
    console.log("returned document", bookSnap)

    if (bookSnap.exists()) {
      console.log("Document data:", bookSnap.data());
      return bookSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return undefined;
    }
  } catch (any) {
    console.log('some error')
  }
}

function BookDetailsCard({ book }) {
  return (
    <Card>
      <Card.Body>
      <Card.Header>"{book.title}"</Card.Header>
      <Card.Img variant="top" src={BookCover}/>
        <Card.Text>Autor: {book.authors.join(",  ")}.</Card.Text>
        <Card.Text>Wydawnictwo: {book.publisher}</Card.Text>
        <Card.Text>Rok wydania: {book.year}</Card.Text>
        <Button variant="secondary" className='card-button'>Wypożycz</Button>
      </Card.Body>
    </Card>
  );
}


export default BookDetails;