import React from "react";
import { Outlet } from "react-router-dom";
import  NavBar  from "../layout/NavBar";
import  Footer  from "../layout/Footer"; // Import chính xác
import ChatUser from "../chat/ChatUser";

const RootLayout = () => {
  const userRoles = localStorage.getItem("userRoles");
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
        <div>
        {userRoles?.includes("ROLE_USER") &&
          <ChatUser/>
        }
        </div>
        
      </div>
      <Footer /> {/* Đặt Footer ngoài NavBar */}
    </>
  );
};

export default RootLayout;
