"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import Link from "next/link";
import Dropzone from "react-dropzone";
import { useSocket } from "../../../../context/SocketContext";
import MessageItem from "../../../../components/Message/MessageItem/MessageItem";
import { getAllMessages, sendMessage } from "../../../../api/message";
import { uploadImages } from "../../../../api/upload";
import "./detail-chat.css";

const Page = () => {
  const { id: chatId } = useParams();
  const { socket } = useSocket();

  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [shipperId, setShipperId] = useState(null);
  const [chatData, setChatData] = useState(null);

  const messagesEndRef = useRef(null);

  const getMessages = async () => {
    try {
      const res = await getAllMessages(chatId);
      setChatData(res);
    } catch (err) {
      console.error("Lỗi khi lấy messages:", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) setShipperId(user.id);
  }, []);

  useEffect(() => {
    if (chatId) {
      getMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit("joinChat", chatId);
    return () => socket.emit("leaveChat", chatId);
  }, [socket, chatId]);

  useEffect(() => {
    if (!socket) return;
    const handleNew = () => getMessages();
    socket.on("messageReceived", handleNew);
    socket.on("messageDeleted", handleNew);
    return () => {
      socket.off("messageReceived", handleNew);
      socket.off("messageDeleted", handleNew);
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const data = { content: message };
      await sendMessage(chatId, data);
      socket.emit("sendMessage", { id: chatId, data });
      setMessage("");
      getMessages();
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    }
  };

  const handleSendImage = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));
      const result = await uploadImages(formData);
      const data = { content: "", image: result[0] };
      await sendMessage(chatId, data);
      socket.emit("sendMessage", { id: chatId, data });
      getMessages();
    } catch (err) {
      console.error("Lỗi gửi ảnh:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  useEffect(() => {
    if (!chatData) return;
    const { chat } = chatData;
    if (chat.store) {
      setAvatar(chat.store.avatar?.url || "");
      setName(chat.store.name || "");
    } else {
      const userA = chat.users[0];
      const userB = chat.users[1];
      const isUserA = userA._id === shipperId;
      setAvatar(isUserA ? userB.avatar?.url : userA.avatar?.url);
      setName(isUserA ? userB.name : userA.name);
    }
  }, [chatData, shipperId]);

  return (
    <div className="chat-page">
      <div className="chat-box">
        <div className="chat-header">
          <Link href="/home/chat">
            <Image
              src="/assets/arrow_left_long.png"
              alt=""
              width={25}
              height={25}
            />
          </Link>
          <div className="chat-info">
            <div className="chat-avatar-wrapper">
              <img src={avatar || ""} alt="" className="chat-avatar" />
            </div>
            <div>
              <p className="chat-name">{name}</p>
              <p className="chat-time">
                {moment
                  .utc(chatData?.chat?.latestMessage?.createdAt)
                  .local()
                  .fromNow()}
              </p>
            </div>
          </div>
        </div>

        <div className="chat-body">
          {chatData?.messages?.map((msg, i) => (
            <MessageItem key={i} msg={msg} chatId={chatId} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <Image
            src="/assets/send.png"
            alt=""
            width={30}
            height={30}
            className="chat-icon"
            onClick={handleSendMessage}
          />
          <Dropzone
            maxFiles={1}
            accept={{ "image/*": [] }}
            onDrop={(acceptedFiles) => {
              handleSendImage(acceptedFiles);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Image
                  src="/assets/camera.png"
                  alt=""
                  width={30}
                  height={30}
                  className="chat-icon"
                />
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </div>
  );
};

export default Page;
