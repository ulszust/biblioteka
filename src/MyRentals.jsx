import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { MOCK_BOOK } from "./BookDetails";
import db from "./Firebase";

export const MOCK_BOOK_2 = {
  id: 2,
  title: "Matematyka",
  authors: ["Kiełbasa"],
  publisher: "Najlepszy",
  year: 1690,
};

const MOCK_RENTALS = [
  {
    id: "user",
    rentals: [
      { book: MOCK_BOOK, dueDate: new Date("2034-01-01") },
      { book: MOCK_BOOK_2, dueDate: new Date("2022-04-05") },
    ],
  },
];

const MyRentals = () => {
  const rentals = MOCK_RENTALS[0].rentals;

  const [allBooks, setAllBooks] = useState([]);
  const [userRentals, setUserRentals] = useState([]);

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      console.log("pobrano książki", books);
      setAllBooks(books);
    });
  }, []);

  useEffect(() => {
    if (allBooks?.length > 0) {
      getRentalFromDB().then(({ rentals }) => {
        console.log("pobrano rentale", rentals);
        const matchedRentals = rentals.map((rental) => {
          return {
            bookId: rental.bookId,
            dueDate: rental.dueDate.toDate(),
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

  return (
    <Table className="table-user" striped bordered hover>
      <thead>
        <tr>
          <th>Tytuł książki</th>
          <th>Szczegóły książki</th>
          <th>Data zwrotu</th>
          <th>Status</th>
          <th>Dodatkowe opcje</th>
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

export default MyRentals;
