import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import { Input, Button, List, Typography, Space } from "antd";
import moment from "moment";

const { Title } = Typography;

const SOCKET_URL = `${process.env.REACT_APP_BACKEND_URI}`;

const Chat = () => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")) || {}
      : {}
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(SOCKET_URL, {
        withCredentials: true,
      });

      socket.current.on("connect", () => {
        console.log("Connected....")
        if (userInfo && userInfo?.username) {
          socket.current.emit("join", { username: userInfo?.username });
        }
      });

      socket.current.on("message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.current.on("history", (data) => {
        setMessages(data); 
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userInfo]);

  const handleSendMessage = () => {
    if (message && socket.current) {
      const username = userInfo?.username;
      const userId = userInfo?.id;
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: username, text: message, userId, createdAt: new Date() },
      ]);
      socket.current.emit("sendMessage", { username, message, userId });
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const renderMessageContent = (msg) => {
    const isCurrentUser = msg.userId.toString() === userInfo?.id.toString();

    return (
      <div
        style={{
          display: "flex",
          justifyContent: isCurrentUser ? "flex-end" : "flex-start",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            backgroundColor: isCurrentUser ? "#1890ff" : "#f0f0f0",
            color: isCurrentUser ? "#ffffff" : "#000000",
            padding: "8px",
            borderRadius: isCurrentUser
              ? "8px 0 8px 8px"
              : "0 8px 8px 8px",
            maxWidth: "75%",
            wordWrap: "break-word",
          }}
        >
          <div>{msg.text}</div>
          <div
            style={{
              fontSize: "0.8em",
              color: isCurrentUser ? "#cccccc" : "#666666",
              textAlign: "right",
            }}
          >
            {moment(msg.createdAt).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Title level={2}>Real-time Group Chatting Application</Title>
      <div style={{ flex: "1", overflowY: "auto" }}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(msg, index) => (
            <List.Item
              style={{
                borderBottom: "none",
                padding: "8px 0",
                textAlign:
                  msg.userId.toString() === userInfo?.id.toString()
                    ? "right"
                    : "left",
              }}
            >
              <List.Item.Meta
                title={<b>{msg.user}</b>}
                description={renderMessageContent(msg)}
                style={{ wordWrap: "break-word" }}
              />
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      <div style={{ marginTop: "16px", alignSelf: "flex-end", width: "100%" }}>
        <Space>
          <Input
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "300px" }}
          />
          <Button type="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Chat;
