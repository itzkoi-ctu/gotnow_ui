import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/features/authSlice";
const NavBar = () => {

  const dispatch= useDispatch()
  const navigate= useNavigate()
  const userRoles= useSelector((state) => state.auth.roles)

  const handleNavigateToCart = () => {
    navigate(`/user/${userId}/my-cart`);
  };


  const handleLogout = () =>{
    dispatch(logout())
    window.location.href="/"
  }
  const cart = useSelector((state) => state.cart)
  const userId= localStorage.getItem("userId");
  return (
    <Navbar expand='lg' sticky='top' className='nav-bg'>
     <Container>
              

        <Navbar.Brand to={"/"} as={Link}>
          <span className='shop-home'>gotNow.com</span>
         </Navbar.Brand>
              

        <Navbar.Toggle />

        <Navbar.Collapse>
                  
          <Nav className='me-auto'>
            <Nav.Link to={"/products"} as={Link}>
              All Products
            </Nav.Link>
          </Nav>


          {userRoles.includes("ROLE_ADMIN")&&(
          <Nav className='me-auto'>
            <Nav.Link to={"/add-product"} as={Link}>
              Manage Products
            </Nav.Link>
          </Nav>
          )}

          <Nav className='ms-auto'>
            <NavDropdown  title='Account'>
              {userId ?(
                  <>
                  <NavDropdown.Item to={`/user-profile/${userId}/profile`} as={Link}>
                    <MdAccountCircle/>{" "}My Account
                   </NavDropdown.Item>
                                
                  <NavDropdown.Divider />                              
  
                  <NavDropdown.Item to={`order/${userId}/my-order`} as={Link}>
                   <RiBillLine/>{" "} My Orders
                  </NavDropdown.Item>
  
                  <NavDropdown.Divider />
                                
                   <NavDropdown.Item to={"#"} onClick={handleLogout}>
                       Logout
                  </NavDropdown.Item>
                                
  
                </>

              ):
              
              <NavDropdown.Item to={"/login"} as={Link}>
                Login
              </NavDropdown.Item>
              
              
              }



              

              {/* <NavDropdown.Item to={"/register"} as={Link}>
                Register
              </NavDropdown.Item> */}
                          

               </NavDropdown>
             
             {userId &&(
              <Link
              to={`/user/${userId}/my-cart`}
              className='nav-link me-1 position-relative'>
              <FaShoppingCart className='shopping-cart-icon' />
              {cart.items.length > 0 ? (
                <div className='badge-overlay'>{cart.items.length}</div>
              ) : (
                <div className='badge-overlay'>0</div>
              )}
            </Link>
             )}
               
               {/* <FaShoppingCart onClick={handleNavigateToCart} style={{cursor: 'pointer', margin: '10'}}/> */}
               
          </Nav>
                  


        </Navbar.Collapse>
              

       </Container>
          

    </Navbar>
  );
};

export default NavBar;
