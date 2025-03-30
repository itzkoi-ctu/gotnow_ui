import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserChat } from "../../store/features/chatSlice";
import { ListGroup, Container, Row, Col, Image } from "react-bootstrap";
import ChatDetail from "./ChatDetail";
import "./AdminChatHistory.css";
import moment from "moment-timezone";
import avt from "../../assets/images/defaultavatar.png"

const AdminChatHistory = () => {
    const dispatch = useDispatch();
    const conversations = useSelector((state) => state.chat.conversations);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(fetchUserChat());
    }, [dispatch]);

    // Sắp xếp cuộc trò chuyện theo thời gian tin nhắn gần nhất
    const sortedConversations = [...(conversations || [])].sort((a, b) =>
        new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );

    return (
        <Container fluid className="mt-3">
            <Row className="chat-container">
                {/* Sidebar danh sách user */}
                <Col md={4} className="chat-sidebar border-end p-3 bg-light">
                    <h5 className="mb-3">Chats</h5>
                    <ListGroup variant="flush">
                        {sortedConversations.map((user) => (
                            <ListGroup.Item
                                key={user.id}
                                className={`d-flex align-items-center py-3 ${selectedUser?.id === user.id ? "active" : ""}`}
                                onClick={() => setSelectedUser(user)}
                                style={{ cursor: "pointer" }}
                            >
                                <Image
                                    src={user.avatarUser|| avt}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    className="me-3"
                                />
                                <div className="flex-grow-1">
                                    <strong>{user.username}</strong>
                                    <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                                        {user.lastMessage?.content || "Chưa có tin nhắn"}
                                    </p>
                                </div>
                                {/* Thời gian tin nhắn cuối cùng */}
                                <small className="text-muted">
    {moment.utc(user.lastMessage?.timestamp).tz("Asia/Ho_Chi_Minh").format("HH:mm DD/MM/YYYY")}
</small>



                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Chi tiết cuộc trò chuyện */}
                <Col md={8} className="chat-content">
                    {selectedUser ? (
                        <ChatDetail userId={selectedUser.userId} username={selectedUser.username} onClose={() => setSelectedUser(null)} />
                    ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <p className="text-muted">Chọn một cuộc trò chuyện để bắt đầu</p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminChatHistory;
