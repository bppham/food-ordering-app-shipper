import React from "react";
import "./DetailOrder.css";

const DetailOrder = ({ order, onClose }) => {
  if (!order) return null;

  // Tính tổng tiền đơn hàng
  const totalAmount = order.items.reduce((sum, item) => {
    const itemPrice = item.dish.price * item.quantity;
    const toppingsPrice = item.toppings.reduce(
      (tSum, topping) => tSum + topping.price,
      0
    );
    return sum + itemPrice + toppingsPrice;
  }, 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chi tiết đơn hàng</h2>

        {/* Chia thành 2 cột */}
        <div className="modal-grid">
          <div className="modal-column">
            <div className="order-info">
              <label>Nhà hàng:</label>
              <p>{order.store.name}</p>
            </div>
            <div className="order-info">
              <label>Địa chỉ:</label>
              <p>{order.store.address.full_address}</p>
            </div>
            <div className="order-info">
              <label>Giao đến:</label>
              <p>{order.shipLocation.address}</p>
            </div>
          </div>
          <div className="modal-column">
            <div className="order-info">
              <label>Mã đơn:</label>
              <p>{order._id}</p>
            </div>
            <h3>Sản phẩm:</h3>
            <div className="items-container">
              {order.items.map((item, index) => (
                <div key={index} className="dish-item">
                  <div>
                    <p>
                      <strong>{item.dish.name}</strong>
                    </p>
                    <p>
                      {item.quantity} x {item.dish.price.toLocaleString()}đ
                    </p>
                    {item.toppings.length > 0 && (
                      <p>
                        Toppings: {item.toppings.map((t) => t.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiển thị tổng tiền */}
        <div className="total-amount">
          <strong>Tổng tiền:</strong>
          <p>{totalAmount.toLocaleString()}đ</p>
        </div>

        <button onClick={onClose} className="close-modal">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default DetailOrder;
