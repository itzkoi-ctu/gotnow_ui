// import React, { useState, useEffect } from "react";
// import { Form, Button, Card, Container, Row, Col, InputGroup } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";
// import { BsEnvelope, BsKey, BsShieldLock } from "react-icons/bs";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom"; // ✅ Thêm useNavigate
// import { sendOTP, verifyOTP, resetPassword, resetState } from "../../store/features/password_temp";

// const ForgotPassword = () => {
//     const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đặt lại mật khẩu
//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Thêm confirm password
//     const dispatch = useDispatch();
//     const navigate = useNavigate(); // ✅ Dùng để chuyển trang
//     const { message, isVerified, isLoading, error, isOtpSent } = useSelector((state) => state.password);

//     console.log("isOtpSent: " + isOtpSent); // Debug
//     console.log("isVerified: " + isVerified); // Debug

//     useEffect(() => {
//         return () => {
//             dispatch(resetState()); // Reset Redux state khi rời khỏi trang
//         };
//     }, [dispatch]);

//     const handleSendOTP = async () => {
//         try {
//             await dispatch(sendOTP(email)).unwrap();
//         } catch (err) {
//             console.error("Lỗi gửi OTP:", err);
//         }
//     };

//     const handleVerifyOTP = () => dispatch(verifyOTP({ email, otp }));

//     const handleResetPassword = async () => {
//         if (newPassword !== confirmPassword) {
//             toast.error("Mật khẩu không khớp!"); // ✅ Kiểm tra khớp mật khẩu
//             return;
//         }

//         try {
//             await dispatch(resetPassword({ email, newPassword })).unwrap();
//             toast.success(message);

//             setTimeout(() => {
//                 navigate("/login"); // ✅ Chuyển về trang đăng nhập sau khi đặt lại mật khẩu
//             }, 2000);
//         } catch (err) {
//             console.error("Lỗi đặt lại mật khẩu:", err);
//         }
//     };

//     useEffect(() => {
//         if (message) toast.success(message);
//         if (error) toast.error(error);
//         if (isOtpSent) {
//             console.log("OTP gửi thành công, chuyển qua bước 2");
//             setStep(2);
//         }
//         if (isVerified) {
//             console.log("OTP xác minh thành công, chuyển qua bước 3");
//             setStep(3);
//         }
//     }, [message, error, isOtpSent, isVerified]);

//     return (
//         <Container className="mt-5">
//             <ToastContainer />
//             <Row className="d-flex justify-content-center">
//                 <Col xs={12} sm={10} md={8} lg={6} xl={5}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title className="text-center mb-4">
//                                 {step === 1 && "Quên Mật Khẩu"}
//                                 {step === 2 && "Nhập Mã OTP"}
//                                 {step === 3 && "Đặt Lại Mật Khẩu"}
//                             </Card.Title>

//                             {step === 1 && (
//                                 <>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Email</Form.Label>
//                                         <InputGroup>
//                                             <InputGroup.Text><BsEnvelope /></InputGroup.Text>
//                                             <Form.Control
//                                                 type="email"
//                                                 placeholder="Nhập email của bạn"
//                                                 value={email}
//                                                 onChange={(e) => setEmail(e.target.value)}
//                                             />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Button variant="primary" className="w-100" onClick={handleSendOTP} disabled={isLoading}>
//                                         {isLoading ? "Đang gửi OTP..." : "Gửi OTP"}
//                                     </Button>
//                                 </>
//                             )}

//                             {step === 2 && (
//                                 <>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Mã OTP</Form.Label>
//                                         <InputGroup>
//                                             <InputGroup.Text><BsShieldLock /></InputGroup.Text>
//                                             <Form.Control
//                                                 type="text"
//                                                 placeholder="Nhập mã OTP"
//                                                 value={otp}
//                                                 onChange={(e) => setOtp(e.target.value)}
//                                             />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Button variant="primary" className="w-100" onClick={handleVerifyOTP} disabled={isLoading}>
//                                         {isLoading ? "Đang xác minh..." : "Xác Minh OTP"}
//                                     </Button>
//                                 </>
//                             )}

