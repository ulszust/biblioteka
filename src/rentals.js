import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";

export async function getRentalFromDB() {
  const docRef = doc(db, "rentals", "user");
  const rentals = await getDoc(docRef);
  return rentals?.data();
}
