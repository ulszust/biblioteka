import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; 
import db from "./Firebase";



const AddBook = () => {

    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState('');
    const [publisher, setPublisher] = useState('')
    const [year, setYear] = useState('')

    function onSubmit(e) {
        e.preventDefault();
        const book = {title, authors: authors.split(','), publisher, year}
        console.log("będzie dodane", book);
        addToDB(book).then((created) => console.log(created))
    }
    return (
        <>
            <h5 className="addbook-header">Aby dodać pozycję, wypełnij poniższy formularz: </h5>
            <Form onSubmit={onSubmit}>
                <fieldset className="form-addbook">
                    <Form.Group>
                        <Form.Label htmlFor="title">Tytuł książki</Form.Label>
                        <Form.Control id="title" placeholder="Podaj tytuł książki" required onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="authors">Autor</Form.Label>
                        <Form.Control id="authors" placeholder="Podaj autora/autorów" required onChange={(e) => setAuthors(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="publisher">Wydawnictwo</Form.Label>
                        <Form.Control id="publisher" placeholder="Podaj wydawnictwo" required onChange={(e) => setPublisher(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="year">Rok wydania</Form.Label>
                        <Form.Control id="year" type="number" placeholder="Podaj rok wydania" required onChange={(e) => setYear(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="form-checkbox">
                        <Form.Check
                            type="checkbox"
                            id="dostepnosc"
                            label="Dostępna do wypożyczenia?" />
                    </Form.Group>
                    <Button className="form-button" type="submit" variant="secondary">Zapisz zmiany</Button>
                </fieldset>
            </Form></>
    );
}

async function addToDB(book) {
    const result = await addDoc(collection(db, "books"), book);
    console.log("rezultat", result)
    return {
        ...book,
        id: result.id
    }
}

export default AddBook;
