import React from "react";
import { updateOrderStatus } from "../../../api/order";

const Step2Delivery = ({ order, status, onStatusUpdate, onShowDetail }) => {
  const isActive = status === "delivering";
  const isDisabled = status !== "delivering"; // Chỉ bật khi ở bước "delivering"

  const handleConfirmPickup = async () => {
      try {
        await updateOrderStatus(order._id, "delivered"); // Gọi API cập nhật trạng thái
        onStatusUpdate(); // Cập nhật UI sau khi gọi API thành công
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        alert("Không thể cập nhật trạng thái đơn hàng!");
      }
    };

  return (
    <div className={`step-container ${isActive ? "active" : "inactive"}`}>
      <div className="info">
        <h2>Bước 2: Mang đồ ăn cho khách</h2>
        <p>
          <strong>Khách hàng:</strong> John Cena
        </p>
        <p>
          <strong>SĐT:</strong> 096996996969
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.shipLocation.address}
        </p>
        <p>
          <strong>Hình thức thanh toán:</strong> {order.paymentMethod}
        </p>
        <div className="action">
            <button className="confirm" disabled={isDisabled} onClick={handleConfirmPickup}>Xác nhận</button>
            <button className="detail-order" disabled={isDisabled} onClick={() => onShowDetail(order._id)}>Chi tiết</button>
            <button className="watch-map" disabled={isDisabled}>Xem bản đồ</button>
        </div>
      </div>
    </div>
  );
};

export default Step2Delivery;
