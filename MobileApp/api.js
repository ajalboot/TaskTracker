import config from "./config";

export const createUpdateTaskee = (data) => {
  return fetch(`${config.backendURL}/taskee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const fetchTaskee = () => {
  return fetch(`${config.backendURL}/taskee`, {
    method: "GET",
  }).then((res) => res.json());
};

export const fetchOneTaskee = (id) => {
  return fetch(`${config.backendURL}/taskee/${id}`, {
    method: "GET",
  }).then((res) => res.json());
};

export const removeTaskee = (id) => {
  return fetch(`${config.backendURL}/taskee/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

export const getAddressData = ({ latitude, longitude }) => {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=18&format=jsonv2`
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
