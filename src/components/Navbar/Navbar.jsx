"use client";
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { getShipper } from "../../api/shipper";
import { getFinishedOrders } from "../../api/order";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [avatar, setAvatar] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [shipperId, setShipperId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setShipperId(user.id); // chỉ set, không gọi hàm nào khác ở đây
    } else {
      console.error("❌ Không tìm thấy thông tin user trong localStorage!");
    }
  }, []);

  useEffect(() => {
    if (shipperId) {
      fetchInfo(shipperId);
      fetchOrderCount(shipperId);
    }
  }, [shipperId]);

  const fetchInfo = async (shipperId) => {
    try {
      if (!shipperId) {
        console.error("❌ Không tìm thấy shipperId!");
        return;
      }
      const response = await getShipper(shipperId);
      setAvatar(response.avatar.url);
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin shipper:", error);
    }
  };

  const fetchOrderCount = async (id) => {
    try {
      const response = await getFinishedOrders(id); // nếu API cần id
      setOrderCount(response.count);
    } catch (error) {
      console.error("❌ Lỗi khi lấy số lượng đơn hàng:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/auth/login"; // Điều hướng mà không cần useRouter
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link href="/home/" className="link">
          <div className="navbar-left">
            <Image
              src="/assets/logo.png"
              width={45}
              height={45}
              alt="Home Icon"
            />
            <span className="logo">Shipper</span>
          </div>
        </Link>

        <div className="navbar-right">
          <Link href="/home/new-order" className="link">
            <div className="navbar-icons">
              <div className="relative flex flex-col gap-[4px] w-[30px] h-[30px] pt-[30px]">
                <Image
                  src="/assets/icons/bell.png"
                  alt="Thông báo"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-[8px]"
                />
              </div>
              {orderCount > 0 && (
                <span className="top-icon-bag">{orderCount}</span>
              )}
            </div>
          </Link>

          {/* ✅ Avatar */}
          <div className="avatar-container">
            <img
              src={
                avatar ||
                "https://res.cloudinary.com/datnguyen240/image/upload/v1722168751/avatars/avatar_pnncdk.png"
              }
              alt="Shipper Avatar"
              className="avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {/* ✅ Dropdown menu */}
            {showDropdown && (
              <div className="dropdown-menu">
                <Link href="/account">
                  <div className="dropdown-item">Thông tin cá nhân</div>
                </Link>
                <div onClick={handleLogout} className="dropdown-item logout">
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
