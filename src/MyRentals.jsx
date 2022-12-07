
import React from "react";
import { MOCK_BOOK } from "./BookDetails";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';


export const MOCK_BOOK_2 = { id: 2, title: 'Matematyka', authors: ['Kiełbasa'], publisher: 'Najlepszy', year: 1690 }


const MOCK_RENTALS = [
  {
    id: 'user',
    rentals: [
      { book: MOCK_BOOK, dueDate: new Date('2034-01-01') },
      { book: MOCK_BOOK_2, dueDate: new Date('2022-04-05') }
    ]
  }
]



const MyRentals = () => {
  const rentals = MOCK_RENTALS[0].rentals;


  function isDue(rental) {
    return rental.dueDate < new Date()
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
        {rentals.map(rental => 
            <tr>
             <td>{rental.book.title}</td>
             <td> <a href={"/books/" + rental.book.id}>Link</a></td>
             <td>{rental.dueDate.toLocaleDateString()}</td>
             <td className="td-align-middle"><Badge className="badge-width" pill bg={isDue(rental) ? "danger" : "success"}>{isDue(rental) ? "Przeterminowana" : "Aktywna"}</Badge></td>
             <td className="td-align-middle"><Button className="table-button" size="sm" variant="secondary">Przedłuż</Button></td>
           </tr>
          )}
      </tbody>
    </Table>
  );
}

export default MyRentals;
