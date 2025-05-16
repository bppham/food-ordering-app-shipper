// src/api/chatApi.js
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllChats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/chat`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách chat:", err);
    throw err;
  }
};

export const createChat = async (id, body) => {
  try {
    const res = await axios.post(`${BASE_URL}/chat/${id}`, body, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi tạo chat:", err);
    throw err;
  }
};

export const deleteChat = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/chat/delete/${id}`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  } catch (err) {
    console.error("❌ Lỗi khi xóa chat:", err);
    throw err;
  }
};
