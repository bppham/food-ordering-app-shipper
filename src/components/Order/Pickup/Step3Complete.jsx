import React from "react";
import { updateOrderStatus } from "../../../api/order";
import Swal from "sweetalert2";

const Step3Complete = ({ order, status, onStatusUpdate }) => {
  const isActive = status === "delivered";
  const isDisabled = status !== "delivered"; // Chỉ bật khi ở bước "delivered"

  const handleConfirmPickup = async () => {
    try {
      await updateOrderStatus(order._id, "done"); // Gọi API cập nhật trạng thái

      // Hiển thị thông báo thành công bằng SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: `Đơn hàng ${order._id} đã hoàn thành.`,
        confirmButtonText: "OK",
      });

      onStatusUpdate(); // Cập nhật UI sau khi gọi API thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);

      // Hiển thị thông báo lỗi bằng SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật trạng thái đơn hàng!",
        confirmButtonText: "Thử lại",
      });
    }
  };

  return (
    <div className={`step-container ${isActive ? "active" : "inactive"}`}>
      <div className="info">
        <h2>🎉 Đơn hàng đã hoàn thành!</h2>
        <p>Cảm ơn bạn đã hoàn thành đơn hàng {order._id}!</p>
        <div className="action">
          <button
            className="confirm"
            disabled={isDisabled}
            onClick={handleConfirmPickup}
          >
            Xác nhận hoàn thành đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Complete;
