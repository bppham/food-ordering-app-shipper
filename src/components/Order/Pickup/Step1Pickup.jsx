import React from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../../../api/order";
import { createChat, getAllChats } from "../../../api/chat";
const Step1Pickup = ({ order, status, onStatusUpdate, onShowDetail }) => {
  const isActive = status === "taken";
  const isDisabled = status !== "taken";
  const router = useRouter();

  const handleConfirmPickup = async () => {
    try {
      await updateOrderStatus(order._id, "delivering");
      onStatusUpdate();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái đơn hàng!");
    }
  };

  const handleChat = async (id, storeId) => {
    try {
      const result = await createChat(id, { storeId });
      if (result) {
        router.push(`/home/chat/${result}`);
        await getAllChats();
      } else {
        console.warn("⚠️ Không có 'data' trong kết quả createChat:", result);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo chat:", error);
    }
  };

  const handleWatchMap = () => {
    router.push("/order/delivering/see-route-store?orderId=" + order._id);
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
          <button
            className="watch-map"
            disabled={isDisabled}
            onClick={handleWatchMap}
          >
            Xem bản đồ
          </button>
          <button
            className="chat"
            disabled={isDisabled}
            onClick={() => handleChat(order.store.owner, order.store._id)}
          >
            Nhắn tin với cửa hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Pickup;
