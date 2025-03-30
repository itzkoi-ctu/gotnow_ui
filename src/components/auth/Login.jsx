
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { login , resetErrorMessage} from '../../store/features/authSlice'
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import { BsLockFill, BsPersonFill, BsGoogle } from 'react-icons/bs'

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(null);

    const authErrorMessage = useSelector((state) => state.auth?.errorMessage);
    // console.log("authErrorMessage: " + authErrorMessage)
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated)
    const from = location.state?.from?.pathname || "/"

    useEffect(() => {
        // Kiểm tra nếu có token trong URL (sau khi OAuth2 redirect)
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            // Lưu token vào localStorage hoặc dispatch một action để lưu token
            localStorage.setItem('token', token);
            // Chuyển hướng và xóa token khỏi URL
            navigate(from, { replace: true });
            window.location.reload();
        }
    }, [location, navigate, from]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
            window.location.reload()
        }
    }, [isAuthenticated, navigate, from])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            toast.error("Invalid username or password");
            setErrorMessage("Invalid username or password");
            return;
        }
        try {
            await dispatch(login(credentials)).unwrap();
        } catch (error) {
            toast.error(authErrorMessage);
        }
    };

    const handleGoogleLogin = () => {
        // Chuyển hướng đến endpoint OAuth2 của Spring Boot
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };
    useEffect(() => {
        if (authErrorMessage) {
            toast.error(authErrorMessage);
            dispatch(resetErrorMessage())
        }
    }, [authErrorMessage]);

    return (
        <Container className='mt-5 mb-5'>
            <ToastContainer />
            <Row className='d-flex justify-content-center'>
                <Col xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Card>
                        <Card.Body>
                            {authErrorMessage && (
                                <div className='text-danger'>{authErrorMessage}</div>
                            )}
                            <Card.Title className='text-center mb-4'>Login</Card.Title>

                            <Form onSubmit={handleLogin}>
                                <Form.Group className='mb-3' controlId='username'>
                                    <Form.Label>Email</Form.Label>

                                    <InputGroup>
                                        <InputGroup.Text>
                                            <BsPersonFill />
                                        </InputGroup.Text>

                                        <Form.Control
                                            type='text'
                                            name='email'
                                            placeholder='Enter your email address'
                                            value={credentials.email}
                                            onChange={handleInputChange}
                                            isInvalid={!!errorMessage}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='password'>
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <BsLockFill />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type='password'
                                            name='password'
                                            placeholder='Enter your password'
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            isInvalid={!!errorMessage}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                
                                <Button
                                    variant='outline-primary'
                                    type='submit'
                                    className='w-100 mb-3'>
                                    Login
                                </Button>
                                <div className='text-center mb-3'>
        <Link to={"/forgot-password"} style={{ textDecoration: "none" }}>
            Forgot Password?
        </Link>
    </div>
                                <div className='text-center mb-4'>
                                Don't have an account yet?{" "}
                                <Link to={"/register"} style={{ textDecoration: "none" }}>
                                    Register here
                                </Link>
                            </div>
                                {/* Google Login Button */}
                                <div className='text-center my-3'>
                                    <p className='text-muted'>OR</p>
                                </div>
                                
                                
                            </Form>

                            
                            <Button
                                    variant='outline-danger'
                                    type='button'
                                    className='w-100 d-flex justify-content-center align-items-center'
                                    onClick={handleGoogleLogin}>
                                    <BsGoogle className='me-2' />
                                    Login with Google
                                </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login