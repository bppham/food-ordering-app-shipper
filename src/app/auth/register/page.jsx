"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "./register.css";

import { registerShipper, uploadAvatarImage } from "../../../api/auth";

const Page = () => {
  const [shipper, setShipper] = useState({
    name: "",
    email: "",
    phonenumber: "",
    gender: "male",
    password: "",
    avatar: null,
    vehicle: {
      name: "",
      number: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShipper((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Bắt đầu đăng ký...");

    if (shipper.password.length < 6) {
      toast.error("Mật khẩu phải ít nhất 6 ký tự!");
      return;
    } else if (shipper.password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      let urlAvatar = "";
      if (shipper.avatar) {
        console.log("📤 Đang upload avatar...");
        urlAvatar = await uploadAvatarImage(shipper.avatar);
        console.log("✅ Ảnh đã upload:", urlAvatar);
      }

      console.log("📤 Gọi registerShipper...");
      await registerShipper(shipper, urlAvatar);
      console.log("✅ Đăng ký thành công!");

      Swal.fire(
        "Thành công!",
        "Đăng ký thành công, hãy chờ tài khoản được duyệt!",
        "success"
      ).then(() => {
        router.push("/auth/login");
      });
    } catch (error) {
      console.log("❌ Lỗi khi đăng ký:", error);
      toast.error(error.response?.data || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-card">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="info-row">
            <div className="left">
              <img
                src={
                  previewAvatar ||
                  "https://res.cloudinary.com/datnguyen240/image/upload/v1722168751/avatars/avatar_pnncdk.png"
                }
                alt="Avatar Preview"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                id="avatarInput"
                style={{ display: "none" }} // Ẩn input file
              />
              <button
                type="button"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                Chọn ảnh
              </button>
            </div>
            <div className="right">
              <div className="row">
                <div className="item">
                  <label>Họ và tên:</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên..."
                    value={shipper.name}
                    onChange={(e) =>
                      setShipper((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="item">
                  <label>Email:</label>
                  <input
                    type="text"
                    placeholder="Nhập email..."
                    value={shipper.email}
                    onChange={(e) =>
                      setShipper((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="item">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại..."
                    value={shipper.phonenumber}
                    onChange={(e) =>
                      setShipper((prev) => ({
                        ...prev,
                        phonenumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="item">
                  <label>Giới tính:</label>
                  <select
                    value={shipper.gender}
                    onChange={(e) =>
                      setShipper((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="item">
                  <label>Mật khẩu:</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu..."
                      value={shipper.password}
                      onChange={(e) =>
                        setShipper((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <button type="button" onClick={togglePasswordVisibility}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
                <div className="item">
                  <label>Nhập lại mật khẩu:</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="item">
                  <label>Loại xem:</label>
                  <input
                    type="text"
                    placeholder="Nhập loại xem..."
                    value={shipper.vehicle.name}
                    onChange={(e) =>
                      setShipper((prev) => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          name: e.target.value,
                        },
                      }))
                    }
                    required
                  />
                </div>
                <div className="item">
                  <label>Số xe:</label>
                  <input
                    type="text"
                    placeholder="Nhập số xe..."
                    value={shipper.vehicle.number}
                    onChange={(e) =>
                      setShipper((prev) => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          number: e.target.value,
                        },
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="action-row">
            <button type="button" onClick={() => router.push("/auth/login")}>
              Trở lại Đăng nhập
            </button>
            <button type="submit">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
