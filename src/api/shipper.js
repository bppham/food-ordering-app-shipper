import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getShipper = async (shipperId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/shipper/${shipperId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin shipper:", error);
    throw error;
  }
};

export const updateShipper = async (updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/shipper`,
      updatedData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thông tin shipper:", error);
    throw error;
  }
};
