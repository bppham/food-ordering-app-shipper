"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "./Login.css";

import { login } from "../../../api/auth";

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      // Save token into local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ id: data._id }));

      toast.success("Đăng nhập thành công");

      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại!",
        text: error.message || "Email hoặc mật khẩu không chính xác.",
      });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-card">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          <div className="links">
            <a href="/auth/forget-password">Quên mật khẩu?</a>
            <a href="/auth/register">Đăng ký</a>
          </div>
          <button type="submit" className="login-btn">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
