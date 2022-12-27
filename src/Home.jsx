import React from "react";
import MyRentals from "./MyRentals";
import { isUser } from "./App";

const Home = (props) => {
  const { user } = props;
  return (
    <div>
      <h1>HOME!!</h1>
      {isUser(user) && <MyRentals></MyRentals>}
    </div>
  );
};

export default Home;
