import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dynamically import React-Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const DiscoverMap = () => {
  const [location, setLocation] = useState();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const mapRef = useRef(null);

  const fetchNearbyUser = async () => {
    const res = await fetch("/api/users/location");
    const data = await res.json();
    setNearbyUsers(data || []);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      });
    }
    fetchNearbyUser();
  }, []);

  if (!location) {
    return (
      <h1 className="text-center text-lg mt-10">
        Please allow location permissions...
      </h1>
    );
  }

  return (
    <div className="w-full h-[calc(100dvh-200px)] rounded-lg overflow-hidden">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Current User Marker */}
        <Marker
          position={[location.latitude, location.longitude]}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `<div class="bg-green-500 text-white font-bold w-12 h-12 flex items-center justify-center rounded-full">
                  Me
                </div> `,
            iconSize: [50, 60],
            iconAnchor: [25, 60],
          })}
        >
          <Popup>You are here!</Popup>
        </Marker>

        {/* Nearby Users */}
        {nearbyUsers?.map((user) => (
          <Marker
            key={user._id}
            position={[
              user.location.coordinates[1],
              user.location.coordinates[0],
            ]}
            icon={L.divIcon({
              className: "custom-div-icon",
              html: `
                <div class="flex flex-col items-center">
                  <img 
                    src="${user.image}" 
                    alt="${user.name}" 
                    class="w-12 h-12 rounded-full border-2 border-blue-500" 
                  />
                  <span class="text-sm font-medium text-gray-800">${user.name}</span>
                </div>
              `,
              iconSize: [60, 70],
              iconAnchor: [30, 70],
            })}
          >
            <Popup>
              <div class="p-2">
                <img
                  src={user.image}
                  alt={user.name}
                  class="w-16 h-16 rounded-full mx-auto"
                />
                <h3 class="text-center text-lg font-semibold mt-2">
                  ${user.name}
                </h3>
                <p class="text-center text-gray-600 text-sm">${user.email}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DiscoverMap;
