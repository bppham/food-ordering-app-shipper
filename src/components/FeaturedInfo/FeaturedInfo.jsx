"use client"
import React, { useEffect, useState } from "react";
import "./FeaturedInfo.css";
import {getShipperOrders} from "../../api/order"


const FeaturedInfo = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const shipperId = user?.id;

  useEffect(() => {
    if (shipperId) {
      fetchShipperOrders();
    }
  }, [shipperId]);

  const fetchShipperOrders = async () => {
    try {
      const response = await getShipperOrders(shipperId);
      setTotalOrders(response.totalOrders);
      setMonthlyOrders(response.monthlyOrders);
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu đơn hàng:", error);
    }
  };
  return (
    <div className="featured-info">
      <div className="featured-item">
        <div className="featured-title">Tổng đơn hàng</div>
        <div className="featured-container">
          <span className="featured-number">{totalOrders}</span>
          <span className="feartured-rate">
            <p>11%</p>
            {/* <img src={increase_icon} alt="" /> */}
          </span>
        </div>
        <span className="featured-sub">So với tháng 12</span>
      </div>

      <div className="featured-item">
        <div className="featured-title">Số đơn hàng</div>
        <div className="featured-container">
          <span className="featured-number">{monthlyOrders}</span>
          <span className="feartured-rate">
            <p>20%</p>
            {/* <img src={decrease_icon} alt="" /> */}
          </span>
        </div>
        <span className="featured-sub">So với tháng 12</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;
