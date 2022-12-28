import React from "react";
import MyRentals from "./MyRentals";
import { isAdmin, isUser } from "./App";
import BooksOverview from "./BooksOverview";

const Home = (props) => {
  const { user } = props;
  return (
    <div>
      {isUser(user) && <MyRentals></MyRentals>}
      {isAdmin(user) && <BooksOverview></BooksOverview>}
    </div>
  );
};

export default Home;
