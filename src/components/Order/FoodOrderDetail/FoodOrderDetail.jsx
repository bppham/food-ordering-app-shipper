import React, { useEffect } from "react";
import "./FoodOrderDetail.css";

const FoodOrderDetail = ({ order, onClose, loading }) => {
  if (loading) {
    return <p>Đang tải chi tiết đơn hàng...</p>; // Hiển thị loading khi API đang chạy
  }

  if (!order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chi tiết đơn hàng</h2>
        <div className="info-container">
          {order.items.map((item) => (
            <div className="dish-info" key={item._id}>
              <div className="left">
                <img src={item.dish.image.url} alt="" />
              </div>
              <div className="right">
                <div className="dish-name">
                  <label>Tên món: </label>
                  <p>{item.dish.name}</p>
                </div>
                <div className="dish-info">
                  <div className="item">
                    <label>Giá: </label>
                    <p>{item.dish.price.toLocaleString()} đồng</p>
                  </div>
                  <div className="item">
                    <label>Số lượng: </label>
                    <p>{item.quantity}</p>
                  </div>
                </div>
                {item.toppings.length > 0 && (
                  <div className="topping-info">
                    <h3>Toppings</h3>
                    <div className="topping-container">
                      {item.toppings.map((topping) => (
                        <div className="item" key={topping._id}>
                          <p className="topping-name">- {topping.name}</p>
                          <p className="topping-price">{topping.price.toLocaleString()} đồng</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default FoodOrderDetail;
