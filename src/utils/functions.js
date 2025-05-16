import { provinces } from "./constants";

export const getClosestProvince = ({ lat, lon }) => {
  const closestProvince = provinces.reduce((prev, curr) => {
    const prevDistance = Math.sqrt(
      Math.pow(prev.lat - lat, 2) + Math.pow(prev.lon - lon, 2)
    );
    const currDistance = Math.sqrt(
      Math.pow(curr.lat - lat, 2) + Math.pow(curr.lon - lon, 2)
    );
    return currDistance < prevDistance ? curr : prev;
  });
  return closestProvince;
};

export const haversineDistance = (coords1, coords2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách tính bằng km
};

export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  } else {
    return `${distanceKm.toFixed(1)} km`;
  }
};

export const calculateTravelTime = (distance, speed = 40) => {
  return distance / speed; // Thời gian tính theo giờ
};

export const formatTravelTime = (timeInHours) => {
  if (timeInHours <= 0) return "0 phút";

  const totalMinutes = Math.round(timeInHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else if (hours > 0) {
    return `${hours} giờ`;
  } else {
    return `${minutes} phút`;
  }
};

export const groupStoresByCategory = (stores) => {
  const groupedStores = {};

  stores.forEach((store) => {
    store.storeCategory.forEach((category) => {
      const categoryId = category._id;

      if (!groupedStores[categoryId]) {
        groupedStores[categoryId] = {
          category: category,
          stores: [],
        };
      }

      groupedStores[categoryId].stores.push(store);
    });
  });

  return Object.values(groupedStores);
};

export const groupDishesByCategory = (dishes) => {
  const groupedDishes = {};

  dishes.forEach((dish) => {
    const category = dish.category;
    const categoryId = category._id;

    if (!groupedDishes[categoryId]) {
      groupedDishes[categoryId] = {
        category: category,
        dishes: [],
      };
    }

    groupedDishes[categoryId].dishes.push(dish);
  });

  return Object.values(groupedDishes);
};