//                             {step === 3 && (
//                                 <>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Mật Khẩu Mới</Form.Label>
//                                         <InputGroup>
//                                             <InputGroup.Text><BsKey /></InputGroup.Text>
//                                             <Form.Control
//                                                 type="password"
//                                                 placeholder="Nhập mật khẩu mới"
//                                                 value={newPassword}
//                                                 onChange={(e) => setNewPassword(e.target.value)}
//                                             />
//                                         </InputGroup>
//                                     </Form.Group>

//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Nhập Lại Mật Khẩu</Form.Label>
//                                         <InputGroup>
//                                             <InputGroup.Text><BsKey /></InputGroup.Text>
//                                             <Form.Control
//                                                 type="password"
//                                                 placeholder="Nhập lại mật khẩu"
//                                                 value={confirmPassword}
//                                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                             />
//                                         </InputGroup>
//                                     </Form.Group>

//                                     <Button variant="success" className="w-100" onClick={handleResetPassword} disabled={isLoading}>
//                                         {isLoading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
//                                     </Button>
//                                 </>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default ForgotPassword;
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Row, Col, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { BsEnvelope, BsKey, BsShieldLock } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP, resetPassword, resetState, clearMessage } from "../../store/features/password_temp";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đặt lại mật khẩu
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message, isVerified, isLoading, error, isOtpSent, resetSuccess } = useSelector((state) => state.password);

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetState());
        };
    }, [dispatch]);

    // Handle messages and state changes
    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(clearMessage()); // Clear message after showing toast
        }
        
        if (error) {
            toast.error(error);
        }
        
        if (isOtpSent) {
            setStep(2);
        }
        
        if (isVerified && step === 2) {
            setStep(3);
        }
        
        if (resetSuccess) {
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [message, error, isOtpSent, isVerified, resetSuccess, navigate, dispatch, step]);

    const handleSendOTP = async () => {
        if (!email) {
            toast.error("Vui lòng nhập email");
            return;
        }
        
        try {
            await dispatch(sendOTP(email)).unwrap();
        } catch (err) {
            console.error("Lỗi gửi OTP:", err);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            toast.error("Vui lòng nhập mã OTP");
            return;
        }
        
        try {
            await dispatch(verifyOTP({ email, otp })).unwrap();
        } catch (err) {
            console.error("Lỗi xác minh OTP:", err);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }
        
        if (newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        try {
            await dispatch(resetPassword({ email, newPassword })).unwrap();
        } catch (err) {
            console.error("Lỗi đặt lại mật khẩu:", err);
        }
    };

    return (
        <Container className="mt-5">
            <ToastContainer />
            <Row className="d-flex justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                {step === 1 && "Quên Mật Khẩu"}
                                {step === 2 && "Nhập Mã OTP"}
                                {step === 3 && "Đặt Lại Mật Khẩu"}
                            </Card.Title>

                            {step === 1 && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><BsEnvelope /></InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email của bạn"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Button variant="primary" className="w-100" onClick={handleSendOTP} disabled={isLoading}>
                                        {isLoading ? "Đang gửi OTP..." : "Gửi OTP"}
                                    </Button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <p className="mb-3 text-muted">Mã OTP đã được gửi đến email: {email}</p>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mã OTP</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><BsShieldLock /></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập mã OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Button variant="primary" className="w-100" onClick={handleVerifyOTP} disabled={isLoading}>
                                        {isLoading ? "Đang xác minh..." : "Xác Minh OTP"}
                                    </Button>
                                    <div className="text-center mt-2">
                                        <Button variant="link" onClick={handleSendOTP} disabled={isLoading}>
                                            Gửi lại OTP
                                        </Button>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mật Khẩu Mới</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><BsKey /></InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu mới"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </InputGroup>
                                        <Form.Text className="text-muted">
                                            Mật khẩu phải có ít nhất 6 ký tự
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nhập Lại Mật Khẩu</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><BsKey /></InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập lại mật khẩu"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Button variant="success" className="w-100" onClick={handleResetPassword} disabled={isLoading}>
                                        {isLoading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
                                    </Button>
                                </>
                            )}

                            {/* Nút quay lại tùy chọn */}
                            {step > 1 && (
                                <div className="text-center mt-3">
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={() => setStep(step - 1)}
                                        disabled={isLoading}
                                    >
                                        Quay lại
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;