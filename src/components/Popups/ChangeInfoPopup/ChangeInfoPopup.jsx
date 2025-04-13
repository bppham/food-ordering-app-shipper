import React, { useState } from "react";
import "./ChangeInfoPopup.css";
import { toast } from "react-toastify";
import { updateShipper } from "../../../api/shipper";
import { uploadImage } from "../../../api/upload";

const ChangeInfoPopup = ({ onClose, fetchData, shipper }) => {
  const [updatedInfo, setUpdatedInfo] = useState({
    phonenumber: shipper.phonenumber,
    gender: shipper.gender,
    avatar: shipper.avatar,
    vehicle: {
      name: shipper.vehicle.name,
      number: shipper.vehicle.number,
    },
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(shipper.avatar.url);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "phonenumber" && !/^\d*$/.test(value)) {
      toast.error("Số điện thoại chỉ được chứa số!");
      return;
    }

    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setImage(file);
      setPreview(imagePreviewUrl);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let imageUrl = shipper.avatar.url;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      console.log(imageUrl);

      const updatedData = {
        ...updatedInfo,
        avatar: { url: imageUrl },
      };

      await updateShipper(updatedData);

      toast.success("Cập nhật thông tin thành công!");

      fetchData();
      onClose();
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-info-popup">
      <div className="popup-content-change-info">
        <h1>Cập nhật thông tin cá nhân</h1>
        <form>
          <div className="info-container">
            <div className="info-first-row">
              <div className="info-avatar">
                {preview && (
                  <div className="image-preview">
                    <img src={preview} alt="Preview" />
                  </div>
                )}
                <label htmlFor="file-upload" className="custom-file-upload">
                  Chọn ảnh
                </label>

                {/* Input file bị ẩn */}
                <input
                  id="file-upload"
                  className="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="orther-info">
                <div className="item">
                  <span>Mã nhân viên:</span>
                  <input type="text" readOnly value={shipper._id} />
                </div>
                <div className="item">
                  <span>Họ và tên:</span>
                  <input type="text" readOnly value={shipper.name} />
                </div>
                <div className="item">
                  <span>Email:</span>
                  <input type="text" readOnly value={shipper.email} />
                </div>
                <div className="item">
                  <span>Loại xe:</span>
                  <input type="text" name="name" value={updatedInfo.vehicle.name} onChange={handleVehicleChange}/>
                </div>
                <div className="item">
                  <span>Số xe:</span>
                  <input type="text" name="number" value={updatedInfo.vehicle.number} onChange={handleVehicleChange}/>
                </div>
              </div>
            </div>
            <div className="info-item-row">
              <div className="item">
                <span>SĐT:</span>
                <input
                  type="text"
                  name="phonenumber"
                  onChange={handleInputChange}
                  value={updatedInfo.phonenumber}
                />
              </div>
              <div className="item">
                <span>Giới tính:</span>
                <select
                  name="gender"
                  className="gender-select"
                  value={updatedInfo.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          </div>
        </form>
        <div className="popup-actions-update-info">
          <button className="confirm" onClick={handleUpdate}>
            Xác nhận
          </button>
          <button className="cancel" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeInfoPopup;
