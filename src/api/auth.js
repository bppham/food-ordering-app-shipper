import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

export const login = async (email, password) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/login/shipper`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (data.token) {
      Cookies.set("token", data.token, { expires: 7 }); // Lưu vào cookie (7 ngày)
    }

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại!");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const verifyOldPassword = async (oldPassword) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/api/v1/shipper/verify-password`,
      { oldPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Có lỗi xảy ra!";
  }
};

export const resetPassword = async (newPassword) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}/api/v1/shipper/reset-password`,
      { newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Có lỗi xảy ra!";
  }
};

export const registerShipper = async (shipperData, imgURL) => {
  try {
    console.log("📤 Gửi dữ liệu đăng ký:", {
      ...shipperData,
      avatar: { url: imgURL },
    });

    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/register/shipper`,
      { ...shipperData, avatar: { url: imgURL } },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Đăng ký thành công:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ Lỗi đăng ký shipper:", error.response?.data || error);
    throw error.response?.data?.message || "Có lỗi xảy ra!";
  }
};

export const uploadAvatarImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${BASE_URL}/api/v1/upload/avatar/shipper`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data[0].url);
    return response.data[0].url;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/forgot-password/shipper`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra!");
  }
};

export const checkOTP = async (email, otp) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/check-otp/shipper`,
      { email, otp }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra!");
  }
};

export const resetPasswordWithEmail = async (email, password) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/auth/reset-password/shipper`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Có lỗi xảy ra!");
  }
};
