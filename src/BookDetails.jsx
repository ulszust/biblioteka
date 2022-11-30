import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import db from './Firebase';
import { doc, getDoc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner';


function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [loading, setLoading] = useState(true)

  getBook(bookId).then(it => setBook(it)).finally(() => setLoading(false))


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
        <h2>Book title: {book.title}</h2>
      }
    </>
  );
}

async function getBook(bookId) {
  const bookRef = doc(db, "books", bookId);
  const bookSnap = await getDoc(bookRef)
  console.log("returned document", bookSnap)

  if (bookSnap.exists()) {
    console.log("Document data:", bookSnap.data());
    return bookSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}


export default BookDetails;