import React from "react";
import { updateOrderStatus } from "../../../api/order";

const Step1Pickup = ({ order, status, onStatusUpdate, onShowDetail }) => {
  const isActive = status === "taken";
  const isDisabled = status !== "taken";

  const handleConfirmPickup = async () => {
    try {
      await updateOrderStatus(order._id, "delivering"); // Gọi API cập nhật trạng thái
      onStatusUpdate(); // Cập nhật UI sau khi gọi API thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái đơn hàng!");
    }
  };

  return (
    <div className={`step-container ${isActive ? "active" : "inactive"}`}>
      <div className="info">
        <h2>Bước 1: Lấy đồ ăn tại nhà hàng</h2>
        <p>
          <strong>Nhà hàng:</strong> {order.store.name}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.store.address.full_address}
        </p>
        <div className="action">
          <button
            className="confirm"
            disabled={isDisabled}
            onClick={handleConfirmPickup}
          >
            Xác nhận
          </button>
          <button
            className="detail-order"
            disabled={isDisabled}
            onClick={() => onShowDetail(order._id)}
          >
            Chi tiết
          </button>
          <button className="watch-map" disabled={isDisabled}>
            Xem bản đồ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Pickup;
