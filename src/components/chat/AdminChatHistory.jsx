import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserChat } from "../../store/features/chatSlice";
import { ListGroup, Button, Container, Card } from "react-bootstrap";
import ChatDetail from "./ChatDetail";

const AdminChatHistory = () => {
    const dispatch = useDispatch();
    const conversations = useSelector((state) => state.chat.conversations);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        dispatch(fetchUserChat());
    }, [dispatch]);

    const handleOpenChat = (userId) => {
        setSelectedUserId(userId);
    };

    const handleCloseChat = () => {
        setSelectedUserId(null);
    };

    return (
        <Container className="mt-5">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white">
                    <h2 className="mb-0">Danh sách User đã chat</h2>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {conversations?.map((user) => (
                            <ListGroup.Item
                                key={user.userId}
                                className="d-flex justify-content-between align-items-center py-3"
                            >
                                <div>
                                    <strong>User {user.userId}</strong>: {user.lastMessage}
                                </div>
                                <Button variant="outline-primary" size="sm" onClick={() => handleOpenChat(user.userId)}>
                                    Xem chi tiết
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            {selectedUserId && <ChatDetail userId={selectedUserId} onClose={handleCloseChat} />}
        </Container>
    );
};

export default AdminChatHistory;