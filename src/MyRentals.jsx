import { async } from "@firebase/util";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import db from "./Firebase";

const MyRentals = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [counter, setCounter] = useState("");

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      console.log("pobrano książki", books);
      setAllBooks(books);
    });
  }, [counter]);

  useEffect(() => {
    if (allBooks?.length > 0) {
      getRentalFromDB().then(({ rentals }) => {
        console.log("pobrano rentale", rentals);
        const matchedRentals = rentals.map((rental) => {
          return {
            bookId: rental.bookId,
            dueDate: rental.dueDate.toDate(),
            //filter zwraca tablicę więc wyciągamy tylko pierwszy element[0]
            book: allBooks.filter((book) => book.id === rental.bookId)[0],
          };
        });
        setUserRentals(matchedRentals);
      });
    }
  }, [allBooks]);

  function isDue(rental) {
    return rental.dueDate < new Date();
  }

  function onReturnBookClick(rental) {
    removeBookFromRentals(rental).then(
      () => {
        setCounter(counter + 1);
        window.alert("Książka została zwrócona.");
      },
      () => {
        window.alert("Nie udało się zwrócić książki.Spróbuj ponownie później.");
      }
    );
  }

  return (
    <Table className="table-user" striped bordered hover>
      <thead>
        <tr>
          <th>Tytuł książki</th>
          <th>Szczegóły książki</th>
          <th>Data zwrotu</th>
          <th>Status</th>
          <th>Przedłuż wypożyczenie</th>
          <th>Zwróć książkę</th>
        </tr>
      </thead>
      <tbody>
        {userRentals.map((rental) => (
          <tr>
            <td>{rental.book.title}</td>
            <td>
              {" "}
              <a href={"/books/" + rental.book.id}>Link</a>
            </td>
            <td>{rental.dueDate.toLocaleDateString()}</td>
            <td className="td-align-middle">
              <Badge
                className="badge-width"
                pill
                bg={isDue(rental) ? "danger" : "success"}
              >
                {isDue(rental) ? "Przeterminowana" : "Aktywna"}
              </Badge>
            </td>
            <td className="td-align-middle">
              <Button className="table-button" size="sm" variant="secondary">
                Przedłuż
              </Button>
            </td>
            <td className="td-align-middle">
              <Button
                onClick={() => onReturnBookClick(rental)}
                className="table-button"
                size="sm"
                variant="secondary"
              >
                Zwróć
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

async function getRentalFromDB() {
  const docRef = doc(db, "rentals", "user");
  const rentals = await getDoc(docRef);
  return rentals?.data();
}

async function getAllBooksFromDB() {
  const collectionRef = collection(db, "books");
  const booksCollection = await getDocs(collectionRef);
  return booksCollection.docs.map((it) => ({
    id: it.id,
    ...it.data(),
  }));
}

async function removeBookFromRentals(rental) {
  const rentalRef = doc(db, "rentals", "user");
  await updateDoc(rentalRef, {
    rentals: arrayRemove({ bookId: rental.bookId, dueDate: rental.dueDate }),
  });
}

export default MyRentals;
