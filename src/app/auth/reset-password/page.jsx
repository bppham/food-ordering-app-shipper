"use client";
import React, { useState, useEffect } from "react";
import "./reset-password.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {resetPasswordWithEmail} from "../../../api/auth"
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      router.push("/auth/forget-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (password === "" || confirmedPassword === "") {
      toast.error("Vui lòng nhập đủ thông tin");
      return;
    } else if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    } else if (password !== confirmedPassword) {
      toast.error("Mật khẩu nhập lại không chính xác");
      return;
    }
    try {
      await resetPasswordWithEmail(email, password);
      toast.success("Đổi mật khẩu thành công!");
      router.push("/auth/login")
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="reset-password-container">
      <ToastContainer />
      <div className="reset-password-card">
        <h2>Đổi mật khẩu</h2>
          <div className="input-group">
            <label>Mật khẩu mới</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showConfirmedPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu..."
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="action">
            <button onClick={() => router.push("/auth/login")}>Trở về</button>
            <button onClick={handleSubmit}>Xác nhận</button>
          </div>
      </div>
    </div>
  );
};

export default page;
