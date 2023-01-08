import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export async function getAllBooksFromDB() {
  const collectionRef = collection(db, "books");
  const booksCollection = await getDocs(collectionRef);
  return booksCollection.docs.map((it) => ({
    id: it.id,
    ...it.data(),
  }));
}
export async function getBook(bookId) {
  try {
    const bookRef = doc(db, "books", bookId);
    const bookSnap = await getDoc(bookRef);

    if (bookSnap.exists()) {
      return {
        ...bookSnap.data(),
        id: bookId,
      };
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.log("some error", error);
  }
}
