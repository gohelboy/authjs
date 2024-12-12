"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RefreshCcwDot } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

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
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const [heading, setHeading] = useState(0);

  const fetchNearbyUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users/location");
      if (!res.ok) throw new Error("Failed to fetch nearby users");
      const data = await res.json();
      setNearbyUsers(data || []);
    } catch (error) {
      console.error(error);
      setError("Error fetching nearby users");
    }
  }, []);

  const updateMyLocationForOthers = useCallback(async (latitude, longitude) => {
    try {
      await fetch("/api/users/location", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            coordinates: [latitude, longitude],
          },
        }),
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  }, []);

  useEffect(() => {
    watchMyLocation();
  }, []);

  const watchMyLocation = () => {
    if (navigator.geolocation) {
      const geoWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await updateMyLocationForOthers(latitude, longitude);
          setLocation({ latitude, longitude });

          if (mapRef.current) {
            const map = mapRef.current;
            map.setView([latitude, longitude], map.getZoom());
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Location permission denied or error occurred");
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      return () => {
        navigator.geolocation.clearWatch(geoWatchId);
      };
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const updateMyOrientationForMe = (event) => {
    if (event.alpha !== null) {
      setHeading(event.alpha);
    }
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", updateMyOrientationForMe);
    return () => {
      window.removeEventListener("deviceorientation", updateMyOrientationForMe);
    };
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!location) {
    return (
      <div className="text-center">Please enable location permissions.</div>
    );
  }

  return (
    <div className="relative w-full md:h-[calc(100dvh-220px)] h-[calc(100dvh-180px)] rounded-lg overflow-hidden">
      <Button
        onClick={fetchNearbyUsers}
        className="absolute bottom-5 right-5 z-[999] flex items-center justify-between"
      >
        <RefreshCcwDot /> Nearby Users
      </Button>

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)} // Using useRef to store map object
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[location.latitude, location.longitude]}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `
              <div class="bg-black text-white font-bold flex items-center justify-center rounded-full" 
                   style="transform: rotate(${heading}deg); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 19V6M5 12l7-7 7 7"></path>
                </svg>
              </div>`,
            iconSize: [50, 60],
            iconAnchor: [25, 30],
          })}
        >
          <Popup>You are here!</Popup>
        </Marker>

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
                    src="${user.image || "/user.jpg"}" 
                    alt="${user.name}" 
                    class="w-12 h-12 rounded-full border-2 border-blue-500" 
                  />
                  <span class="text-sm font-medium text-gray-800">${
                    user.name
                  }</span>
                </div>
              `,
              iconSize: [60, 70],
              iconAnchor: [30, 35], // Centering the marker anchor (half of the size)
            })}
          >
            <Popup>
              <div className="p-2">
                <Image
                  width={54}
                  height={54}
                  src={user.image || "/user.jpg"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full mx-auto"
                />
                <h3 className="text-center text-lg font-semibold mt-2">
                  {user.name}
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  {user.email}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DiscoverMap;
