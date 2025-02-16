import React from "react";
import { Outlet } from "react-router-dom";
import  NavBar  from "../layout/NavBar";
import  Footer  from "../layout/Footer"; // Import chính xác

const RootLayout = () => {
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
      <Footer /> {/* Đặt Footer ngoài NavBar */}
    </>
  );
};

export default RootLayout;
