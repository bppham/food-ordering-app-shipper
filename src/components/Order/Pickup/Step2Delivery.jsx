import React from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../../../api/order";
import { createChat, getAllChats } from "../../../api/chat";

const Step2Delivery = ({ order, status, onStatusUpdate, onShowDetail }) => {
  const isActive = status === "delivering";
  const isDisabled = status !== "delivering";
  const router = useRouter();

  const handleConfirmPickup = async () => {
    try {
      await updateOrderStatus(order._id, "delivered");
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
        await getAllChats(); // gọi lại nếu cần cập nhật danh sách chat
      }
    } catch (error) {
      console.error("Lỗi khi tạo chat:", error);
    }
  };

  const handleWatchMap = () => {
    router.push("/order/delivering/see-route-customer?orderId=" + order._id);
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "credit_card":
        return "Thẻ tín dụng";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className={`step-container ${isActive ? "active" : "inactive"}`}>
      <div className="info">
        <h2>Bước 2: Mang đồ ăn cho khách</h2>
        <p>
          <strong>Khách hàng:</strong>{" "}
          {order?.customerName || order?.user?.name}
        </p>
        <p>
          <strong>SĐT:</strong>{" "}
          {order?.customerPhonenumber || order?.user?.phonenumber}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.shipLocation.address}
        </p>
        <p>
          <strong>Hình thức thanh toán:</strong>{" "}
          {getPaymentMethodLabel(order.paymentMethod)}
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
            onClick={() => {
              handleChat(order.user._id, null);
            }}
          >
            Nhắn tin với khách hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Delivery;
