import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { getRentalFromDB } from "./rentals";
import { getAllBooksFromDB } from "./books";

const BooksOverview = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [userRentals, setUserRentals] = useState([]);

  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      setAllBooks(books);
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
    <Table className="table-books-overview" striped bordered hover>
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

export default BooksOverview;
