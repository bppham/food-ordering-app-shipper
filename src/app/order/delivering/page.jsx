"use client";
import React, { useEffect, useState } from "react";
import { getTakenOrder, getOrderDetail } from "../../../api/order"; // API lấy đơn hàng đang giao
import Step1Pickup from "../../../components/Order/Pickup/Step1Pickup";
import Step2Delivery from "../../../components/Order/Pickup/Step2Delivery";
import Step3Complete from "../../../components/Order/Pickup/Step3Complete";
import FoodOrderDetail from "../../../components/Order/FoodOrderDetail/FoodOrderDetail";
import "./delivering-order.css";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveringOrder = () => {
  const [order, setOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await getTakenOrder();
      if (response?.data) {
        setOrder(response.data);
      } else {
        setOrder(null); // Không có đơn hàng nào
      }
    } catch (error) {
      toast.error("Lỗi lấy đơn hàng!");
      console.error("Lỗi lấy đơn hàng:", error);
      setOrder(null);
    }
  };

  const handleShowDetail = async (orderId) => {
    setLoadingDetail(true);
    try {
      const response = await getOrderDetail(orderId);
      setSelectedOrder(response.data); // Lưu chi tiết đơn hàng vào state
      setShowOrderDetail(true);
    } catch (error) {
      toast.error("Không thể lấy chi tiết đơn hàng!");
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="delivering-order">
      <h1>Đơn hàng đang giao</h1>
      {order ? (
        <>
          <Step1Pickup
            order={order}
            status={order.status}
            onStatusUpdate={fetchOrder}
            onShowDetail={handleShowDetail}
          />
          <Step2Delivery
            order={order}
            status={order.status}
            onStatusUpdate={fetchOrder}
            onShowDetail={handleShowDetail}
          />
          <Step3Complete
            order={order}
            status={order.status}
            onStatusUpdate={fetchOrder}
          />
        </>
      ) : (
        <p>Không có đơn hàng nào đang giao.</p>
      )}
      {showOrderDetail && (
        <FoodOrderDetail
          order={selectedOrder}
          onClose={() => setShowOrderDetail(false)}
          loading={loadingDetail}
        />
      )}
    </div>
  );
};

export default DeliveringOrder;
