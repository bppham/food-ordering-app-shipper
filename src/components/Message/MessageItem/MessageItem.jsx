"use client";
import { deleteMessage } from "../../../api/message";
import { useSocket } from "../../../context/SocketContext";
import React, { useState, useEffect } from "react";
import { FaEllipsis } from "react-icons/fa6";
import Swal from "sweetalert2";
import "./MessageItem.css";

const MessageItem = ({ msg, chatId }) => {
  const { socket } = useSocket();
  const [shipperId, setShipperId] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        setShipperId(user.id);
      } else {
        console.error("❌ Không tìm thấy thông tin user trong localStorage!");
      }
    };
    init();
  }, []);

  const handleDeleteMessage = async () => {
    try {
      setIsDeleting(true);
      await deleteMessage(msg._id);
      socket.emit("deleteMessage", chatId);
    } catch (err) {
      console.error("❌ Xóa tin nhắn thất bại:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteMessage = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa tin nhắn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleDeleteMessage();
    }
  };

  return (
    <div
      className={`message-container ${
        msg?.sender._id == shipperId ? "message-sent" : "message-received"
      }`}
    >
      {msg?.content.length > 0 && (
        <div className="message-bubble">
          <span className="message-text">{msg?.content}</span>

          {msg?.sender._id == shipperId && (
            <div className="message-menu-wrapper">
              <FaEllipsis className="message-menu-icon" />

              <div className="message-menu">
                <p
                  className="message-menu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    confirmDeleteMessage();
                  }}
                >
                  Xóa
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {msg?.image && (
        <>
          <div className="message-image-wrapper">
            <img
              loading="lazy"
              src={msg?.image?.url}
              alt=""
              className="message-image"
            />
          </div>

          {msg?.sender._id == shipperId && (
            <div className="message-menu-wrapper image-menu">
              <FaEllipsis className="message-menu-icon" />

              <div className="message-menu">
                <p
                  className="message-menu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    confirmDeleteMessage();
                  }}
                >
                  Xóa
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageItem;
