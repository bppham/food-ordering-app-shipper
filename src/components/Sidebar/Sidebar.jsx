import React, { useState } from "react";
import "./Sidebar.css";
import Link from "next/link";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("");
  const handleActive = (path) => {
    setActiveItem(path);
  };
  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-menu">
          <div className="sidebar-title">Dashboard</div>
          <div className="sidebar-list">
            <Link href="/home" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/home" ? "active" : ""
                }`}
                onClick={() => handleActive("/home")}
              >
                Trang chủ
              </li>
            </Link>
            <Link href="/home/new-order" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/home/new-order" ? "active" : ""
                }`}
                onClick={() => handleActive("/home/new-order")}
              >
                Nhận đơn mới
              </li>
            </Link>
            <Link href="/home/chat" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/home/new-order" ? "active" : ""
                }`}
                onClick={() => handleActive("/home/chat")}
              >
                Trò chuyện
              </li>
            </Link>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="sidebar-title">Đơn hàng</div>
          <div className="sidebar-list">
            <Link href="/order/delivering" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/order/delivering" ? "active" : ""
                }`}
                onClick={() => handleActive("/order/delivering")}
              >
                Đang giao
              </li>
            </Link>
            <Link href="/order/history" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/order/history" ? "active" : ""
                }`}
                onClick={() => handleActive("/order/history")}
              >
                Đã giao
              </li>
            </Link>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="sidebar-title">Thu nhập</div>
          <div className="sidebar-list">
            <Link href="/income/income-detail" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/income/income-detail" ? "active" : ""
                }`}
                onClick={() => handleActive("/income/income-detail")}
              >
                Thu nhập
              </li>
            </Link>

            <Link href="/income/money-calculation" className="link">
              <li
                className={`sidebar-item ${
                  activeItem === "/income/money-calculation" ? "active" : ""
                }`}
                onClick={() => handleActive("/income/money-calculation")}
              >
                Bảng thu nhập
              </li>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
