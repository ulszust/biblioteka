import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "./Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import Spinner from "react-bootstrap/Spinner";
import { Card } from "react-bootstrap";
import BookCover from "./images/ksiazka6.jpg";
import Button from "react-bootstrap/Button";
import { isAdmin, isUser } from "./App";

function BookDetails(props) {
  const { user } = props;
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  //ensure code is run only once (componentWillMount equivalent) (read below)
  useEffect(() => {
    getBook(bookId)
      .then((it) => setBook(it))
      .finally(() => setLoading(false));
  }, [bookId, counter]); //dont forget this array - this is list of dependencies.
  //if empty - means never reload, if not empty will reload upon any of these dependencies changed
  //if undefined (e.g. you forgot to write that []) will load on every re-render (may cause infinite loop!)

  function update() {
    setCounter(counter + 1);
  }

  return (
    <>
      {!!loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!loading && (
        <BookDetailsCard
          book={book}
          user={user}
          update={update}
        ></BookDetailsCard>
      )}
    </>
  );
}

async function getBook(bookId) {
  try {
    const bookRef = doc(db, "books", bookId);
    const bookSnap = await getDoc(bookRef);
    console.log("returned document", bookSnap);

    if (bookSnap.exists()) {
      console.log("Document data:", bookSnap.data());
      return {
        ...bookSnap.data(),
        id: bookId,
      };
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return undefined;
    }
  } catch (any) {
    console.log("some error");
  }
}

function BookDetailsCard({ book, user, update }) {
  function onRentBookClick(book) {
    //definiujemy dueDate jako dzisiaj (dzisiaj to zawsze new Date())
    const dueDate = new Date();
    //zmieniamy wartość dueDate za pomocą setDate. Na początku pobieramy dzien z dueDate za pomocą
    //getDate (czyli dzisiaj) i dodajemy 14 dni
    dueDate.setDate(dueDate.getDate() + 14);
    addRentalToDB({ bookId: book.id, dueDate }).then(
      () => {
        window.location = "/user/";
      },
      () => {
        window.alert(
          "Nie udało się wypożyczyć książki. Spróbuj ponownie później."
        );
      }
    );
  }

  function onAddCopyOfBookClick(book) {
    const amountOfBooks = book.amount;
    const bookRef = doc(db, "books", book.id);
    updateDoc(bookRef, { amount: amountOfBooks + 1 }).then(() => update());
  }

  function onDeleteCopyOfBookClick(book) {
    const amountOfBooks = book.amount;
    const bookRef = doc(db, "books", book.id);
    updateDoc(bookRef, { amount: amountOfBooks - 1 }).then(() => update());
  }

  function isZero(book) {
    return book.amount <= 0;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Header>"{book.title}"</Card.Header>
        <Card.Img variant="top" src={BookCover} />
        <Card.Text>Autor: {book.authors.join(",  ")}.</Card.Text>
        <Card.Text>Wydawnictwo: {book.publisher}</Card.Text>
        <Card.Text>Rok wydania: {book.year}</Card.Text>
        <Card.Text>Ilość egzemplarzy: {book.amount}</Card.Text>
        {isUser(user) && (
          <Button
            id="rent-button"
            onClick={() => onRentBookClick(book)}
            variant="secondary"
            className="card-user-button"
            disabled={isZero(book) ? true : false}
          >
            Wypożycz
          </Button>
        )}
        {isAdmin(user) && (
          <>
            <Button
              variant="success"
              onClick={() => onAddCopyOfBookClick(book)}
            >
              Dodaj egzemplarz
            </Button>
            <Button
              variant="danger"
              className="card-admin-button"
              onClick={() => onDeleteCopyOfBookClick(book)}
            >
              Usuń egzemplarz
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

async function addRentalToDB({ bookId, dueDate }) {
  const rentalRef = doc(db, "rentals", "user");
  console.log("dodamy rental", bookId, dueDate);
  await updateDoc(rentalRef, {
    rentals: arrayUnion({ bookId, dueDate: Timestamp.fromDate(dueDate) }),
  });
}

export default BookDetails;
