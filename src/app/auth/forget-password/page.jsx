"use client";
import React, { useState, useEffect } from "react";
import "./forget-password.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgetPassword } from "../../../api/auth";
import { useRouter } from "next/navigation";
const page = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    try {
      const response = await forgetPassword(email);
      toast.success("Thành công");

      sessionStorage.setItem("email", email)
      router.push("/auth/verify-otp");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  return (
    <div className="forget-password-container">
      <ToastContainer />
      <div className="forget-password-card">
        <h2>Nhập email tài khoản</h2>

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
        <div className="action">
          <button type="button" onClick={() => router.push("/auth/login")}>
            Trở lại
          </button>
          <button onClick={handleSendOTP}>Tiếp tục</button>
        </div>
      </div>
    </div>
  );
};

export default page;
