// ChatItem.jsx
"use client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import Swal from "sweetalert2";
import { deleteChat as deleteChatApi } from "../../../api/chat";
import "./ChatItem.css";

const ChatItem = ({ chat, refetchAllChats }) => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [shipperId, setShipperId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setShipperId(user.id);
    } else {
      console.error("❌ Không tìm thấy thông tin user trong localStorage!");
    }
  }, []);

  const handleDeleteChat = async () => {
    try {
      await deleteChatApi(chat._id);
      refetchAllChats(); // gọi lại API từ cha để reload danh sách
    } catch (err) {
      console.error("❌ Lỗi khi xóa chat:", err);
    }
  };

  const confirmDeleteChat = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa tin nhắn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      handleDeleteChat();
    }
  };

  useEffect(() => {
    if (chat) {
      if (chat.store) {
        setAvatar(chat.store.avatar.url);
        setName(chat.store.name);
      } else {
        const isUserFirst = chat.users[0]._id === shipperId;
        const user = isUserFirst ? chat.users[1] : chat.users[0];
        setAvatar(user?.avatar?.url);
        setName(user?.name);
      }
    }
  }, [chat, shipperId]);

  return (
    <Link
      href={`/home/chat/${chat._id}`}
      className={`chat-item md:chat-item-md`}
    >
      <div className="chat-avatar-container">
        <img src={avatar || ""} alt="" className="chat-avatar-img" />
      </div>

      <div className="chat-info">
        <span className="chat-name">{name || ""}</span>
        <div className="chat-message-row">
          <span className="chat-message-preview">
            {chat?.latestMessage?.content || ""}
          </span>
          <span className="chat-message-time">
            {moment.utc(chat?.latestMessage?.createdAt).local().fromNow()}
          </span>
        </div>
      </div>

      <div
        className="chat-menu-wrapper group"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <FaEllipsis className="text-[18px] translate-y-[2px]" />
        <div className="chat-menu">
          <p
            className="chat-menu"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              confirmDeleteChat();
            }}
          >
            Xóa
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatItem;
