import React, { useState } from 'react';
import './ChangePasswordPopup.css';
import { toast } from "react-toastify";

import {resetPassword} from "../../../api/auth"

const ChangePasswordPopup = ({onClose}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
      if (newPassword === "" || confirmPassword === ""){
        toast.error("Vui lòng nhập đủ thông tin");
      }else if(newPassword.length < 6){
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      } else if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu nhập lại không chính xác")
      }
      try {
        await resetPassword(newPassword);
        toast.success("Đổi mật khẩu thành công!");
        onClose();
      } catch (error) {
        toast.error(error);
      }
    };
  return (
    <div className="change-password-popup">
      <div className="popup-content">
        <h2>Đổi mật khẩu mới</h2>
        <div>
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Nhập lại mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="popup-actions">
          <button onClick={handleSubmit}>Xác nhận</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPopup
