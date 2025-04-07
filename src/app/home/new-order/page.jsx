"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./NewOrder.css";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getFinishedOrders, acceptOrder } from "../../../api/order";
import DetailOrder from "../../../components/Order/DetailOrder";

const NewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getFinishedOrders();
      console.log("🚀 API Response:", response.data);

      // Đảm bảo response.data là mảng trước khi set vào state
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("❌ API không trả về mảng!");
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng: ", error);
      setOrders([]);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    Swal.fire({
      title: "Bạn có chắc muốn nhận đơn?",
      text: "Sau khi nhận, đơn hàng sẽ chuyển trạng thái đang giao!",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await acceptOrder(orderId);
          toast.success("Nhận đơn thành công!", { position: "top-right" });
          fetchOrders(); // Load lại danh sách đơn hàng
        } catch (error) {
          console.error("❌ Lỗi nhận đơn: ", error.response);

          if (error.response?.status === 409) {
            Swal.fire({
              title: "Không thể nhận đơn mới!",
              text: "Vui lòng hoàn thành đơn hàng hiện tại trước khi nhận đơn mới.",
              icon: "warning",
            });
          } else {
            toast.error("Nhận đơn thất bại! Vui lòng thử lại.", {
              position: "top-right",
            });
          }
        }
      }
    });
  };

  return (
    <div className="new-order">
      <div className="new-order-container">
        <h1>Đơn hàng mới</h1>
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="new-order-item">
              <div className="new-order-left">
                <img src={order.store.avatar?.url || ""} alt="" />
              </div>
              <div className="new-order-right">
                <div className="new-order-title">
                  <div className="new-order-id">Mã đơn: {order._id}</div>
                  <h3>Đơn hàng tại {order.store.name}</h3>
                </div>
                <div className="new-order-address">
                  <div className="new-order-address-start">
                    <Image
                      src="/assets/icons/location.png"
                      width={50}
                      height={50}
                      alt="Location Icon"
                    />
                    <span>Quán ăn:</span>
                    <p>{order.store.address.full_address}</p>
                  </div>
                  <div className="new-order-address-destination">
                    <Image
                      src="/assets/icons/home.png"
                      width={50}
                      height={50}
                      alt="Home Icon"
                    />
                    <span>Điểm đến:</span>
                    <p>{order.shipLocation.address}</p>
                  </div>
                </div>
                <div className="new-order-action">
                  <button
                    className="detail-order"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="confirm-order"
                    onClick={() => handleAcceptOrder(order._id)}
                  >
                    Nhận đơn
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Hiển thị Modal khi có selectedOrder */}
      {selectedOrder && (
        <DetailOrder
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default NewOrder;
