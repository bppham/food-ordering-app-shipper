"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import {
  haversineDistance,
  calculateTravelTime,
  formatTravelTime,
  formatDistance,
} from "../../../../utils/functions";
import { useSocket } from "../../../../context/SocketContext";
import { useSearchParams } from "next/navigation";
import { getOrderDetail } from "../../../../api/order";
import "./see-route-customer.css";

const shipperIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
  iconSize: [40, 40],
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2314/2314433.png",
  iconSize: [40, 40],
});

const Page = () => {
  const mapRef = useRef(null);
  const { socket } = useSocket();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetail, setOrderDetail] = useState();

  const [shipperLocation, setShipperLocation] = useState([
    10.762622, 106.660172,
  ]);
  const [customerLocation, setCustomerLocation] = useState([
    10.762622, 106.660172,
  ]);
  const [routeToCustomer, setRouteToCustomer] = useState([]);
  const [distanceShipperToCustomer, setDistanceShipperToCustomer] = useState(0);
  const [timeShipperToCustomer, setTimeShipperToCustomer] = useState(0);

  const getDetailOrder = async () => {
    try {
      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      alert("Lỗi lấy chi tiết đơn hàng!");
    }
  };

  useEffect(() => {
    if (orderId) getDetailOrder();
  }, []);

  useEffect(() => {
    if (!socket || !orderId) return;
    socket.emit("joinOrder", orderId);
    return () => socket.emit("leaveOrder", orderId);
  }, [socket, orderId]);

  useEffect(() => {
    if (orderDetail) {
      setCustomerLocation([
        orderDetail.data.shipLocation.coordinates[1],
        orderDetail.data.shipLocation.coordinates[0],
      ]);
    }
  }, [orderDetail]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setShipperLocation(newLocation);
          socket.emit("sendLocation", {
            id: orderId,
            data: { lat: newLocation[0], lon: newLocation[1] },
          });
        },
        (error) => console.error("Lỗi lấy vị trí:", error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation");
    }
  }, []);

  useEffect(() => {
    if (!shipperLocation) return;

    const fetchRoute = async () => {
      try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${shipperLocation[1]},${shipperLocation[0]};${customerLocation[1]},${customerLocation[0]}?overview=full&geometries=geojson`
        );
        const coordinates = response.data.routes[0].geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );
        setRouteToCustomer(coordinates);
      } catch (error) {
        console.error("Lỗi lấy đường đi:", error);
      }
    };

    fetchRoute();

    handleFlyToPosition(shipperLocation);

    const distance = haversineDistance(shipperLocation, customerLocation);
    setDistanceShipperToCustomer(distance);
    setTimeShipperToCustomer(calculateTravelTime(distance));
  }, [shipperLocation]);

  const handleFlyToPosition = (position) => {
    if (mapRef.current) {
      mapRef.current.flyTo(position, 15, { duration: 1 });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header-bar">
          <h3>Theo dõi vị trí đơn hàng</h3>
        </div>
        <div>
          <p>
            🚀 Vị trí của bạn ➝ Khách hàng:{" "}
            {formatDistance(distanceShipperToCustomer)} (~{" "}
            {formatTravelTime(timeShipperToCustomer)})
          </p>
        </div>

        <div className="map-wrapper">
          {shipperLocation && (
            <MapContainer
              center={shipperLocation}
              zoom={13}
              style={{ height: "500px", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={shipperLocation}
                icon={shipperIcon}
                eventHandlers={{
                  click: () => handleFlyToPosition(shipperLocation),
                }}
              />
              <Marker
                position={customerLocation}
                icon={customerIcon}
                eventHandlers={{
                  click: () => handleFlyToPosition(customerLocation),
                }}
              />
              <Polyline positions={routeToCustomer} color="red" />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
