"use client";
import React, { useEffect, useState } from "react";
import "./IncomeDetail.css";
import FeaturedInfo from "../../../components/FeaturedInfo/FeaturedInfo";
import ChartOrder from "../../../components/Chart/ChartOrder/ChartOrder";
import { getAllDeliveredOrders } from "../../../api/order";

const IncomeDetail = () => {
  const [orders, setOrders] = useState([]);
  const [shipperId, setShipperId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setShipperId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!shipperId) return;

    const fetchAll = async () => {
      try {
        const res = await getAllDeliveredOrders(); // API sẽ dùng req.user._id từ token
        setOrders(res.data); // data là mảng order
        console.log(orders);
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn hàng đã giao:", error);
      }
    };

    fetchAll();
  }, [shipperId]);

  const countOrdersByMonth = (orders) => {
    // Khởi tạo mảng 12 tháng, value = 0
    const monthCounts = Array(12).fill(0);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
      monthCounts[month] += 1;
    });

    // Chuyển về dạng [{name: 'Tháng 1', value: x}, ...]
    return monthCounts.map((count, index) => ({
      name: `Thg ${index + 1}`,
      value: count,
    }));
  };

  return (
    <div className="income-detail">
      <div className="income-detail-header">
        <h1>Thống kê đơn hàng</h1>
      </div>
      <div className="featurer-info-container">
        <FeaturedInfo />
      </div>
      <div className="chart-container">
        <div className="chart-income-container">
          <ChartOrder
            data={countOrdersByMonth(orders)}
            title="Đơn trong năm"
            grid
            dataKey="value"
          />
        </div>

      </div>
    </div>
  );
};

export default IncomeDetail;
