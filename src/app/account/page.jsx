"use client";
import React, { useEffect, useState } from "react";
import "./account.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePasswordPopup from "../../components/Popups/ChangePasswordPopup/ChangePasswordPopup";
import ChangeInfoPopup from "../../components/Popups/ChangeInfoPopup/ChangeInfoPopup";

import { getShipper } from "../../api/shipper";
import { verifyOldPassword } from "../../api/auth";
const Page = () => {
  const [shipper, setShipper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shipperId, setShipperId] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      setShipperId(user.id);
    }
  }, []);

  useEffect(() => {
    if (shipperId) {
      fetchInfo(shipperId);
    }
  }, [shipperId]);

  const fetchInfo = async (id) => {
    try {
      const response = await getShipper(id);
      setShipper(response);
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin shipper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Change personal info
  const [showChangeInfoPopup, setShowChangeInfoPopup] = useState(false);

  const handleContinueChangeInfo = () => {
    setShowChangeInfoPopup(true);
  };

  const handleChangeInfoClose = () => {
    setShowChangeInfoPopup(false);
  };

  // Change password
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);

  const handleChangePasswordClose = () => {
    setShowChangePasswordPopup(false);
  };

  const handleVerifiedOldPassword = async () => {
    try {
      await verifyOldPassword(oldPassword);
      toast.success("Mật khẩu cũ chính xác!");
      setIsVerified(true);
      setShowChangePasswordPopup(true);
    } catch (error) {
      toast.error(error);
    }
  };

  if (isLoading) {
    return <p className="loading-text">Đang tải thông tin...</p>;
  }

  return (
    <div className="personal-info">
      <h1>Thông tin cá nhân</h1>
      <div className="personal-info-container">
        <div className="personal-info-left">
          <div className="title">Ảnh đại diện</div>
          <img src={shipper.avatar.url} alt="" />
        </div>
        <div className="personal-info-right">
          <div className="title">Thông tin cá nhân</div>
          <div className="info-container">
            <div className="info-item">
              <span className="heading">Mã nhân viên: </span>
              <span className="info-detail">{shipper._id}</span>
            </div>

            <div className="info-item">
              <span className="heading">Họ và tên: </span>
              <span className="info-detail">{shipper.name}</span>
            </div>

            <div className="info-item">
              <span className="heading">Email: </span>
              <span className="info-detail">{shipper.email}</span>
            </div>

            <div className="info-item">
              <span className="heading">Giới tính: </span>
              <span className="info-detail">{shipper.gender}</span>
            </div>

            <div className="info-item">
              <span className="heading">SĐT: </span>
              <span className="info-detail">{shipper.phonenumber}</span>
            </div>

            <div className="info-item">
              <span className="heading">Loại xe: </span>
              <span className="info-detail">{shipper.vehicle.name}</span>
            </div>

            <div className="info-item">
              <span className="heading">Số xe: </span>
              <span className="info-detail">{shipper.vehicle.number}</span>
            </div>
          </div>
          <div className="action">
            <button onClick={handleContinueChangeInfo}>Chỉnh sửa</button>
          </div>
        </div>
      </div>
      <div className="change-password-container">
        <div className="title">ĐỔI MẬT KHẨU</div>
        <div className="old-password-container">
          <span>Nhập mật khẩu cũ:</span>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <div className="action">
            <button onClick={handleVerifiedOldPassword}>Tiếp tục</button>
          </div>
        </div>
      </div>

      {/* Show popup */}
      {showChangePasswordPopup && (
        <ChangePasswordPopup onClose={handleChangePasswordClose} />
      )}

      {showChangeInfoPopup && (
        <ChangeInfoPopup
          onClose={handleChangeInfoClose}
          shipper={shipper}
          fetchData={fetchInfo}
        />
      )}
      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Page;
