import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatHistory, addMessage } from "../../store/features/chatSlice";
import { Button, Form, Card } from "react-bootstrap";
import "./ChatDetail.css";
import newMessageSound from "../../assets/sound/happy-pop-2-185287.mp3";
const ChatDetail = ({ userId,username, onClose }) => {
    const dispatch = useDispatch();
    const { messages } = useSelector((state) => state?.chat);
    const [inputMessage, setInputMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null); // Tham chiếu đến khung chat
    const adminId = 1;
    const playNotificationSound = () => {
        const audio = new Audio(newMessageSound);
        audio.play();
    };

    useEffect(() => {
        if (!userId) return;

        dispatch(fetchChatHistory({ adminId, userId }));

        const socket = new SockJS("https://gotnow-api.onrender.com/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Admin đã kết nối WebSocket!");
                client.subscribe(`/topic/admin/${userId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    dispatch(addMessage(newMessage));
                    if (newMessage.senderId !== adminId) {
                        playNotificationSound();
                    }
                });
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, [userId, dispatch]);

    // ✅ Tự động cuộn khi có tin nhắn mới
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
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

        dispatch(addMessage(chatMessage));

        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(chatMessage),
        });

        setInputMessage("");
    };

    return (
        <Card className="chat-detail-card shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{username}</h5>
                <Button variant="link" className="text-white p-0" onClick={onClose}>
                    ×
                </Button>
            </Card.Header>
            <Card.Body className="chat-messages p-3" ref={chatContainerRef}>
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
            </Card.Body>
            <Card.Footer className="p-2">
                <Form className="d-flex">
                    <Form.Control
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="me-2"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // ✅ Ngăn form reload trang
                                sendMessage();
                            }
                        }}
                    />
                    <Button variant="primary" onClick={sendMessage}>
                        Gửi
                    </Button>
                </Form>
            </Card.Footer>
        </Card>
    );
};

export default ChatDetail;
