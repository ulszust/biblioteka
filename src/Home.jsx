import React from "react";
import MyRentals from "./MyRentals";
import { isAdmin, isUser } from "./App";
import MyBooks from "./MyBooks";

const Home = (props) => {
  const { user } = props;
  return (
    <div>
      <h1>HOME!!</h1>
      {isUser(user) && <MyRentals></MyRentals>}
      {isAdmin(user) && <MyBooks></MyBooks>}
    </div>
  );
};

export default Home;
