import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatHistory, addMessage } from "../../store/features/chatSlice";

const ChatUser = () => {
    const [inputMessage, setInputMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const userId = localStorage.getItem("userId");
    const adminId = 1;

    const dispatch = useDispatch();
    // const { messages, loading, error } = useSelector((state) => state?.chat);
    const chatState = useSelector((state) => state.chat || {});
const { messages = [], loading, error } = chatState;

    
    useEffect(() => {
        // 🔹 Gọi Redux action để fetch lịch sử tin nhắn
        dispatch(fetchChatHistory( {adminId, userId} ));

        const socket = new SockJS("https://gotnow-api.onrender.com/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Connected to WebSocket!");
                client.subscribe(`/topic/user/${userId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    dispatch(addMessage(receivedMessage));
                    
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
        if (!stompClient || !stompClient.connected) {
            console.error("❌ STOMP client is not connected!");
            return;
        }

        const chatMessage = {
            senderId: parseInt(userId),
            receiverId: adminId,
            content: inputMessage,
            timestamp: new Date().toISOString(),
        };

        dispatch(addMessage(chatMessage));

        stompClient.publish({
            destination: `/app/chat`,
            body: JSON.stringify(chatMessage),
        });

        setInputMessage("");
    };

    return (
        <div>
            {!isOpen && (
                <button
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        fontSize: "20px",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    💬
                </button>
            )}

            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "300px",
                        height: "400px",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                            fontWeight: "bold",
                            backgroundColor: "#007bff",
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        Chat với Admin
                        <button
                            style={{
                                float: "right",
                                background: "none",
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsOpen(false)}
                        >
                            ✖
                        </button>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            padding: "10px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {loading && <p>Đang tải tin nhắn...</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {messages?.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    alignSelf: msg.senderId === parseInt(userId) ? "flex-end" : "flex-start",
                                    backgroundColor: msg.senderId === parseInt(userId) ? "#007bff" : "#ddd",
                                    color: msg.senderId === parseInt(userId) ? "white" : "black",
                                    padding: "8px",
                                    borderRadius: "10px",
                                    marginBottom: "5px",
                                    maxWidth: "70%",
                                }}
                            >
                                {msg.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            borderTop: "1px solid #ddd",
                            padding: "10px",
                        }}
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                marginLeft: "10px",
                                padding: "8px",
                                backgroundColor: "#007bff",
                                color: "white",
                                borderRadius: "5px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatUser;

