"use client";
import "./chat.css";
import ChatItem from "../../../components/Message/ChatItem/ChatItem";
import React, { useEffect, useState } from "react";
import { getAllChats } from "../../../api/chat";

const Page = () => {
  const [allChats, setAllChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const data = await getAllChats();
      setAllChats(data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách chat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const shipper = localStorage.getItem("user");
    if (shipper) {
      fetchChats();
    }
  }, []);

  return (
    <div className="chat-page-wrapper">
      <h1>Trò chuyện</h1>
      <div className="chat-page-content">
        {loading ? (
          <p>Đang tải...</p>
        ) : allChats && allChats.length > 0 ? (
          allChats.map((chat, index) => (
            <ChatItem key={index} chat={chat} refetchAllChats={fetchChats} />
          ))
        ) : (
          <p>Không có cuộc trò chuyện nào.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
