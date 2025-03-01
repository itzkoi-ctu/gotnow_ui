import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/features/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRoles = useSelector((state) => state.auth.roles);
  const cart = useSelector((state) => state.cart);
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg shadow">
      <Container>
        {/* Logo */}
        <Navbar.Brand to="/" as={Link} className="nav-logo">
          gotNow<span>.com</span>
        </Navbar.Brand>

        {/* Toggle button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to="/products" as={Link} className="nav-item">
              All Products
            </Nav.Link>

            {userRoles.includes("ROLE_ADMIN") && (
              <>
                <Nav.Link to="/add-product" as={Link} className="nav-item">
                  Manage Products
                </Nav.Link>
                <Nav.Link to="/revenue" as={Link} className="nav-item">
                  Revenue
                </Nav.Link>
                <Nav.Link to="/manage-orders" as={Link} className="nav-item">
                  Manage Orders
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            {/* Dropdown menu cho tài khoản */}
            <NavDropdown title="Account" className="nav-dropdown">
              {userId ? (
                <>
                  <NavDropdown.Item
                    to={`/user-profile/${userId}/profile`}
                    as={Link}
                  >
                    <MdAccountCircle className="dropdown-icon" />
                    My Account
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item to={`order/${userId}/my-order`} as={Link}>
                    <RiBillLine className="dropdown-icon" />
                    My Orders
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item to="#" onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </>
              ) : (
                <NavDropdown.Item to="/login" as={Link}>
                  Login
                </NavDropdown.Item>
              )}
            </NavDropdown>

            {/* Giỏ hàng */}
            {userId && (
              <Link to={`/user/${userId}/my-cart`} className="nav-cart">
                <FaShoppingCart className="cart-icon" />
                {cart.items.length > 0 ? (
                  <div className="badge">{cart.items.length}</div>
                ) : (
                  <div className="badge">0</div>
                )}
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
