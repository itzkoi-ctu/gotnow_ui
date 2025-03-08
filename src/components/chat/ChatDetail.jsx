import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatHistory, addMessage } from "../../store/features/chatSlice";
import { Button, Form, Card, Container } from "react-bootstrap";
import "./ChatDetail.css"; // Giữ file CSS để tùy chỉnh thêm

const ChatDetail = ({ userId, onClose }) => {
    const dispatch = useDispatch();
    const { messages } = useSelector((state) => state.chat);
    const [inputMessage, setInputMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const messagesEndRef = useRef(null);
    const adminId = 1;

    useEffect(() => {
        if (!userId) return;

        dispatch(fetchChatHistory({ adminId, userId }));

        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Admin đã kết nối WebSocket!");
                client.subscribe(`/topic/admin/${userId}`, (message) => {
                    dispatch(addMessage(JSON.parse(message.body)));
                });
                
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, [userId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!inputMessage.trim() || !stompClient || !stompClient.connected) {
            console.error("❌ STOMP client chưa kết nối hoặc tin nhắn rỗng!");
            return;
        }

        const chatMessage = {
            senderId: adminId,
            receiverId: userId,
            content: inputMessage,
            timestamp: new Date().toISOString(),
        };

        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(chatMessage),
        });

        dispatch(addMessage(chatMessage));
        setInputMessage("");
    };

    return (
        <Container className="chat-popup position-fixed" style={{ bottom: "20px", right: "20px", width: "400px", zIndex: 1000 }}>
            <Card className="shadow-lg border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Chat với User {userId}</h5>
                    <Button variant="link" className="text-white p-0" onClick={onClose}>
                        ×
                    </Button>
                </Card.Header>
                <Card.Body className="chat-messages p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-bubble mb-2 p-2 rounded ${
                                msg.senderId === parseInt(userId) ? "bg-light text-dark" : "bg-primary text-white ms-auto"
                            }`}
                            style={{ maxWidth: "75%", wordWrap: "break-word" }}
                        >
                            {msg.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </Card.Body>
                <Card.Footer className="p-2">
                    <Form className="d-flex">
                        <Form.Control
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="me-2"
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button variant="primary" onClick={sendMessage}>
                            Gửi
                        </Button>
                    </Form>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default ChatDetail;