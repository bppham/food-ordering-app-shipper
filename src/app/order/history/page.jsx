"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import "./history.css";
import { getDeliveredOrders } from "../../../api/order";
import DetailOrder from "../../../components/Order/DetailOrder";

const DeliveredOrdersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Số đơn hàng trên mỗi trang

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const response = await getDeliveredOrders(page, limit);
      console.log("🚀 API Response:", response);

      if (response && Array.isArray(response.data)) {
        setOrders(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error("❌ API không trả về mảng hợp lệ!");
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng: ", error);
      setOrders([]);
    }
  };

  // Chuyển trang (cập nhật URL)
  const changePage = (newPage) => {
    router.push(`/order/history?page=${newPage}`);
  };

  return (
    <div className="history-order">
      <div className="history-order-container">
        <h1>Lịch sử đơn hàng</h1>
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="history-order-item">
              <div className="history-order-left">
                <img src={order.store.avatar?.url || ""} alt="" />
              </div>
              <div className="history-order-right">
                <div className="history-order-title">
                  <div className="history-order-id">Mã đơn: {order._id}</div>
                  <h3>Đơn hàng tại {order.store.name}</h3>
                </div>
                <div className="history-order-address">
                  <div className="history-order-address-start">
                    <Image
                      src="/assets/icons/location.png"
                      width={50}
                      height={50}
                      alt="Location Icon"
                    />
                    <span>Quán ăn:</span>
                    <p>{order.store.address.full_address}</p>
                  </div>
                  <div className="history-order-address-destination">
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
                <div className="history-order-action">
                  <button
                    className="detail-order"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Phân trang */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            ← Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Sau →
          </button>
        </div>
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

export default DeliveredOrdersPage;
