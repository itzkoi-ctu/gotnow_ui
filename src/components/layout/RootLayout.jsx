import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import  NavBar  from "../layout/NavBar";
import  Footer  from "../layout/Footer"; // Import chính xác
import ChatUser from "../chat/ChatUser";

const RootLayout = () => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    // Kiểm tra và lấy thông tin người dùng từ localStorage
    const storedRoles= localStorage.getItem("userRoles");
     setRoles(storedRoles);
  }, []);
  
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
        <div>
        {roles?.includes("ROLE_USER") &&
          <ChatUser/>
        }
        </div>
        
      </div>
      <Footer /> {/* Đặt Footer ngoài NavBar */}
    </>
  );
};

export default RootLayout;
