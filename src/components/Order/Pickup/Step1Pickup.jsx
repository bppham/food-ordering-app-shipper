import React from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../../../api/order";
import { createChat, getAllChats } from "../../../api/chat";
const Step1Pickup = ({ order, status, onStatusUpdate, onShowDetail }) => {
  const isActive = status === "taken";
  const isDisabled = status !== "taken";
  const router = useRouter();

  const handleConfirmPickup = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn nhận đơn?",
      text: "Sau khi nhận, đơn sẽ chuyển sang trạng thái 'Đang giao'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await updateOrderStatus(order._id, "delivering");
        onStatusUpdate();
        Swal.fire("Thành công!", "Đơn hàng đang được giao.", "success");
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        Swal.fire("Lỗi", "Không thể cập nhật trạng thái đơn hàng!", "error");
      }
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

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn hủy đơn?",
      text: "Thao tác này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Vâng, hủy đơn!",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        await updateOrderStatus(order._id, "finished");
        onStatusUpdate();
        Swal.fire("Đã hủy!", "Đơn hàng đã được hủy.", "success");
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        Swal.fire("Lỗi", "Không thể cập nhật trạng thái đơn hàng!", "error");
      }
    }
  };

  const handleWatchMap = () => {
    router.push("/order/delivering/see-route-store?orderId=" + order._id);
  };

  return (
    <div className={`step-container ${isActive ? "active" : "inactive"}`}>
      <div className="info">
        <div className="info-header">
          <h2>Bước 1: Lấy đồ ăn tại nhà hàng</h2>
          <Image
            src="/assets/icons/close.png"
            width={30}
            height={30}
            alt="Close Icon"
            className="cancel-order"
            disabled={isDisabled}
            onClick={isDisabled ? undefined : handleCancelOrder}
          />
        </div>

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
