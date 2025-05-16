// src/api/messageApi.js
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllMessages = async (chatId) => {
  const res = await axios.get(`${BASE_URL}/message/${chatId}`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return res.data;
};

export const sendMessage = async (chatId, data) => {
  const res = await axios.post(`${BASE_URL}/message/${chatId}`, data, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return res.data;
};

export const deleteMessage = async (messageId) => {
  const res = await axios.delete(`${BASE_URL}/message/delete/${messageId}`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return res.data;
};
