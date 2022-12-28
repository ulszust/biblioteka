import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import db from "./Firebase";

const MyRentals = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [counter, setCounter] = useState("");
  const [show, setShow] = useState(false);
  const [updatingRental, setUpdatingRental] = useState(null);
  const handleClose = () => {
    setUpdatingRental(null);
    setShow(false);
  };
  const handleShow = (rental) => {
    setUpdatingRental(rental);
    setShow(true);
  };
  const [extendDays, setExtendDays] = useState(null);

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      setAllBooks(books);
    });
  }, [counter]);

  useEffect(() => {
    if (allBooks?.length > 0) {
      getRentalFromDB().then(({ rentals }) => {
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

  function onExtendDueDateClick() {
    const rental = updatingRental;

    removeBookFromRentals(rental)
      .then(
        () => {
          const originalDate = rental.dueDate;
          const updated = {
            bookId: rental.bookId,
            dueDate: new Date(originalDate),
          };
          updated.dueDate.setDate(originalDate.getDate() + +extendDays);
          return addBookToRentals(updated);
        },
        (e) =>
          window.alert(
            "Nie udało się przedłużyć wypożyczenia. Spróbuj ponownie później."
          )
      )
      .then(
        () => {
          setShow(false);
          setCounter(counter + 1);
        },
        (e) =>
          window.alert(
            "Nie udało się przedłużyć wypożyczenia. Spróbuj ponownie później."
          )
      );
  }

  function calculateCharge(dueDate) {
    const today = new Date();
    //jesli duedate nie jest mniejsze niz dzisiaj => '-'
    if (dueDate >= today) {
      return "-";
    }
    // w innym wypadku
    //porownac ile minelo dni od due date do dzisiaj i pomnozyc kazdy x 0,30
    const diffInMs = new Date(today) - new Date(dueDate);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const charge = Math.floor(diffInDays) * 0.3;
    return charge + " zł";
  }

  return (
    <Table className="table-user" striped bordered hover>
      <thead>
        <tr>
          <th>Tytuł książki</th>
          <th>Szczegóły książki</th>
          <th>Data zwrotu</th>
          <th>Status</th>
          <th>Należność</th>
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
            <td>{calculateCharge(rental.dueDate)}</td>
            <td className="td-align-middle">
              <Button
                className="table-button"
                size="sm"
                variant="secondary"
                onClick={() => handleShow(rental)}
              >
                Przedłuż
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Wydłuż termin wypożyczenia książki</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Możesz przedłużyć wypożyczenie maksymalnie o 21 dni. Dokonaj
                    wyboru poniżej.
                  </p>
                  <Form.Select onChange={(e) => setExtendDays(e.target.value)}>
                    <option>Ile dodatkowych dni potrzebujesz?</option>
                    <option value="7">7 dni</option>
                    <option value="14">14 dni</option>
                    <option value="21">21 dni</option>
                  </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Zamknij
                  </Button>
                  <Button variant="primary" onClick={onExtendDueDateClick}>
                    Zapisz
                  </Button>
                </Modal.Footer>
              </Modal>
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

async function addBookToRentals(rental) {
  const rentalRef = doc(db, "rentals", "user");
  await updateDoc(rentalRef, {
    rentals: arrayUnion({
      bookId: rental.bookId,
      dueDate: Timestamp.fromDate(rental.dueDate),
    }),
  });
}

export default MyRentals;
