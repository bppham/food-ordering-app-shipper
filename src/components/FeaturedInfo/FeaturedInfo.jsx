"use client";
import React, { useEffect, useState } from "react";
import "./FeaturedInfo.css";
import { getShipperOrders } from "../../api/order";

const FeaturedInfo = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [shipperId, setShipperId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setShipperId(user.id);
  }, []);

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
        </div>
      </div>

      <div className="featured-item">
        <div className="featured-title">Số đơn hàng trong tháng</div>
        <div className="featured-container">
          <span className="featured-number">{monthlyOrders}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInfo;
