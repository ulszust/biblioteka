import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "./Firebase";

//tworzymy komponent funkcyjny SearchBook (deklarujemy zmienną i przypisujemy funkcję anonimową,
//zamiast tego można zdeklarować normalną funkcję)
const SearchBook = () => {
  //query-wartość którą mamy czytać, jest zmienną stanową; setQuery-funkcja przyjmująca nowy stan query; funkcja do aktualizacji
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [matchedBooks, setMatchedBooks] = useState([]);

  function onBookCardClick(bookId) {
    window.location = "/books/" + bookId;
  }

  //useEffect pozwala nam tutaj na pobranie "w tle" wszystkich książek z bazdy danych, żeby można było ich użyć dowolnym momencie.
  //useEffect przyjmuje dwa parametry. Pierwszy to funkcja anonimowa, drugi to tablica zależności. Pusta oznacza,
  // że wykona się tylko raz (na początku)
  //Wołamy funkcję pobierającą książki (getAll). Aby wykonać działania na jej rezultacie musimy użyć kropki.
  //Jest to funkcja zwracająca promise, więc używamy then (jak się uda pobrać ksiązki). Books jest parametrem funkcji anonimowej, która jest parametrem funkcji resolve.
  //w przypadku sukcesu wołamy funkcję setAllBooks która zaktualizuje stan zmiennej allBooks wartością zwróconą z promisa
  // czyli books jest efektem operacji then i podmieniamy zawartość allBooks na to co przyszło z books
  useEffect(() => {
    getAllBooksFromDB().then((books) => {
      setAllBooks(books);
    });
  }, []);

  useEffect(() => {
    //jeśli query jest puste, ustaw wartość matchedBooks na pustą tablicę, czyli nic nie wyświetlaj
    //robimy to za pomocą funkcji setMatchedBooks przekazując jej w parametrze pustą tablice
    if (!query) {
      setMatchedBooks([]);
    } else {
      setMatchedBooks(
        //aktualny stan allBooks filtrujemy za pomocą metody filter, która przyjmuje funkcję anonimową
        // funkcja anonimowa ma w paramerze jeden element tablicy(w tym przypadku jedną książkę)
        allBooks.filter((book) => {
          return (
            //jeśli book.title istnieje, to: zmieniamy znaki na małe (tworzymy nowego stringa) i sprawdzamy czy query
            // zawiera się w tym tytule LUB
            // jeśli book.title nie istnieje (użyliśmy operatora ?) to te funkcje się nie wykonają i zostanie zwrócona
            // wartość undefined która ma wartość logiczną false czyli: operator znak zapytania wykonuje kod który po nim stoi
            // ale jeśli się nie da (a nie da się bo wartość nie istnieje) to zwraca tą wartość czyli undefined
            book.title?.toLowerCase().includes(query) ||
            // tu to samo co wyżej, tylko autorzy są tablicą, więc za pomocą funkcji join zmieniamy ich na stringa oddzielonego przecinkami
            book.authors?.join(",").toLowerCase().includes(query)
          );
        })
      );
    }
    // tablica zależności, drugi parametr powyższej funkcji useEffect
  }, [query]);

  //kod html zawsze zwracamy w return:
  return (
    <div>
      <div className="book-search-input">
        <InputGroup>
          <Form.Control
            placeholder="Wyszukaj książkę"
            //podczas zmiany wartości inputu(przez użytkownika) przeglądarka fire'uje(odpala) event onChange
            //tutaj słuchamy na tym evencie i gdy się wydarzy ustawiamy wartość query(setQuery)
            //przeglądarka przekazuje nam event (e), który ma różne własności, w tym target, czyli odniesienie
            // do komponentu, który wywołał zdarzenie(czyli ten nasz input), a ten input ma w sobie wartość, czyli to co
            // użytkownik wpisał (value)
            onChange={(e) => setQuery(e.target.value?.toLowerCase())}
          />
          <Button variant="outline-secondary">Search</Button>
        </InputGroup>
      </div>
      <div className="book-search-result">
        {matchedBooks.map((book) => {
          //(powyżej) dla każdej książki z matchedBooks (funkcja mapująca) zwracamy poniższy kod html czyli
          // wyświetlamy tyle elementów, ile jest dopasowanych książek.
          //Map powoduje powstanie nowej tablicy o takiej samej długości jak tablica oryginalna gdzie każdy element
          //jest zamieniony przy użyciu przekazanej w parametrze funkcji mapującej.
          //W tym przypadku: dla każdego parametru(book) funkcji anonimowej zwróć poniższego diva.
          return (
            <div className="book-search-item">
              <Card body onClick={() => onBookCardClick(book.id)} key={book.id}>
                <div className="book-search-item-body">
                  <div className="book-search-item-title">{book.title}</div>
                  <div className="book-search-item-authors">
                    {book.authors.join(", ")}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Funkcja asynchroniczna (zwraca promise).
async function getAllBooksFromDB() {
  //tworzymy zmienną, która wskazuje nam na kolekcję która znajduje się w bazie db o nazwie kolekcji "books"
  //(czyli parametry funkcji collection). Dzięki niej getDosc wie gdzie szukać dokumentów
  const collectionRef = collection(db, "books");
  // tworzymy zmienną, która przyjmuje wartość asynchronicznej funkcji getDocs
  // używamy słowa kluczowego await aby "poczekać" na wynik funkcji getDocs, która normalnie zwróciłaby promise
  //- nie robi tego, bo dopisaliśmy await który czeka na wynik
  const booksCollection = await getDocs(collectionRef);
  //forEach oznacza: dla każdego elementu booksCollection wykonaj poniższy kod
  booksCollection.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
  // z funkcji asynchronicznej zwracamy przemapowane dokumenty wyciągnięte z firebase (zgodnie z dokumentacją)
  return booksCollection.docs.map((it) => ({ id: it.id, ...it.data() }));
}

export default SearchBook;
