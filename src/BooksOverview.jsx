import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "./Firebase";
import Table from "react-bootstrap/Table";

const BooksOverview = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [userRentals, setUserRentals] = useState([]);

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      setAllBooks(books);
      console.log("pobrane książki", books);
    });
  }, []);

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

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Tytuł książki</th>
          <th>Ilość wszystkich egzemplarzy</th>
          <th>Ilość wypożyczonych egzemplarzy</th>
        </tr>
      </thead>
      <tbody>
        {allBooks.map((book) => (
          <tr>
            <td>{book.title}</td>
            <td>{book.amount}</td>
            <td>
              {userRentals.filter((rental) => rental.bookId === book.id).length}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
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

async function getRentalFromDB() {
  const docRef = doc(db, "rentals", "user");
  const rentals = await getDoc(docRef);
  return rentals?.data();
}

export default BooksOverview;
