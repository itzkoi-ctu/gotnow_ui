import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../store/features/authSlice";
import { Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("OAuth2RedirectHandler component mounted");

    // Lấy token từ query string
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    console.log("Extracted token:", token);

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      localStorage.setItem('userId', decodedToken.id);
      localStorage.setItem('userRoles', JSON.stringify(decodedToken.roles));
      localStorage.setItem('authToken', token);
      dispatch(loginSuccess({ token }));

      console.log("Token saved, navigating to /home");
      navigate('/', { replace: true });
    } else {
      console.log("No token found, redirecting to /login");
      navigate('/login', { 
        state: { error: 'Login failed. Please try again.' }, 
        replace: true 
      });
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">Processing your authentication...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
