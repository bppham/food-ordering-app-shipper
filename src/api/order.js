import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getFinishedOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/order/finished`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error to get finished orders:", error);
    throw error;
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/order/${orderId}/accept`,
      {}, // Không cần body
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Lấy đơn hàng đang giao
export const getTakenOrder = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/order/taken`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error getting taken order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/order/${orderId}/update-status`,
      { status: newStatus }, // Gửi trạng thái mới trong body
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/order/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error get order: ", error);
    throw error;
  }
};

// 🔹 API lấy danh sách đơn đã giao (lịch sử)
export const getDeliveredOrders = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/order/delivered`, {
      params: { page, limit },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy lịch sử đơn hàng:", error);
    throw error;
  }
};

export const getAllDeliveredOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/order/delivered`, {
      params: { all: true },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy tất cả đơn hàng:", error);
    throw error;
  }
};

export const getShipperOrders = async (shipperId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/order/shipper/${shipperId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy số đơn hàng của shipper:", error);
    throw error;
  }
};
